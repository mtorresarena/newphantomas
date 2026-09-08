# Resultado semántico conservador: 24 testigos congelados

Fuente 5ada… de ronda 2. Los 24 recorridos se han reproducido desde el origen, con hashes y finales contrastados. Se aplicó `PROTOCOLO-SEMANTICO-CONSERVADOR.md` mediante `clasificar-semantica-conservadora.cjs`. Los resultados detallados, intervalos y secuencias de etiquetas están en `semantic-classification/`; `summary.json` reúne todas las políticas.

**La cobertura cierta es baja: entre 0,84% y 14,56% según el recorrido. No queda demostrada una cifra de duración activa.** Se ha hecho el análisis solicitado, pero sus límites no permiten rellenar la categoría desconocida como acción o diversión. Los marcos de las cámaras y las regiones del clasificador no sustituyen una atribución causal de cada frame.

## Cotas inferiores observadas

Cada celda muestra el rango entre las tres políticas. Son frames de simulación (60 por segundo). Una transición de llave, nodo o jefe acredita un instante de progreso; no significa que todo el esfuerzo asociado durara un frame.

| Nivel | Acción obligatoria puntual | Tránsito simple | Espera de mecanismo | Opcional puntual | Repetición cierta | Cobertura cierta |
|---|---:|---:|---:|---:|---:|---:|
| N1 | 4 | 20 | 0 | 9–10 | 0 | 0,84–0,89% |
| N2 | 6 | 116–142 | 0 | 10–11 | 0 | 3,27–3,96% |
| N3 | 4 | 54–67 | 0 | 9–10 | 0 | 1,54–1,88% |
| N4 | 9 | 42–56 | 0 | 17 | 0 | 1,05–1,20% |
| N5 | 22 | 831–846 | 0 | 6–8 | 0 | 7,43–7,54% |
| N6 | 34 | 789–918 | 0 | 10 | 0 | 8,09–9,35% |
| N7 | 20 | 1018–1058 | 162 | 8 | 0 | 14,18–14,56% |
| N8 | 29 | 980–984 | 54 | 5–6 | 0 | 8,26% |

Las esperas acreditadas son latencia de estabilidad del circuito de espejos mientras el controlador permanece inmóvil: 2,7 s en N7 y 0,9 s en N8. El motor exige estabilidad antes de abrir; no exige que el personaje se quede inmóvil, por lo que esa latencia puede solaparse con otra acción. No se llaman espera necesaria todas las pausas ante guardianes, jefe o elevadores.

La repetición cierta es cero en este conjunto sin muertes ni resets de progreso observados. **No demuestra ausencia de movimientos redundantes.** Los retornos pueden ser obligatorios; para llamarlos repetición habría que probar que se pueden omitir manteniendo los objetivos. Del mismo modo, las bolsas son opcionales, pero no se atribuye a su búsqueda toda una región sin contraste.

## Intervalos y ambigüedad

Como ejemplo reproducible, N6 balanced dura 10283 frames. Solo se atribuyen con la regla estrecha 34 a progreso, 804 a tránsito simple y 10 a recogida opcional. Los otros 9435 quedan ambiguos: 4939 en contexto de puzle, 1682 en obstáculo, 872 en encuentro, 53 de carga y 1889 en otro contexto. Estas últimas etiquetas describen dónde/qué estado tiene el personaje, **no por qué cada frame era necesario**.

Sus intervalos por categoría son acción obligatoria 34–9296, tránsito simple 804–10066, espera 0–173, opcional 10–9445 y repetición 0–9435. Son deliberadamente amplios y sus extremos superiores comparten frames: no se suman. Un frame que podría ser acción, tránsito u opcional no se convierte en tres frames. En todos los niveles, los JSON incluyen los conjuntos posibles y los intervalos contiguos para una auditoría o anotación posterior.

El mayor número de frames simples acreditados en N5–N8 no basta para afirmar que tengan menor densidad: el criterio excluye márgenes alrededor de enemigos y mecanismos, y la geometría de N1–N4 deja menos frames elegibles para atribución estrecha. Tampoco sirve el mayor número de transiciones de B para afirmar más decisiones humanas. La falta de identificación causal afecta a ambos bloques de manera visible.

Para estrechar las cotas hacen falta ablaciones de segmentos o anotación causal detallada de ventanas representativas. Borrar una espera altera fases de enemigos y plataformas: que falle un replay acelerado no demuestra por sí solo que esa duración fuera mínima. La cobertura incompleta permanece como límite de la dimensión duración/densidad y no se cambia la segunda nota por haber generado más archivos.

## Incidencia del observador

El primer arranque se detuvo antes de producir resultados porque `balls` no está expuesto por la API de pruebas. Se añadió un getter de lectura de proyectiles en `route-harness-semantic.cjs`, copia local del harness; no cambia el juego, la física ni las reglas de clasificación. La ejecución corregida produjo los 24 resultados. No se ocultó un fallo del juego ni se reajustaron reglas según los conteos.
