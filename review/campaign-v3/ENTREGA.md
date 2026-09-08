# Campaña v3: diseño y evidencia de entrega

## Candidato actual: fuente 12

SHA256 de `index.html`: `8c3e43a36a29dde8b30a56ad8a5112a0bdb1ccb93b0579b753f54de094362d45`,
congelado en `round12/index.html`. Base Git `31d4610`. **Aceptado expresamente por
el usuario para desplegar y probar el 2026-09-08:** «me doy por satisfecho, lo
dejamos aqui, desplegamos voy a probar». La revisión independiente final es
[9,38/10 (9,375)](REVISION-FINAL-INDEPENDIENTE-FUENTE12.md), inferior al objetivo
inicial de 9,5. La aceptación posterior no cambia la rúbrica ni la nota.
La nota histórica 8,80 corresponde a las fuentes anteriores. El apartado
histórico inferior conserva su alcance original. Se detiene la propuesta de
ampliar N8 parte 3: no está implementada ni forma parte de esta entrega.

Esta iteración incorpora tres cámaras con dependencias físicas: el peso se
deposita, fija la escalera y se recupera para otra balanza en N6; los pulsadores
del reloj cambian los apoyos disponibles en N6; R almacena energía y despliega
la pasarela para acceder al prisma elevado que desvía el mismo haz a S en N7.
No se suman como familias nuevas ni se contabiliza cada estado como otro puzle.
La alternativa de saltar desde el suelo al segundo pulsador sigue permitida;
no se afirma que cada apoyo sea obligatorio. [Diseño y límites de la iteración](ITERACION-MECANISMOS-CONECTADOS.md).

La pausa presenta observación, pista y solución en tres peticiones, con botones
nativos y sin consumir tiempo. El feedback de los jefes añade impacto, cambio
de fase y derrota sin alterar su vida ni las ventanas de vulnerabilidad. Solo
hay dos jefes, N4 y N8. El contador del reloj ocupa un espacio separado que
permanece visible durante los mensajes y el título de parte.

| Evidencia de esta iteración | Alcance y procedencia |
|---|---|
| [24 recorridos](round12/verified-set.json) | Los ocho niveles y tres políticas desde origen, sin muerte. Entradas reutilizadas conservan su hash de grabación; se acredita ejecución sobre fuente 12. |
| [Campaña continua](round12/connected-replays.json) | N4 → N5 → N6 → N7 → N8 → título y tres repeticiones deterministas por nivel nuevo. |
| [Cinco recuperaciones](round12/connected-recovery.json) | Retirada prematura del peso, reloj caducado, haz interrumpido y dos muertes reales con progreso parcial; todos alcanzan la meta. |
| [18 casos de bordes](round12/rules.json) | Estados artificiales de contratos y reinicios; no se presentan como partidas. |
| [47 comprobaciones de navegador](round12/browser-integration.json) | Carga, Pixi/atlas, DOM, persistencia, pausa, controles sintéticos y ayuda progresiva; tres documentos con hash 12. |
| [Contador permanente](round12/clock-hud.json) | 504/504 frames visibles, 357 con mensajes; observación de llamadas de dibujo con métricas reales de la fuente bitmap y un fixture de título. |
| [Contador inspeccionado](round12/n6-clock-visible-with-message.png) | Exportación real de los lienzos del navegador en f10300; reloj, mensaje y personaje separados. |
| [Ayuda adaptable](round12/hint-dom-metrics.json) | DOM final a 390×844 y 480×320, botones Enter/Espacio y ausencia de desbordamiento; no es prueba de un iPhone físico. |

[Contraste principal de conexiones](CONTRASTE-INDEPENDIENTE-CONEXIONES-11.md)
y [contraste visual con cierre 12](CONTRASTE-DISENO-ROUND11.md) conservan también
los hallazgos adversos: E era alcanzable sin apoyos en fuente 10; fuente 11 lo
elevó. Los avisos ocultaban el reloj en 11; fuente 12 corrige ese defecto.
La búsqueda adversarial limitada de acceso a E no demuestra imposibilidad global.
El feedback del golpe del jefe se inspeccionó en
[este fotograma de fuente 11](round11/n8-hit-feedback-world.png), compatible con
12. El sonido se implementó, pero no se ha escuchado en un dispositivo físico.

