# Revisión ciega técnica de N5–N8

**Resultado: cumplimiento parcial del objetivo.** La expansión tiene identidades y partes reconocibles y conserva el lenguaje visual de N1–N4. La progresión de dificultad es el aspecto menos convincente: el aumento de combinaciones no siempre exige una respuesta más elaborada, y hay finales que se superan con una secuencia fija de saltos. No se ha encontrado un bloqueo crítico reproducible en los estados examinados. Eso no certifica que no existan bloqueos ni que los cuatro niveles estén completamente validados.

No asigno una nota numérica global: faltan recorridos completos de N5–N8, cobertura de todos los saltos y observación humana. Una nota sumada daría más precisión de la que permite esta revisión técnica. La rúbrica y sus pesos se fijaron antes de abrir la copia en `CRITERIOS-PREVIOUS.md` y no se han cambiado.

## Alcance y metodología

- Material examinado exclusivamente: `index.html`, `assets/` a través de su renderizado y `tools/route-harness.js` dentro de esta copia congelada. Ningún juego ni recurso original fue editado. Todos los archivos nuevos están en `audit/`.
- Identificador del HTML: SHA-256 `B9ABDC1141247D6EB2F7535342E3600382752A0A6DAE794E848A2D800209B368`.
- Inspección de las 20 partes nuevas y comparación estructural con los cuatro niveles originales de la misma copia.
- Bucle real ejecutado en Node: 100 barridos de entradas simples, 16 comprobaciones de respawn, 32 contactos de puerta (16 con llave y 16 sin ella), pruebas locales de persistencia y rotura, seis recorridos dirigidos de partes, 36 perturbaciones de cuatro recorridos y ventanas de salto. Se conserva tanto el éxito como el fracaso.
- Nueve vistas reales del renderizador, en navegador oculto, cubriendo N1–N8. La página de prueba `render-preview.html` reproduce el HTML y sus recursos mediante `<base href="../">`, detiene el reloj y llama a la API de previsualización existente. Son composiciones de estados de prueba, no capturas de una partida humana.
- Se fijan estados iniciales locales para aislar una regla o una parte: no se acredita cómo llegó un jugador desde el inicio del juego a cada estado. Las pruebas de puertas inyectan la cantidad de llaves; las de persistencia producen recogidas reales desde una posición superpuesta al objeto; las de muerte fuerzan energía cero.

## Resultado según la rúbrica previa

| Dimensión | Peso | Valoración | Confianza y fundamento |
|---|---:|---|---|
| Diferenciación de N5–N8 | 25 % | Sólida, con repetición apreciable | Media-alta en estructura; media en percepción. Cargas, rotura, puntería y combinación final cambian reglas; las 20 partes tienen configuraciones distintas. Comparten un esquema muy estable de recarga, recorrido, llave y puerta. |
| Progresión dentro y entre fases | 25 % | Parcial | Media. Hay aprendizaje y combinaciones nuevas, pero también alivios marcados y retos reactivos anulables con entradas periódicas. No se ha medido dificultad humana ni completado todos los niveles. |
| Justicia, recuperación y robustez | 25 % | Sólida en la muestra; cobertura global incompleta | Alta para puertas, persistencia y respawn examinados; media-baja para todos los saltos y estados posibles. No apareció muerte inmediata tras reaparecer, pérdida incoherente de llaves ni bloqueo de puerta en esos casos. |
| Coherencia estética con N1–N4 | 15 % | Sólida | Media-alta para las vistas observadas. Mismo personaje, HUD, escala, sacos, materiales y lenguaje de plataformas; fondos nuevos de reloj y corazón encajan con los interiores góticos. |
| Claridad, aprendizaje y repetición | 10 % | Parcial | Media. Títulos y numeración delimitan partes; avisos específicos existen. Las instrucciones detalladas de cada parte solo están en los datos, y algunos avisos describen una conducta que las rutas simples no necesitan. |

