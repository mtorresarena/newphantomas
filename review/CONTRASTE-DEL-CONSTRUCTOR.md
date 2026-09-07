# Comprobaciones adicionales del constructor

Estos resultados pertenecen al constructor, no al revisor ciego. No se le
transmitieron durante su evaluación y no se usan para modificar su calificación.
El juego permanece congelado: no se corrige entre comprobaciones para obtener
una nota deseada.

## Sensibilidad temporal de las rutas anteriores

Protocolo previo: `PROTOCOLO-CONTRASTE-TECNICO.md`.
Código: `../tools/check-route-timing.js`.
Datos: `route-timing-sensitivity.json`.

| Nivel | Mismas entradas, con nueve esperas iniciales | Llegan a meta | Mueren | Terminan las entradas sin alcanzar meta |
| --- | --- | ---: | ---: | ---: |
| N5 | 0–120 frames, pasos de 15 | 9 | 0 | 0 |
| N6 | 0–120 frames, pasos de 15 | 1 | 4 | 4 |
| N7 | 0–120 frames, pasos de 15 | 9 | 0 | 0 |
| N8 | 0–120 frames, pasos de 15 | 1 | 8 | 0 |

Los cuatro controles de cero frames llegan a la meta. Las otras ejecuciones
mantienen exactamente las entradas calculadas previamente: no observan ni
reaccionan a cambios de fase de ascensores o puentes.

**Conclusión limitada:** los recorridos anteriores acreditan que existe una
partida viable, pero en N6 y N8 dependen de su estado temporal. No acreditan una
tolerancia general a errores o esperas. Estas cifras no son tasas de éxito de
personas ni prueban por sí mismas un defecto: los mecanismos móviles requieren
adaptar el salto y una persona puede hacerlo. No se deriva ninguna nota de ellas.

## Muerte después de cambios de inventario

Código: `../tools/check-respawn-progress.js`.
Datos: `respawn-progress-audit.json`.

Se recorren las secuencias reales anteriores y se captura el estado justo tras
recoger cada llave o abrir cada puerta. En cada estado se provoca una muerte por
energía y se ejecuta el proceso real de reaparición. Se comprueban las llaves
conservadas, puertas abiertas, objetos restantes y checkpoint. Después se
restaura la instantánea solo para continuar la prueba hasta el siguiente caso.

**Resultado: 32/32 casos pasan.** Esto respalda la consistencia del inventario
ante esos errores concretos. No demuestra que todas las posiciones de muerte
posibles sean recuperables ni sustituye una partida humana.

## Alcance

Las pruebas automáticas resultan útiles cuando hacen afirmaciones estrechas y
reproducibles. No convierten una valoración subjetiva en una certificación ni
permiten deducir motivaciones del primer revisor. Esta ronda es exclusivamente
técnica por elección del usuario.
