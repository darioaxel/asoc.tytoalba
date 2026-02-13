<template>
  <div class="min-h-screen">
    <!-- Header -->
    <PageHeader class="bg-muted/50">
      <PageHeaderHeading class="max-w-4xl">
        Nosotr@s
      </PageHeaderHeading>
      <PageHeaderDescription>
        Conoce la historia, valores y objetivos de la Asociación Tyto Alba
      </PageHeaderDescription>
    </PageHeader>

    <div class="container mx-auto px-4 py-12 max-w-4xl space-y-16">
      
      <!-- Nuestra Historia -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-primary/10 rounded-lg">
            <History class="w-6 h-6 text-primary" />
          </div>
          <h2 class="text-3xl font-bold">Nuestra Historia</h2>
        </div>
        
        <Card class="border-l-4 border-l-primary">
          <CardContent class="pt-6 prose prose-lg max-w-none">
            <p class="text-muted-foreground leading-relaxed">
              <strong class="text-foreground">Tyto Alba</strong> es una asociación sin ánimo de lucro que lleva 
              <span class="text-primary font-semibold">casi 20 años</span> dedicándose a la promoción de las 
              actividades físicas en la naturaleza, deportes alternativos y que se desarrollan en ella y las 
              actividades culturales relacionadas con la música.
            </p>
          </CardContent>
        </Card>

        <!-- Timeline -->
        <div class="mt-8 space-y-6">
          <!-- 1994 -->
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-primary font-bold text-sm">1994</span>
              </div>
              <div class="w-0.5 flex-1 bg-border mt-2"></div>
            </div>
            <Card class="flex-1">
              <CardHeader>
                <CardTitle class="text-lg">Los inicios</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  Antes de conformarse como asociación, antiguos miembros de los grupos de 
                  <strong>Scout de Valdepeñas</strong> deciden enfocar sus actividades de una manera distinta.
                </p>
              </CardContent>
            </Card>
          </div>

          <!-- 1998 -->
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-primary font-bold text-sm">1998</span>
              </div>
              <div class="w-0.5 flex-1 bg-border mt-2"></div>
            </div>
            <Card class="flex-1 border-primary/20">
              <CardHeader>
                <CardTitle class="text-lg">Constitución oficial</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  Se formalizan los primeros <strong>estatutos</strong> en el Registro de Asociaciones de la 
                  Diputación de Ciudad Real. Crece el número de socios y se establece la 
                  <strong>primera sede</strong> en la calle Calvario, con rocódromo, zonas de material y sala de reuniones.
                </p>
              </CardContent>
            </Card>
          </div>

          <!-- 2002 -->
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span class="text-primary-foreground font-bold text-sm">2002</span>
              </div>
              <div class="w-0.5 flex-1 bg-border mt-2"></div>
            </div>
            <Card class="flex-1 border-primary">
              <CardHeader>
                <CardTitle class="text-lg">Nueva sede propia</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  La asociación afronta su proyecto más ambicioso: la <strong>compra de una nave industrial</strong> 
                  en la calle San Cristóbal nº 13 de Valdepeñas, que sigue siendo nuestra sede actual.
                </p>
              </CardContent>
            </Card>
          </div>

          <!-- Actualidad -->
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Clock class="w-5 h-5 text-green-500" />
              </div>
            </div>
            <Card class="flex-1 bg-green-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle class="text-lg text-green-600">Actualidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-muted-foreground">
                  Tras un duro trabajo de remodelación, disponemos de:
                </p>
                <ul class="mt-3 space-y-2">
                  <li class="flex items-center gap-2 text-sm">
                    <Check class="w-4 h-4 text-green-500" />
                    <span>Sala de entrenamiento con tatami</span>
                  </li>
                  <li class="flex items-center gap-2 text-sm">
                    <Check class="w-4 h-4 text-green-500" />
                    <span>Rocódromo</span>
                  </li>
                  <li class="flex items-center gap-2 text-sm">
                    <Check class="w-4 h-4 text-green-500" />
                    <span>Salas insonorizadas para ensayos musicales</span>
                  </li>
                  <li class="flex items-center gap-2 text-sm">
                    <Check class="w-4 h-4 text-green-500" />
                    <span>Taller de mantenimiento</span>
                  </li>
                  <li class="flex items-center gap-2 text-sm">
                    <Check class="w-4 h-4 text-green-500" />
                    <span>Sala de reuniones y exposiciones</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      <!-- Objetivos -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-blue-500/10 rounded-lg">
            <Target class="w-6 h-6 text-blue-500" />
          </div>
          <h2 class="text-3xl font-bold">Objetivos</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <Card class="hover:shadow-md transition-shadow">
            <CardContent class="pt-6">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-orange-500/10 rounded-xl">
                  <Mountain class="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Actividades en el Medio Natural</h3>
                  <p class="text-muted-foreground text-sm">
                    Fomentar las Actividades Físicas en el Medio Natural y, más en concreto, 
                    <strong>la Escalada</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="hover:shadow-md transition-shadow">
            <CardContent class="pt-6">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-purple-500/10 rounded-xl">
                  <Music class="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Actividades Culturales</h3>
                  <p class="text-muted-foreground text-sm">
                    Fomentar las <strong>Actividades Culturales y Sociales</strong> relacionadas con la música.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <!-- Valores -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-red-500/10 rounded-lg">
            <Heart class="w-6 h-6 text-red-500" />
          </div>
          <h2 class="text-3xl font-bold">Valores</h2>
        </div>

        <p class="text-muted-foreground mb-6">
          Tyto Alba mantiene los siguientes valores como principios con los que alcanzar los objetivos de la asociación:
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card class="text-center hover:border-green-500/50 transition-colors">
            <CardContent class="pt-6">
              <div class="w-14 h-14 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                <Leaf class="w-7 h-7 text-green-500" />
              </div>
              <h3 class="font-bold text-green-600 mb-2">RESPETO Y CUIDADO</h3>
              <p class="text-sm text-muted-foreground">Del Medio Ambiente</p>
            </CardContent>
          </Card>

          <Card class="text-center hover:border-blue-500/50 transition-colors">
            <CardContent class="pt-6">
              <div class="w-14 h-14 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Users class="w-7 h-7 text-blue-500" />
              </div>
              <h3 class="font-bold text-blue-600 mb-2">IGUALDAD, RESPETO Y AMISTAD</h3>
              <p class="text-sm text-muted-foreground">Entre los miembros y hacia la ciudadanía</p>
            </CardContent>
          </Card>

          <Card class="text-center hover:border-orange-500/50 transition-colors">
            <CardContent class="pt-6">
              <div class="w-14 h-14 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Trophy class="w-7 h-7 text-orange-500" />
              </div>
              <h3 class="font-bold text-orange-600 mb-2">ESFUERZO Y SUPERACIÓN</h3>
              <p class="text-sm text-muted-foreground">A la hora de afrontar retos deportivos</p>
            </CardContent>
          </Card>

          <Card class="text-center hover:border-purple-500/50 transition-colors sm:col-span-2 lg:col-span-3">
            <CardContent class="pt-6">
              <div class="w-14 h-14 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Guitar class="w-7 h-7 text-purple-500" />
              </div>
              <h3 class="font-bold text-purple-600 mb-2">CRECIMIENTO MUSICAL Y PERSONAL</h3>
              <p class="text-sm text-muted-foreground">Que para el individuo supone la interpretación de música de forma colectiva</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <!-- Estatutos -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-slate-500/10 rounded-lg">
            <Scale class="w-6 h-6 text-slate-500" />
          </div>
          <h2 class="text-3xl font-bold">Estatutos</h2>
        </div>

        <Card class="bg-slate-50 border-slate-200">
          <CardContent class="pt-6">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 class="font-semibold text-lg mb-2">Estatutos Oficiales</h3>
                <p class="text-muted-foreground text-sm">
                  Consulta los estatutos oficiales de la Asociación Tyto Alba registrados en la Diputación de Ciudad Real.
                </p>
              </div>
              <Button variant="outline" class="shrink-0">
                <FileText class="w-4 h-4 mr-2" />
                Ver Estatutos
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  History, 
  Clock, 
  Check, 
  Target, 
  Mountain, 
  Music, 
  Heart, 
  Leaf, 
  Users, 
  Trophy, 
  Guitar, 
  Scale, 
  FileText 
} from 'lucide-vue-next'
</script>
