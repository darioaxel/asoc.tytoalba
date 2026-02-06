import { TaskType, TaskStatus } from '../../../generated/client'

export interface TaskSeedData {
  shortDesc: string
  longDesc: string
  type: TaskType
  status: TaskStatus
  creatorEmail: string
  assigneeEmails: string[]
  validatorEmail?: string | null
  startDate?: Date | null
  endDate?: Date | null
  resolvedAt?: Date | null
  documents?: {
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
  }[]
}

export const rawTasks: TaskSeedData[] = [
  // 1. IMPORTANTE + CREADA (recién creada, sin asignar aún)
  {
    shortDesc: 'Revisar currículo del nuevo ciclo de Desarrollo Web',
    longDesc: 'Se ha detectado que el currículo del CFGS Desarrollo de Aplicaciones Web no está actualizado con los nuevos requisitos del Ministerio. Es necesario revisar las unidades de competencia y adaptarlas antes del inicio de curso.',
    type: 'IMPORTANTE',
    status: 'CREADA',
    creatorEmail: 'root@example.com',
    assigneeEmails: [],
    validatorEmail: null,
    startDate: null,
    endDate: null,
    resolvedAt: null
  },

  // 2. URGENTE + ASIGNADA (asignada pero aún no iniciada)
  {
    shortDesc: 'Incidencia servidor de exámenes caído',
    longDesc: 'El servidor Moodle donde se realizan los exámenes de certificación ha dejado de responder. Los alumnos no pueden acceder a sus evaluaciones. Prioridad máxima.',
    type: 'URGENTE',
    status: 'ASIGNADA',
    creatorEmail: 'admin1@example.com',
    assigneeEmails: ['user2@example.com'],
    validatorEmail: null,
    startDate: null,
    endDate: new Date('2026-02-07T18:00:00Z'),
    resolvedAt: null
  },

  // 3. PROPUESTA + EN_CURSO (trabajándose actualmente)
  {
    shortDesc: 'Propuesta de nuevo sistema de gestión de prácticas',
    longDesc: 'Investigar alternativas al actual sistema de seguimiento de FCT (Formación en Centros de Trabajo). Se valoran opciones como Salesforce, HubSpot o desarrollo a medida con integración al ERP existente.',
    type: 'PROPUESTA',
    status: 'EN_CURSO',
    creatorEmail: 'admin2@example.com',
    assigneeEmails: ['user1@example.com', 'user3@example.com'],
    validatorEmail: null,
    startDate: new Date('2026-01-15T09:00:00Z'),
    endDate: new Date('2026-02-28T23:59:59Z'),
    resolvedAt: null
  },

  // 4. IMPORTANTE + RESUELTA (completada con éxito)
  {
    shortDesc: 'Actualizar documentación de matriculación 2025/26',
    longDesc: 'Renovar todos los formularios PDF y guías de matriculación con los nuevos precios, plazos y requisitos de acceso para el próximo curso escolar. Incluir versión accesible.',
    type: 'IMPORTANTE',
    status: 'RESUELTA',
    creatorEmail: 'admin1@example.com',
    assigneeEmails: ['user4@example.com'],
    validatorEmail: 'admin2@example.com',
    startDate: new Date('2026-01-10T08:00:00Z'),
    endDate: new Date('2026-01-20T14:00:00Z'),
    resolvedAt: new Date('2026-01-19T16:30:00Z'),
    documents: [
      {
        filename: 'matriculacion_2026_vfinal.pdf',
        originalName: 'Guía_Matriculación_2025-26_FINAL.pdf',
        mimeType: 'application/pdf',
        size: 2457600,
        url: '/uploads/documents/matriculacion_2026_vfinal.pdf'
      }
    ]
  },

  // 5. URGENTE + ESPERANDO_VALIDACION (pendiente de aprobación admin)
  {
    shortDesc: 'Compra urgente de licencias Adobe Creative Cloud',
    longDesc: 'El departamento de Diseño ha solicitado 25 licencias adicionales de Adobe CC para el nuevo grupo de SMR. Presupuesto: 3,500€. Necesita validación inmediata para aprovechar descuento educativo.',
    type: 'URGENTE',
    status: 'ESPERANDO_VALIDACION',
    creatorEmail: 'user1@example.com',
    assigneeEmails: ['user1@example.com'],
    validatorEmail: 'admin1@example.com',
    startDate: new Date('2026-02-05T10:00:00Z'),
    endDate: new Date('2026-02-06T12:00:00Z'),
    resolvedAt: null,
    documents: [
      {
        filename: 'presupuesto_adobe_2026.pdf',
        originalName: 'Presupuesto_Adobe_Edu_25lic.pdf',
        mimeType: 'application/pdf',
        size: 890000,
        url: '/uploads/documents/presupuesto_adobe_2026.pdf'
      }
    ]
  },

  // 6. PROPUESTA + CREADA (idea propuesta, aún sin aprobar/asignar)
  {
    shortDesc: 'Implementar sistema de préstamo de tablets',
    longDesc: 'Propuesta para adquirir 30 tablets para préstamo en biblioteca. Destinadas a alumnos sin recursos tecnológicos. Se necesita estudio de viabilidad y presupuesto.',
    type: 'PROPUESTA',
    status: 'CREADA',
    creatorEmail: 'user3@example.com',
    assigneeEmails: [],
    validatorEmail: null,
    startDate: null,
    endDate: null,
    resolvedAt: null
  },

  // 7. IMPORTANTE + ASIGNADA (múltiples asignados, trabajo colaborativo)
  {
    shortDesc: 'Preparar Jornadas de Puertas Abiertas 2026',
    longDesc: 'Organizar el evento de puertas abiertas para familias interesadas en FP. Incluye: preparar stands, coordinar con profesores, material promocional y visitas guiadas.',
    type: 'IMPORTANTE',
    status: 'ASIGNADA',
    creatorEmail: 'admin2@example.com',
    assigneeEmails: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
    validatorEmail: null,
    startDate: new Date('2026-02-15T09:00:00Z'),
    endDate: new Date('2026-03-15T18:00:00Z'),
    resolvedAt: null
  },

  // 8. URGENTE + EN_CURSO (crítico en desarrollo)
  {
    shortDesc: 'Reparar fallo de conexión RS485 en HVAC',
    longDesc: 'El sistema de climatización Carrier del aula 203 no responde al control centralizado. Error en bus RS485. Técnico trabajando en diagnóstico de cables y termostatos.',
    type: 'URGENTE',
    status: 'EN_CURSO',
    creatorEmail: 'root@example.com',
    assigneeEmails: ['user4@example.com'],
    validatorEmail: null,
    startDate: new Date('2026-02-06T08:00:00Z'),
    endDate: new Date('2026-02-06T14:00:00Z'),
    resolvedAt: null
  },

  // 9. PROPUESTA + RESUELTA (propuesta aceptada y completada)
  {
    shortDesc: 'Migración de servidor de correo ainfraestructura cloud',
    longDesc: 'Tras evaluar opciones, se ha completado la migración del servidor Exchange local a Microsoft 365 Education. Todos los usuarios migrados y DNS actualizados.',
    type: 'PROPUESTA',
    status: 'RESUELTA',
    creatorEmail: 'user2@example.com',
    assigneeEmails: ['user2@example.com', 'user4@example.com'],
    validatorEmail: 'admin1@example.com',
    startDate: new Date('2025-12-01T00:00:00Z'),
    endDate: new Date('2026-01-15T23:59:59Z'),
    resolvedAt: new Date('2026-01-14T20:00:00Z')
  },

  // 10. IMPORTANTE + ESPERANDO_VALIDACION (pendiente de aprobación final)
  {
    shortDesc: 'Contratar servicio de limpieza adicional exámenes',
    longDesc: 'Necesario contratar servicio extraordinario de limpieza para el período de evaluaciones (febrero). Presupuesto 800€. Empresa: Limpiezas Express S.L.',
    type: 'IMPORTANTE',
    status: 'ESPERANDO_VALIDACION',
    creatorEmail: 'user3@example.com',
    assigneeEmails: ['user3@example.com'],
    validatorEmail: 'admin2@example.com',
    startDate: new Date('2026-02-10T00:00:00Z'),
    endDate: new Date('2026-02-28T23:59:59Z'),
    resolvedAt: null
  },

  // 11. URGENTE + CREADA (detectada, aún sin asignar responsable)
  {
    shortDesc: 'Error en backup automático NAS UGOS',
    longDesc: 'Los backups nocturnos al NAS principal están fallando desde hace 3 días. Error: "Disk full". Se necesita limpieza urgente o expansión de capacidad.',
    type: 'URGENTE',
    status: 'CREADA',
    creatorEmail: 'root@example.com',
    assigneeEmails: [],
    validatorEmail: null,
    startDate: null,
    endDate: null,
    resolvedAt: null
  },

  // 12. PROPUESTA + ASIGNADA (asignada para estudio/valoración)
  {
    shortDesc: 'Evaluación de nuevo ERP para gestión de alumnos',
    longDesc: 'Estudiar la viabilidad de migrar desde el sistema actual a Odoo ERP para integrar gestión académica, contabilidad y RRHH. Reunión con proveedores prevista.',
    type: 'PROPUESTA',
    status: 'ASIGNADA',
    creatorEmail: 'admin1@example.com',
    assigneeEmails: ['user1@example.com', 'user4@example.com'],
    validatorEmail: null,
    startDate: new Date('2026-02-10T10:00:00Z'),
    endDate: new Date('2026-03-01T18:00:00Z'),
    resolvedAt: null
  },

  // 13. IMPORTANTE + EN_CURSO (con validador asignado desde inicio)
  {
    shortDesc: 'Renovación certificado SSL wildcard',
    longDesc: 'El certificado SSL *.campusdigitalfp.com expira el 15/02. Renovación en curso con Let\'s Encrypt. Verificar auto-renovación en nginx reverse proxy.',
    type: 'IMPORTANTE',
    status: 'EN_CURSO',
    creatorEmail: 'root@example.com',
    assigneeEmails: ['user2@example.com'],
    validatorEmail: 'admin2@example.com',
    startDate: new Date('2026-02-01T09:00:00Z'),
    endDate: new Date('2026-02-14T12:00:00Z'),
    resolvedAt: null
  },

  // 14. URGENTE + RESUELTA (crisis resuelta)
  {
    shortDesc: 'Restauración servicio tras fallo eléctrico',
    longDesc: 'Corte de energía generalizado en el edificio B. Arranque secuencial de servidores, verificación de integridad de bases de datos MariaDB y restauración de servicios. Todo operativo.',
    type: 'URGENTE',
    status: 'RESUELTA',
    creatorEmail: 'root@example.com',
    assigneeEmails: ['user2@example.com', 'user4@example.com'],
    validatorEmail: 'admin1@example.com',
    startDate: new Date('2026-02-05T06:00:00Z'),
    endDate: new Date('2026-02-05T09:30:00Z'),
    resolvedAt: new Date('2026-02-05T09:15:00Z')
  },

  // 15. PROPUESTA + ESPERANDO_VALIDACION (a la espera de decisión)
  {
    shortDesc: 'Crear App móvil para acceso de alumnos',
    longDesc: 'Propuesta de desarrollo de aplicación móvil (React Native) para consulta de notas, horarios y comunicados. Presupuesto desarrollo: 12,000€. Esperando aprobación consejo.',
    type: 'PROPUESTA',
    status: 'ESPERANDO_VALIDACION',
    creatorEmail: 'user4@example.com',
    assigneeEmails: ['user4@example.com'],
    validatorEmail: 'admin1@example.com',
    startDate: null,
    endDate: new Date('2026-06-01T00:00:00Z'),
    resolvedAt: null,
    documents: [
      {
        filename: 'propuesta_app_movil.pdf',
        originalName: 'Propuesta_Desarrollo_App_Alumnos_v1.pdf',
        mimeType: 'application/pdf',
        size: 1560000,
        url: '/uploads/documents/propuesta_app_movil.pdf'
      },
      {
        filename: 'mockups_app.fig',
        originalName: 'Mockups_App_v1.fig',
        mimeType: 'application/octet-stream',
        size: 4500000,
        url: '/uploads/documents/mockups_app.fig'
      }
    ]
  }
]