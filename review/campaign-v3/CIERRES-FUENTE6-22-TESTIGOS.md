# Fuente 6: 22 testigos y cierre de recuperaciones

Fuente `5963bcc02f71090a958df9737eca2b8fd5a96ed0a615f4a9dcbe4be4dc04ef21`. Sin nota nueva. Este documento añade evidencia a las carencias ya registradas; no reescribe los resultados ni cambia la rúbrica.

## Políticas y observadores

Se incorporaron a la copia inmutable del revisor cautious N5/N6 y speed N7/N8. Las 22 rutas disponibles pasan reproducción desde origen, normalización de órdenes manteniendo exactamente el estado final y clasificación común A–E. El lote `round6-classification/batch-22-1671bb016e3e-bounds-v1.json` declara dos ausentes: cautious N7/N8. No se han medido archivos incompletos.

| Nueva ruta | Frames | Vector A/B/C/D/E | Episodios |
|---|---:|---|---:|
| N5 cautious | 11205 | 2/10/7/5/0 | 24 |
| N6 cautious | 11346 | 4/10/6/1/0 | 21 |
| N7 speed | 9378 | 0/10/10/10/0 | 30 |
| N8 speed | 12256 | 0/10/5/8/6 | 29 |

Sin muertes ni episodios inconclusos en las cuatro rutas. Superan sus mínimos comparables A–E, conforme a `comparacion-round6-parcial-22.json`. No se equipara ese resultado con diversión o aceptación total.

V2 conserva exactamente su algoritmo, en `semantic-windows-v2-round6/`. Cautious N5 registra 5053 frames de ejecución de objetivos, 2370 de tránsito, 858 de espera de mecanismo, 174 de recarga de necesidad no atribuida, 2748 sin atribuir y 2 de recogida opcional. Que cautious espere más y se mueva menos no añade contenido ni demuestra una experiencia humana diferente.

## Cuatro reintentos reproducidos de forma independiente

`verificar-recuperacion-round6.cjs` reproduce exclusivamente controles de producción desde el origen del nivel sobre el HTML congelado. No restaura snapshots, llama a muerte directamente, cambia posiciones/ángulos/recursos ni elimina enemigos. Valida comandos, fuente, frames, estado final, diez pruebas resueltas y vidas. Los registros originales se copian por hash y no se sustituyen. `recovery-round6-verified/batch-five.json` conserva estados y eventos; el quinto caso es el retorno del guardián descrito abajo.

| Caso | Fallo y recuperación observados | Final |
|---|---|---|
| Peso alto N5 5-2, cautious | Muerte en 19584 llevando `5-2`; reaparición 19674, transporte vacío, nodos inactivos y puerta cerrada; recoge/encaja después | 21726 frames, 2 vidas |
| Espejo mixto N7 5-2 | Muerte 19156 después de alterar A y B; reaparición 19246 restaura exactamente sus ángulos iniciales, puerta cerrada; vuelve a resolver | 20819 frames, 2 vidas |
| Reloj de retorno N6 4-2 | Caducidad 9060 con progreso previo; nodos/progreso/plazo se reinician y la puerta cierra; resuelve posteriormente | 11977 frames, 3 vidas, sin muerte |
| Reloj final N6 5-2 con ascensor/ácido | Muerte 20991 con progreso 1 y 257 frames de plazo todavía vigentes; reaparición 21081 reinicia progreso/plazo/puerta; usa elevador de nuevo y resuelve | 22988 frames, 2 vidas |

En el espejo, la enumeración lógica independiente anterior confirma que A estaba inicialmente correcto y B inicialmente incorrecto. El replay altera ambos antes de morir; el verificador compara el estado real de muerte y reaparición con la mezcla inicial. No se introduce la solución del fixture dentro del replay.

En el reloj final se observan 228 frames de contacto con plataforma móvil después de reaparecer, entre 21624 y 22661. El hecho fuerte es accesibilidad y salida reales tras fallo, no que toda esa espera sea inevitable o mínima. Este caso prueba muerte activa en el cierre; el caso de caducidad sin muerte prueba la variante de retorno 4-2. No se declara un ensayo exhaustivo de toda combinación de caducidad/muerte/plataforma.

