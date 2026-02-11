# AGENTS.md - Asociación Tyto Alba Web

> Este archivo está diseñado para ser leído por agentes de código AI. Contiene información esencial sobre la arquitectura, convenciones y procesos de desarrollo del proyecto.

---

## Project Overview

Este es el proyecto de desarrollo web para la **Asociación Tyto Alba**, una aplicación web full-stack construida con Nuxt 4. El proyecto implementa un sitio web con blog, sistema de autenticación de socios, área de administración y gestión de contenidos.

### Tecnologías Principales

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [Nuxt](https://nuxt.com/) | ^4.2.1 | Framework Vue.js full-stack |
| [Vue](https://vuejs.org/) | ^3.5.24 | Framework UI reactivo |
| [TypeScript](https://www.typescriptlang.org/) | ^5.1 | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.1.17 | Framework CSS utilitario |
| [Prisma](https://www.prisma.io/) | 7.3.0 | ORM para base de datos |
| [PostgreSQL](https://www.postgresql.org/) | - | Base de datos ( Neon ) |
| [Pinia](https://pinia.vuejs.org/) | ^3.0.4 | Estado global de la aplicación |
| [shadcn-vue](https://www.shadcn-vue.com/) | ^2.3.3 | Componentes UI accesibles |
| [VeeValidate](https://vee-validate.logaretm.com/) | ^4.15.1 | Validación de formularios |
| [Zod](https://zod.dev/) | ^3.25.76 | Validación de esquemas |

---

## Project Structure

```
/home/darioaxel/Proyectos/asoc.tytoalba/
├── app/                          # Código fuente principal de Nuxt
│   ├── app.vue                   # Componente raíz de la aplicación
│   ├── assets/css/               # Estilos globales (Tailwind)
│   ├── components/               # Componentes Vue reutilizables
│   │   ├── ui/                   # Componentes shadcn-vue
│   │   ├── layout/               # Componentes de layout
│   │   ├── blog/                 # Componentes específicos de blog
│   │   └── landing/              # Componentes de landing page
│   ├── composables/              # Composables de Vue (lógica reutilizable)
│   ├── layouts/                  # Layouts de Nuxt
│   │   ├── default.vue           # Layout principal (público)
│   │   └── dashboard.vue         # Layout para área de socios
│   ├── middleware/               # Middleware de rutas
│   │   ├── auth.ts               # Protección de rutas autenticadas
│   │   └── role.global.ts        # Validación de roles (global)
│   ├── pages/                    # Páginas de la aplicación (rutas automáticas)
│   │   ├── index.vue             # Página de inicio
│   │   ├── blog/                 # Blog y entradas
│   │   ├── socios/               # Área de socios (login, registro, dashboard)
│   │   └── ...                   # Otras páginas estáticas
│   ├── types/                    # Definiciones de tipos TypeScript
│   └── generated/prisma/         # Cliente Prisma generado (output personalizado)
├── lib/                          # Utilidades compartidas
│   └── prisma.ts                 # Instancia singleton de Prisma Client
├── prisma/                       # Esquema y migraciones de Prisma
│   ├── schema/                   # Esquemas divididos por dominio
│   │   ├── schema.prisma         # Configuración principal del generador
│   │   ├── user.prisma           # Modelos de usuario y dirección
│   │   ├── post.prisma           # Modelos de posts y tags
│   │   ├── payment.prisma        # Modelos de datos de pago
│   │   └── enums.prisma          # Enumeraciones (Role, PaymentMethod)
│   ├── seed/                     # Scripts de seeding
│   └── migrations/               # Migraciones de base de datos
├── server/                       # Código del servidor (Nitro)
│   ├── api/                      # Endpoints de API
│   │   ├── auth/                 # Autenticación (login, logout, register)
│   │   ├── posts/                # API de posts del blog
│   │   └── user/                 # API de gestión de usuarios
│   └── utils/                    # Utilidades del servidor
│       ├── db.ts                 # Prisma Client para server con adaptador Neon
│       └── iban.ts               # Utilidades de validación IBAN
├── plugins/                      # Plugins de Nuxt
├── public/                       # Archivos estáticos públicos
├── nuxt.config.ts                # Configuración de Nuxt
├── prisma.config.ts              # Configuración de Prisma CLI
├── content.config.ts             # Configuración de Nuxt Content (blog)
├── tailwind.css                  # Configuración de Tailwind CSS v4
└── components.json               # Configuración de shadcn-vue
```

---

## Database Schema

La base de datos PostgreSQL está gestionada por Prisma con los siguientes modelos principales:

### User
- Campos: id, email, emailPersonal, firstName, lastName, phone, dni, birthDate, picture, passwordHash, isActive, role, etc.
- Relaciones: Address (1:1), UserPaymentData (1:1), Posts (1:N)
- Roles: `USER`, `ADMIN`, `ROOT`

### Address
- Direcciones de usuarios con relación opcional 1:1

### Post
- Posts del blog con contenido markdown
- Campos: title, slug, excerpt, content, cover, published, publishedAt
- Relaciones: Author (User), Tags (N:M)

### Tag
- Etiquetas para categorización de posts

### UserPaymentData
- Datos de pago de socios
- Métodos: `TRANSFERENCIA`, `CARGO_BANCARIO`
- Validación condicional de IBAN

---

## Build and Development Commands

> **Package Manager:** pnpm (v10.12.1)

```bash
# Instalación de dependencias
pnpm install

# Desarrollo local (con HMR)
pnpm dev

# Construcción para producción
pnpm build

# Generar sitio estático
pnpm generate

# Vista previa de producción
pnpm preview

# Comandos de Prisma
pnpm prisma:migrate      # Crear y aplicar migraciones
pnpm prisma:generate     # Regenerar cliente Prisma
pnpm prisma:setup        # Setup inicial (migración + seed)
```

---

## Code Style Guidelines

### TypeScript
- Usar tipado estricto en todo el código
- Definir interfaces en `app/types/`
- Usar `~/` alias para imports desde la raíz del proyecto
- Usar `@/` alias para imports desde `app/`

### Vue Components
- Usar `<script setup lang="ts">` para SFC
- Componentes en PascalCase (ej: `BlogCardHorizontal.vue`)
- Composables en camelCase prefijados con `use` (ej: `useAppUserSession.ts`)

### Tailwind CSS v4
- Configuración en `app/assets/css/tailwind.css`
- Usar variables CSS personalizadas para theming
- Soporte para modo oscuro con clase `.dark`
- Tema base: `neutral`

### Prisma
- Esquemas divididos en archivos separados por dominio
- Cliente generado en `app/generated/prisma/` (no en node_modules)
- Uso de adaptador Neon para conexión serverless

### Convenciones de Nombres
- **API routes:** `nombre.metodo.ts` (ej: `login.post.ts`)
- **Componentes UI:** Sistema de shadcn-vue (estilo New York)
- **Middleware:** Nombre descriptivo + `.ts`

---

## Authentication & Authorization

### Sistema de Autenticación
- Basado en `nuxt-auth-utils` con sesiones seguras
- Contraseñas hasheadas con bcrypt
- JWT para tokens de sesión
- **OAuth con Google** - Autenticación social
- Variables de entorno: `NUXT_SESSION_PASSWORD`

### Flujo de Autenticación (Local)
1. Login en `/api/auth/login.post.ts` valida credenciales
2. Sesión establecida con `setUserSession()`
3. Composable `useAppUserSession()` gestiona estado reactivo
4. EventBus para comunicación entre componentes (`authBus`)

### Flujo de Autenticación (Google OAuth)
1. Usuario hace clic en "Iniciar sesión con Google"
2. Redirección a `/api/auth/google` (endpoint OAuth de nuxt-auth-utils)
3. Google autentica al usuario y redirige a callback
4. Handler en `/api/auth/google.get.ts` procesa el callback
5. Si el usuario no existe, se crea automáticamente
6. Si el usuario existe con email igual, se vincula la cuenta Google
7. Sesión establecida y redirección al dashboard

### Configuración Google OAuth
1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Configurar URIs de redirección:
   - Desarrollo: `http://localhost:3000/api/auth/google`
   - Producción: `https://tu-dominio.com/api/auth/google`
5. Copiar Client ID y Client Secret a `.env`

### Autorización por Roles
- Middleware `auth.ts` protege rutas privadas
- Middleware global `role.global.ts` valida roles permitidos
- Definir roles permitidos en `definePageMeta({ roles: ['ADMIN'] })`
- Roles disponibles: `USER`, `ADMIN`, `ROOT`

---

## State Management

### Pinia
- Configurado con `@pinia/nuxt`
- Persistencia con `pinia-plugin-persistedstate`

### EventBus
- Usar `@vueuse/core` `useEventBus` para eventos globales
- Canal principal: `'auth-events'`
- Eventos: `'login'`, `'logout'`, `'user-loaded'`

### Estado de Sesión
- Composable `useAppUserSession()` centraliza la gestión de sesión
- Estado reactivo con `useState('auth:state')`
- Sincronización entre SSR y CSR

---

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/google` - Iniciar OAuth con Google (callback incluido)

### Posts (Blog)
- `GET /api/posts` - Listar posts publicados
- `GET /api/posts/latest` - Obtener posts recientes
- `GET /api/posts/[slug]` - Obtener post por slug

### Usuarios
- `GET /api/user` - Obtener usuario actual completo
- `GET /api/user/profile` - Perfil del usuario
- `GET /api/user/payment-data` - Datos de pago
- `PUT /api/user/payment-data` - Actualizar datos de pago
- `DELETE /api/user/[id]` - Eliminar usuario (admin)

---

## Environment Variables

```bash
# Seguridad
NUXT_SESSION_PASSWORD=<clave-segura-32-caracteres>

# Base de datos (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host-pooler/DB?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/DB?sslmode=require"

# Google OAuth
NUXT_OAUTH_GOOGLE_CLIENT_ID=<google-client-id>
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=<google-client-secret>
```

**Nota:** El archivo `.env` contiene credenciales de desarrollo. Nunca commitear a git. Usar `.env.example` como plantilla.

---

## Content Management (Nuxt Content)

- Configurado en `content.config.ts`
- Colección `posts` para contenido markdown
- Ubicación: `content/blog/*.md`
- Schema con Zod para validación de frontmatter

---

## UI Components (shadcn-vue)

Componentes instalados en `app/components/ui/`:
- `button`, `card`, `input`, `select`
- `dialog`, `sheet`, `sidebar`
- `dropdown-menu`, `navigation-menu`
- `avatar`, `badge`, `separator`
- `tooltip`, `popover`, `collapsible`
- `carousel` (Embla)
- `sonner` (notificaciones toast)

### Instalación de nuevos componentes
```bash
npx shadcn-vue@latest add <component-name>
```

---

## Security Considerations

### Configuración de Seguridad (nuxt-security)
- CSP desactivado en desarrollo (ver `nuxt.config.ts`)
- Headers de seguridad en producción
- Rate limiting implementado con `rate-limiter-flexible`

### Validación
- Zod para validación de esquemas en API
- VeeValidate para formularios frontend
- Sanitización de inputs en endpoints

### Contraseñas
- bcrypt con salt rounds apropiados
- Nunca almacenar contraseñas en texto plano
- Validación de fortaleza en registro

---

## Deployment

### Base de Datos
- Producción: Neon PostgreSQL (serverless)
- Adaptador Prisma Neon para conexiones eficientes
- SSL requerido en todas las conexiones

### Build
- Nitro como servidor backend
- Prisma Client inline para serverless
- Variables de entorno requeridas en runtime

### Pre-requisitos de Deploy
1. Configurar `DATABASE_URL` y `DIRECT_URL`
2. Ejecutar `prisma migrate deploy`
3. Generar cliente Prisma: `prisma generate`
4. Construir: `nuxt build`

---

## Testing Strategy

Actualmente el proyecto no tiene tests automatizados configurados. Se recomienda:

- **Unit tests:** Vitest para composables y utilidades
- **Component tests:** Vue Test Utils + Vitest
- **E2E tests:** Playwright para flujos críticos (login, registro, pagos)

---

## Common Tasks

### Agregar un nuevo endpoint API
1. Crear archivo en `server/api/ruta/metodo.ts`
2. Usar `defineEventHandler()` para el handler
3. Validar body/query con Zod
4. Usar `prisma` desde `server/utils/db.ts`

### Agregar una nueva página
1. Crear archivo `.vue` en `app/pages/`
2. El path del archivo define la ruta URL
3. Usar `definePageMeta()` para layout y middleware

### Modificar el esquema de base de datos
1. Editar archivos en `prisma/schema/`
2. Ejecutar `pnpm prisma:migrate`
3. El cliente se regenera automáticamente en postinstall

### Agregar un composable
1. Crear archivo en `app/composables/`
2. Exportar función con prefijo `use`
3. Usar `useState()` para estado persistente

---

## Troubleshooting

### Problemas comunes

**Error de Prisma Client no encontrado:**
```bash
pnpm prisma:generate
```

**Tailwind CSS no aplica estilos:**
- Verificar que `@import "tailwindcss"` esté en `tailwind.css`
- Reiniciar servidor de desarrollo

**Sesión no persiste:**
- Verificar `NUXT_SESSION_PASSWORD` está configurada
- Cookie debe ser segura en HTTPS (producción)

**Errores de tipo en TypeScript:**
- Ejecutar `nuxt prepare` para regenerar tipos
- Verificar imports usan alias correctos (`~/` o `@/`)

---

## Resources

- [Nuxt Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
- [shadcn-vue](https://www.shadcn-vue.com/docs/introduction.html)
