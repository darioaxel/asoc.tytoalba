<template>
    <div class="flex flex flex-col items-center justify-center">
        <PageHeader>     
      <PageHeaderHeading class="max-w-4xl">
        Asociación Tyto Alba
      </PageHeaderHeading>
      <PageHeaderDescription>Mi descripción</PageHeaderDescription>
      <PageActions>
        <Button as-child size="sm">
          <NuxtLink to="/docs/installation">
            Get Started
          </NuxtLink>
        </Button>
        <Button as-child size="sm" variant="ghost">
          <NuxtLink to="/docs/components">
            View Components
          </NuxtLink>
        </Button>
      </PageActions>
        </PageHeader>
    </div>
</template>