**Cierre de cobertura:** las cuatro nuevas relaciones de geometría/estado tienen ahora fallo recuperable y resolución legal, además de los 14 bordes ya verificados. No queda un fallo crítico nuevo reproducido abierto en ellas.

## Carga fallida y retorno del guardián

La propia ruta cautious N5 aporta el quinto caso sin necesitar una ruta artificial adicional:

- Guardián 0 de 5-1 carga en 8658, falla en 8729 sin activar sello; termina lejos de su pedestal, x8206 frente a origen x8367.
- Pasa de recuperación a retorno en 8839 y llega físicamente al pedestal en 9018. No se cambia su estado desde el observador.
- Vuelve a alertar/cargar, activa el primer sello y el segundo guardián completa el puzle en 9298. La nave termina sin morir.

Antes de resolverse el puzle hay 197 frames neutrales e inmóviles del jugador coincidiendo con un guardián en `return`: 179 siguen como `unattributed` en V2 y 18 como `mechanism_wait` por otra condición de espera reconocida. Hay asimismo 106 frames neutrales con `recover`, etiquetados como espera. Son subconjuntos descriptivos de los frames existentes; no se suman como episodios ni se cambian sus etiquetas retrospectivamente. El retorno neutral ya identificado puede explicarse como latencia observada, sin afirmar que el controlador haya esperado el mínimo.

El fallo de búsqueda previo no acredita softlock. Este replay muestra explícitamente una vía legal de recuperación del mismo guardián y ambos sellos.

## Continuidad, presentación y procedencia

`round6-connected-replays-independent.cjs` se ejecutó sobre la copia congelada: tres reproducciones deterministas de cada balanced N5–N8 y una secuencia real de teclas desde N4 hasta el título final, con pausa/reanudar y congelación del reloj comprobadas. Todo pasa; `round6-connected-replays-independent.json` conserva fuente, eventos y transiciones. Tres repeticiones prueban determinismo, no tres políticas ni tres jugadores.

Se inspeccionaron imágenes reales del autor: `mirrors-touch-landscape.png`, su aspecto clásico, `mirrors-touch-portrait.png`, `mirror-cd-legal.png` y `clock-final-help-legal.png`. A/B y C/D/R tienen etiquetas distinguibles; C/D no colisionan con el HUD. La pista pausada del reloj explica embarcar antes de activar, descenso y plazo, y aparece íntegra en la captura.

**Corrección explícita de una inferencia del revisor:** las primeras tres imágenes se identificaron inicialmente en un mensaje como el tutorial por mostrar solo dos espejos. Esa inferencia no estaba justificada: una captura no muestra necesariamente todo el circuito. Son la cámara izquierda del circuito avanzado; la captura derecha posterior muestra C/D. Se retira la identificación de tutorial, no la observación inicial de que C/D todavía no se veían en esas tres imágenes. No se mantiene esa inferencia como defecto.

El reporte de navegador del autor registra 35 PASS, con alcance explícito de DOM/storage/render y controles sintéticos. No incluye SHA dentro del JSON; su ubicación en `round6/` no es, por sí sola, una prueba criptográfica del documento cargado. Se ha solicitado asociar esa procedencia. Las capturas inspeccionadas no son una sesión de navegador ejecutada por el revisor ni hardware físico.

Los cuatro logs de geometría dicen OK, pero sus «caminos mínimos ~202/252 s» para N5/N6 son mínimos aproximados de su modelo BFS, no cotas de tiempo del motor: las rutas legales ya verificadas terminan antes. No se usan esos tiempos como duración activa o necesidad mínima.

## Qué continúa abierto

Faltan los dos testigos cautious N7/N8 para la muestra de 24 y la revisión de la ayuda genérica de espejo anunciada para otra fuente. La ayuda particular ya es visible; el texto genérico de fuente 6 sigue siendo el previamente observado. Una fuente posterior deberá conservar su SHA y contrastar exactamente qué cambió antes de reutilizar rutas.

No se asigna nota provisional. La geometría cambiada ya tiene recuperación representativa y continuidad propia; los límites de muestra, procedencia visual y experiencia humana se mantienen separados de los defectos de diseño reproducidos.
