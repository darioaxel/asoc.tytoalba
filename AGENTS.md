# AGENTS.md - Asociación Tyto Alba

> Este archivo contiene información esencial para agentes de IA que trabajen en este proyecto.
> El proyecto utiliza principalmente español para comentarios y documentación.

---

## Project Overview

**Asociación Tyto Alba** es una aplicación web full-stack desarrollada con Nuxt.js para la gestión de una asociación. Incluye funcionalidades para:

- Gestión de socios y membresías
- Sistema de recibos y pagos
- Blog/documentación con Nuxt Content
- Sistema de tareas internas
- Sistema de propuestas y votaciones
- Panel de administración

**Stack Tecnológico Principal:**
- **Framework**: Nuxt.js 4.2.1 (Vue 3 + TypeScript)
- **Base de datos**: PostgreSQL (Neon) con Prisma ORM 7.3.0
- **Estilos**: Tailwind CSS 4 + shadcn-vue (estilo New York)
- **Autenticación**: nuxt-auth-utils (sesiones) + bcrypt para passwords
- **Estado**: Pinia con pinia-plugin-persistedstate
- **Contenido**: Nuxt Content para blog
- **Iconos**: Lucide Vue
- **Formularios**: vee-validate + zod
- **Package Manager**: pnpm 10.12.1

---

## Project Structure

```
/home/darioaxel/Proyectos/asoc.tytoalba/
├── app/                          # Código fuente principal (Nuxt 4)
│   ├── app.vue                   # Componente raíz
│   ├── assets/css/               # Estilos globales (Tailwind)
│   ├── components/               # Componentes Vue
│   │   ├── ui/                   # Componentes shadcn-vue
│   │   ├── layout/               # Layouts específicos
│   │   ├── payment/              # Componentes de pagos
│   │   └── ...
│   ├── composables/              # Composables reutilizables
│   │   ├── useAppUserSession.ts  # Gestión de sesión extendida
│   │   ├── useFileUpload.ts      # Subida de archivos
│   │   ├── useMyReceipts.ts      # Gestión de recibos
│   │   └── usePayment.ts         # Proceso de pago
│   ├── layouts/                  # Layouts de Nuxt
│   │   ├── default.vue           # Layout público
│   │   └── dashboard.vue         # Layout con sidebar (autenticado)
│   ├── middleware/               # Middleware de rutas
│   │   ├── auth.ts               # Protección de rutas autenticadas
│   │   └── role.global.ts        # Verificación de roles
│   ├── pages/                    # Páginas (rutas auto-generadas)
│   │   ├── index.vue             # Página principal
│   │   ├── blog/                 # Blog público
│   │   └── socios/               # Área de socios (protegida)
│   ├── types/                    # Tipos TypeScript
│   │   ├── auth.d.ts             # Tipos de autenticación
│   │   └── payments.ts           # Tipos de pagos
│   └── generated/prisma/         # Cliente Prisma generado
├── content/                      # Contenido markdown (blog)
├── lib/                          # Utilidades (si aplica)
├── plugins/                      # Plugins de Nuxt
│   └── api.ts                    # Configuración de $fetch
├── prisma/                       # Esquema y migraciones Prisma
│   ├── schema/                   # Esquemas divididos por dominio
│   │   ├── schema.prisma         # Configuración principal
│   │   ├── user.prisma           # Usuarios y membresías
│   │   ├── receipt.prisma        # Recibos y pagos
│   │   ├── task.prisma           # Tareas
│   │   ├── proposal.prisma       # Propuestas
│   │   ├── post.prisma           # Posts del blog
│   │   └── enums.prisma          # Enumeraciones
│   ├── migrations/               # Migraciones de base de datos
│   └── seed/                     # Datos de semilla
├── server/                       # Código del servidor (Nitro)
│   ├── api/                      # Endpoints de API
│   │   ├── auth/                 # Autenticación (login, register, logout)
│   │   ├── admin/                # Endpoints de administración
│   │   ├── receipts/             # Gestión de recibos (socios)
│   │   ├── user/                 # Gestión de usuarios
│   │   └── ...
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
pnpm prisma:migrate      # Crear/apply migraciones
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

### Modelos Principales

**Usuarios y Autenticación:**
- `User`: Usuarios del sistema (socios, admin, root)
- `Address`: Direcciones de usuarios
- `MembershipType`: Tipos de membresía (NORMAL, JUVENIL, FUNDADOR)
- `UserPaymentData`: Datos bancarios para domiciliaciones

**Sistema de Recibos:**
- `Receipt`: Recibos de cuotas mensuales
- `ReceiptFile`: Archivos adjuntos a recibos
- `Payment`: Pagos realizados por socios

**Sistema de Tareas:**
- `Task`: Tareas internas de la asociación
- `TaskAssignee`: Asignaciones de tareas

**Sistema de Propuestas:**
- `Proposal`: Propuestas para votación
- `Vote`: Votos de usuarios

**Contenido:**
- `Post`: Artículos del blog
- `File`: Archivos generales subidos

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
- Usa `nuxt-auth-utils` para gestión de sesiones
- Sesiones almacenadas en cookies seguras
- Passwords hasheados con bcrypt (10 rounds)

### Middleware
- `auth.ts`: Protege rutas que requieren autenticación
- `role.global.ts`: Verifica roles permitidos por página

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

---

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login con email/password |
| POST | `/api/auth/register` | Registro de nuevo socio |
| POST | `/api/auth/logout` | Cerrar sesión |

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
| POST | `/api/admin/receipts/validate` | Validar pago |
| POST | `/api/admin/receipts/reject` | Rechazar pago |
| POST | `/api/admin/receipts/unlock` | Desbloquear recibos |

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

### Componentes Vue
- Preferir `<script setup lang="ts">`
- Usar Composition API
- Componentes en PascalCase

### Estilos
- Usar Tailwind CSS para todos los estilos
- Variables CSS definidas en `tailwind.css`
- Soporte dark mode via `dark` class

### Convenciones de Nomenclatura
- **Archivos**: kebab-case para composables, PascalCase para componentes
- **Variables**: camelCase
- **Constantes**: UPPER_SNAKE_CASE para enums
- **Tipos/Interfaces**: PascalCase con sufijo opcional (User, UserSession)

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
4. **Rate limiting**: Implementar en endpoints sensibles
5. **Validación**: Usar zod para toda entrada de usuario
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

*Última actualización: Febrero 2026*
