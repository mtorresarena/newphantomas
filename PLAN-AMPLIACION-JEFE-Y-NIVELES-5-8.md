# Phantomas: jefe del museo y ampliación a ocho niveles

Documento de entrega a otro agente · 7 de septiembre de 2026.

## 1. Encargo, alcance y límites

El usuario quiere un monstruo final al terminar el contenido actual y, después, cuatro niveles adicionales. Quiere conservar el estilo visual que ya aprobó. Este documento es exclusivamente un plan: al redactarlo no se han programado mecánicas, generado recursos ni construido pantallas.

**Interpretación de trabajo:** «otras cuatro» significa cuatro niveles completos, numerados N5–N8, cada uno compuesto por varias salas horizontales. No significa cuatro salas sueltas. El siguiente agente debe mantener esta interpretación visible al comenzar; si el usuario la corrige, ajustar el alcance antes de construir mapas.

Orden de entrega:

1. Añadir una sala final y un jefe al museo actual, N4.
2. Entregar ese cierre como una versión completa y jugable de la campaña actual.
3. Ampliar después la aventura con N5, N6, N7 y N8, conservando el encuentro de N4 como final del primer acto.
4. Dar a N8 un cierre de campaña. Este plan no encarga otros cuatro jefes: solo el monstruo de N4 es obligatorio. Un segundo jefe al final de N8 sería una ampliación que debe plantearse por separado.

Los nombres, historia, patrones y cifras de diseño que aparecen a continuación son **propuestas para ejecutar y ajustar con pruebas**, no preferencias que el usuario haya confirmado individualmente.

## 2. Carpeta correcta y estado de partida

### Copia de trabajo actual y repositorio de publicación

- Carpeta: `C:\Users\mtare\Desktop\cerebro-voz-starter\_tmp\newphantomas-deploy`.
- Entrada del juego: `index.html` en esa carpeta.
- Repositorio independiente: `https://github.com/mtorresarena/newphantomas`.
- Rama de publicación: `main`.
- Base comprobada al redactar el plan: `7107f23`, versión 1.5, efectos PixiJS en los cuatro niveles.
- Web: `https://newphantomas.turti.es/`.
- Servidor local utilizado en esta sesión: `http://127.0.0.1:8770/`. Que esa dirección exista en el documento no garantiza que el servidor siga ejecutándose al retomarlo.
- Publicación: Dokploy, Dockerfile de la raíz, contexto `.`, puerto interno 80. El push a GitHub no prueba que la web esté desplegada; verificar el despliegue por separado.

### Copia histórica que NO debe confundirse con la actual

`C:\Users\mtare\Desktop\cerebro-voz-starter\.claude\worktrees\proyecto-cartas-qr-0068d6\PROYECTOS\phantomas`

Es la carpeta original mencionada por el usuario; no es la copia actual con los últimos cambios de Safari y PixiJS. Tampoco publicar en el repositorio padre `cerebro-voz-starter`: sus commits no despliegan este juego.

La carpeta actual está dentro de `_tmp`, pero contiene un clon Git independiente y es la base usada para publicar. No eliminarla por su nombre. Si se decide trasladar el proyecto a una ubicación permanente, hacerlo como tarea explícita y actualizar las rutas; este plan no ordena moverlo.

### Comprobaciones iniciales del siguiente agente

- Leer instrucciones aplicables y revisar rama, remoto, commit y cambios locales antes de editar.
- Si `main` ha avanzado, trabajar sobre el estado vigente y conservar los cambios del usuario.
- Crear una rama de trabajo `codex/phantomas-expansion` o un worktree del repositorio correcto, sin copiar encima archivos antiguos.
- Había una captura local sin seguimiento, `review/pixi-garden-demo.jpg`. No borrarla ni incluirla accidentalmente en commits de código.
- El presente plan queda como archivo local Markdown; su creación no implica commit, push ni deploy.

## 3. Lectura técnica obligatoria

