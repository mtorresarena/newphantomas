# Recuperación legal de puzles y bordes del motor

2026-09-08. Evidencia posterior a la primera nota, sin recalificar. Se ejecutan las entradas entregadas sobre `candidate-score1.html` (SHA256 `57a34b6ffb17a65d897d4e0b6a832ddd9f77300673942a2865efde24ac3d2725`); los cambios posteriores declarados son visuales. Los testigos se copian a `verified-route-n*-retry-*.json` y sus hashes quedan registrados.

`verificar-reintentos-puzles.cjs` no modifica posición, energía, inventario ni enemigos, no usa snapshots y no llama directamente a muerte/reaparición. Reproduce controles desde el inicio natural del nivel. Comprueba final `clear`, diez puzles resueltos, una muerte, una reaparición y dos vidas restantes. Su resultado completo es `reintentos-puzles-verificados.json`.

| Familia | Frames totales | Muerte / reaparición | Estado parcial al morir | Conclusión acreditada |
|---|---:|---|---|---|
| Sellos N5 | 14660 | 4770 / 4860 | Sí, prueba2-2 | Progreso parcial, muerte real, reinicio y completación del nivel. |
| Runas N5 | 23041 | 11559 / 11649 | Sí, prueba1-2 | Progreso parcial, muerte real, reinicio y completación del nivel. |
| Temporizado N6 | 20768 | 10962 / 11052 | **No: ya había caducado** | Activación parcial, caducidad, muerte real y completación del nivel. No demuestra muerte con contador activo. |
| Espejos N7 | 19731 | 10962 / 11052 | Sí, prueba1-1 | Orientación parcial, muerte real, reinicio y completación del nivel. |

El matiz del temporizado es material: esperar a agotar energía en un sitio seguro dura mucho más que su plazo. No se llama «muerte durante un temporizador activo» a una ruta cuyo progreso se había reseteado antes. Queda pendiente ese caso específico si se quiere acreditar con controles reales; los fixtures de reinicio y caducidad existentes siguen siendo evidencia distinta. Tampoco se atribuye una completación al intento de contrapeso marcado `complete:false`: no forma parte de esta tabla.

Se inspeccionaron y ejecutaron los **14 casos** de `tools/check-campaign-rules.js`, con resultado14PASS en la fuente actual. Además se conserva `score1-rules14.cjs/json`, copia del comprobador con solo ruta de harness, fuente congelada y archivo de salida adaptados. También da14PASS, de modo que los resultados mecánicos no dependen de una revisión visual aún móvil.

Los casos incluyen alcance de dos jefes, soluciones de espejos, orden equivocado y pulsación mantenida, recogida/deposito de contrapeso, activación de sello exclusivamente por carga, caducidad y umbral exacto, reinicio parcial, contención de arena y congelación durante muerte, vulnerabilidad/fases/salida, ventana perdida, proyectil letal simultáneo con último pisotón, muerte durante animación de derrota y restauración de snapshot del harness.

Son **fixtures unitarios**, no recorridos. Por ejemplo, ventana fallida usa invulnerabilidad preparada, último golpe/muerte coloca un proyectil sobre el jugador, y la prueba de animación llama directamente a `die`. Son adecuados para aislar orden y coherencia de transiciones, pero no sustituyen las rutas legales. El caso titulado «Every mirror layout connects only with the intended beam turns» verifica orientación inicial desconectada y solución conocida conectada; no enumera todas las orientaciones alternativas. Los14PASS no se presentan como cobertura exhaustiva del espacio de estados.

Esta evidencia cierra varias carencias de recuperación y de simultaneidad mencionadas en la primera revisión. No cambia retroactivamente aquella nota ni demuestra aprendizaje humano o ausencia universal de bloqueos.
