# Referencia comparable de la campaña original

Base fija: `31d461028516344bc0dbb80b7ecd625296509014`. Se conservan `index-base-31d4610.html` y `route-harness-base.cjs`, obtenidos con `git show`. No se utilizan notas ni testigos anteriores. Todos los archivos nuevos están en esta carpeta y no modifican el juego.

## Dos capas de evidencia que no deben mezclarse

1. `geometria-base.json`: inventario homogéneo N1–N8, obtenido cargando los mapas base en el mismo harness. Incluye columnas, distancia horizontal mínima hasta el objetivo, puertas, llaves, recargas, apoyos móviles, amenazas y familias de reglas disponibles. Es **estructura**, no una ruta, duración humana ni número de decisiones obligatorias.
2. `ruta-base-n1.json`, `ruta-base-n2.json`, `ruta-base-n3.json`: secuencias de entradas obtenidas con búsqueda acotada y reproducidas desde una nueva VM. El campo `complete` distingue recorridos completos de prefijos. Un `false` o una búsqueda agotada **no prueba que el nivel sea imposible**.

El buscador usa snapshots para explorar, pero la validación crea una VM nueva y aplica solamente controles. Conserva enemigos, energía, daño, colisiones, puertas y temporizadores de producción. No teletransporta al personaje ni le regala llaves, vida o invulnerabilidad en el replay. Las pistas espaciales orientan la búsqueda hacia plataformas y ascensores; no son posiciones asignadas al jugador.

No se busca N4 con este planificador porque el harness base omite el estado del jefe en snapshots. N4 conserva referencia geométrica y de reglas, pero carece de recorrido legal en esta ronda. Este límite impide calcular una mediana de duración/acciones de **los cuatro** niveles originales.

## Reproducción

Desde la raíz del repositorio:

```text
node review/campaign-v3/geometria-comparable.cjs
node review/campaign-v3/replay-base.cjs review/campaign-v3/ruta-base-n1.json
node review/campaign-v3/replay-base.cjs review/campaign-v3/ruta-base-n2.json
node review/campaign-v3/replay-base.cjs review/campaign-v3/ruta-base-n3.json
```

`replay-base.cjs` exige concordancia de duración y estado final, y ausencia de muertes/pérdidas de vida. Un resultado correcto para un prefijo únicamente verifica ese prefijo. `buscar-base.cjs N limite` permite repetir la búsqueda, aunque las pistas y el límite de nodos son sesgos explícitos del controlador. La ruta guardada, más que el coste de búsqueda, es el testigo reproducible.

Para un inventario del rediseño, `geometria-comparable.cjs ruta-html ruta-salida-json` acepta otro HTML con la API de pruebas compatible. La misma definición se aplica a cada nivel; cualquier incompatibilidad debe resolverse y documentarse antes de comparar. No comparar tiempos parciales de un nivel con tiempos completos de otro.

## Métricas de cada replay

| Campo | Qué mide | Qué no demuestra |
|---|---|---|
| `frames`, `simulatedSeconds` | Pasos de simulación realmente reproducidos; 60 pasos/s | Minutos de aprendizaje o duración humana |
| `jumps` y evento `jump` | Inicio de velocidad ascendente de salto, tras estado no ascendente; excluye empujones de daño de menor velocidad | Número de decisiones diferentes o saltos necesarios |
| `directionChanges` | Inversiones no nulas del control horizontal; pausas no reinician dirección previa | Exploración significativa; puede ser oscilación del planificador |
| `idleInputFrames` | Sin dirección ni botón de salto | Inactividad física: el personaje puede seguir cayendo, deslizarse o ser transportado |
| `stationaryFrames` / `movingFrames` | Sin/con desplazamiento observado del personaje | Tiempo vacío frente a acción significativa; esperar un ataque puede ser una decisión |
| `chargingFrames` | Frames con recarga efectiva | Contenido adicional o espera obligatoria mínima |
| `hits`, `minEnergy` | Daños y reserva mínima del testigo | Dificultad justa o tasa de éxito humana |
| `keys`, `doors` | Cambios netos de inventario por frame; eventos con posición y energía | Nuevos tipos de puzle por cada llave |
| `distancePx` | Suma del desplazamiento horizontal absoluto | Longitud óptima o tiempo mínimo |
| Eventos `zone`, `checkpoint` | Transiciones y puntos activados por contacto real | Completabilidad desde cualquier estado de recuperación |

Las métricas de espera/recarga/movimiento **se solapan**: no sumar ni restar todas para fabricar un tiempo activo. `stationaryFrames` y `movingFrames` sí particionan los frames, pero solo describen movimiento. El método de salto es una inferencia del estado físico y tiene que revisarse si cambian las constantes o se añaden impulsos. Los eventos de llaves/puertas necesitan instrumentación separada si un rediseño permite recoger y consumir en el mismo frame.

## Comparación exigible para duración activa y decisiones

1. Disponer de recorridos completos legales para N1–N4 y N5–N8. Registrar versión del motor, entradas, semilla si afecta al gameplay, recursos y política del controlador.
2. Reproducir al menos tres veces con condiciones idénticas para estabilidad determinista; esas repeticiones no son tres jugadores. Añadir variantes de temporización/control con resultado y fallos, sin presentar la proporción como éxito humano.
3. Aplicar la misma política de búsqueda/optimización a ambos grupos. Si unos recorridos están cuidadosamente optimizados y otros conservan rodeos del buscador, no son una referencia homogénea de duración.
4. Dividir la ruta en fases obligatorias con eventos observables. Clasificar cada segmento como desplazamiento sin amenaza, ejecución bajo amenaza, interacción con cambio de estado, espera por mecanismo, recarga, retorno obligado, opcional o repetición tras fallo. Dar reglas de clasificación y revisar segmentos ambiguos; el contador de frames no hace esta interpretación.
5. Contar por separado las **familias de decisión** efectivamente exigidas: orden/estado, interpretación de pista, posición frente a patrón, sincronización, recurso, ruta/riesgo. Repetir una acción veinte veces no crea veinte familias. Contrastar una ruta alternativa que intente omitir cada mecánica central.
6. Comparar medianas y rangos de ejecución, esperas y acciones significativas. Solo con cobertura homogénea aplicar el umbral de la rúbrica para N5–N7 ≥80% y N8 ≥100% de la mediana N1–N4. Sin N4 completo o sin fases clasificadas, mantener esa barrera **no demostrada**.
7. Publicar límites: no hay evaluación humana, aprendizaje, disfrute, percepción de justicia ni satisfacción del cierre. No convertir una nota técnica o un replay en aprobación definitiva del usuario.

## Lectura estructural inicial

N1–N4 tienen 177/312/302/377 columnas, 2/3/2/3 puertas y 5/7/6/8 tipos enemigos. Incluyen 3/4/5/2 plataformas móviles, respectivamente. La expansión base tiene 256/260/264/300 columnas y cuatro puertas en cada nivel. Estos datos contradicen usar únicamente cuatro puertas o cinco nombres de parte como garantía de contenido equivalente. No autorizan concluir que aumentar enemigos o ancho mejorará la experiencia.

Se mantiene un registro de resultado acotado en `RESULTADO-REFERENCIA.md`. No se puntúa la implementación en curso.
