# Documentación del proceso de cuotas

## Vistas

1. Ver estado todos los recibos por año (Socio)
2. Tramitar pago recibo (Socio).
3. Validar pago recibos (Admin).

## Procedimiento

1. Todos los socios tienen que hacer frente a recibos de cuotas mensuales.
2. Las cuotas tienen un valor distinto, incluimos un tipo de socio: Normal, Juvenil, Fundador.
3. El día 25 de cada mes se generan los recibos de las cuotas de todos los socios, y no son visibles hasta que un usuario con rol ADMIN lo desbloquea.
   1. Los recibos pueden estar en varios estados: pendiente, en trámite de aprobación, pagada, devuelto. 
   2. Si el importe de un recibo cuota tiene valor 0, se debe poner como pagada directamente.
   3. Cuando se generan los recibos estarán, salvo aquellos que tienen valor 0, todos con estado pendiente.
4. Las cuotas se pueden pagar mediante transferencia bancaria o mediante ingreso en cuenta. 
   1. Si es una transferencia bancaria, el usuario debe agregar al recibo un fichero (imagen, pdf) con el justificante de pago y en ese momento pasa a estado *en trámite*.
   2. Si un recibo *en trámite* es validado por un usuario con rol ADMIN, pasará a estar pagado.
   3. En caso que no sea validad, se identificará como devuelto.

## Seeds escenarios

| Usuario | Tipo     | Escenario       | Recibos                                     |
| ------- | -------- | --------------- | ------------------------------------------- |
| Ana     | NORMAL   | `perfect`       | 24 pagados                                  |
| Luis    | NORMAL   | `with_returns`  | 22 pagados, 2 devueltos, 2 con recargo 5€   |
| Marta   | JUVENIL  | `unpaid_last_3` | 21 pagados, 3 pendientes (último bloqueado) |
| Pablo   | JUVENIL  | `random`        | ~50% pagados, ~50% pendientes               |
| Antonio | FUNDADOR | `zero_fee`      | 24 auto-pagados a 0€                        |
| Carmen  | NORMAL   | `mixed_review`  | 60% pagados, 20% en trámite, 20% pendientes |
| David   | JUVENIL  | `perfect`       | 24 pagados                                  |
