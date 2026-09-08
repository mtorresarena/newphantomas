# Contraste independiente de diseño — round5 frente a round4

2026-09-08. Fuente congelada: `round5/index.html`, SHA-256 `faeccc2abdcd3ccff53bd12e98f91720e6d3704f72f1f1d90a8e2606d2dfd427`. Referencia: candidato round4 ya revisado. No se ha modificado producción ni se han leído puntuaciones ajenas. Se conserva la rúbrica de `CRITERIOS.md`.

**El cambio sí mejora rutas y colocación de objetivos. Queda una estrategia trivial en los espejos: girar todos exactamente una vez resuelve los ocho circuitos N7/N8, sin interpretar el haz.** Las nuevas pistas también nombran A/B/C/D, pero esos identificadores no se dibujan sobre los espejos.

## Verificación propia

Inspección comparativa de definiciones y código, tres recorridos legales balanced de N5/N7/N8, y enumeración exhaustiva de las orientaciones de cada circuito como prueba unitaria óptica. Programa: `contraste-diseno-round5.cjs`; resultados: `contraste-diseno-round5-evidencia.json`.

| Nivel | Estado de mi reproducción | Frames | Impactos | Muertes | Pruebas resueltas |
|---|---|---:|---:|---:|---:|
| N5 | clear | 10.939 | 5 | 0 | 10 |
| N6 | No reproducido: testigo todavía incompleto en el momento de lectura | — | — | — | — |
| N7 | clear | 9.672 | 0 | 0 | 10 |
| N8 | clear, jefe derrotado | 12.615 | 4 | 0 | 10 |

Estos recorridos parten del inicio natural de cada nivel tras seleccionarlo; no usan teleport, energía regalada ni modificación de estados. Las configuraciones fabricadas de espejos se prueban en instancias distintas y **no acreditan completabilidad**. El testigo incompleto de N6 no demuestra un fallo del juego: únicamente deja la completabilidad pendiente en esta revisión.

Una política por nivel no sustituye las tres políticas comparables de round4. No traslado al candidato nuevo sus medidas de duración, ausencia de impactos ni su cobertura. No hay evaluación humana ni visual real en este contraste.

## Qué cambia realmente

| Cambio | Contraste observado | Juicio de diseño |
|---|---|---|
| N5 sello de parte 3 | Primer guardián carga a derecha; segundo a izquierda | Sí exige elegir el lado de cebo. El replay registra `dir` +1, −1. |
| N5 sello de parte 4 | Primer guardián a izquierda; segundo a derecha | Cambia el acceso y la colocación entre dos amenazas; no basta repetir la orientación anterior. Replay: −1, +1. |
| N5 sello final | Sellos más centrados y cargas convergentes | Cambia la relación entre refugio central y amenazas. Replay: +1, −1. Es práctica combinada de elegir lado, no una regla nueva de enemigo. |
| Contrapeso final N5 | Piedra en fila 2, hueco en fila 6 a la izquierda; antes piedra en suelo y hueco alto | Subida sin carga y retorno descendente cambian la planificación de trayecto. Ya no copia el ejercicio anterior. Resuelto legalmente. |
| Reloj parte 3 | Empieza alto, visita fondo bajo y regresa al centro alto | Hay retorno obligatorio y nueva secuencia espacial. Amplía el plazo a 660 frames; no introduce dificultad solo por recortarlo. Estructura revisada; N6 completo aún pendiente. |
| Reloj parte 4 | Orden 2→1→3, desde fondo bajo hasta origen alto y vuelta | Cambia dónde debe arrancar el cronómetro y qué desplazamiento conviene preparar antes. 780 frames. HUD presenta el orden real. |
| Reloj parte 5-1 | Activa en fondo, asciende hacia la izquierda y vuelve a salida derecha | Exige preparar una ida y vuelta, distinta del avance lineal anterior. 720 frames. |
| Reloj final N6 | Montacargas antes del reloj; activaciones descendentes sobre zona de ácido | Separa preparación del ascenso y ejecución de descenso; buena diferencia potencial de política. Su cumplimiento y márgenes no están verificados por mí en N6. |
| Espejos parte 3 | Fuente elevada y trayecto hacia abajo antes de subir al receptor | Cambia el trayecto óptico y de acceso. El replay N7 completa la prueba. |
| Espejos parte 4 | Fuente a la derecha, avance óptico hacia la izquierda | Cambia dirección de lectura y acceso espacial. |
| Espejos parte 5-1 | Trayecto por abajo y retorno ascendente al receptor izquierdo | Evita copiar la misma elevación anterior. |
| Espejos final | Cuarto espejo que devuelve el haz hacia receptor interior | El receptor deja de ser el extremo exterior; hay un retorno óptico real. Resuelto legalmente en N7/N8. |