| Archivo o referencia | Qué debe entender el agente |
|---|---|
| `index.html` | `CFG`, `LEVELS`, `buildLevel`, `loadLevel`, controles, colisiones, energía, checkpoints, enemigos, estados, HUD y cierre de niveles. |
| `assets/pixi-world.js` | Presentación PixiJS actual, efectos por ambiente, superficies reutilizadas y respaldo Canvas. |
| `assets/world-art.js` | Fondos por familias, materiales, decoración, animaciones, plataformas y objetos. |
| `assets/garden-art.js`, `garden-frames.js`, `garden-terrain.js`, `garden-ui.js` | Robot aprobado, recortes/pivotes, escala, suelo, ácido y marcador. |
| `assets/world-frames.js`, `world-prop-frames.js` | Recortes reales de los atlas; no asumir celdas iguales sin medir. |
| `assets/ART-DIRECTION.md`, `assets/WORLD-ART-DIRECTION.md` | Referencias, prompts y preparación del arte aprobado. Son documentos históricos; sus menciones antiguas a Canvas no sustituyen la arquitectura v1.5. |
| `tools/check-levels.js` | Pruebas de motor y búsqueda de caminos usando las físicas reales. |
| `tools/visual-check.html` | Vistas reproducibles, recorrido visual y almacenamiento aislado. |
| `review/VERIFICACION-v1.5.md` | Evidencia y limitaciones de la versión de partida. |
| `Dockerfile`, `nginx.conf`, `README.md` | Recursos que se publican, caché y comprobaciones de despliegue. |

Consultar Context7 cuando se necesite documentación de PixiJS u otra biblioteca, conforme a la instrucción del usuario. No cambiar de biblioteca ni actualizar PixiJS incidentalmente.

### Arquitectura que debe respetarse

- Mundo lógico de 320 × 192; tiles de 16; 12 filas por segmento. La anchura varía por nivel.
- Cuatro niveles actuales: mansión, castillo de Drácula, tejados y museo.
- Simulación propia a 60 pasos por segundo. PixiJS no gobierna las físicas.
- PixiJS 8.16.0 local. El jardín usa sprites nativos. Las demás salas conservan el dibujo existente en dos texturas Canvas reutilizadas, fondo y mundo, compuestas con efectos PixiJS.
- HUD y pantallas de estado siguen en Canvas. No presentar esta arquitectura como una migración completa a sprites nativos.
- `?demo=pixi` permite comparar presentación y efectos; `?renderer=canvas` evita cargar PixiJS. El aspecto clásico también conserva su ruta Canvas.
- El verificador extrae el script principal de `index.html`. Si se extrae lógica a módulos, adaptar el verificador en el mismo cambio; no dejarlo comprobando una simulación distinta.
- Están corregidos los gestos nativos de pulsación prolongada sobre controles de iPhone/Safari. Preservar CSS, cancelación de eventos y limpieza de pulsaciones al perder foco.

## 4. Contrato visual: mantener el estilo aprobado

### Rasgos que deben permanecer

- Pixel art detallado de estética 16 bits; vista lateral de plataformas y siluetas legibles.
- Robot plateado pequeño, cabeza grande, visor oscuro y ojos cian. Reutilizar sus gráficos y animaciones actuales.
- Sombras azul marino, índigo y tonos fríos; luces ámbar en ventanas, antorchas y oro; verde luminoso en ácido.
- Materiales con textura: piedra, ladrillo, madera, metal, vegetación. Contraste del suelo y peligros suficiente para leer los saltos.
- Fondos con profundidad atmosférica; la decoración no debe confundirse con plataformas sólidas ni con objetos recogibles.
- Bruma, partículas y resplandores moderados. Las luces no deben ocultar bordes, proyectiles ni avisos del jefe.
- Mantener la tipografía bitmap del HUD, el idioma español, la iconografía y el tamaño funcional de los controles.

### Prohibiciones de dirección artística

