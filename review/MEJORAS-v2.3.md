# Mejoras tras el contraste técnico y corrección del Custodio

## Fallo de cámara comunicado durante el trabajo

La cámara se fija en la arena mientras el Custodio está activo. Las puertas anteriores solo tenían colisión en las dos filas inferiores: saltando desde las plataformas laterales se podía salir por ambos extremos, dejando el combate activo fuera de vista.

Las puertas ahora cierran las filas 1–9 y tienen barrotes visibles hasta el techo, tanto con PixiJS como con Canvas. Al morir se abre la entrada y se reinicia el jefe; al derrotarlo se abre toda la salida. Una protección adicional devuelve al interior una posición inválida durante el combate. El jefe deja de actualizar sus ataques durante la animación de muerte del jugador.

`tools/check-boss-boundaries.js` reproduce ambas fugas en el HTML anterior y comprueba que quedan bloqueadas en el actual. También comprueba recuperación de posición inválida, reaparición y salida tras la derrota. Datos: `boss-boundaries-v2.3.json`. Imagen: `custodio-barreras-v2.3.png`.

## Respuesta a los hallazgos del revisor

| Hallazgo | Cambio | Alcance demostrado |
| --- | --- | --- |
| N5 partes 4–5 y N7 inicio/final superables con derecha y saltos periódicos | Balcones superiores con acceso desde la derecha y regreso hacia la llave o el trofeo; los muros y apoyos dejan visible el recorrido | Los 36 casos locales repetidos pasan de 30 éxitos a cero; existen recorridos completos con entradas normales |
| Reducción de exigencia al introducir ascensores o llegar a la guardia | N6 parte 3 termina con descenso por tablas y piedra sobre líquido; N8 parte 4 encadena guardianes, ascensor y tablas hasta la llave; N7 final exige recorrer la zona elevada del vigía | Los recorridos ejercitan los mecanismos y las comprobaciones geométricas contrastan su necesidad |
| Las 20 instrucciones `lesson` no se mostraban | Se conservan en las zonas, aparecen en la entrada segura y están disponibles al pausar, incluso en las transiciones | Inspección de entrada y pausa, más barrido gráfico; imagen `ayuda-pausa-v2.3.png` |

La instrucción de entrada dura hasta cinco segundos y desaparece al abandonar la zona segura; el menú de pausa permite leerla sin límite de tiempo. Los avisos de ataques conservan su espacio propio. La tipografía, personajes, fondos y recursos artísticos se mantienen.

Durante la validación se corrigieron techos demasiado bajos. También se añadieron apoyos de recuperación en las orillas secas: una caída que no mata no debe dejar al jugador sin acceso al objetivo. Se comprueban cinco retornos locales con la física real, aislando la geometría; datos en `dry-floor-recovery-v2.3.json`.

## Evidencia técnica y reproducción

Desde la raíz del proyecto:

```text
node tools/check-boss-boundaries.js
node tools/check-periodic-shortcuts.js
node tools/check-expansion-structure.js
node tools/check-expansion-reachability.js
node tools/check-required-mechanics.js
node tools/check-dry-floor-recovery.js
node tools/check-expansion-routes.js
node tools/check-respawn-progress.js
```

Los controles anteriores se leen de `baselines/index-v2.2.txt`, una copia íntegra del HTML auditado, SHA-256 `b9abdc1141247d6eb2f7535342e3600382752a0a6dae794e848a2d800209b368`. Los informes originales y la revisión ciega se conservan sin modificar su dictamen.

- 20 partes con entradas seguras; los datos de N1–N4 coinciden con el commit `749c72a`. N4 sí recibe la corrección de la lógica y dibujo de sus barreras.
- N5–N8: todas las metas y objetos accesibles, sin puertas pendientes en el análisis geométrico de la versión final. Resultados y hash del HTML en `reachability-v2.3.json`.
- 14 controles emparejados de mecanismos: objetivo accesible con el apoyo y no accesible al retirarlo. Son comprobaciones geométricas, sin enemigos.
- 32 muertes provocadas tras recogidas de llave o aperturas de puerta: inventario y checkpoint conservados.
- Las 23 pruebas de motor pasan. N4 conserva acceso a su meta después de la corrección de la arena.
- Barrido gráfico de 106 vistas con PixiJS y de 106 con Canvas, alternando ambos aspectos, sin errores registrados. Es una prueba de renderizado, no una partida humana ni una inspección estética exhaustiva de cada fotograma.

Recorridos completos reproducidos con enemigos, energía, puertas, plataformas y colisiones activos. Solo se reproducen teclas desde el inicio del nivel, sin teletransportes, curaciones artificiales ni invulnerabilidad añadida:

| Nivel | Tiempo del recorrido | Muertes | Energía mínima |
| --- | ---: | ---: | ---: |
| N5 | 48,4 s | 0 | 65,9 |
| N6 | 54,0 s | 0 | 85,8 |
| N7 | 56,7 s | 0 | 11,1 |
| N8 | 63,4 s | 0 | 46,6 |

Secuencias en `route-n5-v2.3.json` a `route-n8-v2.3.json`; datos del replay en `continuous-routes-v2.3.json`. El planificador usa objetivos intermedios para buscar ascensores y accesos a balcones; eso guía la búsqueda, no altera el estado de la partida reproducida. N7 termina con poco margen en esa secuencia y no se presenta como una demostración de dificultad ideal. Los enchufes permiten recuperar energía mediante contacto normal.

## Límites de la conclusión

Se elimina el automatismo concreto detectado de avanzar y repetir saltos. Eso no prueba que cada enemigo obligue a leer sus avisos: una ruta memorizada puede seguir resolviendo encuentros. No se ha cambiado la IA para castigar arbitrariamente el salto repetido.

La progresión combina aprendizajes con retos posteriores y conserva descansos; no se certifica una dificultad humana estrictamente creciente. Esta ronda es técnica por petición del usuario y no tiene una nueva nota de un revisor independiente. No se atribuye un 9,5 ni se reutiliza la nota anterior para los cambios nuevos.

Los cambios de esta ronda permanecen locales. No se ha hecho commit, push ni despliegue.
