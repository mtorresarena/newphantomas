# Prerregistro de actividad mecánica, ronda 2

Fijado por el revisor el 2026-09-08 después de la primera nota 7,55 y antes de leer o medir resultados de las políticas nuevas balanced/cautious/speed. El autor acepta la unidad A–E. No cambia ningún peso, mínimo ni barrera de `CRITERIOS.md`. Este registro operacionaliza una carencia ya declarada; no modifica la nota anterior.

## Unidad y fuentes

Una unidad es un **episodio mecánico con progreso o respuesta verificable**, no una pulsación ni una decisión humana. Se informa el vector A–E, los identificadores y el total sin ponderaciones entre familias. Las familias no se intercambian para afirmar variedad: diez cerraduras no demuestran combate. No se añaden unidades por duración, distancia, cantidad de nodos, saltos vacíos, giros, spam o fracaso repetido.

N1–N4 se delimitan desde `index-base-31d4610.html`; N5–N8 desde `candidate-score1.html`. La geometría y las reglas de una revisión posterior deberán contrastarse con esas fuentes. Un cambio material exige nueva versión explícita del registro, sin sobrescribir este ni escoger la versión que dé mejor resultado. El manifiesto se obtiene solo cargando mapas; no reproduce políticas. Ninguna ruta nueva se usa para elegir las fronteras.

| Familia | Episodio | Cómputo |
|---|---|---|
| A | Llave obligatoria recogida; cerradura consumida | Una unidad por llave necesaria para las cerraduras de la ruta y otra por puerta distinta abierta. Bolsas, baterías, enchufes, ajo, checkpoints y salida se registran aparte, sin puntuarlos como obligaciones universales. Si sobran llaves al acabar, se excluyen las últimas sobrantes. |
| B | Dependencia de puzle resuelta | Una unidad por prueba única que pasa a resuelta. Cuatro nodos, dos guardianes o transporte de ida/vuelta siguen siendo un único objetivo. El tránsito y enemigo internos quedan absorbidos por B. |
| C | Obstáculo de tránsito con frontera geométrica independiente de una prueba | Una unidad al cruzar por primera vez una región de peligro de suelo o barrera elevada entre inicio y salida. Debe haber control de altura/ruta/tiempo observable; no se concede solo por pasar x. Regiones que se cruzan con desplazamiento horizontal seguro sin cambiar altura/timing no califican. Repeticiones no añaden unidades. El tránsito interno de B o arena E se excluye. |
| D | Encuentro con respuesta efectiva | Una unidad por región de encuentro independiente cruzada hacia la salida, si una respuesta observable evita daño o un bloqueo respecto a continuar con el movimiento horizontal previo sin saltar/interactuar. Un enemigo decorativo o que queda fuera de la ruta no suma. Proyectiles/esquivas repetidos del mismo encuentro no suman. D solapado con B/C/E se registra como combinación, pero no añade otra unidad al total. |
| E | Progreso obligatorio del jefe | Una unidad por conductor nuevo de N4 o decremento válido de vida de N8. Esperar apertura, esquivar cada disparo o repetir una ventana sin progreso no suma. |

**Deduplicación y obligatoriedad.** Prioridad de atribución del mismo obstáculo: E, B, A, C, D. A recoge hitos discretos y no absorbe una región de tránsito completa; una cerradura no se vuelve a contar como barrera C. C agrupa tramos contiguos de peligro/barrera separados por hasta dos columnas libres: pequeños apoyos internos no inflan el conteo. Un mismo obstáculo no añade una segunda unidad por reintento o retroceso. Si un recurso exige regresar de forma comprobable, se documenta el retorno y su actividad, sin inflar la unidad del obstáculo ya resuelto. Se publican exclusiones y casos ambiguos. No se concede una unidad dudosa.

## Delimitación estática N1–N8

`preregistrar-segmentos.cjs` genera `segmentos-preregistrados.json` con hashes de las dos fuentes, intervalos en píxeles y columnas, anclas y predicados. El algoritmo es idéntico para todos los niveles:

- A: posiciones de llaves y columnas únicas de puertas reales entre inicio/salida.
- B: cámara desde el primer borde de la construcción del puzle (`gate-28` relativo a la sala) hasta el borde derecho de su compuerta. Incluye todos sus nodos, guardianes y apoyos.
- E: arena completa del jefe, si existe.
- C: componentes de columnas con ácido/pinchos/ausencia de suelo en filas 10–11 o sólido a altura del cuerpo sobre el suelo (filas 8–9). Se excluyen puertas A, cámaras B y arena E; se agrupan con la regla de dos columnas. Los accesos a llaves elevadas se registran como parte de A, sin contar plataformas opcionales por existir.
- D: anclas de enemigos y peligros temporales con radio fijo de 48 px, recortadas al mapa; se fusionan intervalos que se tocan. Solo se conservan fuera de B/C/E. Ese radio sirve para delimitar observación, **no afirma alcance de ataque**. Si un ataque procede de fuera, se registra como encuentro no delimitado, sin inventar una región tras ver el resultado.
- Todo lo demás queda como tránsito no clasificado u opcional. Los márgenes de observación C son una casilla a ambos lados; no se agrupan dos componentes por sus márgenes. La pertenencia temporal usa la posición del centro del jugador.

