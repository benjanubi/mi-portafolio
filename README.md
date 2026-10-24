# MiPortafolio

Portafolio personal estático de Benjamín Valenzuela, construido con HTML, CSS y JavaScript sin frameworks ni dependencias de ejecución.

## Abrir el sitio

Haz doble clic en `index.html` o ábrelo con tu navegador. No necesitas instalar nada ni levantar un servidor.

## Estructura

- `index.html`: contenido y estructura de la página.
- `css/styles.css`: sistema visual, efecto liquid glass y responsive.
- `js/script.js`: navegación, interacciones y detalles de proyectos.
- `assets/favicon.svg`: icono del sitio.

## Editar contenido

Los textos principales están en `index.html`. Los datos de los proyectos se editan en el objeto `PROJECTS` de `js/script.js`. Los enlaces de contacto están en la sección `#contacto` del HTML.

## Verificación

```powershell
py -m unittest discover -s tests -v
node --test tests/test_projects.js
node --check js/script.js
```
