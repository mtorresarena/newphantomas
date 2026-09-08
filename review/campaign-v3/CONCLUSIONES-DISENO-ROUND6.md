# Conclusiones independientes de diseño — round6

2026-09-08. Fuente revisada: `round6/index.html`, SHA-256 `5963bcc02f71090a958df9737eca2b8fd5a96ed0a615f4a9dcbe4be4dc04ef21`. Este contraste amplía mi revisión óptica anterior con recorridos actuales y capturas. No adopta puntuaciones de otros revisores y no modifica producción. Las notas emitidas sobre round4 describen aquel candidato, no este.

**Las objeciones principales de repetición han recibido cambios reales de juego.** Ahora se alternan lados de cebo, transporte descendente y ascendente, preparación antes del reloj, retornos durante el reloj y circuitos ópticos con estados iniciales mezclados. He completado las cuatro fases nuevas usando las rutas actuales. No encuentro otra carencia fundamental de diseño que justifique añadir más salas o más mecanismos. Sí queda una mejora menor y concreta en la duración de la indicación del escarabajo.

## Evidencia actual reproducida por mí

`contraste-final-round6.cjs` ejecutó 22 rutas principales completas: las doce referencias N1–N4, las tres políticas N5/N6 y balanced/speed N7/N8. Todas llegaron a `clear` sin muertes. En el momento de lectura, cautious N7 seguía marcado incompleto y cautious N8 no estaba disponible; no se cuentan como superados ni como fallos del juego.

| Nivel nuevo | Políticas reproducidas | Frames obtenidos | Impactos | Muertes |
|---|---|---|---|---|
| N5 | balanced / cautious / speed | 10.939 / 11.205 / 10.875 | 5 / 7 / 6 | 0 / 0 / 0 |
| N6 | balanced / cautious / speed | 11.346 / 11.346 / 11.346 | 0 / 0 / 1 | 0 / 0 / 0 |
| N7 | balanced / speed | 9.345 / 9.378 | 0 / 0 | 0 / 0 |
| N8 | balanced / speed | 12.491 / 12.256 | 5 / 3 | 0 / 0 |

No todos los frames son decisiones; el controlador conoce los objetivos y sus políticas están relacionadas. Los tiempos no se traducen a minutos humanos ni bastan para acreditar la barrera de acciones significativas de la rúbrica. Tampoco interpreto `cautious` como prueba de que sea más fácil o segura: N5 cautious recibió más impactos que balanced.

También reproduje cuatro recuperaciones con entradas del juego:

- N5, contrapeso final: muerte y recuperación, `clear`, 21.726 frames. Se usó el testigo completo `route-n5-cautious-retry-weight-trial5-2.json`; el intento balanced incompleto se conservó sin acreditarlo.
- N6, reloj final activo: muerte y recuperación, `clear`, 22.988 frames.
- N6, reloj de retorno de parte 4: expiración y resolución posterior, `clear`, 11.977 frames, sin muerte.
- N7, circuito final: muerte y recuperación, `clear`, 20.819 frames.

Estas rutas de muerte incluyen largas esperas deliberadas hasta agotar energía. Sirven para verificar recuperación y **se excluyen de valorar duración activa o densidad**. El archivo `contraste-final-round6-evidencia.json` contiene eventos y resultados; la recuperación de peso adicional está en `contraste-final-round6-weight-recovery.json`.

No he reproducido por mi cuenta aquí las 35 comprobaciones de navegador ni la continuidad completa N4→N8→título anunciadas por el revisor principal. No las incorporo como evidencia propia ni las convierto en una nota de integración.

## Juicio sobre las soluciones de diseño

**Variedad:** los cierres mantienen reglas diferentes —transportar, completar un trayecto con plazo y orientar luz— y cada nivel combina otras familias durante el recorrido. El sello requiere escoger el lado desde el que provocar la carga; los finales no son combates con barra de vida encubiertos. Los puzles siguen perteneciendo a cinco familias reconocibles, lo que permite aprenderlas; no necesitan una familia inédita por sala para tener variedad. La sustitución de copias exactas por relaciones espaciales distintas es suficiente para retirar mi objeción principal de round4.