- No sustituir los recursos actuales por dibujos de otro estilo.
- No introducir personajes 3D, acabado vectorial liso, fotografía, perspectiva isométrica ni una estética de terror realista.
- No quemar HUD, texto, plataformas o enemigos dentro de los fondos.
- No aceptar cuadrículas dibujadas como si fueran transparencia: los sprites deben tener alfa real.
- No ampliar un enemigo existente sin revisar resolución, anatomía, recorte y animación. El jefe necesita arte diseñado a su escala.
- No usar bloom global intenso, destellos rápidos repetitivos ni movimiento de cámara que comprometa la lectura.

### Procedimiento de recursos

1. Comparar cada propuesta con el jardín aprobado y una sala existente de su familia.
2. Hacer una ficha de silueta, paleta, escala lógica y animaciones antes del atlas definitivo.
3. Generar o dibujar fondos y sprites por separado; consultar la skill de generación de imágenes si se utiliza esa herramienta.
4. Medir límites y pivotes reales; mantener apoyo de pies y tamaño corporal coherentes entre fotogramas.
5. Comprobar transparencia sobre fondo claro y oscuro, halos, partes recortadas y parpadeo de tamaño.
6. Guardar recursos y metadatos localmente, con nombres descriptivos y preparación reproducible. Registrar origen y licencia cuando corresponda.
7. Revisar una captura en situación jugable antes de multiplicar el diseño a todas las salas.

Referencias locales originales, si siguen disponibles:

- `C:\Users\mtare\Downloads\ChatGPT Image 7 sept 2026, 12_58_36.png`: propuesta nocturna con efectos.
- `C:\Users\mtare\Downloads\ChatGPT Image 7 sept 2026, 09_09_01.png`: propuesta inicial.

Si faltan, usar los PNG y capturas aprobados del repositorio; no inventar un estilo sustituto.

## 5. Jefe obligatorio al final del museo (N4)

### Concepto propuesto: El Custodio del Diamante

Autómata de piedra y bronce encantado, construido con piezas de las colecciones del museo. Máscara pétrea, ojos violeta, núcleo ámbar/cian y articulaciones mecánicas. Debe encajar entre la arquitectura egipcia, las armaduras y la tecnología del robot, sin cambiar el tono aventurero.

- Tamaño inicial de referencia: aproximadamente 48 × 56 píxeles lógicos, unas tres alturas de Phantomas. Ajustar según encuadre y hitbox, sin cambiar el mundo lógico.
- Situarlo en una sala añadida después de la cámara final actual del museo.
- Mantener el diamante como objetivo narrativo de N4; el jefe impide recogerlo hasta quedar desactivado.
- No dar al robot un arma ni añadir un botón de ataque. Resolver el combate con movimiento, salto y mecanismos del escenario.

### Sala y acceso

- Antecámara con checkpoint y recarga antes de entrar; separar esos elementos de cualquier área de ataque.
- Arena de referencia: una pantalla lógica de 20 columnas, con suelo continuo y dos alturas de plataformas. Mantener margen bajo el HUD.
- Cámara fijada a los límites de la arena durante el encuentro; salida y seguimiento normal restaurados después.
- Acceso cerrado solo al entrar completamente. Nunca cerrar una barrera sobre el cuerpo del jugador.
- Tres conductores o pedestales repartidos por la arena; al menos uno alcanzable desde suelo seguro.
- No exigir una llave consumible adicional para empezar o terminar el combate. Las llaves del recorrido del museo mantienen su función.
- No colocar ácido ni caídas de muerte instantánea en la primera versión del encuentro.

### Mecánica propuesta

El Custodio anuncia un disparo de energía y fija su puntería. Phantomas debe atraerlo hacia un conductor y apartarse antes de que llegue el impacto. Cada conductor activado devuelve una descarga al núcleo y cuenta una vez. Tres descargas desactivan al jefe.

