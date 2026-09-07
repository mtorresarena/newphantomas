# Contraste técnico de la evaluación

Esta ronda conserva el juego sin modificaciones. Un segundo agente recibe una
copia de `index.html`, `assets/` y el adaptador de ejecución del motor. Su tarea
se inicia sin historial de conversación y excluye los informes, notas, rutas y
pruebas de aceptación anteriores. Fija sus criterios antes de leer el código.
No se le transmite una nota objetivo ni se repite su evaluación hasta aprobar.

La separación es de contexto y de material entregado: no es un aislamiento de
permisos del sistema de archivos ni una revisión por una persona externa. El
agente comparte familia de herramientas y puede compartir limitaciones del
modelo. Se documentarán tanto resultados favorables como discrepancias.

## Comprobación adicional del constructor, separada del revisor

Hipótesis previa: las rutas automáticas que demostraron viabilidad pueden depender
de una fase temporal concreta de los mecanismos. Un único recorrido acertado no
demuestra tolerancia a errores de control ni cubre todas las fases temporales.

Procedimiento fijado antes de ejecutar: para cada una de las cuatro rutas
anteriores, esperar inicialmente 0, 15, 30, 45, 60, 75, 90, 105 y 120 frames del
bucle real y después reproducir exactamente las mismas entradas. No corregir
entradas, teletransportar, curar ni quitar enemigos. Registrar llegada a meta,
muerte, posición/parte y energía. No asignar nota a partir de estos resultados.

Interpretación: si alguna variación falla, se limita la generalización de la
prueba anterior. No demuestra por sí sola un fallo del juego: un jugador puede
adaptarse a un ascensor o esperar a un enemigo. La prueba no mide tasa de éxito
humana, diversión ni accesibilidad en dispositivos físicos.

El usuario ha elegido limitar esta ronda a revisión técnica. No se inventan
sesiones humanas ni se usan agentes automáticos como sustitutos de participantes.
