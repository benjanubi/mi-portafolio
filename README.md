# MiPortafolio

Portafolio personal estático de Benjamín Valenzuela, construido con HTML, CSS y JavaScript sin frameworks ni dependencias de ejecución.

## Abrir el sitio

Haz doble clic en `index.html` o ábrelo con tu navegador. No necesitas instalar nada ni levantar un servidor.

## Estructura

- `index.html`: contenido y estructura de la página.
- `css/styles.css`: sistema visual, efecto liquid glass, animaciones y responsive.
- `js/script.js`: navegación activa, revelados, diálogos de proyectos y copia de correo.
- `assets/favicon.svg`: icono del sitio inspirado en Dedenne.
- `assets/pfp.jpg`: foto usada como avatar en la navegación y en la tarjeta de perfil.
- `tests/`: verificaciones de estructura, contenido y datos de proyectos.

## Editar contenido

- Los textos principales están en `index.html`.
- El avatar se toma de `assets/pfp.jpg`. El encuadre se ajusta con `--avatar-zoom` y `object-position` en `css/styles.css`.
- Los datos de los proyectos se editan en el objeto `PROJECTS` de `js/script.js`. Cada entrada incluye título, fecha, categoría, descripción, detalle y tecnologías.
- Los enlaces y datos de contacto están en la sección `#contacto` del HTML. Si cambias el correo, actualízalo también en `initCopyEmail()` dentro de `js/script.js`.
- El año del pie de página está escrito directamente en `index.html`.

## Interacciones

- La navegación marca la sección visible con `aria-current="page"`.
- Las tarjetas y secciones aparecen con un revelado suave al entrar en pantalla.
- El reflejo de las tarjetas de vidrio sigue al puntero y los orbes tienen un parallax leve.
- El botón "Copiar correo" usa la API de portapapeles y recurre a `document.execCommand("copy")` cuando no está disponible.
- Los detalles de cada proyecto se abren en un `<dialog>` nativo, se cierran con Escape y devuelven el foco al botón de origen.

Todas las animaciones, el parallax y el scroll suave se desactivan con `prefers-reduced-motion: reduce`. El contenido sigue siendo visible aunque JavaScript no esté disponible.

## Compatibilidad

El objetivo principal es Chrome y Edge en escritorio y móvil. Firefox y Safari reciben compatibilidad best-effort: el efecto de vidrio usa `backdrop-filter` con un fondo sólido de respaldo mediante `@supports`.

## Verificación

```powershell
py -m unittest discover -s tests -v
node --test tests/test_projects.js
node --check js/script.js
```
