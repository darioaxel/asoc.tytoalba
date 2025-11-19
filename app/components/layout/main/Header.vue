<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl text-tyto-primary">
            <Icon name="Bird" class="w-6 h-6" />
            <span class="hidden sm:inline">Tyto Alba</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <NavigationMenu class="hidden lg:flex">
          <NavigationMenuList class="gap-6">
            
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <NuxtLink 
                  to="/nosotros" 
                  class="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-tyto-primary/10 hover:text-tyto-primary focus:bg-tyto-primary/10 focus:text-tyto-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  :class="{ 'bg-tyto-primary/10 text-tyto-primary': isActive('/nosotros') }"
                >
                  Nosotr@s
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <NuxtLink 
                  to="/rocodromo" 
                  class="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-tyto-primary/10 hover:text-tyto-primary focus:bg-tyto-primary/10 focus:text-tyto-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  :class="{ 'bg-tyto-primary/10 text-tyto-primary': isActive('/rocodromo') }"
                >
                  Rocódromo
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <NuxtLink 
                  to="/musica" 
                  class="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-tyto-primary/10 hover:text-tyto-primary focus:bg-tyto-primary/10 focus:text-tyto-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  :class="{ 'bg-tyto-primary/10 text-tyto-primary': isActive('/musica') }"
                >
                  Música
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <NuxtLink 
                  to="/contacto" 
                  class="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-tyto-primary/10 hover:text-tyto-primary focus:bg-tyto-primary/10 focus:text-tyto-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  :class="{ 'bg-tyto-primary/10 text-tyto-primary': isActive('/contacto') }"
                >
                  Contacto
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <NavigationMenuLink class="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-tyto-primary/10 hover:text-tyto-primary focus:bg-tyto-primary/10 focus:text-tyto-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
                    <span class="relative">
                      Soci@s
                      <Icon name="ChevronDown" class="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </span>
                  </NavigationMenuLink>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-56">
                  <DropdownMenuLabel>Área de Socios</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem as-child>
                    <NuxtLink to="/socios/login">
                      <Icon name="User" class="mr-2 h-4 w-4" />
                      Mi Área
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem as-child>
                    <NuxtLink to="/socios/signup">
                      <Icon name="UserPlus" class="mr-2 h-4 w-4" />
                      Hazte Socio
                    </NuxtLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem as-child>
                    <NuxtLink to="/socios/documentos">
                      <Icon name="FileText" class="mr-2 h-4 w-4" />
                      Documentación
                    </NuxtLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        <!-- Right side actions -->
        <div class="flex items-center gap-4">
          <!-- Desktop Login -->
          <NuxtLink to="/socios/login" class="hidden lg:block">
            <Button variant="outline" class="border-tyto-primary text-tyto-primary hover:bg-tyto-primary hover:text-white">
              <Icon name="LogIn" class="mr-2 h-4 w-4" />
              Login
            </Button>
          </NuxtLink>

          <!-- Mobile Menu Button -->
          <Sheet>
            <SheetTrigger as-child class="lg:hidden">
              <Button variant="ghost" size="icon">
                <Icon name="Menu" class="h-6 w-6" />
                <span class="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" class="w-80">
              <SheetHeader>
                <SheetTitle class="flex items-center gap-2 text-tyto-primary">
                  <Icon name="Bird" class="w-6 h-6" />
                  Menú Tyto Alba
                </SheetTitle>
              </SheetHeader>

              <nav class="flex flex-col gap-4 mt-8">
                <NuxtLink 
                  v-for="item in menuItems" 
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-tyto-primary/10 hover:text-tyto-primary"
                  :class="{ 'bg-tyto-primary/10 text-tyto-primary': isActive(item.path) }"
                  @click="closeSheet"
                >
                  <Icon :name="item.icon" class="h-5 w-5" />
                  <span class="font-medium">{{ item.label }}</span>
                </NuxtLink>

                <Separator class="my-4" />

                <div class="flex flex-col gap-2 px-4">
                  <p class="text-sm font-semibold text-muted-foreground">Área de Socios</p>
                  <NuxtLink 
                    v-for="item in sociosItems" 
                    :key="item.path"
                    :to="item.path"
                    class="flex items-center gap-3 py-2 text-sm transition-colors hover:text-tyto-primary"
                    @click="closeSheet"
                  >
                    <Icon :name="item.icon" class="h-4 w-4" />
                    {{ item.label }}
                  </NuxtLink>
                </div>

                <Separator class="my-4" />

                <NuxtLink to="/login" @click="closeSheet">
                  <Button class="w-full bg-tyto-primary hover:bg-tyto-primary/90">
                    <Icon name="LogIn" class="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                </NuxtLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from '#app'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Icon } from '#components'

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}

const menuItems = [
  { path: '/nosotros', label: 'Nosotr@s', icon: 'Users' },
  { path: '/rocodromo', label: 'Rocódromo', icon: 'Mountain' },
  { path: '/musica', label: 'Música', icon: 'Music' },
  { path: '/contacto', label: 'Contacto', icon: 'Mail' },
]

const sociosItems = [
  { path: '/socios/area', label: 'Mi Área', icon: 'User' },
  { path: '/socios/registro', label: 'Hazte Socio', icon: 'UserPlus' },
  { path: '/socios/documentos', label: 'Documentación', icon: 'FileText' },
]

// Close sheet on navigation
const closeSheet = () => {
  // This will be handled by the Sheet component automatically
}
</script>