Copia y pega esta instrucción en el agente constructor:



```text

Quiero que mejores los cuatro últimos niveles de Phantomas, N5–N8, introduciendo enemigos y desafíos de forma progresiva. Las pantallas ya están implementadas: parte de su estado actual y adapta lo necesario, conservando su diseño y el trabajo existente.



Tu objetivo es que cada nivel aporte decisiones nuevas y que la dificultad aumente mediante combinaciones comprensibles. No te limites a añadir más enemigos, acelerar sus movimientos o aumentar el daño.



Trabaja sobre el repositorio y la rama donde estás desarrollando actualmente. Antes de editar, confirma que contienen las últimas pantallas implementadas. No sustituyas ese trabajo por una copia antigua.



Lee las instrucciones aplicables y el documento PLAN-AMPLIACION-JEFE-Y-NIVELES-5-8.md, si está disponible. Esta instrucción actualiza su propuesta de enemigos y desafíos para N5–N8. Conserva el alcance y las decisiones ya implementadas del resto del juego.



1\. ALCANCE



Implementa estas tres novedades:



\- Enemigo 1: Centinela de piedra.

\- Desafío de escenario: plataforma agrietada que cede temporalmente.

\- Enemigo 2: Vigía espectral.



Distribúyelas así:



\- N5: presentar y desarrollar el Centinela.

\- N6: presentar y desarrollar la plataforma agrietada.

\- N7: presentar y desarrollar el Vigía.

\- N8: combinar los elementos aprendidos, sin introducir otra mecánica obligatoria.



Mantén el jefe final del museo y las demás funciones que ya estén implementadas. No añadas más jefes ni un botón de ataque como parte de este encargo.



Los valores numéricos de esta instrucción son puntos de partida para ajustar con pruebas. Las condiciones de claridad, justicia y ausencia de bloqueos sí son requisitos.



2\. PRIMERO: AUDITAR LOS NIVELES ACTUALES



Antes de colocar elementos:



\- Revisa los mapas reales de N5–N8.

\- Identifica rutas principales y opcionales, checkpoints, recargas, llaves, puertas, plataformas móviles y objetivos.

\- Revisa enemigos y mecánicas nuevas que ya existan.

\- Si ya hay un elemento equivalente a uno de los propuestos, reutilízalo o adáptalo; evita duplicar sistemas.

\- Identifica salas apropiadas para enseñar, practicar y combinar cada novedad.

\- Comprueba el espacio visible de la cámara y el espacio ocupado por los controles en móvil.



Deja una tabla breve en un Markdown de seguimiento:



Nivel | Sala existente | Cambio previsto | Qué aprende el jugador | Riesgo y recuperación



No rehagas todos los mapas para encajar esta propuesta. Prefiere ajustes locales. Si una sala no ofrece espacio suficiente para una situación justa, utiliza otra o modifica solo ese tramo.



Tras esta revisión, comienza a implementar. No te detengas en otro plan.



3\. PRINCIPIO DE PROGRESIÓN



Para cada novedad sigue este orden:



A. Presentación:

Un ejemplo aislado, visible y fácil de entender.



B. Práctica:

Una variación sencilla que confirme que el jugador comprendió la regla.



C. Combinación:

La novedad junto a una mecánica ya conocida.



D. Dominio:

Una secuencia más exigente, con una solución clara y margen de recuperación.



La primera aparición nunca debe ser la situación más difícil.



No combines dos elementos nuevos antes de que el jugador haya podido aprender cada uno por separado.



4\. ENEMIGO 1: CENTINELA DE PIEDRA



Identidad visual:



\- Guardián de piedra gris azulada con detalles de bronce y ojos ámbar.

\- Debe encajar con las estatuas, la arquitectura gótica y el pixel art aprobado.

\- Silueta reconocible y distinta de las armaduras existentes.

\- Tamaño orientativo: 18–22 píxeles lógicos de ancho por 24–28 de alto.

\- Ajusta tamaño y colisión a las físicas reales; debe poder esquivarse con el salto normal en las situaciones donde esa sea la solución.

\- Las partes decorativas que sobresalgan no deben ampliar injustamente la hitbox.



Función de juego:



Obliga a provocar una carga, apartarse y aprovechar su recuperación para pasar.



No requiere atacar, saltar encima del enemigo ni aprender un botón nuevo.



Estados:



1\. Vigilancia:

Permanece quieto o patrulla lentamente dentro de su zona.



2\. Detección:

Detecta al jugador dentro de una distancia limitada y con una línea de visión razonable.



3\. Aviso:

Se agacha o prepara el cuerpo, ilumina los ojos y produce un sonido corto.



4\. Carga:

Avanza horizontalmente hacia el lado elegido.



5\. Impacto o agotamiento:

Se detiene al chocar con un obstáculo o terminar su distancia máxima.



6\. Recuperación:

Queda inmóvil durante una ventana suficiente para que Phantomas lo supere.



7\. Regreso:

Vuelve a vigilancia sin activar otra carga instantáneamente.



Valores iniciales orientativos:



\- Aviso: 0,8–1,1 segundos.

\- Carga: aproximadamente 1,4–1,7 veces la velocidad horizontal del jugador.

\- Recorrido máximo: 4–6 tiles.

\- Recuperación: 1,5–2 segundos.

\- Distancia de detección: limitada al tramo visible y a su zona de patrulla.



Ajusta estos valores si el salto y la velocidad actuales no permiten una respuesta cómoda.



Reglas obligatorias:



\- La dirección queda fijada al comenzar la carga.

\- No gira para perseguir al jugador durante esa carga.

\- No inicia ataques desde fuera de cámara.

\- No atraviesa paredes, puertas cerradas ni límites de su sala.

\- No se precipita sobre ácido o huecos, salvo que esa conducta forme parte explícita de un encuentro diseñado y probado.

\- No puede acumular impactos de contacto en cada frame: usa el sistema existente de daño e invulnerabilidad.

\- Durante su recuperación, el contacto es inofensivo y su aspecto lo comunica.

\- El jugador debe disponer de una forma visible de pasar.

\- No lo coloques en un pasillo bajo donde sea imposible saltarlo y tampoco exista refugio.

\- Su comportamiento debe ser reproducible para las pruebas.



Primera aparición en N5:



\- Suelo firme y bastante espacio.

\- Un único Centinela.

\- Sin ácido, proyectiles ni otros enemigos.

\- Pared u obstáculo que haga evidente su choque.

\- Posición inicial que permita observarlo antes de entrar en su alcance.

\- Mensaje breve, una sola vez: “PROVOCA SU CARGA Y APÁRTATE”.



Desarrollo posterior en N5:



\- Segundo encuentro con una plataforma de refugio.

\- Tercer encuentro junto a un enemigo ya conocido, separando sus zonas de peligro.

\- Desvío opcional de botín que premie aprovechar bien la recuperación.

\- Evitar repetir exactamente la misma habitación con más Centinelas.



5\. DESAFÍO: PLATAFORMA AGRIETADA



Identidad visual:



\- Mismo lenguaje de piedra o madera que el nivel donde aparezca.

\- Grietas visibles que la distingan de una plataforma normal.

\- La silueta debe seguir permitiendo leer su superficie de apoyo.

\- El aviso no puede depender exclusivamente del color.



Comportamiento:



1\. Intacta:

Se comporta como una plataforma normal.



2\. Activada:

Cuando el jugador se apoya realmente sobre ella, comienza una cuenta atrás.



3\. Aviso:

Tiembla, ensancha sus grietas y suelta unas pocas partículas.



4\. Colapso:

Pierde la colisión y desaparece o cae visualmente.



5\. Reconstrucción:

Vuelve después de un tiempo claramente definido.



Valores iniciales orientativos:



\- Desde apoyo hasta colapso: 0,9–1,2 segundos.

\- Ausencia: 2,5–3,5 segundos.

\- Aviso de reconstrucción: aproximadamente 0,4 segundos.



Reglas obligatorias:



\- Solo el apoyo real del jugador activa la cuenta; pasar por debajo no la activa.

\- Una vez activada, la cuenta no se reinicia por saltar brevemente.

\- El estado de la plataforma controla tanto su dibujo como su colisión.

\- Al colapsar debe liberar correctamente al jugador si sigue encima.

\- La reconstrucción nunca debe encerrar, empujar dentro de un sólido o atravesar injustamente al jugador.

\- Si su volumen está ocupado, retrasa la recuperación de la colisión hasta que sea seguro.

\- No debe acumular canvas, texturas o temporizadores nuevos en cada ciclo.

\- Debe reiniciarse de manera coherente al morir o cargar el nivel.

\- Pausar congela su estado.

\- La ruta principal nunca puede quedar bloqueada permanentemente.



Primera aparición en N6:



\- Una plataforma agrietada sobre suelo seguro.

\- Caer permite recuperarse inmediatamente.

\- Sin enemigos.

\- El siguiente apoyo se ve antes de saltar.

\- Mensaje breve, una sola vez: “LAS GRIETAS AVISAN: SIGUE MOVIÉNDOTE”.



Desarrollo posterior en N6:



\- Dos plataformas consecutivas con un descanso sólido.

\- Una plataforma agrietada que conecta con una plataforma móvil conocida.

\- Un desvío opcional que exige mayor continuidad, con recompensa visible.

\- Solo después de esas enseñanzas, una secuencia sobre un peligro real.



No diseñes largas cadenas que exijan memorizar saltos fuera de cámara. Cada tramo comprometido debe mostrar su siguiente apoyo o un destino seguro reconocible.



6\. ENEMIGO 2: VIGÍA ESPECTRAL



Identidad visual:



\- Espectro flotante de tonos azulados o violetas.

\- Núcleo o mirada luminosa que marque claramente cuándo prepara un disparo.

\- Diferenciarlo del fantasma existente mediante silueta, postura y comportamiento.

\- Mantener el estilo aventurero; no introducir terror realista.

\- Tamaño aproximado cercano al de los enemigos actuales para no saturar el encuadre.



Función de juego:



Obliga a leer un aviso, cambiar de posición o utilizar cobertura.



Estados:



1\. Patrulla:

Movimiento lento y acotado.



2\. Preparación:

Se detiene o adopta una postura reconocible.



3\. Fijación:

Señala una posición concreta del jugador.



4\. Disparo:

Lanza un único proyectil hacia esa posición.



5\. Recuperación:

Deja una ventana clara para avanzar.



Valores iniciales orientativos:



\- Aviso completo: 1–1,3 segundos.

\- La posición objetivo queda fijada al menos 0,4 segundos antes del disparo.

\- Velocidad del proyectil: aproximadamente 1,2–1,5 veces la velocidad horizontal del jugador.

\- Recuperación después del disparo: 1,8–2,5 segundos.

\- Un proyectil activo por Vigía en la primera versión.



Reglas obligatorias:



\- El proyectil no persigue al jugador después de salir.

\- La dirección no cambia a última hora.

\- No dispara a través de paredes ni desde fuera de cámara.

\- La cobertura visual que parece sólida debe bloquear el proyectil.

\- Destruir proyectiles al impactar, superar su alcance o abandonar su zona útil.

\- Limitar tanto proyectiles por enemigo como el total simultáneo.

\- Los proyectiles deben contrastar con todos los fondos donde se utilicen.

\- No ocultar la trayectoria mediante partículas o resplandores.

\- No colocar un Vigía de forma que su único punto de cobertura sea una plataforma que colapsa antes de poder salir.

\- Usar el sistema común de daño e invulnerabilidad.



Primera aparición en N7:



\- Un único Vigía.

\- Suelo firme y cobertura sólida visible.

\- Sin plataformas que se rompan ni cargas de Centinela.

\- Espacio para esquivar caminando.

\- Mensaje breve, una sola vez: “ESPERA LA SEÑAL Y CAMBIA DE SITIO”.



Desarrollo posterior en N7:



\- Pasar de una cobertura a otra.

\- Esquivar un disparo mientras se utiliza una plataforma normal.

\- Un encuentro con plataforma agrietada, pero con un apoyo sólido intermedio.

\- Un desafío opcional de botín con mayor exposición.

\- Evitar dos Vigías disparando de forma sincronizada desde lados opuestos, salvo que se demuestre una ruta segura y evidente.



7\. DISTRIBUCIÓN POR NIVELES



N5 — APRENDER A PROVOCAR Y ESQUIVAR



\- Mantener el ritmo de exploración.

\- Introducir el Centinela durante el primer tercio o cuando el mapa ofrezca una sala adecuada.

\- Dar al menos dos oportunidades distintas para practicar.

\- Cerrar con una combinación sencilla de Centinela y plataformas conocidas.

\- No añadir todavía plataformas agrietadas ni Vigías.



N6 — APRENDER A MOVERSE CON CONTINUIDAD



\- Introducir la plataforma agrietada sobre suelo seguro.

\- Alternar tramos de movimiento con descansos sólidos.

\- Reutilizar algún Centinela para mantener lo aprendido.

\- Solo combinar Centinela y plataforma agrietada cuando exista una respuesta clara y suficiente tiempo.

\- No introducir Vigías todavía.

\- No convertir todo el nivel en una carrera permanente.



N7 — APRENDER A LEER SEÑALES Y COBERTURA



\- Introducir el Vigía por separado.

\- Combinar después disparos con cambios de altura y apoyos conocidos.

\- Reutilizar plataformas agrietadas de forma puntual.

\- Evitar que esperar un disparo agote innecesariamente la energía.

\- Utilizar descansos y recargas como parte del ritmo, sin ponerlos bajo fuego.



N8 — DEMOSTRAR LO APRENDIDO



\- No introducir otro enemigo o sistema obligatorio.

\- Crear varias secuencias cortas:

&#x20; A. Centinela con refugios de altura.

&#x20; B. Plataformas agrietadas con descansos sólidos.

&#x20; C. Vigía con cobertura.

&#x20; D. Una combinación de dos elementos.

\- No superponer los tres peligros por defecto.

\- Reservar una combinación de tres elementos para un desvío opcional, y únicamente si las pruebas demuestran que es justa.

\- Incluir checkpoint y recarga antes del tramo final exigente.

\- Terminar con el cierre de campaña ya previsto, sin añadir otro jefe fuera del alcance.



8\. PRESUPUESTO DE DIFICULTAD



Para cada encuentro identifica cuántas decisiones simultáneas exige:



\- Leer una señal.

\- Calcular un salto.

\- Evitar un enemigo.

\- Gestionar una plataforma temporal.

\- Buscar una llave o interpretar una ruta.



En la ruta principal, procura que las situaciones habituales exijan como máximo dos de estas tareas a la vez.



La dificultad puede crecer mediante:



\- Menor separación entre situaciones ya aprendidas.

\- Variación de alturas.

\- Elección entre ruta segura y ruta de botín.

\- Uso más preciso de coberturas.

\- Combinaciones de dos reglas conocidas.



No debe crecer principalmente mediante:



\- Aumentar daño.

\- Eliminar avisos.

\- Acelerar todos los enemigos.

\- Añadir proyectiles desde fuera de cámara.

\- Obligar a recibir daño.

\- Multiplicar esperas.

\- Ocultar el siguiente apoyo.



Mantén el comportamiento aprendido de cada enemigo entre niveles. No reduzcas sus avisos silenciosamente en N8.



9\. ENERGÍA, CHECKPOINTS Y RECUPERACIÓN



Phantomas pierde energía con el tiempo y al saltar. Evalúa el coste real de cada nuevo tramo.



\- Calcula el tiempo de espera impuesto por Centinelas y Vigías.

\- Evita varias esperas obligatorias consecutivas sin progreso.

\- Coloca recargas en posiciones seguras.

\- No compenses una situación imposible con una batería al final.

\- Los checkpoints deben permitir observar de nuevo el encuentro al reaparecer.

\- No reaparecer dentro del alcance inmediato de una carga o un proyectil.

\- El reinicio de enemigos y plataformas debe ser coherente: una muerte no puede dejar el siguiente intento en peor estado.

\- Mantén las reglas actuales sobre conservación de botín, llaves y vidas.

\- Comprueba también el comportamiento al perder la última vida y continuar.



10\. ESTILO Y PRESENTACIÓN



Respeta los recursos y la dirección artística aprobados:



\- Robot actual, sin rediseño.

\- Pixel art detallado compatible con el resto.

\- Sombras frías, materiales texturizados y luces moderadas.

\- Fondos separados de superficies jugables.

\- HUD bitmap y textos en español.

\- Sprites con transparencia real.

\- Animaciones con pivotes y tamaño estables.

\- Avisos reconocibles por postura y forma, además de color y sonido.



No conviertas los enemigos nuevos en simples variantes de color. Deben reconocerse por su silueta y por lo que hacen.



No dejes recursos provisionales como acabado final. Si necesitas marcadores temporales para comprobar colisiones, sustitúyelos antes de dar el hito por terminado.



Mantén todos los elementos jugables visibles tanto con PixiJS como con el respaldo Canvas. Los efectos decorativos pueden variar; las señales, hitboxes y reglas deben ser equivalentes.



11\. IMPLEMENTACIÓN



Adapta la implementación a la arquitectura actual:



\- Un único sistema de simulación.

\- Estados y contadores actualizados con los pasos del juego.

\- Nada de avanzar ataques desde funciones de dibujo.

\- Nada de temporizadores independientes que continúen durante la pausa.

\- Reutilizar daño, invulnerabilidad y colisiones existentes.

\- Datos de configuración centralizados.

\- Límites de patrulla y activación explícitos.

\- Limpieza de proyectiles y estados al cargar, morir o reiniciar.

\- Sin duplicar la lógica entre Canvas y PixiJS.

\- Sin cambios globales a salto, gravedad o velocidad para resolver un encuentro mal diseñado.

\- Revisar caracteres de mapa antes de reservar símbolos nuevos.

\- Mantener o adaptar las herramientas de verificación cuando cambie la estructura de datos.



Usa Context7 cuando necesites documentación de bibliotecas.



12\. PRUEBAS NECESARIAS



Mantén las pruebas actuales y añade pruebas de comportamiento que detecten errores reales.



Centinela:



\- Avisa antes de cargar.

\- Mantiene la dirección fijada.

\- Respeta límites y paredes.

\- No inicia ataques fuera de cámara.

\- Se recupera durante el tiempo previsto.

\- No causa daño durante la recuperación.

\- No produce impactos repetidos saltándose la invulnerabilidad.



Plataforma agrietada:



\- Se activa únicamente al apoyar al jugador.

\- Su cuenta no se reinicia al saltar.

\- Dibujo y colisión cambian de forma coherente.

\- Colapsa y se reconstruye.

\- No se reconstruye atravesando al jugador.

\- Se reinicia correctamente tras la muerte.

\- No bloquea rutas permanentemente.



Vigía:



\- Fija el objetivo antes de disparar.

\- El proyectil no sigue al jugador.

\- Las paredes lo bloquean.

\- Se respetan límites de proyectiles.

\- Los proyectiles se eliminan correctamente.

\- No dispara fuera de cámara ni daña al reaparecer sin posibilidad de reacción.



Integración:



\- Pausa y pérdida de foco.

\- Cambio Canvas/PixiJS durante cada estado.

\- Muerte y continuación.

\- Alcanzabilidad de metas, llaves y botín.

\- Gasto de energía de los encuentros.

\- Diferentes fases de plataformas móviles.

\- Ausencia de errores de consola.

\- Ausencia de crecimiento continuo de memoria u objetos.



El verificador de caminos estáticos no demuestra que se pueda superar una secuencia temporal. Añade pruebas de simulación o recorridos reproducibles para los encuentros nuevos.



13\. PRUEBAS VISUALES Y MÓVIL



Amplía las vistas de revisión con:



\- Centinela en aviso, carga y recuperación.

\- Plataforma intacta, agrietándose, ausente y reconstruyéndose.

\- Vigía en aviso, fijación y disparo.

\- Una sala representativa de cada nivel.

\- La combinación más exigente de N8.



Revisa legibilidad con efectos activados y desactivados.



Preserva la corrección de pulsación prolongada de iPhone/Safari. Prueba movimiento y salto simultáneos, toques repetidos, rotación y regreso desde otra pestaña si dispones del dispositivo.



No afirmes haber validado un iPhone físico si solo has usado emulación.



14\. FORMA DE TRABAJAR Y ENTREGAR



Avanza en este orden:



1\. Auditoría y asignación a las salas existentes.

2\. Centinela funcional y probado.

3\. Integración y acabado de N5.

4\. Plataforma agrietada funcional y probada.

5\. Integración y acabado de N6.

6\. Vigía funcional y probado.

7\. Integración y acabado de N7.

8\. Combinaciones de N8.

9\. Regresión, equilibrio y acabado final.



Mantén un Markdown de seguimiento con:



\- Cambios realizados.

\- Parámetros finales.

\- Salas afectadas.

\- Pruebas ejecutadas y resultados.

\- Capturas o rutas para revisar.

\- Limitaciones y pendientes.



Haz commits por hitos sin incluir cambios ajenos.



No te detengas a pedirme confirmación para cada detalle rutinario. Usa esta dirección y las pruebas para decidir. Pregunta solo si hay una incompatibilidad importante con el trabajo actual o una decisión que cambie el alcance.



Deja el push a main y el despliegue pendientes de mi indicación, salvo que ya te haya autorizado expresamente a realizarlos en esta tarea.



15\. CRITERIO FINAL DE ACEPTACIÓN



N5–N8 deben sentirse como una evolución del mismo Phantomas:



\- N5 enseña a provocar y esquivar.

\- N6 enseña a mantener el movimiento.

\- N7 enseña a interpretar señales y usar cobertura.

\- N8 combina esas habilidades.



Las novedades deben entenderse jugando, conservar el estilo aprobado y funcionar con los controles existentes. Ninguna situación obligatoria puede depender de recibir daño, esperar indefinidamente, memorizar peligros invisibles o aprovechar un fallo del juego.



Entrega el desarrollo terminado y verificado, no solo propuestas.

```

