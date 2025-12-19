declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: firstName
    lastName: lastName
    picture: picture
  }
  
  interface UserSession {
    user?: User
  }
}