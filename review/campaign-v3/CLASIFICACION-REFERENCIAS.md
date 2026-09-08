# Clasificación de las referencias originales

Base fija `31d461028516344bc0dbb80b7ecd625296509014`. Cuatro testigos completos reproducidos con el mismo observador (`clasificar-referencias.cjs`), salida detallada en `clasificacion-referencias.json`. Esta clasificación no es una nota ni una medición humana.

## Acciones y cambios de control

Cada frame pertenece a una sola categoría de botones:

| Nivel | Dirección sin salto | Dirección + salto mantenido | Salto sin dirección | Orden de bajar plataforma | Orden de usar | Sin botones |
|---|---:|---:|---:|---:|---:|---:|
| N1 | 2.267 | 600 | 40 | 40 | 0 | 280 |
| N2 | 3.195 | 710 | 120 | 100 | 0 | 420 |
| N3 | 2.860 | 550 | 40 | 70 | 0 | 580 |
| N4 | 4.866 | 740 | 70 | 100 | 0 | 860 |

Son frames de control, no número de decisiones. Mantener salto veinte frames no equivale a veinte saltos. Los inicios de salto físico detectados fueron 37/58/45/64; las inversiones de dirección ordenadas, 24/56/46/80. Las inversiones incluyen ajustes y oscilaciones del buscador, no solo retornos impuestos por los mapas.

Las interacciones de los originales se producen principalmente por contacto. Que `orden de usar=0` no implica ausencia de interacción o decisiones; `Abajo+salto` corresponde a bajar plataformas, mientras que el botón específico de uso de mecanismos pertenece al rediseño.

## Qué puede llamarse espera

| Nivel | Frames neutros y quieto | Frames neutros pero moviéndose | Recarga efectiva | Recarga efectiva estando quieto |
|---|---:|---:|---:|---:|
| N1 | 9 | 271 | 56 | 0 |
| N2 | 9 | 411 | 615 | 10 |
| N3 | 10 | 570 | 33 | 0 |
| N4 | 129 | 731 | 168 | 0 |

Los frames neutros pueden conservar movimiento por inercia, caída o plataformas. La recarga puede ocurrir mientras el controlador oscila sobre el enchufe. Estas columnas se solapan; no se suman para calcular duración activa. Para categorías físicas sin solapamiento, usar la partición recargando / moviéndose sin recarga / inmóvil sin recarga de `eventos-base-n*.json`.

Tampoco puede inferirse la razón de una espera solo por los botones. Una pausa puede anticipar un ataque, sincronizar un apoyo o ser un artefacto de búsqueda. El intervalo de desactivación del jefe de N4 sí tiene un estado explícito `defeat` de 120 frames; el jugador puede seguir moviéndose durante él. No se han clasificado automáticamente las demás pausas como espera obligatoria o contenido vacío.

## Interacciones que sí ocurrieron

| Nivel | Llaves | Puertas | Sacos | Pilas | Ajo | Checkpoints | Conductores del jefe | Meta |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| N1 | 2 | 2 | 7 | 0 | 0 | 1 | 0 | 1 |
| N2 | 3 | 3 | 12 | 2 | 0 | 3 | 0 | 1 |
| N3 | 2 | 2 | 7 | 4 | 0 | 4 | 0 | 1 |
| N4 | 3 | 3 | 17 | 2 | 0 | 4 | 3 | 1 |

Son eventos observados, con frame y posición guardados. Llave y puerta son dos eventos relacionados de una misma regla; no se presentan como dos familias nuevas. Los sacos recogidos en una trayectoria no prueban una decisión deliberada de exploración. N2 se completó sin ajo: su presencia en el inventario del mapa no permite contabilizar esa mecánica como obligatoria en este testigo.

Se observaron apoyos sobre plataformas horizontales durante 22/13/286/1 frames y verticales durante 110/2/1/9 frames. El contacto breve puede ser decisivo, pero por sí solo no prueba que ese apoyo sea necesario ni que el jugador interprete su ciclo.

## Fases descriptivas, sin convertirlas en decisiones

Las rutas guardan intervalos cuyo objetivo era recoger una llave, alcanzar el límite de una zona, aproximarse a una recarga, alcanzar un punto auxiliar, cargar un conductor o llegar a la meta. Se conservan por separado en `phases` y `phaseTotals` del JSON.

Ejemplo de una distinción necesaria: en N4 los objetivos de aproximación/recarga ocupan 1.720 frames, pero la recarga efectiva ocurre solo en 168. En N1 son 510 frente a 56. Clasificar el intervalo entero como «esperar para recargar» inflaría artificialmente la espera. Del mismo modo, «tránsito a salida» puede contener amenazas o saltos y no significa pasillo vacío.

No se asigna una cantidad de decisiones significativas a esas fases sin revisar el motivo y las alternativas viables. Para contrastar la sustancia del rediseño, usar además sus eventos de cambio de estado (activar, rotar, depositar, resolver, daño al jefe) y comprobar qué acciones son necesarias frente a rutas que intentan omitirlas.

## Sesgo de búsqueda y límites comparativos

- Todos los testigos usan controles normales y el mismo motor base, y se observan con idénticos predicados.
- N2 fue buscado con una penalización menor del daño: recibe 14 impactos y consume más recursos. N1 y N4 evitan todos los golpes; N3 recibe uno. Por ello sus tiempos no representan niveles idénticos de pericia o estrategias equivalentes.
- Las pistas espaciales guían al buscador hacia plataformas, ascensores y los conductores. No asignan posiciones al personaje, pero reducen el trabajo de descubrir el camino de formas diferentes por nivel.
- La búsqueda devuelve un testigo viable, no una solución óptima. Sus retrocesos y oscilaciones son parte del contador, incluso cuando no añaden decisiones.
- Repetir un testigo confirma estabilidad determinista; no añade jugadores, aprendizaje ni rutas independientes.

La base permite comparar **controles y eventos observados**. Todavía no permite aprobar el umbral de duración activa o variedad de decisiones de la rúbrica usando una supuesta mediana humana o una equivalencia automática salto=decisión. No se asigna nota para cumplir un objetivo de puntuación.

Reproducción: `node review/campaign-v3/clasificar-referencias.cjs`.
