# Contraste independiente de diseño — mecanismos conectados, round11

Fuente congelada: `round11/index.html`, SHA-256 comprobado `b9f1a7b93ca1438d7a969cd76852f119d87e9c6ff91cabb752515f6090a12c03`. Fecha: 2026-09-08. Alcance: causalidad, progresión, culminación y legibilidad de las imágenes suministradas. Se leyó `ITERACION-MECANISMOS-CONECTADOS.md` como descripción a contrastar; su referencia a una calificación anterior no se utiliza para formar este juicio. No se modificó el juego ni se asigna una nota global.

**Hay una mejora causal real, especialmente en la reutilización del contrapeso.** Los mecanismos cambian apoyos físicos o el destino de un mismo haz y conservan estados necesarios para la siguiente acción. No se limitan a pedir otra pulsación antes de abrir una puerta. La profundidad sigue siendo la de una secuencia corta y legible; no equivale a un sistema de soluciones abiertas. Se detecta una reserva concreta: los mensajes de cambio de pasarelas ocultan durante demasiado tiempo el cronómetro del reloj conectado.

## Evidencia propia

Inspeccioné `connected_trial` y sus tres implementaciones congeladas. Reproduje las rutas balanced completas N6 y N7 con el bucle de producción, desde el inicio natural de cada nivel, sin alterar estado, energía, enemigos o posición. El programa `contraste-conexiones-round11.cjs` y sus datos `contraste-conexiones-round11-evidencia.json` registran eventos, estados de los mecanismos y contacto real con sus apoyos dinámicos.

| Nivel | Resultado | Frames | Impactos | Muertes |
|---|---|---:|---:|---:|
| N6 | clear, diez pruebas resueltas | 11.995 | 0 | 0 |
| N7 | clear, diez pruebas resueltas | 9.584 | 0 | 0 |

No reproduje aquí las otras políticas, atajos ni recuperaciones de esta fuente; corresponden a la revisión principal. «Apoyo utilizado» no se interpreta como «apoyo imposible de evitar». No hay pruebas humanas ni evaluación de dispositivos físicos.

## Qué añade cada mecanismo

### N6, balanza de dos alturas: reutilizar un recurso cambia el orden de resolución

La ruta observada realiza depósito en 2 (frame 5709) → cerrojo (5999) → recuperación de 2 (6239) → depósito en 4 y resolución (6449). Antes del cerrojo, las pasarelas dependen de que el peso permanezca en la balanza baja. Después de fijarlo, siguen desplegadas al recuperar ese mismo peso. El código no genera un segundo objeto ni convierte el depósito inicial en consumo irreversible.

Se pisan los dos apoyos dinámicos: uno durante 20 frames y el otro durante 34. Al recuperar el peso, el estado es `carry='3-2'`, `docked=null`, `anchored=true`, con ambas pasarelas todavía activas. Es evidencia de la conexión concreta entre transporte, soporte temporal y fijación permanente.

La decisión nueva consiste en **cuándo recuperar el recurso y qué debe quedar asegurado antes**. Es más sustancial que subir dos pesos independientes a dos huecos. La primera balanza simple del nivel presenta previamente el transporte; la cámara conectada introduce la relación temporal en suelo recuperable. Mi inspección respalda la regla de que retirar antes del cerrojo elimina los apoyos; no cuento esa rama de error como ejecutada en esta prueba de éxito.

### N6, reloj de pasarelas: las activaciones cambian la ruta disponible

El estado pasa de `ninguna` a `[activa, activa, inactiva, inactiva]` con 1; con 2 cambia a `[inactiva, activa, activa, activa]`. La ruta pisa el apoyo inferior que después desaparece y el nuevo apoyo superior. Por tanto, el cambio no es decorativo: afecta a colisiones del trayecto seguido y obliga a reconocer que la ruta de vuelta no conserva toda la geometría de ida.

La combinación reúne orden, altura, dirección y plazo. Sigue siendo una cadena 1→2→3 con una solución clara, lo que es razonable para un reto de plataformas; no necesita una secuencia más larga para aportar variedad. El plazo de 660 frames corresponde al recorrido, y el testigo lo resuelve 504 frames después de arrancarlo.