El 50 % de la rúbrica dedicado a diferenciación y progresión no permite considerar plenamente acreditado el objetivo: la primera está mejor sustentada que la segunda. Los pesos se conservan para explicar esta prioridad, sin convertir etiquetas cualitativas en números inventados.

## Qué diferencia realmente cada nivel

| Nivel | Secuencia observada en sus cinco partes | Evaluación técnica |
|---|---|---|
| N5 | Un centinela y desniveles; dos centinelas con bloques; dos charcas con isla; centinelas más canal; escalera de plataformas sobre líquido | Cambios internos claros. La tercera parte introduce castigo letal y precisión, pero las partes cuarta y quinta permiten avanzar sin leer las cargas mediante el patrón descrito abajo. |
| N6 | Tablas frágiles sobre suelo seguro; puente frágil sobre líquido con apoyo; ascensor a llave sobre suelo; puente móvil y tablas; ascensor y cadena de apoyos | La enseñanza inicial sobre suelo es apropiada. La tercera parte reduce el castigo respecto a la segunda: puede ser un descanso deliberado, pero no acredita una subida continua. La cuarta y quinta añaden coordinación con movimiento. |
| N7 | Un vigía entre bloques; dos vigías y coberturas; vigías elevados; vigía seguido de puente frágil; combinación de alturas y tramo final frágil | La altura cambia la línea de tiro, y el paso sobre líquido añade riesgo. Sin embargo, el inicio y el final admiten entradas periódicas muy similares; la cúpula no obliga a esperar y leer cada disparo. |
| N8 | Centinela y vigía; fuego/momia y tablas; puente móvil; guardianes y ascensor a llave; guardianes, ascensor y apoyos frágiles finales | Es una recombinación real. Muchos retos están sucesivos en lugar de actuar simultáneamente; eso facilita reconocerlos, pero limita la evidencia de que toda combinación aumente la exigencia. La entrada del acueducto sí demuestra dependencia fuerte del momento del salto. |

No se usaron los números `pressure` ni los textos `lesson` como prueba de dificultad alcanzada: son declaraciones en los datos. N5 arranca con una introducción localizada tras el jefe y el conjunto más amplio de enemigos de N4; por tanto la transición N4→N5 tampoco sustenta por sí sola una escalada continua. Una pausa de aprendizaje puede ser razonable, pero la dificultad progresiva debe describirse como una curva con descansos, no como un aumento uniforme ya probado.

## Hallazgos negativos conservados

### H1. El patrón periódico reduce el reto reactivo y debilita algunos finales

**Relevancia: media para el objetivo de diseño. Evidencia: ejecución reproducible.**

Con derecha mantenida y salto activado durante 58 fotogramas de cada 60, N5 parte 4 recoge la llave, abre su puerta y alcanza el siguiente tramo sin recibir impactos. N5 parte 5 alcanza `clear` en 484 pasos desde su aproximación segura, sin impactos ni muerte. No hay decisiones basadas en el estado del centinela ni uso voluntario de los refugios.

En N7, derecha y salto durante 28 de cada 30 fotogramas superan la primera parte, recogen su llave y abren la puerta sin impactos. El mismo patrón completa la quinta parte en 596 pasos con un impacto desde la posición central de prueba. Al desplazar esa posición ocho píxeles a izquierda o derecha, completa el final en 566 pasos sin impactos. Las nueve combinaciones examinadas de posición y fase temporal completan ese final, con cero o un impacto.

**Reproducción principal:** ejecutar `node targeted.js` desde `audit/`. Las entradas de cada paso son `[1, f % periodo < periodo - 2, 0]`, con `f` empezando en cero. Índices de nivel de la API: N5 = 4, N7 = 6. Se carga el nivel y se inicia; el personaje se sitúa en `x = zona.x0 + 51`, `y = 142`, velocidad inicial cero, `onGround = true`, `jHeld = false`, energía normal, sin invulnerabilidad añadida. Los estados finales y los fotogramas de impacto están en `targeted-results.json`.

