// ~/server/api/auth/google.get.ts
// OAuth callback handler for Google authentication

import { Role } from '../../../prisma/generated/client'

interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['openid', 'email', 'profile']
  },
  async onSuccess(event, { user: oauthUser, tokens }) {
    console.log('=== 🔐 GOOGLE OAUTH SUCCESS ===')
    console.log('📧 Email:', oauthUser.email)
    console.log('🆔 Google ID:', oauthUser.sub)

    const googleUser = oauthUser as GoogleUserInfo

    try {
      // Check if user already exists with this Google account
      let dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { provider: 'google', providerId: googleUser.sub },
            { email: googleUser.email.toLowerCase() }
          ]
        }
      })

      if (dbUser) {
        // User exists - check if we need to update provider info
        if (dbUser.provider === 'local' && !dbUser.providerId) {
          // Link existing local account to Google
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              provider: 'google',
              providerId: googleUser.sub,
              picture: googleUser.picture || dbUser.picture,
              lastLoginAt: new Date()
            }
          })
          console.log('🔗 Cuenta local vinculada con Google:', dbUser.email)
        } else {
          // Update last login
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() }
          })
          console.log('✅ Usuario existente login:', dbUser.email)
        }
      } else {
        // Create new user from Google data
        dbUser = await prisma.user.create({
          data: {
            email: googleUser.email.toLowerCase(),
            emailPersonal: googleUser.email.toLowerCase(),
            firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || 'Usuario',
            lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || 'Google',
            picture: googleUser.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleUser.name || 'U')}&background=random`,
            provider: 'google',
            providerId: googleUser.sub,
            role: Role.USER,
            isActive: true,
            failedLoginAttempts: 0,
            lastLoginAt: new Date()
          }
        })
        console.log('✅ Nuevo usuario Google creado:', dbUser.email)
      }

      // Create session
      await setUserSession(event, {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          isActive: dbUser.isActive,
        },
        loggedInAt: new Date().toISOString(),
      })

      console.log('=== ✅ GOOGLE LOGIN COMPLETADO ===')

      // Redirect to dashboard
      return sendRedirect(event, '/socios/dashboard')

    } catch (error) {
      console.error('❌ Error en Google OAuth:', error)
      throw createError({
        statusCode: 500,
        message: 'Error procesando autenticación de Google'
      })
    }
  },

  onError(event, error) {
    console.error('❌ Google OAuth Error:', error)
    return sendRedirect(event, '/socios/login?error=google_auth_failed')
  }
})
