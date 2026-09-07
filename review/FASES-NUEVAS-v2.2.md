# Revisión de las fases nuevas — v2.2

## Problema y resultado

La versión 2.1 mejoraba el arte, pero sus fases nuevas repetían cinco salas de
44 columnas, sin cambios de nombre o ambiente dentro del nivel. Las mecánicas
nuevas podían evitarse recorriendo el suelo. La revisión independiente inicial
otorgó 4,8/10 al cumplimiento de este encargo específico.

Se han diseñado veinte partes distintas. Cada fase tiene cinco partes con nombre
propio y cuatro pasos con llave. Las puertas no cuentan como partes adicionales:
mantienen el nombre e indicador de la parte que termina. Al entrar aparece el
nombre y «PARTE n / 5»; bajo N5–N8 quedan cinco marcas de progreso.

## Recorrido diseñado

| Fase | Parte 1: entrada | Parte 2: práctica | Parte 3: variación | Parte 4: combinación | Parte 5: prueba final |
| --- | --- | --- | --- | --- | --- |
| N5 | Paseo olvidado: leer una carga y usar un bloque | Patio de piedra: dos patrullas separadas por columnas | Canales verdes: dos charcas con isla de descanso | Claustro hundido: carga, canal y subida | Altar de bronce: guardia y escalera de islas sobre ácido |
| N6 | Taller del reloj: tablas frágiles con suelo de recuperación | Puente del péndulo: tablas necesarias e isla estable | Pozo de pesas: ascensor necesario hasta la llave alta | Campanas rotas: puente móvil seguido de tablas | Maquinaria mayor: ascensor, balcón alto y puente frágil |
| N7 | Archivo estelar: aviso del vigía y cobertura segura | Galería de los rayos: alternar dos líneas de tiro | Terrazas lunares: cobertura y disparos a distinta altura | Paso de las órbitas: refugio antes del puente | Cúpula de la lente: cobertura horizontal/vertical y último cruce |
| N8 | Umbral: centinela y vigía, habilidades ya conocidas | Forjas: fuego, tablas y momia separados en el recorrido | Acueducto: recarga y combinación de puente móvil/tablas | Guardia del núcleo: carga, cobertura y ascenso | Corazón: orden distinto de amenazas, cobertura alta, ascensor y puente final |

Los campos `lesson` y `pressure` de la fuente documentan intención de diseño;
`pressure` es una escala relativa del autor, no una puntuación medida ni la nota
del revisor. La dificultad crece mediante decisiones, alturas y combinaciones,
sin subir arbitrariamente daño o velocidad de los enemigos. Se conserva una zona
de recuperación al comienzo de cada parte y una isla estable donde se necesita
esperar un mecanismo.

## Cambios tras la revisión independiente

- El último tramo de N8 dejó de repetir las primeras cuarenta columnas de la
  Guardia del núcleo. Ahora invierte el orden de amenazas, cambia alturas y
  distancias y termina con un ascensor y un puente más largo. Mide 76 columnas.
- El aviso de tablas frágiles se activa al pisar cualquier tile del primer puente
  de práctica, una sola vez; ya no depende de caer sobre el primer tile.
- Las pruebas registran contactos con ascensores y tablas por parte, además de
  cargas visibles y orbes realmente disparados.
- Se añadieron dos cámaras intermedias para cubrir sin huecos el tramo final más
  largo. La galería incluye entrada, centro y salida de las veinte partes.

## Evidencia reproducible

```text
node tools/check-levels.js
node tools/check-expansion-structure.js
node tools/check-expansion-routes.js
node tools/check-required-mechanics.js
```

1. **23 pruebas de motor.** Incluyen combate, colisiones, puertas, plataformas,
   reaparición y regresión del aviso en el último tile de práctica.
2. **Mapas originales preservados.** El test compara N1–N4 con `749c72a` mediante
   igualdad de todos sus datos. Comprueba veinte nombres y geometrías únicos,
   cuatro ambientes como mínimo por fase, llaves locales y entradas seguras.
3. **Reaparición real en veinte entradas.** El bucle completo ejecuta respawn y
   mantiene al jugador quieto tres segundos, también después de agotarse la
   invulnerabilidad; exige más de 95 de energía y ninguna muerte.
4. **Cuatro rutas continuas.** Los JSON `route-n5-v2.2.json` a `route-n8-v2.2.json`
   guardan exclusivamente secuencias de entradas de diez frames. El verificador
   vuelve a empezar el nivel y las reproduce con el bucle real: enemigos, cámara,
   energía, llaves, puertas y temporizadores. No teletransporta, cura, retira
   enemigos, concede invulnerabilidad ni abre puertas manualmente.
5. **Trece controles geométricos pareados.** Cada objetivo local se alcanza en su
   configuración normal y deja de alcanzarse cuando se retira el tipo de soporte
   requerido. Resultado en `required-mechanics-v2.2.json`.
6. **Galería PixiJS y Canvas.** `tools/visual-check.html?sweep=1` y
   `?sweep=1&renderer=canvas`; 106 vistas en ambos aspectos. Las láminas
   `partes-n*-entrada/centro/salida-v2.2.jpg` cubren las veinte partes; dos capturas
   grandes completan el recorrido del último tramo de N8.

| Ruta automática continua | Tiempo de esa ruta | Energía mínima | Muertes |
| --- | ---: | ---: | ---: |
| N5 | 46,7 s | 53,5 | 0 |
| N6 | 51,8 s | 85,4 | 0 |
| N7 | 48,1 s | 69,2 | 0 |
| N8 | 59,2 s | 70,8 | 0 |

Estos tiempos pertenecen a entradas calculadas, no estiman lo que tardará una
persona. Las rutas buscan la meta: no reclaman recoger todo el botín. La búsqueda
geométrica comprueba por separado la accesibilidad de todos los objetos.

`continuous-routes-v2.2.json` contiene las métricas por parte. N8 termina con
carga visible, un orbe disparado, contacto con ascensor y con tablas frágiles.

Para recalcular una ruta, `node tools/plan-expansion-route.js 4` usa índice 0-based;
cambiar 4 por 5, 6 o 7 para los demás niveles. El planificador puede tardar varios
minutos; usa búsqueda acotada y objetivos intermedios de entrada al ascensor y
balcón. Esos objetivos guían entradas, no modifican el estado del juego.

## Límites y publicación

Las pruebas de búsqueda tienen resolución finita: ofrecen evidencia de recorrido,
no una demostración matemática de todas las rutas posibles. Las rutas continuas
acreditan partidas viables con esas entradas, no una dificultad universal para
jugadores humanos ni para todas las variaciones de control. No se ha realizado
una sesión de juego con participantes externos ni probado un iPhone físico.

La valoración y sus descuentos pertenecen al informe independiente
`REVISOR-FASES-v2.2.md`. Este informe no supone commit, push ni despliegue.
