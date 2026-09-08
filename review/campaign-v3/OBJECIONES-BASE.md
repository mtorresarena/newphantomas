# Objeciones previas al rediseño

Base inspeccionada: `31d461028516344bc0dbb80b7ecd625296509014`, 2026-09-07. Rúbrica fijada antes de leer código en `CRITERIOS.md`. No se han leído informes con notas previas ni otras carpetas del proyecto padre. No se asigna nota ni se acepta una propuesta de implementación en esta fase.

Alcance: inspección de `index.html` y herramientas de comprobación; inventario ejecutado mediante `loadLevel` en el entorno de pruebas con DOM/canvas simulados. No se han ejecutado recorridos humanos, completado la campaña, medido tiempos de juego ni validado imágenes. Los números siguientes son estructura cargada, no calidad percibida.

## Lo que existe realmente

| Nivel | Columnas | Llaves / puertas | Enemigos cargados | Recargas / checkpoints | Jefe |
|---|---:|---:|---|---:|---|
| N1 | 177 | 2 / 2 | 17, cinco tipos | 1 / 3 | No |
| N2 | 312 | 3 / 3 | 33, siete tipos | 3 / 5 | No |
| N3 | 302 | 2 / 2 | 28, seis tipos | 2 / 5 | No |
| N4 | 377 | 3 / 3 | 45, ocho tipos | 3 / 6 | Sí |
| N5 | 256 | 4 / 4 | 6 centinelas (`K`) | 5 / 4 | No |
| N6 | 260 | 4 / 4 | Ninguno | 5 / 4 | No |
| N7 | 264 | 4 / 4 | 8 vigías (`Y`) | 5 / 4 | No |
| N8 | 300 | 4 / 4 | 3 centinelas, 3 vigías, 1 llama, 1 momia | 5 / 4 | No |

Inventario reproducible: `node review/campaign-v3/inventario-base.cjs`, salida en `inventario-base.json`. El script lee `index.html` del commit fijo con `git show`, evitando confundir la base con cambios simultáneos. La carga usa el harness actual inspeccionado; no se ha aislado un ejecutable completo de ese commit.

La expansión tiene menos tipos y ejemplares enemigos que los originales, y repite una organización fija de cinco partes. Esto respalda una objeción sobre uniformidad estructural. **No demuestra** que más enemigos mejoren el juego ni que N6 deba tenerlos: un buen nivel de plataformas puede aportar variedad sin combate.

## Objeciones que el rediseño debe resolver

### 1. La culminación de N8 todavía no existe

`index.html:700` marca el jefe de N4. El bloque N8 (`index.html:1466`) carece de jefe; `loadLevel` solo crea uno si `def.boss` existe (`index.html:1888`). El objetivo `S` llama a `levelClear` por contacto (`index.html:1992`), y la única restricción especial de `levelClear` es un jefe pendiente (`index.html:2010`).

**Criterio observable:** llegar legalmente al final de N8 debe activar el nuevo encuentro; tocar o aproximarse a la meta antes de derrotarlo no debe completar el nivel. Deben ejecutarse victoria, derrota/reintento y transición final. Conservar exactamente los jefes N4/N8; cierres N5–N7 sin jefe.

El jefe de N4 apunta al jugador y se daña haciendo que su proyectil alcance tres conductores; introduce una onda cuando queda un punto de vida (`index.html:2195–2315`). Un nuevo jefe que vuelva a apuntar y cargar tres receptores sería la misma solución con otro decorado. La diferencia ha de aparecer en cómo se obtiene una oportunidad de progreso y en la respuesta necesaria a cada fase.

### 2. Los cuatro cierres comparten la misma condición abstracta

Los objetivos `seal`, `gear`, `lens` y `heart` cambian nombre/apariencia, pero la resolución de todos se reduce a tocar el mismo tipo de objeto `S`. No hay estado persistente de un puzle específico en `loadLevel`, procesamiento de objetos o `levelClear` (`index.html:1852`, `1980–1992`, `2010`). Las aproximaciones espaciales varían, pero no se acredita por ello una regla de cierre distinta.

**Criterio observable:** para N5, N6 y N7, escribir regla, acciones relevantes, feedback y estados de fallo/reinicio; ejecutar soluciones correctas e incorrectas. Deben existir tres reglas jugables distintas. Una secuencia de interruptores con distinto número/orden en cada nivel sigue siendo una sola familia si exige la misma decisión.

### 3. Cinco partes no equivalen a cinco problemas

Las veinte partes nuevas repiten entrada con recarga, búsqueda de llave y puerta de transición; las últimas sustituyen la llave por la meta. Las lecciones se centran principalmente en saltar, cubrirse, subir y volver (`index.html:854–1653`). Hay variaciones geométricas auténticas, pero la repetición de dependencia llave→puerta sigue dominando la estructura.

**Criterio observable:** documentar al menos tres fases obligatorias distinguibles por nivel y al menos dos familias de decisiones. Mostrar qué cambia de una fase a otra y buscar una ruta que ignore la mecánica central. No aceptar como prueba cinco nombres de sala, cinco fondos o el mero contacto con cinco plataformas.

### 4. La duración activa continúa sin medir