**Progresión:** ahora hay introducción, primera ampliación y variantes que exigen reutilizar el conocimiento en otro contexto. El reloj elevado enseña que conviene preparar el acceso antes de activar; el retorno cambia la secuencia espacial; el descenso final distingue preparación y ejecución. El contrapeso final cambia cuándo conviene subir y cuándo se lleva la limitación de movimiento. En los espejos se introducen direcciones inversas y un receptor interior, conservando algunos espejos ya correctos. Este último cambio exige seleccionar qué corregir, en lugar de repetir una pulsación en todos.

**Límite real de esa progresión:** N8 continúa siendo una recapitulación de familias conocidas antes de su jefe; no es una campaña de reglas completamente nuevas. Es una elección coherente para culminar lo aprendido, no una carencia que obligue a inventar otro sistema. La intensidad tampoco crece de forma uniforme: algunos relojes nuevos retiran enemigos locales mientras cambian el trayecto. Eso favorece practicar el nuevo recorrido, pero no permite decir que cada variante sea más difícil solo por ser posterior.

**Densidad:** hay rutas obligatorias largas, cambios de objetivo y recuperaciones demostradas; la extensión no procede de quedarse quieto esperando sin finalidad. Las pruebas nuevas tienen más sustancia que diez copias por nivel. No sustituyo, sin embargo, un clasificador común de acciones significativas por mis frames o por el número de puertas: la barrera cuantitativa de sustancia debe apoyarse en la evidencia específica del revisor que la haya medido.

**Jefes:** se conservan los dos jefes de objetivos distintos: atraer proyectiles a conductores en N4 y caer sobre el núcleo abierto en N8. Las políticas de altura, cebo y desplazamiento de sus fases N8 siguen teniendo un propósito. Los recorridos actuales los derrotan. Mi revisión actual no añade pruebas de todos los fallos de ventana o muerte simultánea; tampoco transforma estas victorias del bot en evidencia de diversión humana.

**Tono y ayudas:** las indicaciones son concretas y utilizan los controles del juego; explican posiciones y consecuencias recuperables. La ayuda de pausa proporciona una solución bastante explícita, pero es voluntaria y está justificada como apoyo al aprendizaje. No hace falta convertirla en un acertijo textual. La redacción «gira cada espejo» sigue presente en el archivo congelado 6; el arreglo anunciado en el archivo de autoría no se atribuye a esta fuente hasta generar y comprobar la siguiente.

## Comprobación visual limitada

Inspeccioné `mirror-cd-legal.png`, `mirror-cd-touch-classic-legal.png`, `mirror-cd-touch-portrait-legal.png` y `clock-final-help-legal.png`.

- C y D se distinguen de sus diagonales y permiten relacionar las pistas con el circuito. El receptor interior R está separado del espejo D. No observé solapamientos entre sus etiquetas y las plataformas en esas capturas.
- Los controles táctiles no cubren esos nodos en las imágenes facilitadas.
- La pausa del reloj final muestra íntegramente el ascenso previo en montacargas, el descenso, el orden 1→2→3, el ácido y el plazo de siete segundos. El texto es legible en la captura de escritorio y no está cortado.
- El HUD en vertical sigue siendo pequeño. La imagen de la herramienta está reducida uniformemente; sus dimensiones visibles **no equivalen a medidas CSS del área de juego**. El revisor principal informa de 390×234 CSS de mundo y tipografía HUD aproximada de 7,3 px. Mantengo una reserva de comodidad de lectura, no una afirmación de solape ni una medida propia de hardware. Conviene priorizar ayuda de pausa legible en vertical si se ajusta la interfaz.

Estas capturas permiten retirar el problema específico de letras ausentes; no acreditan uso cómodo en un teléfono físico ni comprensión humana de las señales.

