# asoc.tytoalba
Desarrollo para la nueva web de la asociacion tyto alba

## Listado Tareas

 - [X] Insertar imágen en página principal
 - [X] Menú usuario configurable por parametrización
 - [ ] Utilización de Pinia para stores que permitan la actualización de datos en multiples puntos.
 - [ ] 

### Blog - documentación
[ ] Montar varias entradas del blog
[ ] Preparar sitio para documentación

---

## API Endpoints - Gestión de Recibos

### Endpoints Públicos (Socios)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/receipts/my?year=2024` | Listar mis recibos del año |
| GET | `/api/receipts/pending` | Recibos pendientes de pago |
| POST | `/api/receipts/pay` | Enviar pago con justificante |
| POST | `/api/files/upload` | Subir archivo de justificante |

### Endpoints de Administración (ADMIN/ROOT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/receipts/pending` | Listar pagos pendientes de validación |
| POST | `/api/admin/receipts/validate` | Validar/aprobar un pago |
| POST | `/api/admin/receipts/reject` | Rechazar un pago |
| POST | `/api/admin/receipts/unlock` | Desbloquear recibos para socios |
| GET | `/api/admin/receipts/stats` | Estadísticas de tesorería |

#### Ejemplos de uso:

**Validar un pago:**
```bash
POST /api/admin/receipts/validate
{
  "receiptId": "uuid-del-recibo",
  "notes": "Transferencia verificada en cuenta"
}
```

**Rechazar un pago:**
```bash
POST /api/admin/receipts/reject
{
  "receiptId": "uuid-del-recibo",
  "reason": "Importe incorrecto",
  "unlockForRetry": true
}
```

**Desbloquear recibos:**
```bash
POST /api/admin/receipts/unlock
{
  "receiptIds": ["uuid-1", "uuid-2"]
}
```
