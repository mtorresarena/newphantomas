# Cierres contrastados: contrapeso y avisos visuales

2026-09-08. Añade evidencia sin modificar la primera nota ni borrar objeciones históricas. No hay nueva calificación.

## Muerte llevando un contrapeso y completación posterior

`verificar-reintento-contrapeso.cjs` reproduce `route-n5-cautious-retry-weight.json` desde el inicio natural de N5, mediante sus controles. Guarda copia del testigo y su hash en `reintento-contrapeso-verificado.json`. No usa snapshots, posiciones preparadas, curación, invulnerabilidad ni llamadas directas a muerte/reaparición.

- Final completo en **22295 frames / 371,58 segundos de simulación**.
- Muerte en frame12590 llevando el contrapeso de prueba2-1, todavía sin resolver.
- Reaparición en frame12680, x1892, carry=null y dos vidas.
- Después vuelve a recoger/encajar ese contrapeso y llega a `clear` con las diez pruebas resueltas.

El replay se contrasta sobre el motor score1 congelado `57a34b6f…`, pese a que el testigo declara una fuente visual posterior `5ada9ce9…`. Su duración coincide exactamente. Se conserva el intento balanced anterior fallido; no se transforma un agotamiento de búsqueda en un bloqueo del juego.

Se cierra la carencia representativa de recuperación legal de la familia contrapeso. No equivale a probar cada combinación de altura/punto de control. El caso temporizado de la ronda anterior sigue acreditando caducidad→muerte→completación, no muerte con contador activo.

## P2 del aviso de polilla alta: cerrado en el caso reproducido

Se inspeccionaron directamente las tres capturas reales del mismo momento de N7:

- `moth-warning-before.png`: el aviso de la polilla alta queda tapado por la franja de pista.
- `moth-warning-after.png`: el signo aparece entero debajo de la polilla, sobre fondo oscuro y separado del HUD, con el aspecto renovado.
- `moth-warning-after-classic.png`: el mismo signo queda íntegro y separado de la pista con el aspecto anterior.

La corrección `drawCampaignWarning` coloca avisos altos debajo del cuerpo, con y mínima48. Su código se inspeccionó y las capturas verifican el resultado del caso que motivó la objeción. Se cierra el defecto reproducido; no se conserva como fallo abierto por faltar una prueba humana. Esto no certifica cada posible encuadre y solapamiento con mensajes transitorios.

## Solapamientos de paisaje táctil: cerrados en las vistas verificadas

`touch-landscape-fixed.png` y `touch-landscape-classic-fixed.png` muestran HUD, personaje y texto «ABAJO:1» íntegros. Pausa/pantalla completa tienen franja superior y el botón de comparación inferior ya no pisa el prompt. Ambos aspectos se inspeccionaron.

Se cierran los solapamientos concretos observados en esas vistas. No se afirma que una captura pruebe interacción con hardware táctil, todos los tamaños o todas las posiciones del personaje.

## Identificación de la evidencia visual

Fuente actual al verificar: `index.html`, SHA256 `5ada9ce96900d5b60feb1308d0fa25119aacdb34d9ef32c4f07ba04cab261f3d`. Las capturas fueron producidas por el autor y visualmente inspeccionadas por el revisor; no se atribuye al revisor su captura ni una sesión de juego humana.

| Archivo | SHA256 |
|---|---|
| moth-warning-before.png | e5280c92326ca91c439d2233e1f2448463554d52b222f5aed69862e60e818ebb |
| moth-warning-after.png | a010203252fe2e8dd2dfe4aacd7a880fd6f68dc5ee09d27f3fc2c9912d4b8906 |
| moth-warning-after-classic.png | 0473e773fbcf9e374652f704ec3bd00c698ee48aafc05081f699dcdebd74bffa |
| touch-landscape-fixed.png | 0e4316954a9b0ee203b90b4f2569f96934b9698d5b7cfbb492ab43b65d791b9b |
| touch-landscape-classic-fixed.png | 22b235622c8d7887b5f44d2d41d7b9f9d020329cdf9f7a0b202751618f7ea48c |

Las políticas harmonized-v2 siguen en generación. No se han medido archivos activos ni mezclado resultados anteriores bajo el mismo nombre.
