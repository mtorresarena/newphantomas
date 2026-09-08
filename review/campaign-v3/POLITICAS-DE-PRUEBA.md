# Políticas de búsqueda y límites de la comparación

Las búsquedas producen grabaciones de entradas. Solo su reproducción completa en
un juego nuevo acredita completabilidad; restaurar snapshots durante la búsqueda
no es una partida válida. Los ficheros incompletos se conservan como intentos.

## Conjunto harmonized-v2

Se usa el mismo presupuesto máximo de 20.000 estados expandidos por objetivo,
acciones de diez frames en la búsqueda de movimiento, distancia ponderada
`0,8×dx + 1,4×dy`, discretización
horizontal/vertical de cuatro píxeles y velocidad horizontal en medios píxeles.
La puntuación combina distancia, tiempo y energía perdida:

| Política | Coste del tiempo | Coste de perder energía | Intención del buscador |
|---|---:|---:|---|
| balanced | 0,13 | 5 | Equilibrar avance y reserva de energía |
| cautious | 0,10 | 8 | Preferir recorridos que evitan daño |
| speed | 0,20 | 3 | Admitir más riesgo para avanzar antes |

En las dos mitades de la campaña se omite una recarga cuando se está por encima
del 90%. Se busca cargar hasta aproximadamente el máximo, con tolerancia de medio
punto. El éxito exige llegar al cierre sin perder vidas. Los reintentos con muerte
se prueban aparte y quedan fuera de esta comparación.

El estado de búsqueda añade las variables propias de cada sistema: llaves y
conductores en la referencia; nodos, peso, puertas y frágiles en la campaña nueva.
Las pulsaciones de uso, cargas y controladores de jefe tienen duraciones propias;
el Corazón usa algunas entradas de un frame y el Custodio bloques de diez.
Ambos se observan con el mismo reloj de producción, pero ese detalle limita la
comparación directa de rapidez entre combates diferentes.
Los objetivos espaciales se adaptan a cada mapa. Esta guía reduce el descubrimiento
de rutas y soluciones: el programa no aprende como una persona. Tampoco se afirma
que la búsqueda encuentre el óptimo, ni que esas tres políticas representen tres
niveles de habilidad humana.

Los nombres de política no bastan para comparar. El revisor utiliza un observador
común con episodios A–E y contrafactuales preregistrados; publica el vector por
familia. Los tiempos se presentan como contexto mecánico y se separan de espera,
recarga y recorridos repetidos. No se rebautizan giros, botones o frames como
«decisiones significativas».

## Intentos anteriores preservados

- `policy-unharmonized/`: referencias con heurísticas o recarga diferentes.
- `policy-risk-v1/`: primeras políticas y ampliaciones de presupuesto; algunas
  eligieron prefijos que consumían demasiada energía o agotaron la búsqueda en
  un ascensor/guardián. No prueban un bloqueo del juego, ni son éxitos.
- `score1-route-n*.json`: rutas de la primera revisión puntuada. Sus tres replays
  idénticos prueban determinismo, no diversidad de estrategia.

La revisión no ha cambiado sus pesos, segmentos, unidades A–E ni umbral para
adaptarse a estos resultados. La revisión de las políticas sirve para obtener
testigos distintos y comparables, y se registra separadamente del diseño del juego.

## Guía del buscador para las variantes 5 y 6

Se mantienen costes, acciones de movimiento de diez frames y presupuesto de
20.000 estados por objetivo. Se actualizan objetivos espaciales para los mapas
nuevos: aproximación y embarque en ascensores, balcones y regreso por llaves.
El circuito óptico se resuelve a partir de la geometría visible; la orientación
elegida se ejecuta caminando y pulsando Abajo, sin modificar espejos en la partida.

En guardianes se contempla la dirección necesaria hacia cada sello. Después de
una carga fallida, entradas reales de espera permiten su regreso al origen. La
clave de búsqueda incorpora posición, estado y temporizador del guardián y la
cámara: el motor solo inicia ataques cuando todo su cuerpo está visible. Esperar
a que la cámara alcance al personaje puede ser necesario y no cuenta como
contenido nuevo. Un intento que agota la búsqueda no prueba un bloqueo jugable.

Esta guía conoce el mapa y la solución. No compara tiempos humanos ni demuestra
rutas óptimas. Los tres costes pueden converger en una ruta idéntica; eso se
informa y no se presenta como tres estrategias diferentes. Los replays finales
arrancan en el origen natural del nivel y ejecutan únicamente entradas registradas.

## Guía y procedencia de conexiones: fuentes 10–12

Se añaden metas espaciales para subir al cerrojo, recuperar el peso y acceder al
prisma elevado. Son instrucciones del buscador que conoce la solución, no ayudas
ocultas que cambien las físicas. N6 declara presupuesto 20000; N7 declara 8000.
El revisor midió máximos reales de 1959/1939/1851 expansiones en las búsquedas
exitosas de N7: elevar ese límite por sí solo no cambiaría estas rutas. No se
afirma uniformidad de todos los presupuestos ni optimalidad del recorrido.

N1–N5 y N8 reutilizan entradas anteriores compatibles. N6/N7 incorporan los
recorridos de las cámaras modificadas. Cada archivo conserva su `sourceHash`
original; `round12/verified-set.json` identifica separadamente la fuente sobre
la que se ejecutan los 24 testigos. Congelar una copia no vuelve a grabarla.

`--exercise-links` retira/recoloca el peso o interrumpe/reconecta el haz usando
entradas reales. `--retry-link=weight-anchored` y `light-primed` esperan una muerte
real tras alcanzar esos estados. Los cinco testigos adicionales acaban en meta;
se separan de los fixtures que posicionan estados para probar bordes.

Intentos no exitosos durante esta iteración: búsquedas sin metas intermedias se
interrumpieron tras agotar tiempo; un presupuesto inicial de 5000 en el ascensor
de N6 no bastó; una meta relajada seguida de espera acabó en caída/muerte y se
descartó. Se conservó la condición de embarque real y se orientó la búsqueda al
apoyo a y100 con presupuesto 20000. Un intento parcial de N5 en round10 no cuenta
como completado; las entradas anteriores reproducidas sí completan el nivel.
Ninguno de estos intentos demuestra por sí solo un bloqueo del motor.

El primer probe de HUD tuvo errores de instrumentación (sustitución de texto con
`$` y mensaje nulo en el fixture de entrada), corregidos en la herramienta; no
fueron fallos de producción. La observación final usa la fuente congelada 12.
