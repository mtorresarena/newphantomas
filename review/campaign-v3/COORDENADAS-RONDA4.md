# Delimitación geométrica de ronda 4

Fijada antes de leer rutas de ronda 4, el 2026-09-08. Fuente `round4/index.html`, SHA256 `8eef8b28ed89122e03c5eb04ebed91d5923fe87b51b6b12dd6f999699e35c65b`.

`preregistrar-segmentos-round4.cjs` solo cambia las rutas de fuente y salida del generador de ronda 3; ejecuta cero pasos y no lee testigos. Manifiesto `segmentos-preregistrados-round4.json`, SHA256 `b06a8b64c6a2fd92fa29669d6acf66eba01ef91abe30b9da3128c85ab9968968`.

El único episodio delimitado que cambia es la llave de N6 parte 4: de (7844,38) a **(7572,38)**. La puerta sigue en la columna 511, x 8176–8192. C permanece en columnas 480–488, observación 7664–7824. Los demás candidatos A/B/C/D/E son idénticos a ronda 3; no hay unidades nuevas por reubicar la llave.

Se conservan el prerregistro semántico de las tres excursiones y la misma métrica. La hipótesis de diseño es que la llave requiere avanzar a un apoyo derecho, volver hacia la izquierda y regresar al cruce. Debe observarse con controles legales; la intención del mapa no prueba esa dependencia.

Se repetirán las cuatro políticas simples desde dos prefijos legales distintos: entrada anterior al ascenso y apoyo derecho de la excursión si el testigo permite capturarlo antes de recoger la llave. Se publicará posición/altura inicial para no presentar una respuesta simple desde una plataforma ya alcanzada como un atajo desde el origen. Si un prefijo no aparece naturalmente, se declara; no se inyecta un personaje sobre él y se etiqueta como recorrido legal.
