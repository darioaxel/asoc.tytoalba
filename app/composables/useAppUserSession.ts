// ~/composables/useAppUserSession.ts
export const useAppUserSession = () => {
  
  const { user: baseUser, loggedIn} = useUserSession()
  
  // 2. Tu API de Prisma
  const { data: userData, refresh } = useFetch('/api/user', {
    lazy: true,
    server: false,
    // Solo ejecuta si hay sesión
    immediate: false
  })


  watch(
    () => baseUser.value?.id,
    (userId) => {      
      if (userId) {       
        refresh() // Esto ejecuta /api/user
      }
    },
    { immediate: true } // Ejecuta al montar si ya hay sesión
  )

  // ✅ Combinación final
  return computed(() => {   
    if (!baseUser.value?.id) {
      return { 
        user: null, 
        loggedIn: false,
        loading: false
      }
    }

    // Mientras carga, userData.value será null
    const isLoading = loggedIn.value && !userData.value
    console.log('⏳ LOADING:', isLoading)

    return {
      user: userData.value || { id: baseUser.value.id }, // Fallback mientras carga
      loggedIn: true,
      role: baseUser.value.role, // El rol viene de la sesión base
      loading: isLoading
    }
  })
}