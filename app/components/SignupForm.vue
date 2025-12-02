<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Crear una cuenta</CardTitle>
      <CardDescription>
        Introduce tu información a continuación para crear tu cuenta
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel for="name">
              Nombre
            </FieldLabel>
            <Input id="name" type="text" placeholder="Juan Antonio" required />
          </Field>
          <Field>
            <FieldLabel for="last-name">
              Apellidos
            </FieldLabel>
            <Input id="last-name" type="text" placeholder="Juan Antonio" required />
          </Field>
          <Field>
            <FieldLabel for="email">
              Correo electrónico
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@ejemplo.com"
              required
            />
            <FieldDescription>
              Usaremos este correo para contactar contigo. No lo compartiremos
              con nadie más.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="password">
              Contraseña
            </FieldLabel>
            <Input id="password" type="password" required />
            <FieldDescription>Debe tener al menos 8 caracteres.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="confirm-password">
              Confirmar contraseña
            </FieldLabel>
            <Input id="confirm-password" type="password" required />
            <FieldDescription>Por favor, confirma tu contraseña.</FieldDescription>
          </Field>
          <FieldGroup>
            <Field>
              <Button type="submit">
                Crear cuenta
              </Button>
              <Button variant="outline" type="button">
                Registrarse con Google
              </Button>
              <FieldDescription class="px-6 text-center">
                ¿Ya tienes una cuenta? <a href="/socios/login">Inicia sesión</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
