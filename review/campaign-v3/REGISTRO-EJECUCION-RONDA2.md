# Registro de la segunda ronda, sin nueva nota

Se conserva íntegra `PRIMERA-REVISION-PUNTUADA.md`: 7,55/10 sobre score1. Este registro añade pruebas posteriores; no reescribe el resultado histórico.

## Prerregistro y primer control del observador

Antes de medir las políticas nuevas se fijaron:

- Protocolo `PREREGISTRO-ACTIVIDAD-RONDA2.md`, SHA256 `7cbf1719f6a41f37faec4c8742d6706a6f6ed743250a0995e8a6427b429f801f`.
- Manifiesto `segmentos-preregistrados.json`, SHA256 `60a647d43bc88725908d50249ea9593c878e6097dde067c917859e905e0f0f9c`.
- Primera implementación del observador, conservada como `clasificador-comun-v1-original.cjs`, SHA256 `b9b8bda3652fae03009f0ffb558ea8e6916365892051c82272dff2d459dcb090`.

El manifiesto carga geometría N1–N8, sin ejecutar frames ni leer rutas. La primera validación del observador reproduce el testigo N1 antiguo en 3227 frames. Su vector observado es A4/B0/C2/D6/E0, total inferior 12. No se considera una referencia homogénea a tres políticas por existir ese resultado aislado.

Antes de analizar las políticas nuevas se aplica una corrección conservadora al observador: una entrada con dirección ordenada negativa no puede acreditar la necesidad de una respuesta para avanzar a la derecha, y queda no demostrada. También se corrige el contador informativo del contrafactual para no informar un frame adicional cuando agota su límite. No cambian las fronteras, unidades, deduplicación o umbrales del prerregistro. Ningún episodio N1 de esa primera validación tenía dirección de entrada negativa. Los resultados originales se preservan; las ejecuciones siguientes usan `clasificador-comun.cjs` y registran su versión/hash al agrupar resultados.

La categorización temporal del observador distingue contexto de puzle/jefe/obstáculo/encuentro, carga efectiva y movimiento/reposo restante. No calcula todavía una etiqueta semántica de actividad obligatoria por frame. El resultado lo declara con `semanticActiveFrames: null`; no se presentará como duración activa validada.

## Reintentos legales del jefe N8

`verificar-reintentos-legales.cjs` ejecuta tres testigos de origen a salida sobre la copia score1. Su auditor no dispone de ninguna llamada de restauración de snapshot, preview o asignación de vida/posición/estado. Se conservan las entradas verificadas como `verified-route-n8-retry*.json`, con hashes en `reintentos-legales-verificados.json`.

| Muerte buscada | Frame y estado de muerte | Reaparición | Final completo |
|---|---|---|---|
| Fase 1 | 13918, aviso, hp6 | 14008, hp6/fase1/idle | 16033 frames |
| Fase 2 | 13426, apertura, hp4 | 13516, hp6/fase1/idle | 15562 frames |
| Fase 3 | 13767, aviso, hp2 | 13857, hp6/fase1/idle | 15953 frames |

En cada caso hay una muerte, reaparición con dos vidas en x10948, nueva entrada al jefe, seis impactos después de reaparecer, diez puzles resueltos y salida `clear`. Esto acredita volver a completar tras morir en cada fase, incluida una muerte durante apertura. No son fixtures de arena y no participan en la comparación de políticas sin muerte. No cubren simultaneidad de último golpe/muerte ni todas las familias de puzles.

## Homogeneidad pendiente al registrar esta ronda

El autor produce balanced/cautious/speed con iguales costes nominales de tiempo/daño. Los primeros generadores difieren en política de recarga, discretización, heurística y presupuesto. Se ha señalado expresamente: nombres iguales no prueban controladores equivalentes. Se esperarán archivos congelados de la revisión armonizada para comparar juntos; no se mezclan archivos de versiones distintas bajo un nombre común. El autor propone armonizar carga, costes y techo de búsqueda; no se da esa propuesta por comprobada hasta inspeccionar su resultado.

Las capturas/pruebas nuevas de navegador se evaluarán como evidencia de otra revisión identificada, distinguiendo DOM/almacenamiento real de entradas sintéticas y hardware no probado. No se concede una nota nueva por un resumen de resultados sin contraste.
