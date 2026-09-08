# Recursos de campaña v3 — 8 de septiembre de 2026

Se conserva la dirección artística de `expansion-enemies-v2.png`: fantasía gótica,
metal envejecido, sombras azules y detalles luminosos. Los fondos anteriores siguen
siendo locales; esta entrega añade dos enemigos animados y el segundo jefe.

## Corazón del Barón

Archivos de ejecución: `campaign-boss.png`, `campaign-boss-frames.js`,
`campaign-boss-art.js`. Cuatro poses: cerrado, preparación, núcleo expuesto y roto.
No sustituye al Custodio de N4. La silueta y el modo de derrotarlo son distintos.

Imagen generada con la herramienta integrada, usando el atlas existente como
referencia de estilo. Instrucción: «Production gothic pixel-art boss atlas,
THE BARON'S HEART, levitating mechanical vampire heart, antique brass ribcage,
iron bat wings, crown, crimson crystal, cyan wires. Four poses: idle, prepare,
exposed, broken. Transparent background, no labels; reference is style only.»

Original conservado en la sesión: `exec-3952ab0e-7fe9-4815-9a79-de8dfec86a80.png`
(2172 × 724). El generador dibujó un damero; `tools/prepare-campaign-boss.py`
elimina el fondo y recorta las poses. La limpieza por código fue autorizada por
el usuario. El original permanece intacto. El juego usa transparencia real.

## Escarabajo y polilla

Archivos: `campaign-foes.png`, `campaign-foes-frames.js`, `campaign-foes-art.js`.
Atlas con cuatro poses por criatura: escarabajo de latón y polilla de alas claras,
con ojos decorativos violetas. La polilla prepara el ataque antes de lanzarse hacia
la posición marcada; el escarabajo patrulla y permite el salto encima.

Instrucción de generación: atlas de enemigos para el mismo juego gótico pixel art;
dos filas, cuatro poses por fila, escarabajo mecánico de latón y polilla de alas
crema con ojos violetas, siluetas legibles y coherentes con el atlas de referencia,
fondo transparente, sin texto. Original: `exec-5c3c2bbb-b61c-4921-b9b5-10ad67481509.png`
(1774 × 887). `tools/prepare-campaign-foes.py` limpia el fondo blanco y conserva
los anclajes corporales entre poses.

## Integración

Se cargan como imágenes locales y se dibujan con muestreo sin suavizado. Si falta
un recurso, hay representación geométrica de reserva. La galería de pruebas
comprueba explícitamente que ambos atlas estén listos. No se llama a servicios
de generación ni se descargan gráficos mientras se juega.