Secuencia inicial para ajustar en pruebas:

| Estado | Duración orientativa | Conducta y lectura |
|---|---|---|
| Entrada | 1–2 s | Mostrar el nombre; sin causar daño. El control vuelve antes del primer ataque. |
| Preparación | 0,9–1,2 s | Ojos y núcleo se iluminan, postura clara y sonido breve. |
| Fijar objetivo | 0,6–0,8 s | Marcador visible; posición de disparo ya fijada. No seguir al jugador a último instante. |
| Ataque | Según distancia | Un proyectil claramente contrastado, con trayectoria reproducible. |
| Recuperación | 1,2–1,8 s | Espacio para recolocarse; sin un segundo ataque superpuesto. |
| Impacto en conductor | 0,8–1,2 s | Señal visual, descarga al jefe y cambio persistente del conductor. |
| Derrota | 2–3 s | Desactivar daño inmediatamente; animación de apagado y apertura de salida. |

- Tras cada descarga, variar la posición de origen o el patrón, manteniendo avisos y rutas de escape.
- Propuesta para la última fase: alternar disparo dirigido y onda baja que se pueda saltar; no lanzar ambos a la vez hasta demostrar que siempre hay respuesta segura.
- No añadir aleatoriedad que pueda producir combinaciones imposibles. Los patrones deben poder fijarse en pruebas.
- Colisión del ataque con conductores debe resolverse antes de aplicar daño al jugador situado detrás.
- Un mismo proyectil no puede activar varios conductores ni restar varios puntos de resistencia en un frame.
- Añadir indicación compacta de tres segmentos bajo el HUD solo dentro de la arena; no superponerla a controles o mensajes de salto.
- Mensaje tutorial propuesto: «ATRÁELO HACIA LOS CONDUCTORES». Enseñar la regla en una ocasión segura antes de exigir precisión.

### Energía, muerte y repetición

- Objetivo de duración de un intento competente: 45–75 s; objetivo inicial sujeto a las físicas y al gasto real de energía.
- Calcular consumo con `CFG.DRAIN`, coste de saltos, daño y duración total. No asumir que 100 de energía bastan.
- Si hace falta ayuda, ofrecer recarga accesible con un intervalo seguro real; no compensar un patrón injusto subiendo vidas globales.
- Morir reinicia jefe, conductores y proyectiles del encuentro; conservar el botín y las llaves según las reglas actuales de reaparición.
- Reaparecer en el checkpoint de la antecámara con la invulnerabilidad habitual; nunca dentro de una barrera cerrada.
- Asegurar que perder la última vida y continuar reconstruye correctamente el encuentro.
- Una vez derrotado, no reactivarlo al retroceder en la misma partida. Reiniciar nivel sí reconstruye el desafío.
- Pausa, cambio de pestaña y pérdida de foco deben congelar el patrón y limpiar entradas; los tiempos de ataque pertenecen a la simulación, no a temporizadores independientes.

### Integración del final actual

- El contacto actual con el objeto `S` llama a `levelClear()`. En N4, condicionar la meta al jefe derrotado, de forma explícita por datos del nivel.
- Evitar que la meta vieja permita saltarse la arena: ubicarla en la salida del encuentro o mantenerla inaccesible hasta la derrota.
- No contar dos veces botín, totales o tiempo al entrar en la arena y al salir. Completar N4 una sola vez.
- En la primera entrega, con cuatro niveles, conservar un final completo después del jefe.
- Al añadir N5, convertir ese cierre en final de acto y habilitar la continuación hacia N5. No mostrar ya «fin de campaña» ni guardar el récord de ocho niveles en N4.

## 6. Cuatro niveles nuevos: propuesta de contenido

Continuidad: el diamante revela un mecanismo oculto que conduce desde el museo a las instalaciones del Barón. Los cuatro niveles forman una segunda parte con identidad propia, pero comparten materiales, enemigos y reglas de la primera.