Reserva de precisión: el cuarto apoyo, a la derecha y previsto para el retorno, no se pisa en este testigo. No debe describirse cada pasarela individual como obligatoria basándose en esta ejecución. Tampoco atribuyo a la polilla una decisión imprescindible solo porque está instanciada: la ruta recibe cero impactos, pero ese dato no demuestra por sí solo evasión activa ni irrelevancia del enemigo.

### N7, dos destinos de luz: reutilizar la red después de alimentar R

La ruta gira B (9034) y C (9224), alimenta R (9254), utiliza pasarelas recién activadas, gira E (9359) y resuelve al llegar la luz a S (9389). Tras R, `primed=true` conserva la energía y el acceso mientras el haz cambia de destino. La cadena no exige seguir iluminando R y S simultáneamente; esa propiedad se explica en la segunda pista.

El jugador emplea dos de los tres apoyos nuevos. La red que acaba de resolver pasa a servir otro objetivo, y el prisma se convierte en una acción con efecto sobre el haz visible. Es una culminación más conectada que colocar un quinto espejo incorrecto o pedir un segundo circuito aislado.

Límite de profundidad: la segunda etapa es una **redirección binaria**. Una vez alimentado R, basta alcanzar E y activarlo; no hay una segunda búsqueda de orientaciones de B/C/D para S. La mejora es causal y espacial, pero no debe presentarse como dos puzles ópticos completos ni como un sistema de muchas soluciones. El primer apoyo nuevo de esta cámara tampoco se pisa en el testigo; su necesidad queda fuera de lo probado aquí.

## Ayuda y progresión

Las tres capas de ayuda separan observación/reglas, orientación estratégica y solución. La primera capa de la balanza comunica un peso y dos destinos; la segunda revela la importancia de fijar los apoyos antes de recuperar; la tercera concreta el itinerario. En la luz, la primera distingue R/S/E y la segunda explica almacenamiento/redirección; solo la tercera enumera qué espejos conservar y girar.

Esta separación preserva espacio para descubrir la relación causal y ofrece una salida explícita a quien la solicite. Abrir pausa no necesita revelar automáticamente la solución. La inspección de `requestCampaignHint` confirma que avanzar la ayuda requiere una petición estando en pausa; no se puntúa comprensión humana a partir de esa implementación.

Las mediciones DOM suministradas de round10 son útiles como antecedente de límites del panel y tamaños de botones, pero no equivalen a capturas ni a revalidación automática de round11. No las presento como una prueba visual propia de esta fuente.

## Legibilidad de los lienzos inspeccionados

- `round11/n7-powered-prism-world-final.png`: letras A–E, símbolo del prisma y receptor S diferenciados. Haces amarillos y bordes cian de plataformas activas tienen funciones visuales distintas. El mensaje sobre R y E se ve completo y separado del HUD. R está fuera de este encuadre; la captura acredita el estado posterior a su alimentación, no la legibilidad de toda la red en una sola pantalla.
- `round11/n6-reused-weight-world.png`: se distinguen las balanzas 2 y 4, el peso transportado y los apoyos. No observo texto cortado ni objetos de interacción tapados. El cerrojo remoto no aparece en este encuadre; no atribuyo a esta imagen la legibilidad de ese elemento.
- `round11/n6-clock-changing-path-world.png`: 2 activo, 3 pendiente, apoyos nuevos y la línea discontinua del apoyo retirado se distinguen. El mensaje «PASARELAS CAMBIADAS: MIRA LOS APOYOS» es legible. Sin embargo, no se ve el tiempo restante en ese momento.

Los fondos son detallados, pero las siluetas, identificadores y plataformas mantienen contraste suficiente en estos lienzos a su resolución exportada. Esto no acredita su tamaño cómodo en un teléfono ni sustituye la comprobación de la ayuda DOM.

## P2: el feedback del reloj oculta una información necesaria para decidir

