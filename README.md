# Phantomas: La Mansión del Barón

Plataformas horizontal en HTML5/Canvas inspirado en **Phantomas** (Dinamic, ZX Spectrum, 1986):
el mismo robot ladrón (cabeza esférica enorme, ojos luminosos, cuerpo pequeño), los mismos enemigos
(murciélagos, arañas, calaveras, fantasmas, armaduras, cañones, llamas) y la misma dinámica (energía
que se agota, llaves, sacos de dinero, porcentaje de botín), pero con un **aspecto moderno**: lienzo
de 320·S × 192·S (S = 2..6 según pantalla y densidad de píxeles; hasta 4 en táctil), con el arte prerrenderizado a 6× y recalculado al cambiar de tamaño o entrar en pantalla completa con formas vectoriales suaves, degradados, brillos y sombras, personajes animados de forma
procedural, tiles en alta resolución, fondos con parallax, iluminación dinámica, viñeta y música
chiptune. No es una réplica de 8 bits: el mundo lógico sigue siendo de 320×192 con tiles de 16 px
(físicas y niveles), pero todo se dibuja a resolución de pantalla.

Un solo archivo, sin dependencias: abre `index.html` en cualquier navegador moderno o sírvelo
con `python -m http.server`.

## Despliegue

Imagen Docker con nginx (`Dockerfile` + `nginx.conf`), pensada para Dokploy:

```bash
docker build -t phantomas .
docker run --rm -p 8080:80 phantomas
```

En Dokploy: aplicación de tipo **Docker/Dockerfile** sobre este repositorio, rama `main`,
puerto interno **80**, y el dominio con Let's Encrypt en la pestaña *Domains*.
El HTML se sirve con `Cache-Control: no-store`, así que cada despliegue se ve al recargar.

## Cómo se juega

| Acción | Teclado | Táctil |
|---|---|---|
| Mover | Flechas o WASD | Botones ◀ ▶ |
| Saltar | Espacio, ↑, W, Z o K | Botón SALTO |
| Bajar de plataforma | ↓ + salto | ▼ + SALTO |
| Pausa | P, Esc o Start del mando | Botón ❚❚ (cualquier toque reanuda) |
| Silenciar | M | — |
| Pantalla completa | — | Botón ⛶ |

También funciona con **mando** (cruceta o stick, A/B para saltar, Start para pausar). Si la ventana
pierde el foco, el juego se pausa solo.

- La **energía baja sola** (como en el original). Se recarga en los **enchufes** (`E`) y con las **pilas**.
- Cada golpe resta energía y da invulnerabilidad breve. El ácido y caer del mapa quitan una vida.
- Las **llaves** abren la siguiente puerta. Los **sacos** suman botín; el rango final depende del porcentaje.
- Los **puntos de control** (estatuas) guardan la posición de reaparición.
- Saltar también gasta un poco de energía. Los pinchos hacen mucho daño y te lanzan hacia arriba.
- En el castillo, el **ajo** hace huir a Drácula. En el museo, las **momias** aceleran cuando te ven.
- Hay **plataformas móviles** (ascensores y puentes) en once salas y, en los tejados, un reloj de **amanecer**: si llega a cero pierdes una vida.
- Las **placas de alarma** (armería, museo, galería) despiertan a los guardianes durante un minuto: armaduras y momias van a 1,8× y las ratas a 1,4×, los cañones disparan el doble y los fantasmas te detectan desde más lejos. Se pueden saltar; la ruta alta las evita.
- El mejor porcentaje de botín y el último nivel alcanzado se guardan en el navegador: en el título, **C** continúa desde ese nivel, y tras un fin de partida se puede seguir en el nivel donde se perdió (Espacio) o volver al título (T).

## Niveles

La dificultad va de menos a más: el nivel 1 es corto y didáctico, el 4 el más largo y exigente.

1. **La Mansión del Barón** (177 columnas): jardín, vestíbulo con entreplanta, biblioteca a oscuras (las velas marcan el camino y la llave obliga a volver atrás con un ascensor) y torre. Meta: la caja fuerte en lo alto de la torre.
2. **El Castillo de Drácula** (312): foso, patio de armas de techo bajo, armería con cañones cruzados, mazmorras, torre del homenaje de tres pisos, campanario con ascensores y la cámara del ataúd, donde Drácula te persigue. Meta: el ataúd.
3. **Los Tejados** (302, con reloj de amanecer): azoteas con caídas mortales, desván con pozo y ascensor, almacén del puerto de tres pisos, alcantarillas, puentes colgantes móviles y la azotea escalonada. Meta: el globo.
4. **El Museo** (325): sala de armaduras, sala egipcia con pirámide y momias, galería de techo bajo con cañones, archivo de tres pisos, salón de baile, catacumbas y la cámara del diamante con fuego cruzado. Meta: el diamante.

Cada nivel tiene su propia música (jardín, castillo, ciudad, museo).

## Físicas (fijas)

Los niveles se diseñan alrededor de estas constantes, no al revés:

```
JV=5.5  GRAV=0.23  SPEED=1.5  MAXFALL=6.5
salto: 63 px de altura, 50-70 px de alcance a nivel (desde parado o en carrera), ~48 frames en el aire
techo en la fila 0: las plataformas de las filas 3-4 limitan mucho el salto
```

