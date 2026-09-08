# Prerregistro geométrico y de contraste de ronda 5

Fijado el 2026-09-08 antes de leer testigos de ronda 5. Fuente `round5/index.html`, SHA256 `faeccc2abdcd3ccff53bd12e98f91720e6d3704f72f1f1d90a8e2606d2dfd427`. Manifiesto `segmentos-preregistrados-round5.json`, SHA256 `629be63565d870458bd526baf6adde705d11d6f917536bebf86307a1d19fc505`.

El generador es el anterior con cambios de rutas de entrada/salida; carga mapas y ejecuta cero pasos. Se mantienen las unidades, deduplicación, márgenes y contrafactuales de ronda 2. Ningún nodo, espejo, giro o apoyo nuevo añade B por sí mismo. Las notas y fuentes anteriores se conservan.

Las posiciones A/B/C/E son idénticas al manifiesto 4. D mantiene número de candidatos (N5:16, N6:11, N7:16, N8:21); cambian metadatos de anclas en N6–N8 al cambiar elementos interiores. Los candidatos completos son N5 A2/B10/C7/D16, N6 A4/B10/C6/D11, N7 A0/B10/C10/D16 y N8 A0/B10/C5/D21/E1. No son acciones acreditadas.

Antes de medir se registran estos contrastes de las variantes propuestas:

- Sellos: comprobar qué lado de cada guardián provoca una carga que alcanza el sello, si puede atravesar la cámara sin activarlos y si el retorno del guardián recupera una carga fallida. Dos guardianes siguen siendo un solo B.
- Contrapeso alto y retorno descendente: comprobar toma, transporte y depósito con controles legales; caída, devolución y muerte no deben perder el objeto irrecuperablemente. Cambiar la altura por sí mismo no demuestra una política nueva.
- Temporizados: fijar orden, coordenadas, plazo y recorrido mínimo horizontal como cota física; después verificar una ruta real, un intento con orden antiguo y caducidad/recuperación. Un límite inferior estático favorable no prueba viabilidad.
- Espejos: enumerar todas las combinaciones binarias de ángulos como fixtures, incluyendo dirección inicial de la fuente, solución inicial, soluciones válidas y dependencia de cada espejo. Esto detecta circuitos insolubles o nodos decorativos; no demuestra acceso legal a los controles. El acceso, orden práctico de ajustes y recuperación se contrastan posteriormente mediante entradas.
- Transferencia de soluciones: comparar topología completa normalizada a la compuerta; incluir la dirección inicial de la fuente en la firma. Una firma diferente es evidencia estructural, no prueba automática de una respuesta distinta ni de diversión. Conservar y publicar duplicados restantes.

`auditar-repeticion-topologica-round5.cjs` añade a la firma descriptiva la dirección efectiva de la fuente (por defecto derecha), necesaria para distinguir el nuevo flujo invertido. No cambia A–E ni los criterios de aceptación. La fuente 4 tenía ese valor por defecto; sus duplicados documentados no se revierten.

Si cambia el HTML tras una búsqueda fallida, la nueva fuente y su manifiesto se identificarán por separado antes de medirla. No se aceptan como resultados de este hash rutas generadas contra otro.
