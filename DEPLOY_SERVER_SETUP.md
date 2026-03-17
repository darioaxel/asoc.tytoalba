# Guía de Configuración del Servidor - Asociación Tyto Alba

> Esta guía documenta los pasos necesarios para configurar el servidor Hetzner para el despliegue automático de www.tytoalba.org

---

## 📋 Resumen de la Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    HETZNER SERVER                               │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │    Caddy     │───▶│  App Nuxt    │───▶│  PostgreSQL  │      │
│  │   (:443)     │    │   (:3000)    │    │   (:5432)    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                                                       │
│         ▼                                                       │
│  www.tytoalba.org                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🗄️ Base de Datos: Desarrollo vs Producción

| Entorno      | Base de Datos        | Ubicación        | Configuración                                      |
|--------------|----------------------|------------------|----------------------------------------------------|
| **Desarrollo** | PostgreSQL (Neon.tech) | Cloud            | `.env` local con `DATABASE_URL` de Neon            |
| **Producción** | PostgreSQL (Docker)    | Servidor Hetzner | `docker-compose.yml` apunta a contenedor local     |

> **⚠️ Importante:** En producción la app usa PostgreSQL local dentro de Docker, no la base de datos de Neon.tech. Esto mejora el rendimiento y no depende de conexión externa.

---

## 🔧 Paso 1: Preparar el Servidor

### 1.1 Crear estructura de directorios

```bash
# Conectarse al servidor
ssh root@TU_SERVIDOR_HETZNER

# Crear usuario deploy (si no existe)
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Crear directorios
mkdir -p /apps/tytoalba
mkdir -p /apps/backups/tytoalba/db
mkdir -p /apps/caddy
mkdir -p /var/log/caddy

# Asignar permisos
chown -R deploy:deploy /apps/tytoalba
chown -R deploy:deploy /apps/backups
chown -R deploy:deploy /apps/caddy
chown -R deploy:deploy /var/log/caddy
```

### 1.2 Instalar Docker y Docker Compose

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose plugin
apt install -y docker-compose-plugin

# Verificar instalación
docker --version
docker compose version
```

### 1.3 Instalar Caddy

```bash
# Instalar Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy

# Verificar instalación
caddy version
```

---

## 📁 Paso 2: Configurar la Aplicación

### 2.1 Clonar el repositorio

```bash
# Cambiar al usuario deploy
su - deploy

# Clonar el repositorio
cd /apps/tytoalba
git clone https://github.com/darioaxel/asoc.tytoalba.git .
```

### 2.2 Crear archivo .env

```bash
cd /apps/tytoalba
nano .env
```

**⚠️ IMPORTANTE:** En producción usamos **PostgreSQL LOCAL** (no Neon.tech)

```env
# ============================================
# BASE DE DATOS (PostgreSQL LOCAL en Docker)
# ============================================
POSTGRES_USER=tytoalba
POSTGRES_PASSWORD=TU_CONTRASEÑA_SEGURA_AQUI
POSTGRES_DB=tytoalba

# Adaptador para producción (usa pg en lugar de neon)
DB_ADAPTER=pg

# ============================================
# SEGURIDAD
# ============================================
# Generar con: openssl rand -hex 32
NUXT_SESSION_PASSWORD=TU_SESSION_PASSWORD_DE_32_BYTES_HEX

# ============================================
# GOOGLE OAUTH (Opcional)
# ============================================
NUXT_OAUTH_GOOGLE_CLIENT_ID=
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=
```

**Generar contraseñas seguras:**
```bash
# Generar session password
openssl rand -hex 32

# Generar contraseña de PostgreSQL
openssl rand -base64 32
```

### 2.3 Hacer ejecutable el script de deploy

```bash
chmod +x /apps/tytoalba/deploy-github.sh
```

---

## 🌐 Paso 3: Configurar Caddy

### 3.1 Copiar Caddyfile

```bash
# Como root o deploy con sudo
cp /apps/tytoalba/Caddyfile /apps/caddy/Caddyfile
```

### 3.2 Configurar Caddy como servicio

```bash
# Como root
ln -sf /apps/caddy/Caddyfile /etc/caddy/Caddyfile

