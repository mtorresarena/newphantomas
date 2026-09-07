# Seguimiento de Mejoras de Fases N5–N8

Fecha: 7 de septiembre de 2026  
Documento base de referencia: `mejoras de fases.md`  
Rama activa: `codex/phantomas-expansion`  

---

## 1. Tabla de Auditoría y Asignación de Salas

| Nivel | Sala existente | Cambio previsto | Qué aprende el jugador | Riesgo y recuperación |
|---|---|---|---|---|
| **N5** | `segs[0]` (cols 0–43) | Presentación aislada del Centinela (`K`). Suelo llano amplio, muro de choque natural, sin ácido ni otros enemigos. Mensaje tutorial *"PROVOCA SU CARGA Y APÁRTATE"*. | Observar aviso (ojos ámbar, agachado), provocar carga horizontal, esquivar caminando/saltando, pasar durante su recuperación inofensiva. | Daño normal con invulnerabilidad si choca; recuperación garantizada hacia la izquierda sin caer al vacío. |
| **N5** | `segs[2]` (cols 48–91) | Segundo encuentro con Centinela (`K`) con plataforma de descanso (`=`) y refugio de altura. | Aprovechar el desnivel vertical para provocar la carga con seguridad y avanzar por encima o por detrás. | Plataforma fija como salvavidas; caída a suelo firme sin pinchos ni ácido. |
| **N5** | `segs[4]` (cols 138–181) | Tercer encuentro combinando Centinela con enemigo conocido (murciélago `m` en altura o momia `u`), zonas delimitadas. | Medir tiempos coordinando el paso del Centinela con la cadencia de patrulla de otro enemigo. | Refugio central y margen para retirarse hacia atrás a zona segura. |
| **N6** | `segs[0]` (cols 0–43) | Presentación aislada de plataforma agrietada (`_` / `crumble`) sobre suelo seguro. Mensaje tutorial *"LAS GRIETAS AVISAN: SIGUE MOVIÉNDOTE"*. | Comprender que pisar inicia la cuenta atrás, la plataforma vibra y colapsa temporalmente, reconstruyéndose sola. | Suelo seguro inmediatamente debajo (caída de 1–2 tiles sin daño). |
| **N6** | `segs[1]` (cols 48–91) | Dos plataformas agrietadas consecutivas con descanso sólido intermedio; desvío opcional con saco `$`. | Mantener impulso y ritmo en apoyos temporales con tiempo de descanso antes del siguiente salto. | Si colapsa, caída a plataforma inferior con camino de retorno claro. |
| **N6** | `segs[2]` (cols 95–138) | Conexión de plataforma agrietada con ascensor vertical conocido (`!`) o puente móvil (`-`). | Temporización entre superficie que desaparece y plataforma móvil que llega. | Suelo seguro accesible si no se alcanza el ascensor a tiempo. |
| **N6** | `segs[3]` (cols 142–185) | Reutilización de Centinela (`K`) sobre tramo con descansos firmes. | Consolidar lo aprendido en N5 manteniendo viva la memoria del enemigo. | Refugios sólidos para esquivar la carga. |
| **N7** | `segs[0]` (cols 0–43) | Presentación aislada del Vigía espectral (`Y`). Suelo firme con columna/cobertura visible. Mensaje tutorial *"ESPERA LA SEÑAL Y CAMBIA DE SITIO"*. | Aprender que el Vigía fija la posición de Phantomas 0.4s antes de disparar y que el proyectil se bloquea con muros. | Disparo telegrafiado; movimiento lateral o cobertura lo anula por completo. |
| **N7** | `segs[1]` (cols 48–91) | Vigía espectral combinando cobertura y cambio de altura entre plataformas. | Moverse de una cobertura a otra aprovechando la ventana de recarga del Vigía. | Plataformas intermedias sólidas; caída a suelo firme. |
| **N7** | `segs[2]` (cols 95–138) | Encuentro con Vigía y tramo puntual de plataforma agrietada con descanso sólido intermedio. | No quedarse estático sobre superficie temporal mientras se esquiva la trayectoria fijada. | Descanso sólido entre las dos plataformas temporales. |
| **N8** | `segs[0]` (cols 0–43) | Secuencia A: Centinela (`K`) con refugios de altura en la entrada a la Cámara. | Confirmación de provocación y paso rápido en espacios de altura variable. | Desniveles accesibles para esquivar. |
| **N8** | `segs[1]` (cols 48–91) | Secuencia B: Plataformas agrietadas alternadas con descansos sólidos sobre charca. | Mantener ritmo seguro sin memorización a ciegas. | Apoyos sólidos intermedios visibles en todo momento. |
| **N8** | `segs[2]` (cols 95–138) | Secuencia C: Vigía (`Y`) custodiando ascenso hacia la llave. | Uso preciso de la cobertura en vertical para subir sin recibir impacto. | Muros de cobertura que detienen el orbe. |
| **N8** | `segs[3]` (cols 142–185) | Secuencia D: Combinación de 2 elementos (Centinela y plataforma agrietada o Vigía con apoyos conocidos), con batería y checkpoint antes del tramo final. | Dominio de lectura de avisos y movilidad aprendida durante la campaña. | Checkpoint justo antes; recarga de batería `b` en zona protegida. |

---

## 2. Parámetros de Diseño Calibrados

### Centinela de Piedra (`K`)
- Carácter de mapa: `K`
- Hitbox: 18 px de ancho $\times$ 24 px de alto.
- Estados: `idle` (patrulla o guardia) $\to$ `alert` (aviso 0.9s, ojos ámbar, sonido corto `SFX.bossAim()`) $\to$ `charge` (velocidad 2.3 px/f $\approx 1.5\times$ jugador, dirección fijada sin giro) $\to$ `impact` (choque con muro o fin de recorrido de 5 tiles) $\to$ `recover` (inmóvil 1.8s, inofensivo con colisión no dañina) $\to$ `idle`.
- Daño en carga: `CFG.DMG_HIT` (20 de energía, respeta invulnerabilidad de 80 frames). En `recover`: daño 0.

