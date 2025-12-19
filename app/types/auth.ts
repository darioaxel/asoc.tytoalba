export interface UserSessionState {
  user: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    fullName?: string | null
    picture?: string | null
    role: 'USER' | 'ADMIN' | 'ROOT'
    isActive: boolean
  } | null
  loggedIn: boolean
  loading: boolean
  role: string | null
}

declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    role: 'USER' | 'ADMIN' | 'ROOT'
  }
  
  interface UserSession {
    user?: User
    loggedInAt?: string
  }
}