Las cantidades de sacos, llaves y columnas son objetivos de diseño, no mapas definitivos. Ajustarlas con el verificador y partidas reales. Ningún saco obligatorio debe requerir recibir daño.

| Nivel | Propuesta | Salas | Botín / llaves orientativos | Mecánica central y meta |
|---|---|---:|---|---|
| N5 | El Jardín de las Estatuas | 5 | 18–24 sacos, 2 llaves | Rutas alta/baja, estatuas y mausoleos; obtener el sello de bronce. |
| N6 | La Torre del Reloj | 6 | 20–26 sacos, 3 llaves | Ascensores, plataformas y ritmo; obtener el engranaje maestro. |
| N7 | El Observatorio del Barón | 6 | 22–28 sacos, 3 llaves | Señales y trampas temporizadas; obtener la lente lunar. |
| N8 | La Cámara del Corazón | 6 | 24–30 sacos, 3 llaves | Combinar habilidades conocidas y abrir el tesoro definitivo. |

### N5 — El Jardín de las Estatuas

Paleta índigo, vegetación verde oscura, piedra gris azulada, faroles ámbar. Reutilizar familia del jardín/foso con fondos nuevos compatibles y monumentos propios.

1. Salida del museo: tramo corto sin peligro para presentar el cambio de ambiente.
2. Avenida de estatuas: enseñar dos alturas de recorrido y un desvío opcional de botín.
3. Mausoleos: primer circuito llave–puerta; calaveras y arañas ya conocidas.
4. Invernadero abandonado: plataformas sobre ácido con apoyo seguro antes y después; checkpoint previo.
5. Cripta del sello: encuentro de enemigos combinados y meta visible desde una posición segura.

No aumentar simultáneamente velocidad de enemigos, precisión de salto y pérdida de energía. Este nivel debe permitir retomar la aventura después del jefe.

### N6 — La Torre del Reloj

Piedra gótica, madera oscura, bronce y contraluces cian. Torre representada mediante salas laterales y ascensores dentro del encuadre existente; no introducir desplazamiento vertical global por necesidad artística.

1. Vestíbulo: presentar un ascensor aislado, sin enemigos.
2. Sala de péndulos: plataformas móviles existentes y decoración mecánica; no convertir el péndulo decorativo en peligro sin aviso visual propio.
3. Contrapesos: alternar plataformas horizontales y verticales con descansos sólidos.
4. Taller: recuperar llaves y recargar; desvío opcional con recompensa.
5. Campanario: combinación de movimiento y murciélagos, con zonas de espera protegidas.
6. Núcleo del reloj: recoger engranaje y abrir salida mediante reglas ya aprendidas.

Verificar todas las fases de las plataformas: no basta que un salto funcione cuando comienzan en una posición favorable.

### N7 — El Observatorio del Barón

Cobre envejecido, cristal azul, cielo nocturno y mecanismos astronómicos. Conectar visualmente tejados, museo y torre; evitar estética de nave espacial.

1. Azotea de acceso: anticipar el observatorio y presentar la lente como objetivo.
2. Galería de instrumentos: pequeña secuencia de señales luminosas sin daño.
3. Sala de energía: primera trampa temporizada, anunciada con forma y sonido además de color.
4. Pasarela exterior: alternar refugios y avance, sin ataques desde fuera de cámara.
5. Archivo estelar: ruta de llaves con enemigos existentes y checkpoint.
6. Gran telescopio: combinación final y recogida de la lente.

Única mecánica nueva propuesta para N5–N8: una barrera de energía con ciclo visible de aviso, actividad y descanso. Introducirla aquí, probarla de forma aislada y no reutilizar un carácter de mapa ocupado. Si el alcance se dispara, sustituirla por cañones y alarmas existentes manteniendo la secuencia de salas.

### N8 — La Cámara del Corazón

Fortaleza subterránea de piedra, metal, oro y luz roja/ámbar contenida. Sombras frías para conservar coherencia y legibilidad.

