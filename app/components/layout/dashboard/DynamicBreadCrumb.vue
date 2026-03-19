<!-- components/DynamicBreadcrumb.vue -->
<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <BreadcrumbItem v-if="index < breadcrumbs.length - 1" class="hidden md:block">
          <BreadcrumbLink :href="crumb.path">
            {{ crumb.label }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem v-else>
          <BreadcrumbPage>{{ crumb.label }}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" class="hidden md:block" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string
}>()

// Mapeo de segmentos de URL a etiquetas legibles
const routeLabels: Record<string, string> = {
  'socios': 'Área Socios',
  'recibos': 'Mis Recibos',
  'pagar': 'Pagar',
  'tareas': 'Tareas',
  'tarea': 'Tarea',
  'propuestas': 'Propuestas',
  'propuesta': 'Propuesta',
  'nueva': 'Nueva',
  'posts': 'Posts',
  'crear': 'Crear',
  'editar': 'Editar',
  'perfil': 'Mi Perfil',
  'banco': 'Datos Bancarios',
  'lista': 'Lista de Socios',
  'morosos': 'Morosos',
  'login': 'Login',
  'signup': 'Registro',
  'landing': 'Bienvenida',
  'solicitud': 'Solicitud',
}

const breadcrumbs = computed(() => {
  const segments = props.url.split('/').filter(Boolean)
  const result = []

  let path = ''
  for (const segment of segments) {
    path += `/${segment}`
    
    // Si es un ID numérico, lo omitimos del breadcrumb
    if (/^\d+$/.test(segment)) {
      continue
    }
    
    result.push({
      label: routeLabels[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1)),
      path,
    })
  }

  return result
})
</script>