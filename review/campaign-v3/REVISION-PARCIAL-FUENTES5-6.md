# Contraste parcial independiente: fuentes 5 y 6

No se asigna nota nueva. Se mantienen la fuente 4 y su nota 8,15, así como todos los resultados anteriores. Fuente 5: `faeccc2abdcd3ccff53bd12e98f91720e6d3704f72f1f1d90a8e2606d2dfd427`; fuente 6: `5963bcc02f71090a958df9737eca2b8fd5a96ed0a615f4a9dcbe4be4dc04ef21`.

## Delimitación previa

Se generaron los manifiestos 5 y 6 con cero pasos y antes de leer sus rutas. Las fronteras A/B/C/E no cambian respecto a 4; D conserva el número de candidatos y solo cambia metadatos de anclas en algunos niveles. De 5 a 6 todos los candidatos son idénticos. Ningún espejo, nodo, letra o cambio de ángulo añade una unidad B. Véanse `COORDENADAS-RONDA5.md` y `COORDENADAS-RONDA6.md`.

## Repetición y políticas de espejo

La firma topológica (tipo, plazo, orden, nodos/alturas/ángulos, dirección efectiva de fuente y matriz de cámara) ya no encuentra grupos idénticos dentro de N5 o N6 de fuente 5. Quedan las runas N7 1-2/2-1 y contrapesos N8 2-2/4-1. Se conserva esta reutilización: no se declara variedad absoluta ni se exige eliminar toda práctica repetida.

Una topología distinta no basta. El contraste `politicas-espejos-rondas56.json` reproduce el defecto de fuente 5: **girar todos los espejos una vez resuelve los siete circuitos avanzados**, además del tutorial. Tener soluciones únicas no impedía esa estrategia uniforme.

Fuente 6 lo corrige dentro del contraste lógico: ninguno de los siete avanzados se resuelve dejando todo igual, girando todo una vez, poniendo todo a cero o poniendo todo a uno. El tutorial de dos espejos conserva la regla sencilla. Cada circuito tiene una única solución; los patrones de giros requeridos entre avanzados no son todos iguales. Estas pruebas enumeran estados binarios en fixtures: no se describen como navegación legal ni como dificultad humana.

## Rutas y respuestas legales ya contrastadas

Se conservaron por hash los testigos balanced de N5/N7/N8 de fuente 6. El revisor los reprodujo desde el origen:

| Nivel | Frames completos | Vector A/B/C/D/E | Total |
|---|---:|---|---:|
| N5 | 10939 | 2/10/7/6/0 | 25 |
| N7 | 9345 | 0/10/9/10/0 | 29 |
| N8 | 12491 | 0/10/5/11/6 | 32 |

Sin muerte ni inconclusiones nuevas en esos testigos. Son resultados parciales de una política, no un conjunto de 24 ni una secuencia continua probada del nuevo candidato.

`variantes-legales-round6.json` contiene 50 ramas de controles simples sobre diez variantes: sellos N5 3-1/4-2/5-1, peso N5 5-2, espejos N7 3-1/4-2/5-1/5-2 y temporizados N7 3-2/4-1. Cada rama reproduce controles naturales hasta la primera proximidad de guardián o interacción y luego aplica derecha, salto mantenido, salto pulsado, Abajo repetido o espera, hasta 900 frames. No se inyecta posición, energía o progreso.

Ninguna de las 50 ramas resuelve su prueba. Cuatro mueren; no son daños inevitables, porque esos desafíos se completan en la ruta correspondiente. Hubo efectos reales: rotaciones, activaciones, resets de orden/caducidad y un sello parcial. Algunas ramas dejan de alcanzar el nodo al desplazarse o caer, por lo que no se presume que las 450 pulsaciones hayan sido interacciones efectivas. No se afirma ausencia exhaustiva de atajos.

Los temporizados avanzados de partes 3/4 se alcanzaron legalmente en N7. Eso acredita sus instancias concretas; **no sustituye una ruta completa de N6** ni prueba su cierre de descenso con ascensor y ácido.

## Motor y pendientes concretos

Los 14 bordes pasan sobre fuente 6; el solver del comprobador del autor se contrastó con enumeración independiente de los espejos. Son fixtures, no recorridos. La inspección de `respawn` confirma que restablece plataformas frágiles, además del reinicio de puzles; falta aún contrastar los nuevos tramos con recuperaciones legales específicas.

La cota optimista de desplazamiento horizontal no demuestra que ningún temporizado sea imposible por plazo, pero ignora saltos, ascensor, daño y maniobras: no es una prueba de viabilidad. Un agotamiento de búsqueda de 20000 nodos en N6 queda como fallo de búsqueda, no como bloqueo demostrado del juego.

Pendiente antes de una nota nueva:

- Completar y contrastar N6, particularmente cierre 5-2 de ascensor/ácido, con sus plazos y regreso tras fallo.
- Congelar las tres políticas completas de N5–N8 y volver a ejecutar clasificación y normalización contra la misma fuente. Los cambios de guías geométricas del planificador se deben conservar como metadata de búsqueda, no ocultarlos como igual pericia humana.
- Pruebas legales de caducidad/reintento en los temporizados de retorno y el cierre nuevo; recuperación del peso alto y de circuitos con ángulos iniciales mezclados.
- Inspeccionar en navegador las letras A/B/C/D y el texto que aclara que algunos espejos ya están correctos. Una explicación genérica que sugiera girarlos todos contradice el cambio de estado inicial.

No queda un bloqueo crítico nuevo reproducido en el alcance ensayado; las pendientes no se convierten en pases por anuncio.

## Método temporal complementario

`RESULTADO-VENTANAS-SEMANTICAS-V2.md` corrige la limitación del observador puntual anterior. Sobre los 24 testigos completos de fuente 4, separa duración de ejecución de objetivos, tránsito simple, latencia, recursos y movimientos no atribuidos. Permite reconocer transporte y acceso como tareas extendidas sin exigir que cada frame sea causalmente mínimo. La cobertura es aproximadamente 84–89% en N5–N8 y 41–72% en los originales, con sesgo explícito por la mayor claridad de hitos B. No se cambia A–E ni se deduce diversión de esa cobertura.
