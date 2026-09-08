# Cierre autorizado por el usuario

El 2026-09-08, después de conocer la nota independiente 9,38/10, el usuario indicó:

> me doy por satisfecho, lo dejamos aqui, desplegamos voy a probar

Se cierra y publica la fuente 12 ya verificada, SHA256 de `index.html`
`8c3e43a36a29dde8b30a56ad8a5112a0bdb1ccb93b0579b753f54de094362d45`.
La nota real sin redondear es 9,375. No se presenta como un 9,5 ni se modifica
el informe del revisor. La propuesta posterior para N8 parte 3 queda sin ejecutar.

Las comprobaciones finales están en `round12/`: 24 recorridos, cinco
recuperaciones, continuidad N4 hasta el título final, 18 casos de bordes y 47
comprobaciones del navegador. No equivalen a pruebas humanas; el usuario va a
probar esta versión publicada. La autorización de commit y push a main persiste.

Se añadieron capturas reales de la ayuda HTML con rectángulo explícito porque
la captura de viewport completo fallaba en la pestaña oculta. Los archivos
`help-portrait-pixi-1/2/3.png`, `help-landscape-pixi-1/2/3.png` y
`help-portrait-classic-1/2/3.png` muestran la ayuda y los controles del navegador;
son evidencia distinta de las exportaciones de lienzos. El aspecto anterior
vertical se cargó con `look=classic`; las imágenes horizontales clásicas se
tomaron después de cambiar el selector, sin forzar otro render del lienzo.
No se solicita recalificación por estas capturas posteriores.
