# Procedencia y reproducción

Los otros 16 archivos de esta carpeta se copiaron íntegramente del expediente producido por el revisor independiente. Este documento lo añade el constructor y no forma parte del dictamen del revisor.

Ubicación original:

`C:\Users\mtare\Desktop\cerebro-voz-starter\_tmp\phantomas-blind-audit-20260907\audit`

Los scripts se ejecutan desde esa ubicación. Conservan rutas relativas a `../tools/route-harness.js` y al HTML de la copia congelada. No se deben ejecutar directamente desde esta carpeta archivada: su disposición de directorios es diferente.

Para reproducir fuera de la copia original, preparar un directorio separado con `index.html`, `assets/`, `tools/route-harness.js` y `audit/` al mismo nivel, verificar los archivos contra `../blind-audit-manifest.json` y copiar aquí los scripts del expediente a su carpeta `audit/`. Ejecutar allí los comandos del informe. Los scripts sobrescriben sus JSON de resultados; conservar este archivo de evidencia antes de ejecutarlos.

El visor requiere un servidor HTTP local en la raíz de esa copia. El puerto 8771 documentado en el informe fue el utilizado durante la inspección; no implica que siga en ejecución. Las observaciones visuales no cuentan con PNG archivados.

Los resultados originales se conservan sin corregir ni recalcular. El informe de contraste del constructor se encuentra en `../AUDITORIA-CIEGA.md` y no reemplaza el dictamen independiente.
