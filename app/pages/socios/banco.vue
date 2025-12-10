<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
})

/* ---------- Composables / estado ---------- */
const { user } = await useUserSession()
const router = useRouter()
const isEditing = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)

import { toast } from 'vue-sonner'
import { Pencil, Loader2 } from 'lucide-vue-next'

/* ---------- Formulario reactivo ---------- */
const form = reactive({
  paymentMethod: 'TRANSFERENCIA' as 'TRANSFERENCIA' | 'CARGO_BANCARIO',
  iban: '',
})

/* ---------- Carga de datos ---------- */
async function loadPaymentData() {
  if (!user.value?.id) {
    await router.push('/socios/login')
    return
  }
  try {
    const data = await $fetch('/api/user/payment-data')
    form.paymentMethod = data.paymentMethod
    form.iban = data.iban ?? ''
  } catch (err: any) {
    toast.error(err.data?.message || 'No se han podido cargar los datos bancarios')
    if (err.statusCode === 401) await router.push('/socios/login')
  } finally {
    isLoading.value = false
  }
}

/* ---------- Acciones ---------- */
function startEdit() {
  isEditing.value = true
}
function cancelEdit() {
  isEditing.value = false
  loadPaymentData()
}
async function savePaymentData() {
  isSaving.value = true
  try {
    await $fetch('/api/user/payment-data', {
      method: 'PUT',
      body: {
        paymentMethod: form.paymentMethod,
        iban: form.paymentMethod === 'CARGO_BANCARIO' ? form.iban.trim() : null,
      },
    })
    toast.success('Datos bancarios actualizados')
    isEditing.value = false
  } catch (err: any) {
    toast.error(err.data?.message || 'Error al guardar')
  } finally {
    isSaving.value = false
  }
}

/* ---------- Montaje ---------- */
onMounted(() => loadPaymentData())
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">Mis datos bancarios</h1>
      <Button v-if="!isEditing" @click="startEdit" variant="outline">
        <Pencil class="w-4 h-4 mr-2" />
        Editar
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin" />
    </div>

    <!-- Card -->
    <Card v-else>
      <CardHeader>
        <CardTitle>Forma de pago</CardTitle>
        <CardDescription>
          Indica cómo quieres realizar los pagos y, en su caso, el IBAN para domiciliarlos.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="savePaymentData">
          <FieldGroup>
            <!-- Selector -->
            <Field>
              <FieldLabel>Método de pago</FieldLabel>
              <Select v-model="form.paymentMethod" :disabled="!isEditing">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSFERENCIA">
                    Transferencia manual
                  </SelectItem>
                  <SelectItem value="CARGO_BANCARIO">
                    Cargo bancario mensual
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <!-- IBAN (solo si es cargo) -->
            <Field v-if="form.paymentMethod === 'CARGO_BANCARIO'">
              <FieldLabel>IBAN</FieldLabel>
              <Input
                v-model="form.iban"
                placeholder="ES91 2100 0418 4502 0005 1332"
                :disabled="!isEditing"
              />
              <FieldDescription>
                Introduce un IBAN español válido (24 caracteres).
              </FieldDescription>
            </Field>

            <!-- Botones -->
            <div class="flex justify-end gap-3 mt-6">
              <Button
                v-if="isEditing"
                type="button"
                variant="outline"
                @click="cancelEdit"
              >
                Cancelar
              </Button>
              <Button
                v-if="isEditing"
                type="submit"
                :disabled="isSaving"
              >
                <Loader2 v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" />
                {{ isSaving ? 'Guardando…' : 'Guardar' }}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>