# Verificar configuración
caddy validate --config /etc/caddy/Caddyfile

# Recargar Caddy
caddy reload --config /etc/caddy/Caddyfile

# O con systemd
systemctl reload caddy
systemctl enable caddy
```

### 3.3 Configurar DNS

Asegúrate de que los dominios apunten a la IP de tu servidor Hetzner:

```
Tipo: A
Nombre: @
Valor: IP_DE_TU_SERVIDOR_HETZNER
TTL: 3600

Tipo: A
Nombre: www
Valor: IP_DE_TU_SERVIDOR_HETZNER
TTL: 3600
```

---

## 🔐 Paso 4: Configurar GitHub Secrets

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions → New repository secret

| Secret           | Valor                                      | Descripción                           |
|------------------|--------------------------------------------|---------------------------------------|
| `HETZNER_HOST`   | `123.456.789.0`                            | IP de tu servidor Hetzner             |
| `HETZNER_USER`   | `deploy`                                   | Usuario SSH para deploy               |
| `HETZNER_SSH_KEY`| `-----BEGIN OPENSSH PRIVATE KEY-----...`   | Clave SSH privada (completa)          |
| `HETZNER_PORT`   | `22`                                       | Puerto SSH (opcional, default 22)     |

### 4.1 Configurar clave SSH (en el servidor)

```bash
# Como usuario deploy en el servidor
su - deploy

# Generar par de claves (si no tienes)
ssh-keygen -t ed25519 -C "deploy@tytoalba.org" -f ~/.ssh/deploy_key

# Copiar la clave PÚBLICA a authorized_keys
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys

# Ver la clave PRIVADA (para copiar a GitHub)
cat ~/.ssh/deploy_key
# Copia TODO el contenido incluyendo -----BEGIN OPENSSH PRIVATE KEY----- y -----END OPENSSH PRIVATE KEY-----
```

### 4.2 Configurar clave SSH (en GitHub)

Copia el contenido de `~/.ssh/deploy_key` del servidor y pégalo en el secret `HETZNER_SSH_KEY`.

---

## 🧪 Paso 5: Primer Deploy Manual

Antes de que GitHub Actions funcione, haz un deploy manual para verificar:

```bash
# Como deploy en el servidor
cd /apps/tytoalba

# Verificar que docker compose funciona
docker compose config

# Construir e iniciar
docker compose up -d --build

# Verificar logs
docker logs -f tytoalba-app

# Verificar que Caddy puede acceder
curl -H "Host: www.tytoalba.org" http://localhost:3000/api/health
```

---

## ✅ Paso 6: Verificar el Deploy Automático

### 6.1 Hacer un commit de prueba

```bash
# En tu máquina local
# Edita cualquier archivo (ej: añade un comentario en README.md)
git add .
git commit -m "Test deploy automático"
git push origin main
```

### 6.2 Verificar en GitHub

Ve a GitHub → Actions → y deberías ver el workflow "Deploy to Hetzner" ejecutándose.

### 6.3 Verificar en el servidor

```bash
# Ver logs del deploy
cd /apps/tytoalba && docker ps

# Verificar health check
curl http://localhost:3000/api/health
```

---

## 🔄 Comandos Útiles

### Ver logs
```bash
# Logs de la aplicación
docker logs -f tytoalba-app

# Logs de PostgreSQL
docker logs -f tytoalba-postgres

