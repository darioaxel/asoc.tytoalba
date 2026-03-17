# Sistema de gestión de propuestas y votaciones

Vamos a generar un sistema de propuestas.
### Entrada del menú
```
{
          title: "Propuestas",
          url: "/socios/propuestas",
          icon: "lucide:vote",
          isActive: true,
          items: [
            { title: "Crear propuestas", url: "/socios/propuesta/nueva" },            
          ],
},
```
### Vistas

#### **vista de la creación de propuestas**
```
/socios/propuesta/nueva
```

* Una propuesta, que puede ser creada por cualquier usuario.
* Sólamente el administrador o el usuario creador puede borrar una propuesta, el restó no tendrá ese botón/opción.

#### **vista de propuestas - votación**
```
/socios/propuestas
```
* Aparecerá un listado (tabla) ordenado por fecha de creación (de más actual a más antigua) de las propuestas. 
* Se mostrará: Título de la propuesta, descripción breve, responsable, número de votos (pulgar arriba, pulgar abajo) con el número de cada tipo de votos. Botón de votar (en caso de no haberse votado previamente) y que mostrará un dialog en el que pulsar por pulgar arriba o pulgar abajo. Si hacemos click sobre la fila de la propuesta, debe llevarnos a una vista en la que se muestra la propuesta con todos sus detalles. 

#### **vista de propuesta**
```
/socios/propuesta/id
```
* Contiene todos los detalles de la propuesta.
* Muestra todas las imágenes que contiene la propuesta.
* Permite descargar los documentos que tiene adjuntos.
* En forma de tags tiene listado de los nombres y apellidos de quién ha votado justo debajo del resumen de la propuesta.
* Información sobre cómo va la votación (pulgares arriba/abajo) en una card, y el número de días que la propuesta seguirá abierta a votación.
  
### Contiene:
* título,
* resumen,
* texto largo
* imágenes o archivos
* fecha de creacion
* fecha en la que se llevaría a cabo o se iniciaría
* fecha de finalización 
* otros responsables de su implementación que el creador puede incluir. 

Una propuesta tiene los siguientes estados: aceptada para su realización, rechazada o en votación. 


## Votaciones

Las votaciones de las propuestas son mensuales. 