Comandos específicos actuales:

```text
python tools/build-campaign.py
node tools/check-campaign-set.js 12
node tools/check-connected-recovery.js 12
node tools/check-campaign-clock.js 12
node tools/check-campaign-rules.js
node tools/check-campaign-replays.js
```

Regenerar preserva el SHA del candidato. La integración se sirve por HTTP en
`tools/browser-integration.html?source=12`. Estos ensayos no miden diversión,
aprendizaje ni dificultad humana. Los revisores mantienen la rúbrica original.

## Antecedente conservado: fuentes 7–9

Candidato: SHA256 `d4b3b88064956af7b9c9460507aff83110f47ed4a2eb28394cacad69d87fee53`
de `index.html`, conservado en `round9/index.html`. La base de Git es `31d4610`.

**Estado: candidato técnicamente suficiente, pendiente de aceptación.** La
[revisión final independiente de fuente 7](REVISION-FINAL-INDEPENDIENTE-FUENTE7.md)
otorga **8,80/10**. Cumple sus siete barreras, pero no el umbral de 9,5 solicitado
por el usuario. No se presenta como aprobado ni se ha publicado esta revisión.
La [aclaración posterior del revisor](ACLARACION-RESERVAS-TRAS-NOTA-FINAL.md)
mantiene la nota: no identifica una reforma técnica amplia justificada ni promete
alcanzar 9,5 mediante más iteraciones. Se distingue esta valoración de los fallos
reproducidos, que sí se corrigieron.

Las fuentes 8/9 añaden una corrección detectada en la comprobación acotada de giro:
los mandos de movimiento/salto se ocultan mientras se lee la pausa, para evitar
que tapen el texto en horizontal pequeño. Pausa y pantalla completa permanecen
accesibles; reanudar recupera los mandos. Al entrar en pausa se liberan las entradas
para evitar movimiento retenido si el dedo se levanta fuera del botón oculto.
El caso DOM falla en fuente 8 y se conserva en `round8/held-controls-regression.json`.
No cambian mapas ni físicas. La comparación actual de las 24 rutas está en
`round9/candidate-replays.json` y la integración ampliada en
`round9/browser-integration.json`; los informes de
fuente 7 de la tabla conservan su procedencia, sin rebautizarlos como ejecuciones9.

El [cierre independiente de fuente 9](CIERRE-ESTRECHO-FUENTE9-PAUSA.md) confirma
la ayuda despejada, la liberación de controles y la compatibilidad de las rutas.
Mantiene **8,80/10**: los cambios siguen locales, sin commit ni push de esta entrega.

## Qué cambia

N5–N8 tienen cinco partes y diez pruebas obligatorias por nivel. Los recorridos
combinan mecanismos, cruces y amenazas; las variantes avanzadas cambian dirección,
altura, preparación, orden y orientación. No se equipara ampliar el mapa a añadir
decisiones. [Matriz de variantes](MATRIZ-VARIANTES.md).

Hay exactamente dos jefes: Custodio en N4 y Corazón del Barón en N8. El segundo
exige seis impactos sobre el núcleo, con tres fases de ataques anunciados y
cambios de altura. La arena del Custodio cierra también sus extremos superiores.
N5–N7 culminan con desafíos de sus familias, sin jefes adicionales.

Las pruebas resueltas y las llaves/puertas conservan su progreso al morir dentro
del nivel. Las pruebas pendientes recuperan su estado inicial. Hay puntos de
control por parte y antes del último jefe. Continuar desde el título reinicia el
nivel, no una instantánea exacta de la habitación.

La estética conserva los fondos y el lenguaje visual aprobados, con nuevos atlas
del Corazón y de escarabajos/polillas. Las pistas se consultan en pausa; la ayuda
vertical utiliza letra mayor. El pisotón opcional del escarabajo queda explicado
en la ayuda de la primera parte de N5. Los espejos A–D indican qué nodo se gira;
la pista aclara que se pueden conservar los ya bien orientados.