Las runas cambian 3→1→4→2 por 4→2→1→3. Eso modifica el recorrido, pero sigue siendo obedecer una secuencia explícita. Es una variación de aplicación, no una sexta familia de mecánicas.

El inventario también muestra que se retiraron la polilla y el respiradero de varios relojes nuevos de partes 3–5. Esa decisión puede favorecer la introducción recuperable de nuevas rutas; impide asumir que toda variante es automáticamente más difícil o una combinación mayor que round4. La diversidad crece por trayecto/orden y el cierre añade ácido, pero la presión de enemigos no crece uniformemente.

## Hallazgos pendientes de corrección

### P1 de diseño: todos los espejos arrancan mal, con la misma receta ciega

La enumeración de `2^n` orientaciones por circuito usando `mirrorTrace` encuentra una sola solución óptica en cada uno. En los ocho circuitos, esa solución es el complemento exacto del vector inicial:

| Circuito | Ángulos iniciales | Única solución |
|---|---|---|
| N7 1-1 | 0,0 | 1,1 |
| N7 2-2 | 0,0,1 | 1,1,0 |
| N7 3-1 | 1,1,0 | 0,0,1 |
| N7 4-2 | 1,1,0 | 0,0,1 |
| N7 5-1 | 0,0,1 | 1,1,0 |
| N7 5-2 | 0,0,1,0 | 1,1,0,1 |
| N8 3-1 | 1,1,0 | 0,0,1 |
| N8 5-2 | 0,0,1,0 | 1,1,0,1 |

La nueva geometría cambia dónde caminar, pero un jugador que detecte «visita todos y pulsa Abajo una vez en cada uno» sigue sin necesitar leer el circuito. La pista base incluso dice «Abajo gira cada espejo», reforzando esa receta.

**Corrección concreta:** en las variantes tardías, dejar algunos espejos inicialmente correctos y variar cuáles. Mantener uno o dos giros muy claros en la introducción; luego exigir identificar dónde se interrumpe el haz. No añadir simplemente otro espejo inicialmente incorrecto. Después comprobar que girarlos todos una vez ya no resuelve todos los circuitos y que ninguna sala empieza completada.

### P2 de enseñanza: pistas A/B/C/D sin letras visibles

Las nuevas pistas dicen «baja por A y B», «sube por B», «desde D». En `drawCampaign` (línea 3703 del candidato congelado), la rama `role==='mirror'` dibuja únicamente la diagonal; el `text(n.glyph||n.id, ...)` se ejecuta para otros nodos, no para espejos. Fuente y receptor sí muestran L/R.

**Corrección concreta:** rotular discretamente los espejos con sus identificadores o describirlos por posición. Es especialmente útil cuando el rayo aún no llega a los espejos posteriores. La instrucción espacial adicional ayuda, pero no sustituye identificar los objetos que nombra. La legibilidad final de esas letras debe validarse con capturas reales.

## Enseñanza y riesgos

Las pistas nuevas sí anticipan la dirección inversa del guardián, la recolección elevada, el orden de reloj y el inicio del descenso. `drawCampaignHUD` ahora presenta `ACTIVA <orden> Y CRUZA` antes de iniciar un temporizado, por lo que 2→1→3 no se exige sin indicación. Las lecciones están disponibles mediante la pausa; no afirmo que los jugadores necesariamente las lean.

No he confirmado nuevas roturas de juego. El aumento de impactos de N5 balanced de tres a cinco respecto al anterior testigo no demuestra daño inevitable: cambian la ruta y la posición de cebo. Requiere revisar la esquiva, no aumentar automáticamente la energía. La recuperación de los nuevos recorridos, especialmente un fallo del reloj final después de descender, queda fuera de mi cobertura actual.

No asigno una nueva nota ni una aceptación completa con N6 pendiente y los dos hallazgos anteriores abiertos. Frente a round4, los cambios de carga, peso y temporizados atacan el problema señalado con diferencias concretas de trayecto y preparación. Los espejos mejoran el espacio, pero todavía necesitan romper la receta de una pulsación universal para acreditar lectura óptica adicional.