1. Puerta del corazón: mostrar los tres objetos de la segunda parte como progreso narrativo; no exigir un inventario persistente nuevo si el avance lineal ya garantiza que se obtuvieron.
2. Fundición: ácido y plataformas con rutas seguras.
3. Galería de guardianes: armaduras y cañones, sin proyectiles cruzados inevitables.
4. Máquinas antiguas: plataformas móviles y señales aprendidas en N6–N7.
5. Bóveda interior: checkpoint, recarga y último circuito de llaves.
6. Tesoro y salida: reto final de navegación, recogida y epílogo.

El cierre debe resolver la aventura y mostrar estadísticas de los ocho niveles. No introducir una persecución cronometrada ni otro jefe obligatorio sin ampliar expresamente el alcance.

## 7. Reglas de construcción de salas

- Cada segmento tiene 12 filas y anchura consistente entre sus filas. Comprobar relleno y límites antes de integrar arte.
- Propuesta general: 24–48 columnas por sala; ajustar al ritmo y evitar alargar mediante corredores vacíos.
- Para cada sala preparar una ficha Markdown: objetivo, entrada/salida, ruta principal, desvío, enemigos, peligros, llaves, puertas, recarga, checkpoint y tiempo de recorrido previsto.
- Introducir una situación nueva de forma segura, practicarla y después combinarla con una conocida.
- Verificar saltos con las físicas reales, incluyendo altura del robot, frenado, caída a través de plataformas, coyote time y posiciones de plataformas móviles.
- Añadir checkpoints por dificultad del tramo, no por una cantidad arbitraria de columnas. Ninguno debe aparecer sobre una trayectoria de daño.
- Comprobar el orden llave–puerta y las vueltas necesarias. No colocar la única llave detrás de su propia puerta.
- Mantener recogibles y objetivos distinguibles de la decoración; no reducir sus hitboxes solo por el arte.
- El ácido, las barreras y los ataques deben ser visibles antes de comprometer el salto.
- No modificar los primeros cuatro recorridos salvo el cierre de N4 y las conexiones necesarias de la campaña.

## 8. Cambios técnicos previstos, sin implementarlos en este documento

### Datos y simulación

- Ampliar `LEVELS` y temas por datos; evitar condiciones dispersas que asuman exactamente cuatro niveles.
- Auditar caracteres de mapa en `loadLevel`, `tileAt`, `isSolid`, `buildLevel` y herramientas antes de reservar símbolos nuevos.
- Modelar el encuentro con estado propio: activación, fase, contador en pasos de simulación, resistencia, conductores, derrota y bloqueo de salida.
- Separar decisiones de combate de dibujo; renderizar varias veces no debe avanzar el jefe.
- Integrar actualización con el bucle de `play`, muerte/reaparición y carga de nivel. No añadir otro bucle de físicas.
- Integrar daño con `hurt()` y `die()`, respetando invulnerabilidad, pausa y causa de muerte.
- Hacer que `levelClear()` sea seguro frente a contactos repetidos y que espere la condición del jefe solo donde corresponda.

### Presentación y recursos

- Renderizar el jefe tanto en la ruta de mundo usada por PixiJS como en Canvas. Evitar duplicar la lógica del encuentro en los renderizadores.
- Si se implementa un sprite nativo adicional de PixiJS, mantener posición, fase, límites de cámara y visibilidad equivalentes en la ruta alternativa.
- Registrar los nuevos ambientes en el dibujo de fondos, materiales, decoración y efectos. Un tema no reconocido no debe producir una sala negra.
- Reutilizar texturas, superficies y sprites. No crear canvas o atlas nuevos cada frame ni aumentar memoria por cada visita a una sala.
- Definir señales del jefe, conductor activado, invulnerabilidad y derrota antes de pulir partículas.
- Preservar el HUD normal y añadir únicamente información necesaria durante el encuentro.

### Guardado, récord y progresión

