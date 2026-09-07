# Criterios fijados antes de inspeccionar

Esta rúbrica se registra antes de abrir el código, los recursos o las herramientas de la copia. Se realizará una única evaluación y se conservarán los hallazgos negativos.

## Rúbrica

- **Diferenciación perceptible de N5–N8 (25 %).** Cada fase debe modificar de forma reconocible las decisiones, ritmo o uso del espacio; nombres, colores o decoraciones por sí solos no prueban variedad. Se valoran mecanismos y combinaciones con consecuencias distintas y partes internas identificables.
- **Progresión de dificultad dentro y entre fases (25 %).** Introducción, desarrollo y combinación de retos con aumento comprensible de exigencia. Se penalizan inversiones injustificadas, largos tramos equivalentes y mecanismos fácilmente anulados. Complejidad visual o mayor número de enemigos no bastan para demostrar dificultad.
- **Justicia, recuperación y robustez (25 %).** Saltos con margen legible, ausencia de bloqueos reproducibles, reaparición utilizable, consistencia de puertas/llaves y recuperación razonable tras errores. Se buscarán atajos que eliminen retos, bucles de daño y estados imposibles.
- **Coherencia estética respecto a N1–N4 (15 %).** Lenguaje de formas, paleta, escala, representación de peligros y jerarquía visual compatibles, con identidad propia sin perder continuidad. Se distinguirá evidencia visual de inferencia extraída del código.
- **Claridad, aprendizaje y repetición (10 %).** Instrucciones oportunas y comprensibles, objetivos y cambios de reglas señalizados; reutilización que transforme retos en lugar de rellenar recorrido.

## Escala y síntesis

Cada dimensión se calificará como deficiente, parcial, sólida o sobresaliente, o no verificable. Una nota global solo se dará si la cobertura es suficiente; de darse será una banda amplia sustentada en los pesos, nunca decimales aparentando precisión. Un fallo crítico reproducible que bloquee progreso o cause daño inevitable prevalece sobre el promedio y se declarará expresamente.

## Evidencia admisible

1. Ejecución reproducible del bucle real con estado inicial, entradas, tiempo y resultado registrados.
2. Inspección directa del código como prueba de reglas implementadas, distinguiéndola de su resultado práctico.
3. Capturas o renderizado de estados reales como evidencia de composición y claridad visual.
4. Comparación explícita con N1–N4 de esta misma copia.

Una ruta automática completada solo acredita viabilidad bajo esas entradas, no diversión, legibilidad, aprendizaje humano ni accesibilidad. Un fallo de un bot tampoco prueba por sí solo un salto imposible. Los nombres de fases, comentarios de intención, contadores aislados o rutas ideales no se aceptan como evidencia suficiente de calidad. Se probarán especialmente bordes de plataformas, muerte/respawn, llaves/puertas, retroceso y estrategias simples repetibles.

## Límites previstos

Sin partida humana observada no se validarán plenamente dificultad percibida, reacción, comodidad de controles, entretenimiento, accesibilidad, audio o comprensión espontánea. Las pruebas automatizadas cubrirán estados concretos, no todos los posibles. La evaluación visual dependerá de disponer de un renderizado real; si no lo hay, la dimensión estética tendrá confianza limitada y no se presentará como observación visual.
