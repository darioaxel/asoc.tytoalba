# AGENTS.md - Asociación Tyto Alba

> Este archivo contiene información esencial para agentes de IA que trabajen en este proyecto.
> El proyecto utiliza principalmente español para comentarios y documentación.

---

## Project Overview

**Asociación Tyto Alba** es una aplicación web full-stack desarrollada con Nuxt.js para la gestión integral de una asociación. Incluye funcionalidades para:

- **Gestión de socios y membresías**: Registro, perfiles y tipos de membresía
- **Sistema de recibos y pagos**: Generación de recibos mensuales, pagos por transferencia y domiciliación bancaria
- **Blog/documentación**: Sistema de contenido con Nuxt Content
- **Sistema de tareas internas**: Creación, asignación y seguimiento de tareas
- **Sistema de propuestas y votaciones**: Propuestas con votación de socios
- **Panel de administración**: Gestión de socios, validación de pagos y tesorería

**Stack Tecnológico Principal:**
- **Framework**: Nuxt.js 4.2.1 (Vue 3 + TypeScript)
- **Base de datos**: PostgreSQL (Neon serverless) con Prisma ORM 7.3.0
- **Estilos**: Tailwind CSS 4 + shadcn-vue (estilo New York)
- **Autenticación**: nuxt-auth-utils (sesiones) + bcrypt para passwords
- **Estado**: Pinia con pinia-plugin-persistedstate
- **Contenido**: Nuxt Content para blog
- **Iconos**: Lucide Vue
- **Formularios**: vee-validate + zod
- **Fuente**: Inter (Fontsource)
- **Package Manager**: pnpm 10.12.1

---

## Project Structure

```
/home/darioaxel/Proyectos/asoc.tytoalba/
├── app/                          # Código fuente principal (Nuxt 4)
│   ├── app.vue                   # Componente raíz
│   ├── assets/css/               # Estilos globales (Tailwind)
│   ├── components/               # Componentes Vue
│   │   ├── ui/                   # Componentes shadcn-vue (40+ componentes)
│   │   ├── layout/               # Layouts específicos
│   │   ├── payment/              # Componentes de pagos
│   │   ├── blog/                 # Componentes del blog
│   │   └── landing/              # Componentes landing page
│   ├── composables/              # Composables reutilizables
│   │   ├── useAppUserSession.ts  # Gestión de sesión extendida
│   │   ├── useFileUpload.ts      # Subida de archivos
│   │   ├── useMyReceipts.ts      # Gestión de recibos
│   │   ├── usePayment.ts         # Proceso de pago
│   │   └── useRole.ts            # Helper para roles
│   ├── layouts/                  # Layouts de Nuxt
│   │   ├── default.vue           # Layout público
│   │   └── dashboard.vue         # Layout con sidebar (autenticado)
│   ├── middleware/               # Middleware de rutas
│   │   ├── auth.ts               # Protección de rutas autenticadas
│   │   └── role.global.ts        # Verificación de roles
│   ├── pages/                    # Páginas (rutas auto-generadas)
│   │   ├── index.vue             # Página principal
│   │   ├── blog/                 # Blog público
│   │   ├── socios/               # Área de socios (protegida)
│   │   │   ├── index.vue
│   │   │   ├── recibos.vue
│   │   │   ├── pagar.vue
│   │   │   ├── tareas.vue
│   │   │   ├── propuestas.vue
│   │   │   ├── posts/
│   │   │   └── ...
│   │   └── admin.vue             # Panel de administración
│   ├── types/                    # Tipos TypeScript
│   │   ├── auth.d.ts             # Tipos de autenticación
│   │   └── payments.ts           # Tipos de pagos
│   └── generated/prisma/         # Cliente Prisma generado
├── content/                      # Contenido markdown (blog) - vacío inicialmente
├── lib/                          # Utilidades (si aplica)
│   └── utils.ts                  # Helpers de utilidad
├── plugins/                      # Plugins de Nuxt
│   └── api.ts                    # Configuración de $fetch
├── prisma/                       # Esquema y migraciones Prisma
│   ├── schema/                   # Esquemas divididos por dominio
│   │   ├── schema.prisma         # Configuración principal del generador
│   │   ├── user.prisma           # Usuarios, direcciones, membresías
│   │   ├── receipt.prisma        # Recibos y archivos adjuntos
│   │   ├── payment.prisma        # Pagos y datos bancarios
│   │   ├── task.prisma           # Tareas y asignaciones
│   │   ├── proposal.prisma       # Propuestas, votos y documentos
│   │   ├── post.prisma           # Posts del blog, tags, imágenes
│   │   ├── file.prisma           # Archivos genéricos
│   │   ├── accounting.prisma     # Contabilidad (facturas, asientos)
│   │   └── enums.prisma          # Enumeraciones del sistema
│   ├── migrations/               # Migraciones de base de datos
│   └── seed/                     # Datos de semilla con seeders organizados
├── server/                       # Código del servidor (Nitro)
│   ├── api/                      # Endpoints de API
│   │   ├── auth/                 # Autenticación (login, register, logout)
│   │   ├── admin/                # Endpoints de administración
│   │   ├── receipts/             # Gestión de recibos (socios)
│   │   ├── user/                 # Gestión de usuarios
│   │   ├── tasks/                # Gestión de tareas
│   │   ├── proposals/            # Gestión de propuestas
│   │   ├── posts/                # Gestión de posts
│   │   └── files/                # Subida de archivos
│   ├── services/                 # Lógica de negocio
│   │   ├── receipt-admin.service.ts
│   │   ├── receipt-generator.service.ts
│   │   └── receipt-payment.service.ts
│   └── utils/                    # Utilidades del servidor
│       ├── db.ts                 # Cliente Prisma (Neon adapter)
│       └── iban.ts               # Validación de IBAN
├── uploads/                      # Archivos subidos (justificantes)
├── public/                       # Assets estáticos
└── .output/                      # Build output
```

