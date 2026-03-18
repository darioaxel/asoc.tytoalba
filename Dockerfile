# =============================================================================
# Dockerfile - Asociación Tyto Alba
# Multi-stage build para Nuxt.js + Node.js
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

# Copiar archivos de dependencias primero (para cacheo)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Builder
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

# Copiar dependencias instaladas
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma

# Copiar todo el código fuente
COPY . .

# Variables de entorno para build
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

# Generar cliente Prisma
RUN pnpm prisma generate

# Build de la aplicación
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 3: Production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

# Instalar herramientas necesarias
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

WORKDIR /app

# Copiar archivos necesarios desde builder
COPY --from=builder --chown=nuxt:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxt:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nuxt:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nuxt:nodejs /app/node_modules/.pnpm/@prisma+client@7.3.0* ./node_modules/.pnpm/
COPY --from=builder --chown=nuxt:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nuxt:nodejs /app/package.json ./

# Crear directorio para uploads
RUN mkdir -p /app/uploads && chown -R nuxt:nodejs /app/uploads

# Cambiar a usuario no-root
USER nuxt

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["node", ".output/server/index.mjs"]