- `phantomas.unlocked` contiene un índice. Conservar el progreso antiguo y limitar valores al rango vigente; no desbloquear N5 a todos por instalar la actualización.
- `phantomas.best` representa porcentaje de campaña sin continuaciones. Un récord de cuatro niveles no es comparable directamente con uno de ocho.
- Propuesta: conservar el récord antiguo como legado y usar una clave/versionado explícito para la campaña de ocho niveles; no borrar datos existentes sin necesidad.
- Revisar `continueFrom`, `total`, `stats`, `continued`, objetivos y pantalla final con ocho niveles y con el jefe.
- No introducir persistencia de estado parcial de combate si el juego no guarda partidas parciales. Documentar la semántica efectiva de continuar.

## 9. Fases de ejecución y condiciones para avanzar

| Fase | Trabajo | Entregable y condición de cierre |
|---|---|---|
| 0. Base | Revisar repo, instrucciones, arquitectura y pruebas existentes. | Informe breve del estado y capturas base. No iniciar desde la copia histórica. |
| 1. Diseño del jefe | Ficha de arena, patrón, economía de energía y recursos. | Un diseño concreto legible, con recorrido de victoria y reintento definidos. |
| 2. Encuentro funcional | Implementar estado y colisiones con recursos temporales internos. | Se puede ganar, morir, continuar y pausar sin bloqueos; todavía no se publica como acabado. |
| 3. Arte y cierre N4 | Atlas del jefe, efectos, audio y conexión del diamante. | Final de cuatro niveles completo, coherente y verificado. Primer hito de publicación. |
| 4. N5 | Crear una sala representativa y después el nivel completo. | Validación de estilo y recorrido; todos sus objetos y puertas alcanzables. |
| 5. N6 | Construir y probar plataformas en varias fases. | Sin hundimientos, saltos dependientes de suerte ni checkpoints peligrosos. |
| 6. N7 | Resolver señales temporizadas y construir el nivel. | Trampas legibles y pruebas de sus ciclos; alternativa con mecanismos existentes si procede. |
| 7. N8 | Combinación final, tesoro y epílogo. | La campaña termina una sola vez y contabiliza correctamente ocho niveles. |
| 8. Integración | Regresión, móvil, rendimiento, guardado y documentación. | Todos los criterios de aceptación cumplidos o limitaciones expresamente documentadas. |
| 9. Publicación | Commits, integración en el repo correcto y despliegue conforme a la autorización vigente. | Verificar la versión servida, recursos y partida real en la web pública. |

No construir los cuatro niveles completos antes de revisar una sala representativa con el arte definitivo. La validación visual puede hacerse con el usuario si está disponible; no convertir decisiones rutinarias de implementación en solicitudes repetidas de permiso.

## 10. Pruebas obligatorias

### Regresión de partida

- Ejecutar las pruebas existentes del motor. La base tenía 14 pruebas correctas y las metas de los cuatro niveles alcanzables.
- Repetir alcanzabilidad de todos los niveles nuevos, incluyendo recogibles opcionales, puertas y orden de llaves.
- El BFS actual no demuestra por sí solo que un jefe se pueda vencer. Adaptar su tratamiento de la meta bloqueada y añadir una prueba del encuentro separada; no desactivar el requisito del jefe en producción para hacer pasar el verificador.
- Revisar muerte, última vida, continuar, inventario, energía, estadísticas, reloj y guardado antiguo.

### Casos específicos del jefe

- No se activa ni causa daño antes de entrar; cámara y barreras no atrapan al jugador.
- Aviso, fijación, disparo y descanso respetan sus duraciones en simulación.
- Se puede alcanzar y activar cada conductor usando controles normales.
- Cada conductor cuenta una vez; un proyectil no produce daño múltiple accidental.
- Un intento de victoria reproducible termina el encuentro con un margen de energía razonable.
- Morir en cada fase reinicia el encuentro y deja una ruta de reentrada válida.
- Pausar y reanudar no salta de aviso a impacto; perder foco no deja una dirección pulsada.
- La meta no se recoge antes de la derrota y se recoge después; completar no duplica totales.
- Cambiar Canvas/PixiJS durante una fase no altera temporizadores ni colisiones.