---

## Build and Development Commands

```bash
# Instalación de dependencias
pnpm install

# Desarrollo local
pnpm dev

# Build para producción
pnpm build

# Generar sitio estático
pnpm generate

# Preview del build
pnpm preview

# Comandos de Prisma
pnpm prisma:migrate      # Crear/aplicar migraciones
pnpm prisma:generate     # Generar cliente Prisma
pnpm prisma:setup        # Setup inicial con seed
```

---

## Database Architecture

### Conexión
- **Proveedor**: Neon PostgreSQL (serverless)
- **Pooling**: Usa `DATABASE_URL` con pooler para la app
- **Migrations**: Usa `DIRECT_URL` sin pooler
- **Adapter**: `@prisma/adapter-neon` para serverless
- **Configuración**: `prisma.config.ts` con enfoque modular

### Modelos Principales

**Usuarios y Autenticación:**
- `User`: Usuarios del sistema (socios, admin, root)
- `Address`: Direcciones de usuarios (1:1)
- `MembershipType`: Tipos de membresía (NORMAL, JUVENIL, FUNDADOR)
- `UserPaymentData`: Datos bancarios para domiciliaciones

**Sistema de Recibos:**
- `Receipt`: Recibos de cuotas mensuales con estados (PENDING, IN_PROCESS, PARTIALLY_PAID, FULLY_PAID, RETURNED)
- `ReceiptFile`: Archivos adjuntos a recibos
- `Payment`: Pagos realizados por socios

**Sistema de Tareas:**
- `Task`: Tareas internas con tipos (IMPORTANTE, URGENTE, PROPUESTA, VERIFICAR_NUEVO_SOCIO)
- `TaskAssignee`: Asignaciones de tareas (muchos a muchos)
- `TaskDocument`: Documentos asociados a tareas

**Sistema de Propuestas:**
- `Proposal`: Propuestas para votación con estados (VOTANDO, ACEPTADA, RECHAZADA)
- `Vote`: Votos de usuarios (UP/DOWN)
- `ProposalDocument`/`ProposalImage`: Archivos adjuntos

**Contenido:**
- `Post`: Artículos del blog
- `Tag`: Etiquetas para posts
- `File`: Archivos genéricos subidos

### Roles del Sistema
```typescript
enum Role {
  USER   // Socio normal
  ADMIN  // Administrador
  ROOT   // Super administrador
}
```

---

## Authentication & Authorization