# Logs de Caddy
sudo tail -f /var/log/caddy/tytoalba.access.log
```

### Acceder a la base de datos
```bash
docker exec -it tytoalba-postgres psql -U tytoalba -d tytoalba
```

### Ejecutar migraciones manualmente
```bash
docker exec tytoalba-app npx prisma migrate deploy
```

### Reiniciar servicios
```bash
docker compose restart
docker compose restart app
docker compose restart postgres
```

### Backup manual de la BD
```bash
docker exec tytoalba-postgres pg_dump -U tytoalba tytoalba > backup-$(date +%Y%m%d).sql
```

### Seed de datos de producción (solo primera vez)
```bash
docker exec tytoalba-app npx prisma db seed
```

---

## 🚨 Troubleshooting

### Error: "docker command not found"
```bash
# Verificar que docker está instalado y el usuario está en el grupo docker
groups deploy
# Si no aparece 'docker', ejecutar:
sudo usermod -aG docker deploy
# Cerrar sesión y volver a entrar
```

### Error: "permission denied" en deploy-github.sh
```bash
chmod +x /apps/tytoalba/deploy-github.sh
```

### Error: "Caddy no puede obtener certificado SSL"
- Verifica que el DNS apunta correctamente a la IP del servidor
- Verifica que el puerto 443 está abierto en el firewall
- Revisa logs: `sudo journalctl -u caddy -f`

### Error: "app no puede conectar a postgres"
- Verifica que ambos contenedores están en la misma red: `docker network ls`
- Verifica logs de postgres: `docker logs tytoalba-postgres`
- Verifica que el adaptador esté configurado correctamente:
  ```bash
  docker exec tytoalba-app env | grep DB_ADAPTER
  # Debe mostrar: DB_ADAPTER=pg
  ```

### Error: "Database connection failed"
**Si ves este error en producción**, verifica:

1. Que el `.env` en el servidor tenga `DB_ADAPTER=pg`
2. Que las variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` estén configuradas
3. Que el contenedor de PostgreSQL esté corriendo: `docker ps | grep postgres`
4. Reinicia los contenedores:
   ```bash
   docker compose down
   docker compose up -d
   ```

### Migrar datos de Neon.tech a Producción Local
Si necesitas copiar datos de desarrollo a producción:

```bash
# 1. Exportar desde Neon (desde tu máquina local)
pg_dump "TU_URL_NEON" > backup_neon.sql

# 2. Copiar al servidor
scp backup_neon.sql deploy@TU_SERVIDOR:/apps/tytoalba/

# 3. Importar en el contenedor PostgreSQL
ssh deploy@TU_SERVIDOR
docker exec -i tytoalba-postgres psql -U tytoalba -d tytoalba < /apps/tytoalba/backup_neon.sql
```

---

## 📁 Archivos Creados

| Archivo                             | Descripción                              |
|-------------------------------------|------------------------------------------|
| `.github/workflows/deploy-hetzner.yml` | Workflow de GitHub Actions               |
| `Dockerfile`                        | Multi-stage build para Nuxt + Node.js    |
| `docker-compose.yml`                | Servicios de app y PostgreSQL            |
| `deploy-github.sh`                  | Script de deploy en el servidor          |
| `Caddyfile`                         | Configuración de Caddy reverse proxy     |
| `DEPLOY_SERVER_SETUP.md`            | Esta guía                                |
| `server/utils/db.ts`                | Configuración dual de adaptadores Prisma |

---

## 🔒 Seguridad Recomendada

1. **Firewall:** Configura UFW para permitir solo 22, 80, 443
   ```bash
   sudo ufw default deny incoming
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Fail2ban:** Instala fail2ban para proteger SSH
   ```bash
   sudo apt install fail2ban
   ```

3. **Actualizaciones automáticas:**
   ```bash
   sudo apt install unattended-upgrades
   ```

4. **Backups:** Los backups se guardan automáticamente en `/apps/backups/tytoalba/`
   Considera sincronizarlos a otro lugar (S3, etc.)

---

## ✨ Próximos Pasos

1. ✅ Configurar servidor (esta guía)
2. ✅ Configurar GitHub Secrets
3. ✅ Hacer primer deploy manual
4. ✅ Verificar deploy automático con un commit
5. 🔄 Configurar monitoreo (opcional: Uptime Kuma, etc.)
6. 🔄 Configurar backups automáticos a S3 (opcional)

---

*Última actualización: Marzo 2026*
