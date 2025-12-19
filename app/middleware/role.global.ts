export default defineNuxtRouteMiddleware((to) => {
  
  if (to.path.startsWith('/blog/')) {
    console.log('ROL  no debería entrar aqui')
    return
  }
  const { user, loggedIn } = useUserSession()
  
  if (!loggedIn) {
    return navigateTo("/socios/login")
  }
  
  // Lee los roles permitidos desde definePageMeta
  const allowed = to.meta.roles as string[] | undefined
  
  console.log('ROLES permitidos en la web:', to.meta.roles as string[])
  console.log('ROL del usuario:', user.value?.role)

  // Si la página pide roles y el usuario no tiene uno válido → forbidden
  if (allowed && !allowed.includes(user.value?.role)) {
    return navigateTo("/forbidden")
  }
})