**Sensibilidad:** `node sensitivity.js` usa `x = zona.x0 + 52 + offset`, con offsets −8, 0 y +8 y `simF` inicial 0, 30 y 90. En N5 parte 4 algunas variantes fallan al caer al líquido; en N5 parte 5 las de −8 fallan. Esos fallos permanecen en `sensitivity-results.json`: no se afirma que todo salto periódico funcione ni que N5 completo sea trivial.

**Interpretación limitada:** es una estrategia simple que evita reaccionar, no un salto fuera del mapa ni una prueba de falta de diversión. Llegar sin llave al final de otras partes del barrido NO se contó como superación. No hay una ruta completa de los cuatro niveles demostrada aquí. Aun así, estos casos debilitan que los respectivos finales evalúen lectura de avisos y mayor toma de decisiones.

### H2. La progresión recupera patrones de introducción y reduce castigo a mitad de nivel

**Relevancia: media. Evidencia: geometría y reglas; dificultad percibida inferida.**

N6 pasa de tablas sobre líquido en parte 2 a un ascensor sobre suelo continuo en parte 3. N7 vuelve a una base principalmente sólida al empezar su final tras el puente de la parte 4. N8 parte 4 tiene suelo continuo bajo sus guardianes y ascensor después del cruce móvil del acueducto. Los nuevos niveles repiten cuatro llaves, cuatro puertas separadoras y cuatro checkpoints, y cada parte ofrece una recarga próxima al inicio.

Esto favorece recuperación y orientación, pero produce una curva de descansos y picos. No justifica calificar la subida de dificultad como uniforme. Tampoco basta con contar enemigos: N5 usa seis centinelas, N6 un cráneo, N7 ocho vigías y N8 mezcla ocho enemigos de distintos tipos. Son especializaciones, no una escala comparable de dificultad.

**Reproducción:** `node inventory.js`; comparar `inventory.json`, mapas por parte, suelo de filas 10–11, objetos y mecanismos. Los 100 resultados de `adversarial-results.json` complementan el análisis, pero los fallos del patrón automático sobre líquido no prueban saltos injustos.

### H3. Los textos de aprendizaje por parte no llegan al jugador

**Relevancia: baja-media. Evidencia: código.**

Los 20 campos `lesson` describen instrucciones concretas —por ejemplo subir con el ascensor al balcón de la llave o esperar el puente móvil—, pero `buildLevel` no los propaga a las zonas y el renderizado del anuncio de parte solo usa etiqueta y numeración. Ningún consumidor de `lesson` aparece en el HTML. No se pueden acreditar esas lecciones como tutoriales visibles.

Sí existen avisos de primer centinela de N5, primera rotura de N6 y primer vigía de N7. Se activan por el mecanismo: el centinela da 55 fotogramas de aviso, el vigía prepara durante 45 y fija durante 24, y la tabla cae tras 60. La primera rotura se practica sobre suelo seguro. Estos son apoyos reales, aunque su comprensión espontánea no está validada.

**Reproducción:** buscar `lesson`, `buildLevel`, `e.tutorial`, `cr.tutorial` y `zoneName` en `index.html`; referencias principales: líneas 1677–1679, 2041, 2095, 2160 y 2581. No se afirma que el juego prometa mostrar todos los textos ni que todo mecanismo sea incomprensible.

## Resultados favorables y límites de robustez

