# Revisión del constructor — v2.1

Base revisada: `23f5568`, después de la ampliación de ocho niveles y los enemigos K/Y.

## Hallazgos y cambios

- Centinela, Vigía y Custodio utilizaban formas vectoriales que desentonaban con los atlas originales. Se incorporan doce poses de pixel art con escala y apoyo comunes por personaje, transparencia real y señales de preparación/recuperación.
- N5–N8 reutilizaban los fondos del castillo, biblioteca y tejados con tintes. Se añaden cuatro fondos propios: jardín de estatuas, torre mecánica, observatorio y cámara del corazón. Los originales siguen como respaldo si el recurso nuevo no carga.
- Se retiran filas de estatuas y ventanas que flotaban sin apoyo y se reduce la repetición de campanas y escudos. Se conserva la geometría de plataformas y puertas.
- Primera presentación de plataformas frágiles en N6: se retira el guardia de suelo. Segunda práctica de Centinela en N5: se retira la calavera de su misma zona; permanece el murciélago superior.
- Plataformas agrietadas usan ahora el material pixel art de las plataformas adyacentes, manteniendo sus grietas y avisos.
- El HUD del Custodio pasa a dibujarse después de la oscuridad del mundo, para que sus segmentos sean legibles.
- Pedestales de conductores reciben relieve y señal de carga; las cuatro nuevas metas comparten el acabado de la expansión.
- Centinela comprueba línea de visión completa y no inicia una carga si termina el aviso fuera de cámara.
- Vigía comprueba visibilidad y cobertura antes del disparo; máximo cuatro orbes globales y uno activo por propietario.
- Los orbes comprueban su volumen completo en pasos cortos contra muros: ya no basta que pase el centro por fuera de una esquina. Se retiran al salir de la zona visible.
- Reaparición limpia velocidad/estado residual de los nuevos enemigos y conserva el vaciado de proyectiles.
- `levelClear` requiere juego activo, impide saltarse el Custodio y no vuelve a contabilizar un cierre ya realizado.
- El truco Alt+N invalida récord mediante el mecanismo existente de continuaciones, ignora repetición de tecla y no vuelve a N1 al usarlo desde pausa. No se ha retirado el acceso de prueba que añadió el constructor.

## Evidencia

- 22 pruebas de motor correctas. Cuatro nuevas regresiones cubren cobertura/cámara, esquinas de proyectiles, límites de orbes y cierre del museo.
- Recorridos de N1–N8 comprobados: 1108 / 2071 / 1939 / 2585 / 1380 / 1527 / 1466 / 1495 estados alcanzados. Metas, llaves y puertas pasan.
- El verificador geométrico abstrae el combate solo después de alcanzar los tres conductores. El encuentro se comprueba además con su prueba de máquina de estados. No se ha quitado el requisito del jefe del juego para hacer pasar el BFS.
- 72 vistas renderizadas en ambos aspectos con PixiJS activo; se incluyen los 28 segmentos de N5–N8, metas y poses de enemigos.
- Las mismas 72 vistas comprobadas con el script PixiJS excluido: Canvas sin PixiJS.
- Inspección de capturas de jardín de estatuas, torre, observatorio, corazón, jefe y catálogo de enemigos. Consola sin errores durante las revisiones.

## Límites de la revisión

Las pruebas geométricas no equivalen a una partida humana completa sin daño ni demuestran todas las combinaciones temporales posibles de plataformas. El test del jefe coloca al jugador en posiciones de conductor para aislar sus estados; no es una prueba de completar toda la arena con entradas de teclado. No se ha probado en un iPhone físico ni medido rendimiento allí.

No se ha rehecho el trazado entero de los cuatro niveles. Se conserva el trabajo del constructor y se corrigen los problemas observados de presentación, seguridad de introducciones y lógica.

## Reproducción

- Juego: servidor local en esta carpeta, puerto 8770.
- Revisión: `tools/visual-check.html?sweep=1`.
- Respaldo: `tools/visual-check.html?sweep=1&renderer=canvas`.
- Capturas: `?capture=expansion-enemies`, `?capture=boss`, `?capture=zone:statues`, `?capture=zone:clocktower`, `?capture=zone:observatory`, `?capture=goal:7`.
- Motor: `node tools/check-levels.js -1`.
- Recorridos: `node tools/check-levels.js` o índice individual 0–7.

## Recursos

Generados con la herramienta integrada `image_gen`, sin CLI/API de pago configurada. Recursos finales en `assets/`; la preparación de alfa está en `tools/prepare-expansion-assets.py`. La limpieza por código cuenta con la autorización previa del usuario en esta conversación.

- `assets/expansion-enemies-v2.png`: doce poses; `expansion-frames.js` contiene recortes medidos.
- `assets/expansion-props-v2.png`: sello, engranaje, lente y corazón; recortes en `expansion-prop-frames.js`.
- `assets/expansion-art.js`: renderizado compartido por Canvas y la capa de mundo usada en PixiJS.
- `assets/world-expansion.png`: cuatro fondos, cuadrícula 2×2, bordes interiores recortados al dibujar.
- Prompts y referencias: `assets/EXPANSION-ART-v2.1.md`.

El estado de publicación debe comprobarse en Git y Dokploy; este informe no implica por sí mismo push ni despliegue.

Capturas finales en esta carpeta: `estatuas-v2.1.jpg`, `reloj-v2.1.jpg`,
`observatorio-v2.1.jpg`, `corazon-v2.1.jpg`, `custodio-v2.1.jpg` y `enemigos-v2.1.jpg`.
