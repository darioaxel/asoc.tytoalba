import { prisma } from '~/server/utils/db'

/**
 * Endpoint de health check para monitoreo
 * Verifica que la aplicación y la base de datos estén funcionando
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  // Información básica de la aplicación
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: 'unknown' as 'ok' | 'error' | 'unknown',
      memory: 'ok' as 'ok' | 'warning' | 'critical'
    },
    responseTime: 0
  }

  // Verificar conexión a base de datos
  try {
    await prisma.$queryRaw`SELECT 1`
    health.checks.database = 'ok'
  } catch (error) {
    health.checks.database = 'error'
    health.status = 'error'
    console.error('Health check: Error de conexión a base de datos', error)
  }

  // Verificar uso de memoria
  const memoryUsage = process.memoryUsage()
  const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
  const memoryPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
  
  if (memoryPercent > 90) {
    health.checks.memory = 'critical'
    health.status = 'error'
  } else if (memoryPercent > 75) {
    health.checks.memory = 'warning'
  }

  // Calcular tiempo de respuesta
  health.responseTime = Date.now() - startTime

  // Determinar código de estado HTTP
  const statusCode = health.status === 'ok' ? 200 : 503

  // Añadir headers de caché para evitar que el health check se cachee
  setResponseHeaders(event, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  })

  setResponseStatus(event, statusCode)
  
  return {
    ...health,
    memory: {
      usedMB: memoryMB,
      usedPercent: memoryPercent
    }
  }
})