Los niveles nuevos tienen 256/260/264/300 columnas. La mediana original es 307; la expansión puede ser más ancha que N1 y aun así sentirse más corta. No hay inferencia válida a minutos a partir del ancho. Cada nueva parte dispone de recarga (`E`), cuya función permite esperar hasta recuperar energía (`index.html:1990`); ese tiempo tampoco demuestra contenido.

**Criterio observable:** entregar recorridos legales y homogéneos comparables, con acciones significativas, segmentos de espera, desplazamiento vacío y repeticiones tras muerte separados. Aplicar los umbrales comparativos previamente fijados; si falta la referencia de N1–N4, marcar duración comparativa no demostrada. Más puertas, pasillos o ciclos obligatorios del jefe no bastan para mejorar la duración activa.

### 5. La variedad enemiga está aislada por nivel

N5 utiliza solamente `K`, N7 solamente `Y` y N6 no utiliza enemigos. N8 combina dos comportamientos nuevos con dos anteriores. El centinela obliga potencialmente a provocar/esquivar una carga; el vigía a abandonar el punto que fija (`index.html:2027–2136`). Son dos respuestas distinguibles, pero contar sus apariciones no demuestra que ambas sean necesarias en una ruta.

**Criterio observable:** registrar encuentro, estímulo, ataque, señal y respuesta viable por comportamiento. La variedad puede proceder de nuevos enemigos o combinaciones que obliguen a responder de otra manera, no de aumentar la cantidad. Si el jugador puede ignorarlos en refugio o mantener una única política de salto en toda la campaña, los sprites distintos no resuelven la objeción.

### 6. Las herramientas existentes verifican propiedades más estrechas que la experiencia

- `tools/check-levels.js` elimina enemigos, repone energía, alarga el amanecer, mueve al jugador entre estados de búsqueda y abre puertas; para el jefe abre la salida tras alcanzar conductores. Es útil para geometría, pero no acredita una partida completa ni duración o dificultad.
- `tools/check-expansion-structure.js` obliga a cinco salas, geometrías/nombres únicos y cuatro llaves/puertas. Una implementación muy uniforme puede superar esas condiciones. Su comparación de N1–N4 comprueba datos de mapas, no regresiones en el motor compartido.
- `tools/check-expansion-routes.js` reproduce entradas con el bucle real y comprueba muerte y fin; esa es una evidencia útil si se ejecuta. Sin embargo, contacto con tablas, tiempo sobre plataformas, cargas visibles y proyectiles disparados no demuestran decisiones obligatorias ni respuesta consciente a señales. No he leído ni reproducido sus rutas almacenadas.
- `tools/check-required-mechanics.js` quita apoyos y comprueba geometría por sala aislada. Puede probar dependencia espacial de esos apoyos, pero no justicia ni variedad cognitiva.
- `tools/check-respawn-progress.js` conserva inventario/checkpoint tras muertes inyectadas. No demuestra completabilidad desde todos esos estados después de reaparecer.
- `tools/route-harness.js` no incluye `boss` en sus snapshots. Si el nuevo planificador o una prueba futura usa `save/restore` durante el jefe, no estará restaurando el estado completo del encuentro. Hay que corregirlo o excluir explícitamente ese uso antes de confiar en replays de combate.

**Criterio observable:** etiquetar cada resultado por su alcance y no sumar pruebas geométricas como si fueran partidas. Los replays de completabilidad deben partir de una carga limpia y aplicar entradas de control, conservando daño, energía, enemigos, mecánicas y jefe. Los montajes de estado se reservan para casos de borde y se reportan aparte.

### 7. La recuperación debe ampliarse a los nuevos estados

La recuperación actual conserva llaves/puertas/items y restaura tablas, proyectiles y ciertos enemigos (`index.html:1943–1956`). El jefe se reinicia con `hp=3` fijo (`index.html:1949`). Al añadir puzles y un jefe distinto, reutilizar esta lógica sin contratos explícitos puede crear inconsistencias de interruptores, plataformas, salidas o recursos. Es un riesgo del cambio, no un bloqueo demostrado de la base.

**Criterio observable:** probar muerte antes/después de cada cambio irreversible, reinicio desde cada fase del jefe, último golpe simultáneo a muerte del jugador, salida bloqueada y reentrada. Definir qué progreso se conserva y comprobar que cada estado puede completarse sin intervención. Actualizar reinicio a los datos/contrato del nuevo jefe sin alterar el de N4.

### 8. La coherencia visual queda sin evidencia en esta inspección

La presencia de renderizadores para centinela/vigía y un dibujo de jefe no prueba que las señales sean legibles durante acción. No he abierto capturas ni reproducido la versión gráfica. No procede aprobar ni objetar colores o calidad de assets desde este inventario.

**Criterio observable:** capturas dentro del juego de presentación, acción, fallo recuperable y cierre de N5–N8, además de cada fase del jefe. Deben mostrar pistas completas dentro de cámara, feedback de puzle, estado de vulnerabilidad/ataque y HUD sin solapamientos; comprobar resoluciones admitidas y comparar con N1–N4.

## Lo que falta para la revisión posterior

Un commit de implementación fijo, tabla de nuevas reglas y rutas, entradas reproducibles sin ayudas, matriz de fallos/recuperación, evidencia de ambos jefes y capturas reales. La nota futura será técnica y llevará límites de cobertura. Que se cumpla un umbral interno no reemplaza la aceptación del usuario; las sensaciones de duración, monotonía, dificultad y satisfacción seguirán sin validación humana.