### Revisión visual y compatibilidad

- Ampliar `tools/visual-check.html` con las nuevas salas, fases del jefe y pantallas finales. Aislar almacenamiento como hace la herramienta actual.
- Capturas con PixiJS, efectos desactivados y Canvas: no deben faltar enemigos, plataformas, proyectiles o avisos.
- Revisar uniones de salas, cambios de cámara, ventanas estrechas, orientación vertical/horizontal y pantalla completa.
- Probar iPhone con Safari físico: mantener direcciones, pulsar salto simultáneamente, tocar repetidamente, girar pantalla y volver tras cambiar de pestaña. No declarar resuelto el gesto de lupa solo por emulación de escritorio.
- Medir una escena exigente antes y después en el mismo dispositivo. Objetivo orientativo: 60 fps en escritorio y al menos 30 estables en el iPhone probado; comunicar modelo y condiciones, no prometer rendimiento universal.
- Si la carga es excesiva, reducir primero partículas, resolución de efectos y trabajo redundante; no reducir pasos de físicas ni volver ilegibles los avisos.
- Probar ausencia de WebGL y recurso que no carga: el respaldo debe seguir permitiendo jugar y comprender el jefe.

## 11. Riesgos y respuesta prevista

| Riesgo | Prevención |
|---|---|
| Programar en la copia antigua | Confirmar remoto y base del clon independiente antes de empezar. |
| El jefe se siente de otro juego | Resolverlo con salto, posición y mecanismos; conservar robot y tono visual. |
| Agotamiento de energía inevitable | Presupuestar tiempo y saltos, probar un intento real y reintentos. |
| Bloqueo de meta o barrera | Estado de encuentro explícito, prueba de muerte por fase y cierre idempotente. |
| PixiJS oculta objetos nuevos | Cubrir ambas rutas de dibujo y escenas con todos los tipos nuevos. |
| Caída de rendimiento móvil | Medir sala exigente, reutilizar recursos y graduar efectos decorativos. |
| Se rompe el verificador al reorganizar código | Mantener la extracción/API o adaptarlas junto con el cambio, sin simulaciones duplicadas. |
| Se confunden récords de cuatro y ocho niveles | Versionar la campaña y conservar el récord legado. |
| El proyecto crece indefinidamente | Un jefe obligatorio y una mecánica nueva como máximo en la segunda parte; otras ideas a pendientes. |

## 12. Entrega final que debe dejar el siguiente agente

- Jefe de N4 y cuatro niveles nuevos completos, con el estilo aprobado.
- Fichas de salas, parámetros finales del jefe y manifestación clara de cualquier desviación del plan.
- PNG, atlas, metadatos y origen de recursos; sin llamadas a generación durante el juego.
- Pruebas del encuentro, regresión y alcanzabilidad; capturas reproducibles y evidencia de dispositivos probados.
- Documentación de progreso, récords y comportamiento al continuar.
- Historial de commits por hitos; no mezclar cambios ajenos ni incluir secretos o archivos temporales por accidente.
- Resumen final que distinga: implementado, probado, subido a GitHub y realmente desplegado.

### Criterio de aceptación global

El jugador puede recorrer los primeros cuatro niveles, vencer al Custodio mediante una regla comprensible, continuar por cuatro niveles nuevos y alcanzar un final de ocho niveles sin bloqueos. El robot, los materiales, el HUD y el tratamiento de luz siguen perteneciendo al mismo juego. Canvas y PixiJS muestran los elementos necesarios para jugar; controles y progresión conservan su comportamiento. Las limitaciones de validación, especialmente en iPhone, se explican con precisión.