### Sesiones
- Usa `nuxt-auth-utils` para gestión de sesiones con cookies seguras
- Passwords hasheados con bcrypt (12 rounds en registro)
- Datos de sesión: id, email, role, firstName, lastName, isActive

### Middleware
- `auth.ts`: Protege rutas que requieren autenticación, redirige a `/socios/login`
- `role.global.ts`: Verifica roles permitidos por página mediante `definePageMeta({ roles: ['ADMIN'] })`

### Uso de Roles en Páginas
```typescript
definePageMeta({
  middleware: ['auth'],
  roles: ['ADMIN', 'ROOT']  // Opcional: restringir por rol
})
```

### Composable de Sesión
- `useAppUserSession()`: Extiende useUserSession con datos completos del usuario
- Emite eventos globales via `authBus` para login/logout
- Mantiene estado reactivo compartido entre componentes

---

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login con email/password |
| POST | `/api/auth/register` | Registro de nuevo socio |
| POST | `/api/auth/logout` | Cerrar sesión |

### Usuario
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/user` | Datos del usuario actual |
| GET | `/api/user/profile` | Perfil completo |
| GET | `/api/user/payment-data` | Datos bancarios |
| PUT | `/api/user/payment-data` | Actualizar datos bancarios |
| POST | `/api/user/change-password` | Cambiar contraseña |
| DELETE | `/api/user/[id]` | Eliminar usuario |

### Recibos (Socios)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/receipts/my?year=2024` | Listar mis recibos |
| GET | `/api/receipts/pending` | Recibos pendientes |
| POST | `/api/receipts/pay` | Enviar pago con justificante |

### Administración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/receipts/pending` | Pagos pendientes de validación |
| GET | `/api/admin/receipts/stats` | Estadísticas de tesorería |
| POST | `/api/admin/receipts/validate` | Validar pago |
| POST | `/api/admin/receipts/reject` | Rechazar pago |
| POST | `/api/admin/receipts/unlock` | Desbloquear recibos |
| GET | `/api/admin/socios` | Listar socios |
| POST | `/api/admin/socios/[id]/toggle-status` | Activar/desactivar socio |

### Tareas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Listar tareas |
| POST | `/api/tasks` | Crear tarea |
| GET | `/api/tasks/[id]` | Ver tarea |
| PUT | `/api/tasks/[id]` | Actualizar tarea |
| DELETE | `/api/tasks/[id]` | Eliminar tarea |

### Propuestas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/proposals` | Listar propuestas |
| POST | `/api/proposals` | Crear propuesta |
| GET | `/api/proposals/[id]` | Ver propuesta |
| DELETE | `/api/proposals/[id]` | Eliminar propuesta |
| POST | `/api/proposals/[id]/vote` | Votar propuesta |

### Posts (Blog)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/posts` | Listar posts |
| POST | `/api/posts` | Crear post |
| GET | `/api/posts/[id]` | Ver post por ID |
| GET | `/api/posts/[slug]` | Ver post por slug |
| PUT | `/api/posts/[id]` | Actualizar post |
| DELETE | `/api/posts/[id]` | Eliminar post |
| GET | `/api/posts/latest` | Posts recientes |

### Archivos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/files/upload` | Subir archivo |

---

## Code Style Guidelines

### TypeScript
- Usar `strict` mode
- Tipar explícitamente retornos de funciones públicas
- Usar interfaces para objetos de dominio
- Tipos de autenticación extendidos en `app/types/auth.d.ts`

### Componentes Vue
- Preferir `<script setup lang="ts">`
- Usar Composition API
- Componentes en PascalCase
- Imports con alias `@/components/...`

### Estilos
- Usar Tailwind CSS para todos los estilos
- Variables CSS definidas en `app/assets/css/tailwind.css`
- Soporte dark mode via clase `dark`
- Tema personalizado con colores ámbar/dorado para primary

### Convenciones de Nomenclatura
- **Archivos**: kebab-case para composables, PascalCase para componentes
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE para enums
- **Tipos/Interfaces**: PascalCase

### Comentarios
- Comentar en español (idioma principal del proyecto)
- Usar `//` para comentarios inline
- Documentar funciones complejas con JSDoc

---

## Environment Variables

