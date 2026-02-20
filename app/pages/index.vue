<!-- pages/index.vue (landing) -->
<template>
  <div class="flex flex-col items-center justify-center">
    <div class="relative w-full">
      <!-- Fondo difuminado -->
      <div
        class="absolute inset-0 bg-cover bg-center blur-[2px]"
        style="background-image: url('/images/old-page/fondo-1.png')"
      />
      <!-- Capa oscura semitransparente para mejorar legibilidad -->
      <div class="absolute inset-0 bg-black/40" />
      <PageHeader class="relative z-10">
        <PageHeaderHeading class="max-w-4xl text-white">
          Asociación Tyto Alba
        </PageHeaderHeading>
        <PageHeaderDescription class="text-white/90">Mi descripción</PageHeaderDescription>
        <PageActions>
          <Button as-child size="sm">
            <NuxtLink to="/"> Nosotr@s </NuxtLink>
          </Button>
          <Button as-child size="sm" variant="secondary">
            <NuxtLink to="/"> blog </NuxtLink>
          </Button>
        </PageActions>
      </PageHeader>
    </div>   
  </div>
</template>

