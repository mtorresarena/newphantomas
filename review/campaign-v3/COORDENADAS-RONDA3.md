# Delimitación geométrica de ronda 3

Registrada el 2026-09-08, antes de leer los testigos de ronda 3. `preregistrar-segmentos-round3.cjs` es copia del generador anterior con cambios únicamente en la ruta de HTML, nombre de salida y referencia al prerregistro. Su ejecución carga geometría y realiza **cero pasos de simulación**.

Fuente: `round3/index.html`, SHA256 `f2a7d393a540134f0c049dfc589001928bb695ae71b0064c4ea0e9017025e780`.

Manifiesto: `segmentos-preregistrados-round3.json`, SHA256 `5a7042145e396334030af0506b5871d22779b21fa906debd84ac35c2a5a0f6d1`.

El cotejo de los objetos LEVELS confirma que N1–N4 y N7–N8 son idénticos a harmonized-v2. Solo cambian N5 y N6. El manifiesto conserva las referencias originales N1–N4 y aplica a N5–N8 el mismo algoritmo, sin usar resultados de rutas.

| Excursión | Llave nativa (x,y) | Puerta nativa | Región adicional C |
|---|---:|---:|---|
| N5 parte 4, galería | (7188,38) | columna 463; x 7408–7424 | Ninguna: el acceso elevado pertenece a A. |
| N6 parte 2, montacargas | (3172,38) | columna 217; x 3472–3488 | Ninguna: el acceso elevado pertenece a A. |
| N6 parte 4, cruce | (7844,38) | columna 511; x 8176–8192 | Columnas 480–488; x 7680–7808, observación 7664–7824. Candidato pendiente de contraste causal. |

Los recuentos de candidatos estáticos son N5: A2/B10/C7/D16/E0 y N6: A4/B10/C6/D11/E0. **No son acciones acreditadas**. El nuevo péndulo queda dentro del cruce C y no añade D. La araña de galería comparte la región D 7091–7202 con otro enemigo ya delimitado; no se separa para aumentar unidades. El montacargas no recibe un episodio por cada ciclo.

Las tres puertas abarcan las filas 1–9 hasta el techo, sobre suelo. La inspección estática no demuestra por sí sola imposibilidad de atravesarlas. El cruce de N6 parte 4 contiene ácido en filas 10–11, apoyos frágiles en altura y un péndulo; su cualificación exige el replay y contraste registrados.

N6 parte 2 dispone de un elevador vertical en x 3064, anchura 32, origen y 117 y amplitud 40. Tenerlo no demuestra aún que sea imprescindible para recoger la llave; ese requisito propuesto se comprobará con entradas y apoyos observados, sin asignar unidades por el nombre de la sala.

La corrección comunicada del planificador N5 (`minX` de 67 a 64 para aceptar el origen x 66,28) pertenece a la búsqueda, no al juego ni al clasificador. Se declarará con los resultados; no se atribuye un agotamiento anterior a un bloqueo del nivel.