```bash
# Sesión (requerido)
NUXT_SESSION_PASSWORD=<random-string-32-chars>

# Base de datos (requerido)
DATABASE_URL="postgresql://...-pooler..."  # Con pooling
DIRECT_URL="postgresql://..."               # Sin pooling (migrations)

# OAuth Google (opcional)
NUXT_OAUTH_GOOGLE_CLIENT_ID=...
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=...
```

---

## Security Considerations

1. **CSP deshabilitado en desarrollo** (ver `nuxt.config.ts`)
2. **Content Security Policy** debe activarse en producción
3. **Subida de archivos**: Solo extensiones permitidas, validación de tamaño
4. **Rate limiting**: Implementado con `rate-limiter-flexible` en endpoints sensibles
5. **Validación**: Usar zod para toda entrada de usuario (`readValidatedBody`)
6. **SQL Injection**: Protegido por Prisma ORM
7. **XSS**: Vue escapa automáticamente, evitar v-html con contenido no sanitizado

---

## Testing Strategy

Actualmente el proyecto no tiene tests configurados. Para añadir:

- **Unit tests**: Vitest (recomendado para composables/utilidades)
- **E2E tests**: Playwright (flujos críticos: login, pagos)
- **API tests**: Vitest + supertest (test de endpoints)

---

## Deployment

### Build de Producción
```bash
pnpm install
pnpm prisma:generate
pnpm build
```

### Variables de Entorno Requeridas
- `DATABASE_URL` y `DIRECT_URL` configuradas
- `NUXT_SESSION_PASSWORD` generada

### Consideraciones
- Usar `DATABASE_URL` con pooler para la aplicación
- Usar `DIRECT_URL` sin pooler para migraciones Prisma
- Carpeta `uploads/` debe persistir entre despliegues

---

## Common Tasks

### Añadir un nuevo modelo Prisma
1. Crear/actualizar archivo en `prisma/schema/`
2. Ejecutar `pnpm prisma:migrate`
3. Ejecutar `pnpm prisma:generate`

### Añadir una nueva página protegida
1. Crear archivo en `app/pages/`
2. Añadir `definePageMeta({ middleware: ['auth'] })`
3. Opcional: especificar roles con `roles: ['ADMIN']`

### Crear un endpoint de API
1. Crear archivo en `server/api/` (ej: `test.get.ts`)
2. Usar `defineEventHandler` con tipado
3. Validar entrada con zod: `readValidatedBody(event, schema.parse)`

### Añadir un componente shadcn
```bash
npx shadcn-vue add <component-name>
```

---

## Troubleshooting

### Error de conexión a base de datos
- Verificar que `DATABASE_URL` use el pooler para la app
- Verificar que `DIRECT_URL` NO use pooler para migraciones

### Cliente Prisma no encontrado
- Ejecutar `pnpm prisma:generate`

### Sesión no persiste
- Verificar `NUXT_SESSION_PASSWORD` está configurada
- Verificar cookies no están bloqueadas

### Errores de CSP en desarrollo
- CSP está deshabilitado intencionalmente en desarrollo (ver `nuxt.config.ts`)
- Activar en producción configurando headers de seguridad

---

## Additional Notes

### Sistema de Recibos - Flujo de Estados
1. Los recibos se crean con estado `PENDING` y `isLocked: true`
2. Los ADMIN deben desbloquear recibos para que sean visibles (`/api/admin/receipts/unlock`)
3. Los socios pueden pagar recibos desbloqueados subiendo justificante
4. Los ADMIN validan/rechazan pagos (`validate` o `reject`)
5. Estados finales: `FULLY_PAID` (validado) o `RETURNED` (rechazado)

### Sistema de Tareas - Tipos
- `IMPORTANTE`: Tareas prioritarias
- `URGENTE`: Tareas con fecha límite crítica
- `PROPUESTA`: Tareas derivadas de propuestas aprobadas
- `VERIFICAR_NUEVO_SOCIO`: Tareas de validación de nuevos registros

### Sistema de Propuestas - Flujo
1. Socio crea propuesta con estado `VOTANDO`
2. Otros socios votan (UP/DOWN)
3. La propuesta puede ser `ACEPTADA` o `RECHAZADA`

---

*Última actualización: Marzo 2026*
