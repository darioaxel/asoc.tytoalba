<template>
  <div class="min-h-screen">
    <!-- Header -->
    <PageHeader class="relative bg-cover bg-center bg-no-repeat" style="background-image: url('/images/old-page/fondo-roco-2.jpeg');">
      <!-- Overlay oscuro para mejorar legibilidad -->
      <div class="absolute inset-0 bg-black/40"></div>
      <PageHeaderHeading class="relative z-10 max-w-4xl text-white drop-shadow-lg">
        Rocódromo
      </PageHeaderHeading>
      <PageHeaderDescription class="relative z-10 text-white/90 drop-shadow-md">
        Sala de escalada indoor de la Asociación Tyto Alba
      </PageHeaderDescription>
    </PageHeader>

    <div class="container mx-auto px-4 py-12 max-w-5xl space-y-16">
      
      <!-- Características del rocódromo -->
      <section>
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <!-- Info -->
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-500/10 rounded-lg">
                <Mountain class="w-6 h-6 text-orange-500" />
              </div>
              <h2 class="text-3xl font-bold">Instalaciones</h2>
            </div>

            <p class="text-muted-foreground leading-relaxed">
              La sala de escalada <strong>indoor</strong> que posee la asociación está construida sobre una 
              estructura de <strong>vigas de acero</strong> y <strong>paneles de DM</strong>. Ocupa la mayor 
              parte de la planta baja del local y tiene una <span class="text-orange-500 font-semibold">altura máxima de 6 metros</span>.
            </p>

            <div class="grid sm:grid-cols-2 gap-4">
              <Card class="bg-orange-500/5 border-orange-500/20">
                <CardContent class="pt-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-orange-500/10 rounded-lg">
                      <Box class="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-orange-500">~1.000</p>
                      <p class="text-sm text-muted-foreground">Presas instaladas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="bg-orange-500/5 border-orange-500/20">
                <CardContent class="pt-6">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-orange-500/10 rounded-lg">
                      <Ruler class="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-orange-500">6m</p>
                      <p class="text-sm text-muted-foreground">Altura máxima</p>
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
                <Dumbbell class="w-5 h-5" />
                Equipamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Presas de diversos tamaños y volúmenes de resina</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Tabla campus para entrenamiento</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Colchonetas para protección de caídas</span>
                </li>
                <li class="flex items-start gap-3">
                  <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Seguros para práctica de maniobras</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <!-- Normativa -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-red-500/10 rounded-lg">
            <ShieldAlert class="w-6 h-6 text-red-500" />
          </div>
          <h2 class="text-3xl font-bold">Normativa del Rocódromo</h2>
        </div>

        <Alert variant="destructive" class="mb-8">
          <AlertTriangle class="w-4 h-4" />
          <AlertTitle>Actividad con riesgo</AlertTitle>
          <AlertDescription>
            La práctica de la escalada en rocódromo es una actividad deportiva con riesgo que exige 
            preparación física y técnica específicas. Se recomienda formación previa si no se tienen 
            los requisitos necesarios.
          </AlertDescription>
        </Alert>

        <!-- Categorías de normas -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Uso obligatorio -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-green-600">
                <CheckCircle2 class="w-5 h-5" />
                Uso Obligatorio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-green-500 font-bold">•</span>
                  <span>Calzado específico para escalada</span>
                </li>
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-green-500 font-bold">•</span>
                  <span>Material básico de seguridad (casco, arnés)</span>
                </li>
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-green-500 font-bold">•</span>
                  <span>Magnesio en bola o líquido</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Prohibiciones -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-red-600">
                <Ban class="w-5 h-5" />
                Prohibiciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3">
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-red-500 font-bold">•</span>
                  <span>Entrar a las colchonetas con calzado de calle</span>
                </li>
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-red-500 font-bold">•</span>
                  <span>Introducir comida y bebidas en la zona</span>
                </li>
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-red-500 font-bold">•</span>
                  <span>Mover las presas de su lugar</span>
                </li>
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-red-500 font-bold">•</span>
                  <span>Fumar, pintar paneles o hacer graffitis</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <!-- Resto de normas -->
        <Card class="mt-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <FileText class="w-5 h-5" />
              Normas de Convivencia y Responsabilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-6">
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-primary">1</span>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Cada usuario <strong>acepta el riesgo</strong> de la utilización del rocódromo en cualquiera de sus disciplinas.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-primary">2</span>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Los <strong>menores de 18 años</strong> deberán rellenar un formulario especial con el consentimiento de padres/tutores.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-primary">3</span>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Tyto Alba <strong>no se hace responsable</strong> de las consecuencias de la incorrecta utilización del rocódromo.
                  </p>
                </li>
              </ul>

              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-primary">4</span>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Tyto Alba <strong>no asume la responsabilidad</strong> por el daño, pérdida o robo de pertenencias personales.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-primary">5</span>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    <strong>Prohibido el uso</strong> a menores de 16 años que no vayan acompañados de un adulto o inscritos en algún curso.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-primary">6</span>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Se <strong>recomienda</strong> estar en posesión de la <strong>licencia federativa de montaña</strong>.
                  </p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <!-- Cierre de instalación -->
        <Alert class="mt-6 bg-blue-500/5 border-blue-500/20">
          <Info class="w-4 h-4 text-blue-500" />
          <AlertTitle class="text-blue-600">Responsabilidad del último usuario</AlertTitle>
          <AlertDescription class="text-blue-600/80">
            El socio que sea el último en usar la instalación será responsable de: comprobar que no hay basura, 
            apagar luces y equipos de música, y recoger todo el material.
          </AlertDescription>
        </Alert>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Mountain, 
  Box, 
  Ruler, 
  Dumbbell, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle, 
  Ban, 
  FileText, 
  Info 
} from 'lucide-vue-next'
</script>
