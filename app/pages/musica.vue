<template>
  <div class="min-h-screen">
    <!-- Header -->
    <PageHeader class="relative bg-cover bg-center bg-no-repeat" style="background-image: url('/images/old-page/musica-fondo.jpeg');">
      <!-- Overlay oscuro para mejorar legibilidad -->
      <div class="absolute inset-0 bg-black/50"></div>
      <PageHeaderHeading class="relative z-10 max-w-4xl text-white drop-shadow-lg">
        Música
      </PageHeaderHeading>
      <PageHeaderDescription class="relative z-10 text-white/90 drop-shadow-md">
        Espacio para la creación y el ensayo musical en la Asociación Tyto Alba
      </PageHeaderDescription>
    </PageHeader>

    <div class="container mx-auto px-4 py-12 max-w-5xl space-y-16">
      
      <!-- Salas de ensayo -->
      <section>
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <!-- Info -->
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-500/10 rounded-lg">
                <Music class="w-6 h-6 text-purple-500" />
              </div>
              <h2 class="text-3xl font-bold">Salas de Ensayo</h2>
            </div>

            <p class="text-muted-foreground leading-relaxed">
              La asociación cuenta con <strong>dos salas de ensayo</strong> completamente equipadas 
              y preparadas para que los grupos musicales puedan practicar y crear. Un espacio 
              diseñado para fomentar la escena musical local y dar cobertura a bandas emergentes 
              y consolidadas de la zona.
            </p>

            <div class="grid sm:grid-cols-2 gap-4">
              <Card class="bg-purple-500/5 border-purple-500/20">
                <CardContent class="pt-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-purple-500/10 rounded-lg">
                      <DoorOpen class="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-purple-500">2</p>
                      <p class="text-sm text-muted-foreground">Salas equipadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="bg-purple-500/5 border-purple-500/20">
                <CardContent class="pt-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-purple-500/10 rounded-lg">
                      <Volume2 class="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-purple-500">Insonorizadas</p>
                      <p class="text-sm text-muted-foreground">Acústica profesional</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Equipamiento - Corregido para dark mode -->
          <Card class="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Mic2 class="w-5 h-5" />
                Equipamiento disponible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Batería acústica completa</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Amplificadores de guitarra y bajo</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Sistema de PA con micrófonos</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Cables y accesorios varios</span>
                </li>                
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <!-- Grupos que ensayan aquí -->
      <section>
        <div class="flex items-center gap-3 mb-8">
          <div class="p-2 bg-pink-500/10 rounded-lg">
            <Music class="w-6 h-6 text-pink-500" />
          </div>
          <h2 class="text-3xl font-bold">Grupos que ensayan aquí</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Ciudadano Peligro -->
          <Card class="overflow-hidden">
            <a 
              href="https://www.facebook.com/ciudadanopeligro/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="block aspect-video w-full relative overflow-hidden"
              title="Ver Ciudadano Peligro en Facebook"
            >
              <img 
                src="/images/old-page/ciudadano-2.jpg" 
                alt="Ciudadano Peligro"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </a>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <a href="https://www.facebook.com/ciudadanopeligro/" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition-opacity">
                  <img src="/images/old-page/ciudadano-logo.jpg" alt="Ciudadano Peligro" class="h-8 w-auto rounded" />
                </a>
                <a href="https://www.facebook.com/ciudadanopeligro/" target="_blank" rel="noopener noreferrer" class="hover:underline">
                  Ciudadano Peligro
                </a>
              </CardTitle>
              <CardDescription>Rock alternativo</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <p class="text-sm text-muted-foreground">
                Uno de los grupos locales más destacados que ensayan regularmente en nuestras salas. 
                Su música combina el rock alternativo con letras comprometidas.
              </p>
              <div class="flex gap-2">
                <Button variant="outline" size="sm" as-child>
                  <a href="https://www.facebook.com/ciudadanopeligro/" target="_blank" rel="noopener noreferrer">
                    <Facebook class="w-4 h-4 mr-2" />
                    Facebook
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Glory Hole -->
          <Card class="overflow-hidden">
            <a 
              href="https://www.instagram.com/gloryholetheband/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="block aspect-video w-full relative overflow-hidden"
              title="Ver Glory Hole en Instagram"
            >
              <img 
                src="/images/old-page/glory-hole-band.jpg" 
                alt="Glory Hole"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </a>
            <CardHeader>
              <CardTitle>
                <a href="https://www.instagram.com/gloryholetheband/" target="_blank" rel="noopener noreferrer" class="hover:underline">
                  Glory Hole
                </a>
              </CardTitle>
              <CardDescription>Rock / Grunge / Alternativo</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <p class="text-sm text-muted-foreground">
                Banda con estilo energético y directo que mezcla rock, grunge y sonidos alternativos. 
                Han sido verificados como banda emergente para festivales como el Viña Rock. 
                Uno de los grupos más dinámicos del circuito local.
              </p>
              <div class="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" as-child>
                  <a href="https://www.instagram.com/gloryholetheband/" target="_blank" rel="noopener noreferrer">
                    <Instagram class="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                </Button>
                <Button variant="outline" size="sm" as-child>
                  <a href="https://www.facebook.com/gloryholetheband/" target="_blank" rel="noopener noreferrer">
                    <Facebook class="w-4 h-4 mr-2" />
                    Facebook
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Info adicional -->
        <Alert class="mt-8 bg-purple-500/5 border-purple-500/20">
          <Info class="w-4 h-4 text-purple-500" />
          <AlertTitle class="text-purple-600">¿Quieres ensayar aquí?</AlertTitle>
          <AlertDescription class="text-purple-600/80">
            Si eres músico o tienes un grupo y necesitas un espacio para ensayar, 
            contacta con la asociación para conocer la disponibilidad y tarifas de alquiler de las salas.
          </AlertDescription>
        </Alert>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Music, 
  DoorOpen, 
  Volume2, 
  Mic2, 
  CheckCircle2, 
  Instagram,
  Facebook,
  Info 
} from 'lucide-vue-next'
</script>