Reglas prácticas de diseño (tile = 16 px, 12 filas, suelo en la fila 10):
- Subir 3 filas: hueco horizontal de 2 tiles como máximo.
- Subir 2 filas: hueco de 3 tiles como máximo.
- Mismo nivel desde filas ≥ 6: hueco de 3 tiles como máximo (4 es marginal, evitar).
- Desde la fila 5: hueco de 2. Desde la fila 4: hueco de 1. Desde la fila 3: solo adyacente.

## Verificador de niveles

```bash
node tools/check-levels.js        # todos los niveles
node tools/check-levels.js 2      # solo el nivel 3 (índice 0)
```

Tarda unos 100 s. Primero ejecuta catorce **pruebas de motor** (gracia de amanecer, ascensor y puente
móvil, reposo sobre plataforma y suelo, enemigos que no caen de sus pisos, tope exacto contra muros,
plataformas móviles sin salto inicial, reaparición segura, puertas, ácido, balas, placas de alarma y patrulleros que no salen de su sala ni pisan pinchos). Después carga cada
nivel en un sandbox de Node con stubs de canvas, quita los enemigos (las plataformas móviles siguen
activas) y explora por búsqueda en anchura todas las posiciones alcanzables usando el motor de físicas
real (`updatePlayer`); las puertas solo se abren cuando el recorrido ha reunido más llaves que puertas
abiertas, así que el orden llave→puerta se comprueba de verdad. Informa de llaves, sacos, pilas, ajos y
metas inalcanzables, de puertas que nunca se abren y del tiempo mínimo hasta la meta frente al reloj
de amanecer. Además emite **avisos de justicia**: murciélagos cuyo recorrido permite
un choque junto a un hueco o ácido, fantasmas cuyo radio de caza cubre ácido, enemigos que nacen
sobre ácido o pegados a un punto de control, y objetos colocados sobre pinchos. Debe dar
`RESULTADO: OK` sin avisos en los cuatro niveles antes de tocar un mapa.

## Editar niveles

Los mapas están en `LEVELS` dentro de `index.html`, como segmentos de 12 filas de texto. Leyenda
completa en el comentario que precede a `LEVELS`. Cada segmento tiene un tema (`t`) definido en
`THEMES` (colores de muro, fondo o cielo, oscuridad y rótulo). Cada nivel define `goal` (sprite de
la meta), `song` y opcionalmente `dawn` (segundos del reloj de amanecer). Las constantes de ajuste
(daños, velocidades, radios, cadencias) están agrupadas en `CFG`; las físicas del jugador no se tocan.

## Cambios

- **v1.2 (2026-09-06)**: patrulleros ligados a su sala y que respetan los pinchos (con prueba propia en el verificador), corrección del fundido de música que podía dejar el nivel mudo, récord invalidado por cualquier continuación con contador visible, y ajustes de recorrido de guardias y ratas.
- **v1.1 (2026-09-06)**: placas de alarma en tres salas, plataformas móviles en ocho salas más, botones táctiles/mando para continuar y volver al título, récord protegido al continuar, continuar desde el nivel alcanzado, escala nítida en escritorio (hasta 6×) recalculada al redimensionar, fundido real entre canciones, motivos de fondo más presentes y pozos de puerta distintos por nivel, causa de la muerte en la pantalla final, constantes de IA en `CFG`, cota de amanecer del verificador con desvíos por llaves.

- **v1.0 (2026-09-06)**: capa gráfica vectorial a resolución de pantalla, ocho salas rediseñadas (entreplantas, ida y vuelta, rutas alta/baja, secretos), sonidos de eventos y percusión, oscuridad por zona y luz propia de los enemigos, tiles de suelo y plataformas por material, verificador con orden real llave→puerta y reaparición segura.
- **v0.9 (2026-09-05)**: corrección del hundimiento de 0,7 px en reposo (`moveY`), pruebas de motor, plataformas móviles, momias, reloj de amanecer, cuatro músicas con sección B.
- **v0.5 (2026-09-05)**: primera versión jugable de 4 niveles con verificador de alcanzabilidad.

## Estructura del código (index.html)

1. Constantes (`CFG`), lienzo a escala `S` (2..6, arte a `S_ART=6`), utilidades de dibujo (`rrect`, `circ`, `lgr`, `rgr`, `glow`) y texto.
2. Arte procedural: `drawPhantomas`, `drawBat`, `drawGhost`, `drawGuard` (armadura y momia), `drawRat`, `drawVamp`, `drawCannon`, `drawFlame`, objetos, metas, puertas y decoración prerrenderizada.
3. Temas y tiles en alta resolución (`tile()` cachea un lienzo por tema y carácter).
4. `LEVELS` y `buildLevel`.
5. Audio: efectos por osciladores y secuenciador de música.
6. Entrada (teclado, táctil, mando; pausa automática al perder el foco).
7. Estado, carga de nivel, físicas (`moveX`, `moveY`), plataformas móviles, jugador, enemigos, cámara.
8. Render: cielo/fondo, decoración, tiles, objetos, enemigos, jugador, partículas, oscuridad, HUD, pantallas.
9. Bucle a 60 Hz con respaldo por `setInterval` si `requestAnimationFrame` no dispara.
