# Comprobación independiente de correcciones — round6

2026-09-08. Fuente: `round6/index.html`, SHA-256 comprobado `5963bcc02f71090a958df9737eca2b8fd5a96ed0a615f4a9dcbe4be4dc04ef21`. Alcance acotado: inicialización óptica, rotulación implementada y enseñanza nueva. No se modificó producción ni se revisaron puntuaciones de otros agentes. No se atribuye completabilidad a rutas de candidatos anteriores.

**La receta universal de girar todos los espejos una vez está corregida en los circuitos avanzados.** Las letras que nombran las pistas se dibujan ahora sobre los espejos. Se incorpora una indicación de pisotón junto al primer escarabajo. Queda una mejora menor de redacción.

## Comprobación óptica propia

`contraste-optica-round6.cjs` enumera todas las configuraciones de cada circuito con `mirrorTrace`; salida en `contraste-optica-round6-evidencia.json`. Es una prueba unitaria con ángulos fabricados, no un recorrido legal ni una prueba visual.

| Circuito | Inicio | Solución única | Espejos que deben girar |
|---|---|---|---|
| N7 1-1, tutorial | 0,0 | 1,1 | A,B |
| N7 2-2 | 0,1,1 | 1,1,0 | A,C |
| N7 3-1 | 1,0,0 | 0,0,1 | A,C |
| N7 4-2 | 0,1,0 | 0,0,1 | B,C |
| N7 5-1 | 0,1,1 | 1,1,0 | A,C |
| N7 5-2 | 1,0,1,1 | 1,1,0,1 | B,C |
| N8 3-1 | 1,0,0 | 0,0,1 | A,C |
| N8 5-2 | 1,0,1,1 | 1,1,0,1 | B,C |

Ninguno de los ocho empieza resuelto. Cada uno conserva exactamente una solución. «Girar todos una vez» solo resuelve el tutorial; falla en los siete avanzados. Por tanto, las variantes de trayecto óptico incorporadas en round5 ya no se pueden completar todas con aquella receta ciega. Este cambio añade selección de espejos que corregir; no necesita más pulsaciones para aportar valor.

No demuestra que desaparezca toda estrategia memorizada ni que el jugador entienda el haz. Es una mejora concreta del problema probado, sin elevarla a evidencia humana. Los recorridos actuales deben validar que visitar solamente los espejos necesarios permite completar las nuevas salas.

## Rotulación y enseñanza

- `drawCampaign`, línea 3708 del candidato congelado, dibuja `n.id` sobre cada espejo dentro de una plaquita oscura. La rama de espejo antes omitía esas letras. La asociación A/B/C/D utilizada por las pistas queda implementada. No he comprobado su legibilidad mediante una captura de este candidato.
- `updateCampaignFoes`, línea 3655, añade `ESCARABAJO: PUEDES PISARLO` cuando el jugador se aproxima al escarabajo de la primera parte de N5 y no hay otra indicación de interacción. Presenta la respuesta especial sin obligar a matar por cumplir una métrica. No se ha medido que un humano la lea o la aplique.
- P2 menor de redacción: `campaignLesson`, línea 3749, conserva «Abajo gira cada espejo». Tras mezclar estados correctos e incorrectos puede sugerir una obligación equivocada. Propuesta: «Abajo gira el espejo cercano. Sigue el rayo y corrige los que desvían la luz». Es una mejora de precisión de la enseñanza; no un bloqueo técnico.

Los dos hallazgos específicos de round5 quedan cerrados en su implementación comprobada: receta óptica universal y ausencia de identificadores dibujados. La comprobación visual de letras, recorridos de round6, recuperación y comparación de densidad siguen correspondiendo a las pruebas de este candidato. No otorgo nueva nota global ni sustituyo esas pruebas con los resultados de round4/round5.
