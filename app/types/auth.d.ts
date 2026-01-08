
export {}
declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    role: 'USER' | 'ADMIN' | 'ROOT'
    isActive: boolean
    firstName?: string | null
    lastName?: string | null
    picture?: string | null
  }

  interface UserSession {
    user?: User
    loggedInAt?: string
  }
}