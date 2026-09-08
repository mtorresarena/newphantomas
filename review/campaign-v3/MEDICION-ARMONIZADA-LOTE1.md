# Medición armonizada: primer lote congelado

2026-09-08. **7/24 testigos; no hay nota nueva ni evaluación global.** Falta N4 incluso para cerrar la referencia balanced. No se publica una mediana parcial como si representara N1–N4.

## Compatibilidad con el prerregistro

Se inspeccionó el diff completo score1→fuente congelada `harmonized-v2/index.html`, SHA256 `5ada9ce96900d5b60feb1308d0fa25119aacdb34d9ef32c4f07ba04cab261f3d`. Cambia CSS/ajuste táctil, comentario de versión, dibujo del aviso de polilla, prompt táctil y espacios. `validar-fuente-armonizada.cjs` comprueba además:

- N1–N4 conservan exactamente las definiciones de nivel originales.
- Los ocho niveles conservan exactamente las definiciones de score1.
- CFG es idéntico al original.
- El texto completo de las reglas de campaña anterior al dibujo es idéntico a score1.
- Todo el bloque desde Entrada hasta final del HTML —incluidos física, enemigos, jefes y bucle— es idéntico a score1.

Resultado: `compatibilidad-fuente-armonizada.json`. El clasificador admite exclusivamente ese nuevo hash después de esta comprobación. No cambian unidades, fronteras, umbrales ni deduplicación del prerregistro.

## Normalización y ejecución

`medir-congelados.cjs` toma una instantánea del manifest, comprueba hashes/protocolo/budget20000 y utiliza solo archivos congelados. El clasificador lee los dos formatos de controles. Se valida cada testigo además con dos replays independientes: formato original y comandos idénticos adyacentes fusionados. Ambos terminan con idéntico estado completo, no solo la misma x o número de frames. Se igualan los prototipos entre los dos contextos VM mediante structuredClone antes de comparar; una primera comprobación directa señaló esa diferencia de contextos, no una diferencia del estado del juego.

Todos los siete replays llegan a clear, sin muerte ni pérdida de vida, y sus frames coinciden con los declarados. La suma de categorías de contexto cubre exactamente todos los frames. El comparador no cambia los controles ni escoge rutas.

## Resultados A–E provisionales

| Nivel/política | Frames | A | B | C | D | E | Intervalo de unidades |
|---|---:|---:|---:|---:|---:|---:|---|
| N1 balanced | 3847 | 4 | 0 | 2 | 9 | 0 | 15–16 |
| N1 cautious | 3946 | 4 | 0 | 2 | 9 | 0 | 15–16 |
| N1 speed | 3821 | 4 | 0 | 2 | 9 | 0 | 15–16 |
| N2 balanced | 4053 | 6 | 0 | 9 | 10 | 0 | 25 |
| N2 speed | 4071 | 6 | 0 | 8 | 7 | 0 | 21–22 |
| N3 balanced | 4397 | 4 | 0 | 9 | 9 | 0 | 22–24 |
| N5 balanced | 11592 | 0 | 10 | 7 | 4 | 0 | 21 |

La tabla publica el vector de unidades acreditadas y una cota superior que añade una unidad posible por candidato pendiente. No concede esas unidades como probadas.

En N1, el obstáculo final169–172 se ha iniciado, pero el nivel termina antes de cruzar la frontera derecha registrada. En N3 ocurre también con293–295. No se mueve retrospectivamente la frontera ni se elimina esa incertidumbre para favorecer al segundo bloque. N2speed tiene un contrafactual no concluyente en291–294; N3balanced, en101–107. Los JSON conservan motivo, duración, estado y resultado de cada contraste.

El registro de cotas se aplica también al comparar: una conclusión favorable inequívoca exige que la cota inferior nueva alcance el mínimo frente a la cota superior de la referencia de esa misma política; si el intervalo cruza el umbral, queda no demostrado. Esto evita aprobar por infracontar un obstáculo final original. No sustituye ni cambia los mínimos80%/100% establecidos.

## Límites pendientes

Los tiempos publicados son de simulación. `semanticActiveFrames` sigue siendo null: el observador separa contexto de puzle/jefe/obstáculo/encuentro, carga efectiva y resto móvil/inmóvil, pero no afirma que cada frame de un contexto sea una decisión o actividad obligatoria. Los intervalos de episodios tampoco son minutos humanos.

Los costes de harmonized-v2 son balanced daño5/tiempo0,13, cautious8/0,10, speed3/0,20, con techo20000 común. Se inspeccionaron esos parámetros en ambos generadores. Se mantienen distintos predicados de objetivos naturales y pistas espaciales; no se atribuye la misma pericia humana a esos planificadores. Los intentos fallidos anteriores permanecen como evidencia separada y no desaparecen por trabajar aquí con completados congelados.

Resultados individuales: `harmonized-classification/n*-*.json`; instantánea del primer lote: `batch-7-4093dae4a695.json`. Los archivos individuales registran fuente, manifiesto, testigo y versión del clasificador. Los lotes sucesivos podrán añadir testigos, manteniendo estos resultados y sin elegir retrospectivamente los que den una cifra favorable.