El manifiesto enumera **candidatos**, no una cifra de acciones ya acreditada. C y D requieren la prueba dinámica descrita abajo. Una región con apoyo móvil no suma unidades por cada frame sobre ese apoyo. Si esta delimitación omite un desafío real, se publica la omisión y un límite inferior; no se redefine en silencio para favorecer una campaña.

## Clasificador común y contraste causal

Todos los niveles se ejecutan desde `newGame/loadLevel/startLevel` con controles de producción. Un único lector normaliza tanto `inputs/actions/framesPerAction` de las referencias como `commands[{a,frames}]` de las nuevas rutas. El observador registra cada frame: posición/velocidad, soporte, energía/daño, controles, objetos, puertas, estado de prueba y jefe, región estática y fase del encuentro.

A/B/E se verifican por transiciones de estado, con deduplicación de identificadores. C conserva entrada, salida y controles del primer cruce completo; un salto o movimiento vertical no se considera automáticamente necesario. D conserva entrada, respuesta y salida del encuentro.

Para acreditar C/D se repite un contrafactual desde el estado real guardado al entrar: mantener únicamente la dirección horizontal con la que se entró, sin salto, Abajo ni cambios de dirección, durante la duración del episodio observado más 60 frames, con máximo 600. Se comparan cruce, progreso, daño y muerte; no se eliminan amenazas ni se tocan energía/geometría. Si mantener ese control cruza sin daño ni bloqueo, la unidad C/D no se acredita. Si el recorrido observado no mejora el resultado, tampoco se acredita. Si expira el máximo sin un resultado concluyente, queda **no demostrado**, no pasa por defecto. Los montajes de ese contraste sirven para causalidad local, nunca sustituyen el recorrido completo legal.

Para C, progreso es cruzar el borde derecho de la región. Para D, progreso es cruzar la región hacia la salida y la mejora exige menos daño, ausencia de muerte o desbloqueo verificable. Si la entrada ya tiene inercia de un salto anterior, el contraste puede infracontar: se declara como límite; no se mueve retrospectivamente el inicio para fabricar causalidad. Las acciones de preparación pueden registrarse como actividad sin añadir unidades.

## Tiempo: no confundir contexto con actividad

Los frames se publican primero en categorías mecánicas observables: B/E activos, C/D dentro de región, carga efectiva, resto en movimiento, resto inmóvil, muerte/repetición. Estar dentro de una cámara no demuestra que cada frame sea activo: estas categorías se llaman **contexto**, no minutos de diversión.

La etiqueta semántica desafío / tránsito simple / espera obligada / opcional / repetición requiere justificar la acción y su dependencia. La espera inmóvil no es obligatoria por ser inmóvil; la carga puede ocurrir andando. Sin análisis causal suficiente, se conserva `no clasificado`. Se entrega porcentaje de cobertura: una mayoría de frames sin clasificar impide afirmar densidad verificada aunque el total de episodios alcance el mínimo.

## Políticas, estadística y resultado

Balanced/cautious/speed deben buscar desde el origen con costes de daño/tiempo diferentes y documentados antes de publicar sus resultados. Mismos controles, condiciones de éxito —salida con todos los objetivos obligatorios, sin muerte ni vidas perdidas—, presupuesto de búsqueda y reglas de recursos para N1–N8. No imponer al segundo bloque objetivos opcionales que no se exijan al primero. Si solo hay tres políticas nuevas para N5–N8 y una política antigua para N1–N4, **sigue faltando homogeneidad**; las referencias antiguas se conservan para regresión y descripción.

Tres repeticiones del mismo testigo comprueban determinismo y cuentan como una política. Un fracaso o búsqueda agotada se publica, no se sustituye selectivamente por la mejor ruta. Los conteos se calculan después de fijar este protocolo y manifiesto. Por política se publica vector A–E por nivel y las comparaciones exigidas por rúbrica: N5–N7 respecto al 80% de la mediana N1–N4; N8 al 100%. Se informa además rango entre políticas. No se combina una política favorable de un nivel con otra favorable de su referencia. Casos C/D ambiguos producen límites inferior/superior y no un aprobado automático.

Una comparación homogénea favorable acredita solo la barrera técnica definida. No eleva automáticamente variedad, enseñanza, justicia, visuales ni diversión. Los resultados podrán mostrar que este conteo no captura la experiencia completa; se dirá así en vez de reajustar el umbral a posteriori.