### Plataforma Agrietada (`_`)
- Carácter de mapa: `_`
- Hitbox: 16 px ancho $\times$ 6 px alto (misma geometría que plataforma `=`).
- Estados: `solid` (soporta peso) $\to$ `shaking` (pisada real inicia cuenta de 1.0s, vibración visual $\pm 1$ px, caída de polvillo) $\to$ `collapsed` (desaparece y pierde colisión durante 2.8s) $\to$ `rebuilding` (reaparece con parpadeo durante 0.4s; si Phantomas está en su volumen, retrasa reactivar colisión sólida para no atraparlo ni empujarlo).
- Reseteo completo tras muerte o reinicio de nivel.

### Vigía Espectral (`Y`)
- Carácter de mapa: `Y`
- Hitbox: 14 px ancho $\times$ 16 px alto (flotante).
- Estados: `idle` (patrulla sinusoidal suave) $\to$ `prepare` (se detiene, ojos violetas brillantes) $\to$ `lock` (fija $(x,y)$ objetivo 0.4s antes del disparo con retícula sutil) $\to$ `fire` (dispara 1 proyectil lineal bloqueable por sólidos, velocidad 2.0 px/f) $\to$ `recover` (ventana de avance libre de 2.0s).
- Proyectil: eliminado al chocar contra muros sólidos `isSolid()`, salir de cámara o impactar. Daño 20 con invulnerabilidad. Máximo 1 proyectil activo por Vigía.

---

## 3. Estado de Hitos

- [x] **Hito 1**: Auditoría y tabla de asignación en Markdown.
- [x] **Hito 2**: Centinela de piedra implementado y validado en motor (prueba O OK).
- [x] **Hito 3**: Integración y pulido de N5 (1380 estados, 12 sacos, 2 llaves/puertas, BFS OK).
- [x] **Hito 4**: Plataforma agrietada implementada y validada en motor (prueba P OK).
- [x] **Hito 5**: Integración y pulido de N6 (1527 estados, 10 sacos, 2 llaves/puertas, BFS OK).
- [x] **Hito 6**: Vigía espectral implementado y validado en motor (prueba Q OK).
- [x] **Hito 7**: Integración y pulido de N7 (1466 estados, 11 sacos, 2 llaves/puertas, BFS OK).
- [x] **Hito 8**: Combinaciones de N8 y equilibrio final (1495 estados, 11 sacos, 2 llaves/puertas, BFS OK).
- [x] **Hito 9**: Verificación de regresión (18/18 pruebas de motor OK, BFS 8/8 niveles OK).

---

## 4. Resultados de Verificación (100% OK)

=== Pruebas de motor (18/18 OK) ===
  OK   gracia de amanecer tras morir: dawn=89.9 vidas=2
  OK   ascensor: frames sin apoyo en 700 = 0
  OK   puente movil: frames sin apoyo en 700 = 0
  OK   quieto sobre plataforma =: frames sin apoyo=0, desvio vertical=0.00 px
  OK   quieto sobre suelo solido: frames sin apoyo=0, desvio vertical=0.00 px
  OK   enemigos terrestres mantienen su fila
  OK   tope exacto contra muro: penetracion=0.000 px, frames dentro=0
  OK   desplazamiento de plataformas moviles en el primer frame: 0.94 px
  OK   reaparicion segura (2 s de invulnerabilidad, 150 frames quieto) en todos los puntos de control
  OK   puerta col 48: sin llave cerrada=true (tope 0.00), con llave abierta=true llaves restantes=0
  OK   el acido quita una vida al caer en el
  OK   la bala de cañon hiere: energia 100 -> 79.6
  OK   placa de alarma: saltandola no se activa=true, pisandola se activa=true, expira sola=true
  OK   patrulleros dentro de su sala y fuera de los pinchos
  OK   encuentro con El Custodio: arena, telegrafiado, 3 conductores, derrota, apertura de salida y reinicio seguro
  OK   centinela de piedra: aviso telegrafiado, carga recta, daño en carrera y recuperacion inocua
  OK   plataforma agrietada: activacion al pisar, vibracion, colapso y reconstruccion segura sin atrapamiento
  OK   vigia espectral: aviso telegrafiado, fijacion previa, orbe bloqueable y recuperacion inocua

=== Verificación BFS (8/8 Niveles OK) ===
  Nivel 1: LA MANSIÓN DEL BARÓN        (177 cols, 13 sacos, 2 llaves / 2 puertas) -> OK
  Nivel 2: EL CASTILLO DE DRÁCULA      (312 cols, 23 sacos, 3 llaves / 3 puertas) -> OK
  Nivel 3: LOS TEJADOS                 (302 cols, 20 sacos, 2 llaves / 2 puertas) -> OK
  Nivel 4: EL MUSEO                    (377 cols, 30 sacos, 3 llaves / 3 puertas) -> OK
  Nivel 5: EL JARDÍN DE LAS ESTATUAS   (226 cols, 12 sacos, 2 llaves / 2 puertas) -> OK
  Nivel 6: LA TORRE DEL RELOJ          (226 cols, 10 sacos, 2 llaves / 2 puertas) -> OK
  Nivel 7: EL OBSERVATORIO DEL BARÓN   (226 cols, 11 sacos, 2 llaves / 2 puertas) -> OK
  Nivel 8: LA CÁMARA DEL CORAZÓN       (226 cols, 11 sacos, 2 llaves / 2 puertas) -> OK