## Evidencia actual

| Evidencia | Archivo y alcance |
|---|---|
| 24 recorridos comparables congelados | [Manifiesto fuente 6](round6/manifest.json). Tres políticas por nivel, no tres personas; se conserva el hash de grabación de cada ruta. |
| Reproducción del candidato | [Comparación de las 24 rutas](round7/candidate-replays.json). Entrada natural, controles reales y comparación del estado completo entre fuentes 6 y 7. |
| Campaña continua y pausa | [Recorridos conectados](round7/connected-replays.json). N4 → N5 → N6 → N7 → N8 → título, más tres repeticiones deterministas de cada nueva fase. |
| Fallos de las variantes nuevas | [Recuperaciones](round7/recovery-replays.json). Peso alto perdido al morir, espejo mixto alterado y muerte, reloj de retorno caducado y muerte durante el reloj de ascensor/ácido. |
| Bordes del motor y los jefes | [14 casos aislados](round7/rules.json). Incluyen último golpe/muerte simultáneos, derrota interrumpida, límites de arena, plazos y reset. Son fixtures, no partidas completas. |
| Navegador | [35 comprobaciones](round7/browser-integration.json), con hash de los tres documentos cargados. DOM, almacenamiento, controles sintéticos, pausa, cambio de aspecto y selección. |
| Geometría | `round6/geometry-n5.log` a `geometry-n8.log`: metas y objetos accesibles en el modelo abstracto. Los mapas y físicas son idénticos en fuente 7. Sus tiempos BFS no son mínimos del motor real ni duración humana. |
| Renderizado | [Pixi](round6/sweep-pixi.json) y [Canvas](round6/sweep-canvas.json): 120 vistas en ambos aspectos. Fuente 7 conserva mapas/atlas y añade solo texto y dibujo de pausa, inspeccionado aparte. |

## Capturas inspeccionadas

- [Circuito avanzado, C/D y receptor interior](round6/mirror-cd-legal.png).
- [Circuito con controles y aspecto anterior](round6/mirror-cd-touch-classic-legal.png).
- [Ayuda ampliada de espejos](round7/portrait-help-mirrors.png).
- [Ayuda permanente de escarabajos](round7/portrait-help-beetle-classic.png).
- [Preparación del reloj final](round6/clock-final-help-legal.png).
- [Reloj final con progreso parcial](round6/clock-final-partial-legal.png).
- El combate y sus reintentos anteriores conservan su evidencia compatible en
  las rondas previas; no se presentan como nuevas ejecuciones sobre otra fuente.

## Cómo interpretar la revisión

La [rúbrica](CRITERIOS.md) se fijó antes de inspeccionar el trabajo. Se conservan
las notas anteriores, incluidos resultados insuficientes, los intentos de búsqueda
fallidos y las discrepancias entre revisores. El [contraste independiente de
diseño](CONCLUSIONES-DISENO-ROUND6.md) no adopta la nota del revisor principal.

[Políticas de prueba](POLITICAS-DE-PRUEBA.md) explica la guía del buscador y sus
límites. Los tiempos de simulación no son estimaciones de una primera partida
humana. La revisión técnica no acredita diversión, aprendizaje humano, comodidad
del HUD en vertical ni funcionamiento en un iPhone físico. Los punteros y el mando
del navegador están simulados. Estos límites no se ocultan detrás de una nota.

## Reproducir las comprobaciones

```text
python tools/build-campaign.py
node tools/check-campaign-rules.js
node tools/check-campaign-replays.js
node tools/check-campaign-recovery.js --round=7
node tools/check-campaign-candidate.js 6 9
```

El generador reproduce el mismo hash del candidato. `tools/browser-integration.html`
y `tools/visual-check.html?sweep=1` se ejecutan sirviendo el repositorio por HTTP.
El juego publicado usa `index.html` y `assets/`; los buscadores, fixtures y
restauración de snapshots pertenecen a las herramientas de prueba.
