export default defineNuxtRouteMiddleware((to) => {
  const { user, loggedIn } = useUserSession()
  
  // Lee los roles permitidos desde definePageMeta
  const allowed = to.meta.roles as string[] | undefined
  
  // Si la página no tiene roles definidos, es pública - permitir acceso
  if (!allowed || allowed.length === 0) {
    return
  }
  
  // A partir de aquí, la página tiene restricción de roles
  
  // Si no está logueado y la página requiere roles → redirigir a login
  if (!loggedIn.value) {
    return navigateTo("/socios/login")
  }
  
  // Debug
  console.log('Está entrando en: ', to.path)
  console.log('ROLES permitidos en la web:', allowed)
  console.log('ROL del usuario:', user.value?.role)

  // Si el usuario no tiene uno de los roles permitidos → forbidden
  if (!allowed.includes(user.value?.role || '')) {
    return navigateTo("/forbidden")
  }
})
