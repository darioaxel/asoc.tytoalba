# =============================================================================
# Dockerfile - Asociación Tyto Alba
# Multi-stage build para Nuxt.js + Node.js
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:20-slim AS dependencies

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
FROM node:20-slim AS builder

# Instalar herramientas necesarias para compilar better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Reinstalar dependencias (para compilar native modules correctamente)
RUN pnpm install --frozen-lockfile

# Copiar todo el código fuente
COPY . .

# Variables de entorno para build
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

# Generar cliente Prisma
RUN pnpm prisma generate

# Build de la aplicación (con 3GB de memoria para evitar heap out of memory)
# Si sigue fallando, prueba con 2048 o desactiva el prerenderer en nuxt.config.ts
ENV NODE_OPTIONS="--max-old-space-size=3072"
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 3: Production
# -----------------------------------------------------------------------------
FROM node:20-slim AS production

# Instalar herramientas necesarias
RUN apt-get update && apt-get install -y dumb-init wget && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root
RUN groupadd -g 1001 nodejs && \
    useradd --system -u 1001 -g nodejs nuxt

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

# Health check - verifica que la app y la base de datos estén funcionando
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider --header="Accept: application/json" http://localhost:3000/api/health || exit 1

# Usar dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["node", ".output/server/index.mjs"]
