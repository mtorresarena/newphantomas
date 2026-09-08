# Duración de ejecución por ventanas: resultado V2

Se ejecutaron los 24 testigos congelados de la fuente 4 con `clasificar-ventanas-v2.cjs`, según `PROTOCOLO-SEMANTICO-VENTANAS-V2.md`. `semantic-windows-v2-round4/` conserva categorías por intervalo, hitos, ventanas, subtipo y resultados. Este análisis **describe duración observada de ejecución de objetivos**, no necesidad mínima de cada frame.

El análisis puntual anterior se conserva, pero su cobertura baja no se usa como demostración de que el juego carezca de actividad. Era una cota de instantes de progreso, insuficiente para describir una tarea extendida. No se reescriben las notas anteriores ni las unidades A–E; la nueva evidencia se incorpora a una revisión posterior identificada.

## Tiempos observados

Rango entre balanced/cautious/speed, en segundos de simulación. Los rangos de columnas pueden proceder de políticas diferentes y no se suman como si fueran una ruta única.

| Nivel | Ejecución de objetivo obligatorio | Tránsito simple | Espera de mecanismo | Gestión de recursos, necesidad abierta | Sin atribución | Cobertura operacional |
|---|---:|---:|---:|---:|---:|---:|
| N1 | 20,25–20,33 | 6,02–6,23 | 0,02–0,17 | 1,28–1,37 | 35,70–37,58 | 40,78–41,93% |
| N2 | 24,05–34,15 | 9,12–12,98 | 0 | 1,75–3,03 | 20,80–27,63 | 54,80–66,12% |
| N3 | 34,40–38,55 | 8,07–9,08 | 1,13–2,97 | 0,28–0,45 | 19,10–27,15 | 62,57–71,51% |
| N4 | 51,93–54,70 | 5,67–7,22 | 1,43–4,42 | 2,67–5,30 | 41,67–45,42 | 55,57–58,60% |
| N5 | 123,93–124,48 | 42,73–43,22 | 0,15–0,60 | 0,85–0,95 | 28,23–29,57 | 84,59–85,19% |
| N6 | 100,12–107,28 | 38,78–41,57 | 4,58–7,50 | 0,85–0,87 | 22,82–27,63 | 84,10–86,21% |
| N7 | 75,62–77,75 | 46,42–47,10 | 2,70 | 0,85–0,87 | 14,48–16,35 | 87,87–89,27% |
| N8 | 119,20–120,30 | 48,92–49,15 | 14,73–14,90 | 1,72–1,83 | 29,67–31,67 | 84,56–85,40% |

Los instantes de recogida opcional que no coinciden con otra tarea se conservan en los JSON; son pocos y no permiten inferir tiempo de exploración opcional extensa. Estas políticas no buscan bolsas como condición de salida. Las recogidas incidentales durante un objetivo se absorben temporalmente en esa ejecución: no se duplican frames. Los 24 testigos no registran muerte ni pérdida de progreso; por ello repetición cierta es cero. No significa que sus trayectos sean óptimos ni que no contengan rodeos.

## Ejemplos auditables

- **N5 balanced:** 7436 frames de ejecución, incluidos 920 de transporte real de contrapesos; 2566 de tránsito simple, 36 de latencia mecánica, 51 de recarga y 1771 sin atribuir. El transporte ya no queda reducido al instante final del depósito.
- **N6 balanced:** 6334 frames de ejecución, incluidos 640 de transporte y 1594 de cruce acreditado; 2347 de tránsito, 450 de viaje pasivo en plataformas móviles, 52 de recarga y 1579 sin atribuir. El movimiento del elevador sin entradas se distingue de movimiento controlado por el jugador.
- **N8 balanced:** 940 frames de movimiento de combate y 821 de latencia del jefe, además del resto de objetivos y tránsitos. Esperar una apertura no se confunde con una nueva decisión por cada frame, ni caminar después de derrotarlo con combate.

Dentro de ventanas se registra distancia que aumenta respecto al hito siguiente: por ejemplo 1451 frames en N5 balanced. No se llaman desperdicio: pueden corresponder a subir por un apoyo, cebar un guardián o regresar por un camino necesario. La ventana demuestra actividad asociada a un objetivo que luego progresa; no demuestra que todos sus movimientos fueran imprescindibles.

## Qué permite concluir

Una parte sustancial del tiempo del bloque nuevo se pasa ejecutando transporte, acceso, orden, cruces y combate verificables. Su duración no procede únicamente de pasillos o esperas. También existe una cantidad relevante de tránsito simple (aproximadamente 39–49 s por nivel nuevo), que queda visible en lugar de etiquetarse como desafío.

Esto es evidencia útil de diseño y duración mecánica. No demuestra diversión ni ausencia de monotonía: ejecutar cinco veces la misma topología sigue siendo repetición estructural aunque esos segundos sean actividad. La objeción concreta de copias de fuente 4 permanece independiente de este análisis temporal.

El mayor porcentaje etiquetado de N5–N8 no prueba que sean más densos que N1–N4. Los puzles B tienen hitos y cámaras explícitos; en el bloque original una parte mayor del desafío fluye entre plataformas/enemigos y queda fuera de las ventanas identificadas. Esas maniobras originales sin atribuir no se convierten en tránsito vacío. Para comparar densidades se deben mantener sus intervalos abiertos, o ampliar la anotación causal de esas maniobras de forma homogénea antes de volver a medir.

La gestión de recursos sigue separada: cargar hasta la reserva elegida por el planificador no es una obligación de salida, pero parte de esa energía puede ser necesaria para sobrevivir. El observador no decide arbitrariamente que toda recarga sea opcional o forzada. La latencia del mecanismo describe la espera de esta ejecución, no un mínimo global ni minutos de una persona.

El alcance del método y sus ambigüedades se han ampliado explícitamente para responder a duración de tareas. No se ha retocado el conteo A–E, no se han borrado resultados adversos y no se ha calculado otra nota para obtener una cifra predeterminada.
