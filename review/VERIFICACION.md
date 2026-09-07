# Verificación de la muestra del jardín

2026-09-07. Alcance: presentación del jardín, personajes compatibles y HUD; conservar el juego existente.

## Motor y recorridos

`node tools/check-levels.js`: 14 pruebas de motor OK. Los cuatro niveles dan RESULTADO: OK,
con meta alcanzable, ninguna puerta sin abrir y sin avisos de justicia. Estados explorados:
1.108 / 2.071 / 1.939 / 2.321. Los datos de mapas, las constantes físicas y las funciones de
movimiento y progreso son los mismos que en la copia previa de index.html.

La comprobación independiente encontró dos detalles que se corrigieron: el foco/Enter del
botón comparador y el pivote del murciélago durante la animación. Las alas ya no cambian
la posición de los ojos por el recorte de cada fotograma.

## Navegador local

- Carga por HTTP local: escenario, PNG, scripts y menús sin errores ni avisos de consola.
- Inicio normal: título → introducción → juego con Espacio/Enter.
- Comparador: botón y G cambian el aspecto. Enter después de usar el botón inicia manteniendo
  el aspecto elegido. Se conserva la simulación y la posición; no se recarga el nivel.
- Revisión de escenario: robot apoyado en la plataforma, murciélago, árboles, bolsa, calaveras,
  plataformas, terreno, ácido y todos los indicadores del HUD visibles.
- Diseño móvil simulado: 390 × 844 y 844 × 390, activando el modo táctil en la herramienta
  de revisión. Los mandos se muestran y el comparador queda fuera del HUD en horizontal.
  Esto no sustituye una prueba de rendimiento o manejo en un teléfono físico.
- El escenario interior usa su fondo anterior y conserva la presentación de los personajes nuevos.

## Capturas

- jardin-renovado.png: escena de revisión del tramo del ácido con el arte nuevo.
- jardin-anterior.png: mismo tramo y posición, con el arte anterior.
- jardin-movil.png: revisión del diseño móvil vertical simulado.

Las vistas de comparación están congeladas mediante la API de pruebas, sin modificar el inicio
normal ni los mapas. El cronómetro se mantiene en 00:00 porque son escenas de revisión, no una
grabación de partida. La herramienta está en tools/visual-check.html.

## Límites de la entrega

Es una muestra gráfica jugable del jardín, no una renovación artística de los cuatro niveles.
El motor sigue siendo Canvas. No se ha publicado ni se ha migrado a Phaser. Los gráficos y
prompts quedan en assets/ART-DIRECTION.md. La copia previa está en backups/2026-09-07-jardin/.