`drawCampaignHUD` (línea 3884 de la fuente congelada) exige `!msg?.t` para dibujar el objetivo, incluida la cuenta atrás. Cada activación del reloj conectado genera un mensaje de 120 frames. Un seguimiento adicional propio registra:

| Medida del reloj N6 5-1 balanced | Frames |
|---|---:|
| Reloj activo antes de resolver | 504 |
| Cuenta atrás del HUD oculta por mensaje | 357 |
| HUD oculto y cifra de la puerta fuera de cámara | 284 |

Datos en `contraste-reloj-hud-round11.json`. Durante aproximadamente el 71% del tramo activo falta la cuenta atrás del HUD; durante el 56% tampoco puede verse la cifra de la puerta. El ejemplo exportado coincide con esa situación. El aviso de cambio aporta información útil, pero sustituye temporalmente otra que permite valorar si continuar o regresar.

**Corrección concreta:** conservar una cuenta atrás visible mientras exista `t.until`, en una posición que no compita con el mensaje. No hace falta alargar el plazo ni quitar el feedback. Este hallazgo se limita a legibilidad del reloj: no ha impedido completar el testigo.

## Resultado provisional del alcance acotado

Los tres cambios aportan relaciones entre acciones y estados del mundo verificables en rutas legales. La mejor aportación es la reutilización del peso con fijación permanente; el reloj combina activación y geometría, y el cierre de luz transforma el propósito de la misma red. La complejidad sigue siendo contenida y secuencial, lo que debe describirse con precisión.

La reserva accionable de esta revisión es mantener visible el tiempo del reloj. Queda pendiente inspeccionar la imagen del feedback del jefe cuando esté disponible; las funciones de pulso/avisos en código no acreditan por sí solas su lectura visual ni su sonido. No se emite nota global ni se usa un objetivo numérico para decidir si estos cambios merecen crédito.

## Cierre acotado: fuente 12 y feedback de golpe del jefe

Se verificó `round12/index.html`, SHA-256 `8c3e43a36a29dde8b30a56ad8a5112a0bdb1ccb93b0579b753f54de094362d45`. El diff completo frente a fuente 11 se limita al HUD: añade un contador persistente a la derecha y reserva la izquierda para mensajes/títulos. No cambia mecanismos, plazos, física ni combate.

Reejecuté `node tools/check-campaign-clock.js 12` después de inspeccionar el programa. Resultado: **PASS, contador correcto y sin colisión de cajas en los 504 frames activos**, incluidos los 357 con mensaje. También supera el estado unitario adicional con banner de entrada. La observación usa llamadas de dibujo y métricas reales de fuente; ese estado adicional es un fixture, no un segundo recorrido. Datos y hash quedan en `round12/clock-hud.json`. Esto cierra el defecto de desaparición medido en fuente 11 a nivel de implementación y ejecución instrumental.

Inspeccioné `round11/n8-hit-feedback-world.png`: el anillo claro de impacto destaca alrededor del jefe, mientras la fase 3/3 y el segmento de vida restante permanecen legibles en su panel separado. No observo texto cortado ni solapamiento del pulso con la barra. La figura del jefe y los apoyos laterales conservan identificación clara. Queda cerrado el apartado visual específico del golpe; una imagen fija no acredita duración del pulso, audio ni toda la secuencia de avisos de fase.

Finalmente inspeccioné `round12/n6-clock-visible-with-message.png`, correspondiente al frame 10300. «RELOJ 9s» aparece completo en la esquina superior derecha y el mensaje de cambio de pasarelas ocupa una zona separada a la izquierda. Ninguno tapa al jugador, los pulsadores visibles o el otro texto; ambos se distinguen del HUD principal. **Queda cerrado el P2 del cronómetro tanto en la prueba instrumental como en esta comprobación visual.** No quedan reservas accionables abiertas dentro de este cierre acotado. Se mantienen los límites expresados sobre experiencia humana, audio y necesidad individual de cada apoyo; no se asigna nota global ni se repite la revisión completa.
