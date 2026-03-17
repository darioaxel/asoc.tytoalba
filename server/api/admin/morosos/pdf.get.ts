import PDFDocument from 'pdfkit'
import { ReceiptStatus, Role } from '../../../../prisma/generated/client'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  // Verificar autenticación y rol de admin
  if (!session.user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }
  
  if (session.user.role !== Role.ADMIN && session.user.role !== Role.ROOT) {
    throw createError({ statusCode: 403, message: 'Acceso denegado' })
  }

  try {
    // Obtener fecha actual
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    // Fecha de inicio del mes actual
    const startOfMonth = new Date(currentYear, currentMonth, 1)
    // Fecha de fin del mes actual
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

    // Buscar todos los recibos pendientes o devueltos del mes en curso
    const pendingReceipts = await prisma.receipt.findMany({
      where: {
        status: {
          in: [ReceiptStatus.PENDING, ReceiptStatus.RETURNED]
        },
        dueDate: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        deletedAt: null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            memberType: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    // Agrupar por usuario y calcular totales
    const morososMap = new Map()
    
    for (const receipt of pendingReceipts) {
      const userId = receipt.userId
      const user = receipt.user
      
      if (!morososMap.has(userId)) {
        morososMap.set(userId, {
          userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          memberType: user.memberType,
          receipts: [],
          totalDebt: 0,
          receiptCount: 0
        })
      }
      
      const moroso = morososMap.get(userId)
      
      // Calcular deuda de este recibo (total - pagado)
      const receiptDebt = Number(receipt.totalAmount) - Number(receipt.paidAmount)
      
      moroso.receipts.push({
        number: receipt.number,
        concept: receipt.concept,
        dueDate: receipt.dueDate,
        debt: receiptDebt,
        status: receipt.status
      })
      
      moroso.totalDebt += receiptDebt
      moroso.receiptCount += 1
    }

    // Convertir a array y ordenar por deuda (mayor primero)
    const morososList = Array.from(morososMap.values())
      .sort((a, b) => b.totalDebt - a.totalDebt)

    // Calcular totales generales
    const totalGeneral = morososList.reduce((sum, m) => sum + m.totalDebt, 0)
    const totalSocios = morososList.length

    // Crear PDF
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    // Capturar el PDF en chunks
    doc.on('data', (chunk) => chunks.push(chunk))

    // Encabezado
    doc.fontSize(20).text('Lista de Morosos', 50, 50)
    doc.fontSize(12).text(`Asociación Tyto Alba - ${now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`, 50, 75)
    doc.moveDown(2)

    // Resumen
    doc.fontSize(14).text('Resumen', 50, doc.y)
    doc.fontSize(10)
    doc.text(`Total de socios con deuda: ${totalSocios}`)
    doc.text(`Importe total adeudado: ${totalGeneral.toFixed(2)} €`)
    doc.moveDown(2)

    // Tabla de morosos
    doc.fontSize(14).text('Detalle por Socio', 50, doc.y)
    doc.moveDown()

    // Encabezados de tabla
    const tableTop = doc.y
    const colName = 50
    const colDebt = 300
    const colRecibos = 420

    doc.fontSize(10).font('Helvetica-Bold')
    doc.text('Nombre', colName, tableTop)
    doc.text('Deuda (€)', colDebt, tableTop)
    doc.text('Recibos', colRecibos, tableTop)
    doc.moveDown()

    // Línea separadora
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.5)

    // Datos
    doc.font('Helvetica')
    for (const moroso of morososList) {
      const y = doc.y
      
      // Verificar si necesitamos nueva página
      if (y > 700) {
        doc.addPage()
        doc.y = 50
      }

      doc.text(`${moroso.firstName} ${moroso.lastName}`, colName, doc.y)
      doc.text(moroso.totalDebt.toFixed(2), colDebt, doc.y)
      doc.text(`${moroso.receiptCount}`, colRecibos, doc.y)
      doc.moveDown()
    }

    // Línea final
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Total
    doc.font('Helvetica-Bold')
    doc.text('TOTAL:', colName, doc.y)
    doc.text(totalGeneral.toFixed(2), colDebt, doc.y)
    doc.text(`${totalSocios}`, colRecibos, doc.y)

    // Pie de página
    doc.fontSize(8).font('Helvetica')
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-ES')} - Asociación Tyto Alba`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    )

    // Finalizar documento
    doc.end()

    // Esperar a que se complete el PDF
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })

    // Configurar headers para descarga
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="morosos_${currentYear}_${currentMonth + 1}.pdf"`)
    
    return pdfBuffer

  } catch (error) {
    console.error('❌ Error generando PDF de morosos:', error)
    throw createError({ 
      statusCode: 500, 
      message: 'Error al generar el PDF' 
    })
  }
})
