<template>
  <div class="min-h-screen">
    <!-- Header -->
    <PageHeader class="bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
      <PageHeaderHeading class="max-w-4xl">
        Socios
      </PageHeaderHeading>
      <PageHeaderDescription>
        Información sobre cómo ser socio de Tyto Alba
      </PageHeaderDescription>
    </PageHeader>

    <div class="container mx-auto px-4 py-12 max-w-5xl space-y-16">

      <!-- Introducción -->
      <section>
        <Alert class="border-amber-500/20 bg-amber-500/5">
          <AlertTriangle class="h-4 w-4 text-amber-500" />
          <AlertTitle class="text-amber-600">Compromiso como Socio</AlertTitle>
          <AlertDescription class="text-amber-600/80">
            Toda persona que desee ser socio de Tyto Alba se compromete a hacer frente a las cuotas periódicas que se estipulan, así como a cumplir con los valores y normativa de la asociación.
          </AlertDescription>
        </Alert>

        <Card class="mt-6 border-red-200 bg-red-50/50">
          <CardContent class="pt-6">
            <div class="flex items-start gap-3">
              <Ban class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p class="text-sm text-muted-foreground">
                La falta de pago o el incumplimiento de la normativa establecida será causa de apertura de expediente y <strong class="text-red-600">expulsión de la asociación de manera definitiva</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <!-- Cómo hacerse socio -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-green-500/10 rounded-lg">
            <UserPlus class="w-6 h-6 text-green-500" />
          </div>
          <h2 class="text-3xl font-bold">Cómo Hacerse Socio</h2>
        </div>

        <p class="text-muted-foreground mb-6">
          Para hacerse socio basta con enviar un email al correo
          <a href="mailto:asoc.tytoalba@gmail.com" class="text-primary font-semibold hover:underline">asoc.tytoalba@gmail.com</a>
          incluyendo:
        </p>

        <div class="grid md:grid-cols-2 gap-4">
          <Card class="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-lg">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">1</div>
                Documento de Identidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">
                Una <strong>fotografía por ambas caras del DNI</strong>. En caso de menores, el DNI del padre/madre o tutor legal responsable.
              </p>
            </CardContent>
          </Card>

          <Card class="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-lg">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">2</div>
                Consentimiento (menores)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">
                Los menores deberán entregar el <strong>Documento de Consentimiento</strong> relleno y firmado por su padre/madre o tutor legal.
              </p>
            </CardContent>
          </Card>

          <Card class="hover:shadow-md transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-lg">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">3</div>
                Datos Bancarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">
                <strong>Número de cuenta bancaria</strong> (IBAN) sobre la que se realizarán los cargos de las mensualidades de la asociación.
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="mt-8 flex justify-center">
          <Button size="lg" as-child>
            <NuxtLink to="/socios/solicitud">
              <Send class="w-4 h-4 mr-2" />
              Enviar Solicitud Online
            </NuxtLink>
          </Button>
        </div>
      </section>

      <Separator />

      <!-- Responsabilidades y Ventajas -->
      <section>
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-purple-500/10 rounded-lg">
            <Scale class="w-6 h-6 text-purple-500" />
          </div>
          <h2 class="text-3xl font-bold">Responsabilidades y Ventajas</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Ventajas -->
          <Card class="border-green-500/20">
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-green-600">
                <CheckCircle2 class="w-5 h-5" />
                Ventajas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <DoorOpen class="w-3 h-3 text-green-500" />
                  </div>
                  <p class="text-sm text-muted-foreground">
                    <strong>Acceso y disfrute</strong> de las instalaciones en horario normal cualquier día de la semana.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <Vote class="w-3 h-3 text-green-500" />
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Posibilidad de acceder a las <strong>reuniones periódicas</strong> que se realizan en la asociación, votar en ellas (siguiendo la normativa) y asumir puestos de responsabilidad en la directiva.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <Lightbulb class="w-3 h-3 text-green-500" />
                  </div>
                  <p class="text-sm text-muted-foreground">
                    <strong>Capacidad de propuesta</strong> de actividades de todo tipo y gestión de las mismas en nombre de la asociación, una vez aprobadas.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Responsabilidades -->
          <Card class="border-amber-500/20">
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-amber-600">
                <ShieldAlert class="w-5 h-5" />
                Responsabilidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Broom class="w-3 h-3 text-amber-500" />
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Ser <strong>responsable del mantenimiento</strong> de las instalaciones, tanto de su limpieza, orden y buen estado de conservación.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <HeartHandshake class="w-3 h-3 text-amber-500" />
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Cumplir con los <strong>valores y normativa</strong> de la asociación.
                  </p>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Receipt class="w-3 h-3 text-amber-500" />
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Hacer frente a las <strong>cuotas periódicas</strong> estipuladas puntualmente.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlertTriangle,
  Ban,
  UserPlus,
  Send,
  Scale,
  CheckCircle2,
  ShieldAlert,
  DoorOpen,
  Vote,
  Lightbulb,
  Broom,
  HeartHandshake,
  Receipt
} from 'lucide-vue-next'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '~/components/ui/card'
import {
  Alert,
  AlertTitle,
  AlertDescription
} from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
</script>