- **Respawn:** los 16 checkpoints de N5–N8 se activaron por contacto; tras muerte por energía y reaparición el personaje quedó a `y = 142`, con suelo debajo. Tras 180 pasos adicionales inmóvil no hubo otra muerte ni daño de enemigo en ninguno de esos estados. La energía de aproximadamente 98,34 corresponde al drenaje normal. No acredita que un enemigo arrastrado desde un estado distinto nunca pueda amenazar un checkpoint.
- **Puertas:** las 16 bloquean sin llave y abren sus dos celdas verticales con una llave, consumiendo una unidad. Las paredes separadoras continúan hasta el techo. No apareció una vía evidente para saltarlas en la inspección; no se presenta como una prueba exhaustiva de ausencia de atajos.
- **Persistencia:** una recogida probada en cada nivel conserva la llave tras morir; después de abrir la puerta y volver a morir, la puerta sigue abierta y la llave sigue gastada. La combinación evita el caso incoherente de puerta cerrada con llave consumida. Son estados locales inyectados para probar la regla, no recorridos naturales hasta esos objetos.
- **Plataformas frágiles:** las muestras de N6, N7 y N8 pasan de `shaking` a `gone` después de 60 pasos, y todas las tablas quedan sólidas al reaparecer. El temporizador de desaparición es 170. No se probó cada transición posible entre varias tablas en movimiento.
- **Saltos:** el salto sostenido medido sobre suelo seguro dura 47 pasos, sube unos 63 píxeles y avanza 70,5 con velocidad horizontal máxima inicial. En las entradas examinadas de N5 parte 3 y N6 partes 2 y 4 se encontraron intervalos de salida de varios píxeles que aterrizan en apoyo, no un único fotograma viable. Los intervalos exactos están en `sensitivity-results.json`; son muestras a una fase temporal concreta.
- **Entrada móvil N8 parte 3:** con el borde del líquido en `x = 1824`, se probaron salidas entre 10 y 60 píxeles antes del borde y 16 fases iniciales, separadas 20 pasos. A fase 0 no aterriza ninguna de esas salidas en el puente; a fase 120 funcionan todas. `moving-entrance-results.json` contiene también las fases sin éxitos. Esto demuestra una necesidad real de sincronizarse. El fracaso a fase 0 es un fallo de esa entrada, no un bloqueo del nivel: esperar cambia la situación y hay suelo seguro antes del líquido.

## Observación visual

En las vistas de N5/N2 se comparte la arquitectura gótica, y en N7/N3 la ciudad nocturna. N6 introduce grandes relojes y cadenas; N8 un corazón luminoso dentro de maquinaria. La figura del jugador, sacos, HUD y plataformas conservan proporciones y tratamiento de píxel. Las grietas de las tablas frágiles se distinguían de los apoyos sólidos en la vista de N6. El líquido verde mantiene la misma señal de peligro.

El detalle de los fondos es alto y los guardianes de piedra de N5/N8 tienen menos contraste que el protagonista. Es una reserva visual sobre esas capturas, no evidencia de fallos de detección por jugadores. La coherencia es sólida, pero la reutilización de fondos hace que parte de la novedad dependa más de la geometría que del escenario.

Vistas reproducibles desde `http://127.0.0.1:8771/audit/render-preview.html?mode=`:

- `room:0:0`
- `room:1:2:0.5`
- `room:2:2:0.5`
- `room:2:0:0.5`
- `room:3:0:0.5`
- `room:4:2:0.5`
- `room:5:2:0.5`
- `room:6:4:0.5`
- `room:7:8:0.6`

Las capturas se observaron en el navegador; no se guardaron PNG en el expediente. `make-preview.js` conserva cómo recrearlas. No se revisó toda la animación, audio, cada dispositivo ni cada pantalla de instrucción.

## Reproducción del expediente y conclusión de confianza

Desde el directorio `audit/`, ejecutar por separado:

```text
node inventory.js
node adversarial.js
node targeted.js
node sensitivity.js
node moving-entrance.js
node make-preview.js
```

Los scripts usan exclusivamente el harness y el HTML de la copia y escriben sus resultados dentro de `audit/`. No hacen afirmaciones de completitud basadas en rutas de otro evaluador. Las entradas dirigidas y los barridos son pruebas adversariales, no sesiones humanas.

**Confianza global: media.** Alta en las reglas concretas verificadas, media en la diferenciación y coherencia visual, y limitada para afirmar una dificultad progresiva experimentada por personas. El resultado queda cerrado como esta única revisión: hay evidencia favorable suficiente para reconocer identidad y recuperación cuidadas, pero no para dar por alcanzada una progresión consistente. Se conservan los atajos de conducta, las inversiones de castigo, las rutas fallidas y las áreas no cubiertas; no se han aplicado cambios al juego ni se ha iterado para elevar una calificación.