## Mejora menor restante: la pista del escarabajo dura muy poco en la primera pasada

Comprobé la ruta N5 balanced contra fuente 6 registrando `campaign.prompt` y la condición real `!msg?.t` usada para dibujarlo. «ESCARABAJO: PUEDES PISARLO» queda disponible para dibujo únicamente durante **15 frames, simF 960–974, unos 0,25 segundos**, en esa primera pasada. La condición depende de mantenerse a menos de 64 px del enemigo; al alejarse, desaparece.

La pista existe y no la tapa un mensaje global en esa ventana, pero esa exposición breve no permite dar por enseñada la respuesta especial. **Propuesta P2:** mantener el aviso durante unos segundos una vez activado o incorporarlo a la ayuda de pausa de esa parte. No es una barrera de completabilidad: pisar es opcional y los recorridos se completan sin ello. No exigiría matar al escarabajo para fabricar una decisión obligatoria.

## Resultado del contraste

No mantengo las objeciones P1 de copias del cierre y receta óptica universal. Los cambios alteran rutas, preparación y selección de estados, y las soluciones actuales se pueden ejecutar por controles del juego. Los fallos y recuperaciones de cuatro variantes también se han reproducido.

Las tareas que faltan en mi cobertura son verificaciones concretas —dos políticas todavía no disponibles al leerlas, clasificación homogénea de sustancia y uso humano—, no razones para seguir añadiendo contenido indefinidamente. Quedan el aviso demasiado fugaz del escarabajo y reservas de lectura en vertical. No asigno una nota global a este contraste parcial ni sumo resultados anunciados como si los hubiera ejecutado.

## Adenda: comprobación del cambio mínimo de fuente 7

Después de cerrar el contraste anterior se recibió `round7/index.html`, SHA-256 comprobado `383fc2c0837ffdf01deff83fbcf4e3d02dbf512d1de94c39d147679757c42607`. Inspeccioné el diff completo frente a fuente 6. Cambia la redacción de la ayuda, añade la explicación del escarabajo a la ayuda de la primera parte N5 y añade un dibujo de pausa para touch vertical con texto a escala 2. No cambia reglas de puzles, mapas, física, enemigos ni jefes en ese diff.

La ayuda de espejos ahora indica conservar los que ya guían bien la luz. La del escarabajo permanece disponible en pausa durante la situación pertinente, de modo que la enseñanza ya no depende exclusivamente de la ventana fugaz de 15 frames. Con esa comprobación de implementación retiro las dos observaciones menores de redacción/disponibilidad. La pausa vertical aprovecha el espacio de letterbox para ampliar el texto; su resultado visual de fuente 7 está pendiente de captura en mi cobertura, así que no convierto el diff en una validación visual o de teléfono físico.

Esta adenda no reetiqueta como fuente 7 los recorridos que ejecuté sobre fuente 6. Distingue la verificación de reglas mediante diff de una nueva ejecución, que no he realizado aquí. No queda otra objeción fundamental de diseño confirmada en mi revisión.

### Cierre de la comprobación visual de fuente 7

Inspeccioné directamente las capturas `round7/portrait-help-mirrors.png` y `round7/portrait-help-beetle-classic.png`. **No observo texto cortado ni solapado en ninguna de las dos.** En la ayuda de espejos se ve la instrucción completa del receptor interior, la explicación de conservar orientaciones correctas y el final «al alejarte». En la ayuda clásica del escarabajo se ve íntegra la alternativa de pisarlo desde arriba o esquivarlo. En ambas, el título, el cuerpo y «TOCA PARA SEGUIR» quedan separados dentro del panel; los botones táctiles no invaden el texto.

Con estas dos imágenes queda cerrada mi reserva de cobertura visual sobre la nueva ayuda de pausa vertical. La mejora de lectura respecto a la captura anterior es visible. Esto no cambia la reserva distinta sobre el tamaño del HUD durante la acción ni acredita comodidad en un móvil físico. No se repitieron partidas para esta comprobación ni se añadió una nota global.
