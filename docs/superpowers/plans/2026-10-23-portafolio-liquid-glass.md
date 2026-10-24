# Portafolio personal liquid glass — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un portafolio personal estático, en español, con estética liquid glass morada, una sola página y contenido verificable, que se abra directamente desde `index.html`.

**Architecture:** Un documento HTML semántico con cinco secciones y un diálogo nativo para los detalles de proyectos. CSS centraliza tokens, vidrio, composición y responsive; JavaScript añade navegación activa, revelados, reflejos, diálogos y copia de correo con mejora progresiva. Las pruebas de estructura usan Python 3.8 y las de datos de proyectos usan el test runner integrado de Node 24.

**Tech Stack:** HTML5, CSS3, JavaScript ES2020, Python 3.8 `unittest`, Node 24 `node:test`, Microsoft Edge headless para comprobaciones visuales.

**Spec:** `C:\CarpetaPruebas\MiPortafolio\docs\superpowers\specs\2026-10-23-portafolio-liquid-glass-design.md`

## Global Constraints

- Sitio estático sin frameworks, sin backend, sin compilación y sin fuentes o librerías externas obligatorias.
- Debe abrirse con doble clic en `C:\CarpetaPruebas\MiPortafolio\index.html`.
- Todo el contenido visible en español; tono cercano y profesional, sin testimonios, métricas ni resultados inventados.
- Paleta: fondo `#08040f`, violeta `#8b2be2`, lavanda `#b79ad6`, lila `#d7b6ef`, acento menta `#6ee7d8`, texto `#f5f0ff`, secundario `#b8a9cc`.
- Colores de contacto: Gmail `#EA4335`, GitHub `#FFFFFF`, LinkedIn `#0A66C2`, WhatsApp `#25D366`.
- Enlaces exactos: `mailto:benjavalenz36@gmail.com`, `https://github.com/benjanubi`, `https://www.linkedin.com/in/benjam%C3%ADn-valenzuela-mu%C3%B1oz-a666a53a8`, `https://wa.me/56971383760`.
- WhatsApp visible: `+56 9 7138 3760`.
- Sin JavaScript, el contenido principal y las tarjetas de proyecto siguen siendo legibles; los diálogos son mejora progresiva.
- Chromium actual es el objetivo principal; Firefox y Safari son best-effort con `-webkit-backdrop-filter` y fallback.
- Respetar `prefers-reduced-motion`; el foco de teclado debe ser siempre visible.
- Sin desbordamiento horizontal entre 360 px y 1440 px.
- No crear `package.json`; las pruebas de Node usan APIs integradas.

## Review Focus

- **Móvil estrecho (360–390 px):** nombres largos, enlaces de LinkedIn y botones no deben causar scroll horizontal ni texto cortado.
- **Teclado y diálogo:** abrir un proyecto, recorrer el diálogo, cerrar con Escape y recuperar el foco en el botón que lo abrió.
- **Movimiento reducido:** con `prefers-reduced-motion: reduce` no debe haber parallax, revelados ni scroll suave; el contenido debe verse de inmediato.
- **Vidrio sin soporte:** si `backdrop-filter` no existe, los paneles deben conservar fondo suficientemente opaco y texto legible.
- **Copiar correo desde `file://`:** si `navigator.clipboard` falla o no está disponible, debe usarse un fallback y comunicar el resultado sin lanzar errores.
- **Enlaces externos:** GitHub, LinkedIn y WhatsApp deben abrir con `rel="noopener noreferrer"` y `target="_blank"`; `mailto:` no debe abrir pestaña.

---

## Tareas

### Tarea 1: Estructura base, tokens y arnés de pruebas

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `js/script.js`
- Create: `assets/favicon.svg`
- Create: `README.md`
- Create: `tests/test_site.py`

**Interfaces:**
- Consumes: nada.
- Produces: documento con `lang="es"`, un solo `h1` y las secciones `inicio`, `sobre-mi`, `habilidades`, `proyectos`, `contacto`; archivos `styles.css` y `script.js` enlazados con rutas relativas.

- [ ] **Step 1: Escribir las pruebas fallidas de la estructura**

Crear `tests/test_site.py` con este contenido base:

```python
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CSS = ROOT / "css" / "styles.css"
JS = ROOT / "js" / "script.js"


class PageParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self, convert_charrefs=True)
        self.ids = []
        self.links = []
        self.tags = []
        self.text_parts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a" and "href" in attrs:
            self.links.append(attrs)

    def handle_data(self, data):
        self.text_parts.append(data)

    @property
    def text(self):
        return " ".join(" ".join(self.text_parts).split())


def load_page():
    parser = PageParser()
    parser.feed(INDEX.read_text(encoding="utf-8"))
    return parser


class SiteStructureTests(unittest.TestCase):
    def test_document_language_and_title(self):
        page = load_page()
        self.assertIn(("html", {"lang": "es"}), page.tags)
        self.assertIn("Benjamín Valenzuela", page.text)
        self.assertIn("Portafolio", page.text)

    def test_required_sections_and_single_h1(self):
        page = load_page()
        self.assertTrue({"inicio", "sobre-mi", "habilidades", "proyectos", "contacto"}.issubset(set(page.ids)))
        self.assertEqual(sum(1 for tag, _ in page.tags if tag == "h1"), 1)

    def test_internal_links_resolve(self):
        page = load_page()
        ids = set(page.ids)
        for link in page.links:
            href = link.get("href", "")
            if href.startswith("#") and len(href) > 1:
                self.assertIn(href[1:], ids)

    def test_ids_are_unique(self):
        page = load_page()
        self.assertEqual(len(page.ids), len(set(page.ids)))

    def test_assets_exist(self):
        for path in (INDEX, CSS, JS, ROOT / "assets" / "favicon.svg", ROOT / "README.md"):
            self.assertTrue(path.is_file(), str(path))
```

- [ ] **Step 2: Ejecutar las pruebas y comprobar que fallan**

Run: `py -m unittest discover -s tests -v`

Expected: FAIL con `FileNotFoundError` para `index.html`.

- [ ] **Step 3: Crear el esqueleto de la página**

Crear `index.html` con `lang="es"`, `meta viewport`, título `Benjamín Valenzuela — Portafolio`, favicon, hoja de estilos y script con `defer`. Incluir skip link, `header` con navegación a las cinco secciones, `main` con las secciones vacías pero con sus IDs y un `h1` en el hero, y `footer`.

Crear `css/styles.css` con reset mínimo, tokens base (`--bg`, `--bg-2`, `--ink`, `--muted`, `--violet`, `--lilac`, `--mint`, `--container`, tipografías del sistema) y estilos de legibilidad. Crear `js/script.js` como IIFE en modo estricto. Crear `assets/favicon.svg` con monograma `BV` y degradado morado. Crear `README.md` con instrucciones para abrir el sitio y editar contenido.

- [ ] **Step 4: Ejecutar pruebas y verificar sintaxis**

Run: `py -m unittest discover -s tests -v`

Expected: 5 tests PASS.

Run: `node --check js/script.js`

Expected: sin salida y exit code 0.

- [ ] **Step 5: Inicializar repositorio y commit**

Si `git rev-parse --is-inside-work-tree` falla, ejecutar `git init` dentro de `MiPortafolio`.

```powershell
git add index.html css/styles.css js/script.js assets/favicon.svg README.md tests/test_site.py docs
git commit -m "chore: scaffold static portfolio"
```

---

### Tarea 2: Sistema liquid glass, cabecera y hero

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Test: `tests/test_site.py`

**Interfaces:**
- Consumes: secciones y tokens de la Tarea 1.
- Produces: clases reutilizables `.glass`, `.glass--interactive`, `.btn`, `.btn--primary`, `.btn--ghost`, `.eyebrow`, `.section`, `.section__head`; variables CSS `--mx`, `--my` para el reflejo.

- [ ] **Step 1: Añadir pruebas fallidas de hero y vidrio**

Añadir a `SiteStructureTests`:

```python
def test_hero_content(self):
    text = load_page().text
    for phrase in [
        "Benjamín Valenzuela",
        "Ingeniería Civil en Informática",
        "Universidad del Bío-Bío",
        "San Carlos",
        "20 años",
        "Flutter",
        "Python",
        "Linux",
    ]:
        self.assertIn(phrase, text)

def test_glass_tokens_fallback_and_motion(self):
    css = CSS.read_text(encoding="utf-8").lower()
    for token in [
        "--violet",
        "--mint",
        "backdrop-filter",
        "-webkit-backdrop-filter",
        "@supports not",
        "prefers-reduced-motion",
    ]:
        self.assertIn(token, css)
```

- [ ] **Step 2: Ejecutar y comprobar el fallo**

Run: `py -m unittest discover -s tests -v`

Expected: FAIL en `test_hero_content` y `test_glass_tokens_fallback_and_motion`.

- [ ] **Step 3: Implementar cabecera, hero y sistema de vidrio**

En `index.html`, construir:

- `header` fijo con nav de vidrio, marca `BV`, enlaces Inicio/Sobre mí/Habilidades/Proyectos y CTA "Hablemos" hacia `#contacto`.
- Hero con etiqueta `Portafolio · 2026`, `h1` "Benjamín Valenzuela", bajada sobre apps móviles, herramientas de escritorio y web, botones "Ver proyectos" y "Hablemos".
- Tarjeta lateral con monograma `BV`, nombre legal completo, `20 años · San Carlos, Chile`, `Ingeniería Civil en Informática`, `Universidad del Bío-Bío` y chips Flutter, Python, Linux.
- Fondo ambiental con orbes decorativos `aria-hidden="true"` y un indicador discreto de scroll.

En CSS, implementar `.glass` con fondo translúcido, borde claro, sombra, `backdrop-filter: blur(24px) saturate(150%)`, `-webkit-backdrop-filter`, brillo especular con `--mx`/`--my` y fallback dentro de `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))`. Añadir layout responsive del hero y navegación; ocultar los enlaces de nav bajo 760 px y conservar marca + CTA.

- [ ] **Step 4: Verificar pruebas y captura visual**

Run: `py -m unittest discover -s tests -v`

Expected: todos los tests PASS.

Capturar escritorio y móvil:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=1440,1100 --screenshot="$env:TEMP\portafolio-hero-desktop.png" "file:///C:/CarpetaPruebas/MiPortafolio/index.html"
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=390,844 --screenshot="$env:TEMP\portafolio-hero-mobile.png" "file:///C:/CarpetaPruebas/MiPortafolio/index.html"
```

Abrir ambas imágenes y comprobar: nombre legible, vidrio visible sin perder contraste, sin scroll horizontal, CTA visible en móvil.

- [ ] **Step 5: Commit**

```powershell
git add index.html css/styles.css tests/test_site.py
git commit -m "feat: add liquid glass hero and navigation"
```

---

### Tarea 3: Sobre mí y habilidades

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Test: `tests/test_site.py`

**Interfaces:**
- Consumes: `.section`, `.glass`, `.eyebrow` de la Tarea 2.
- Produces: secciones `#sobre-mi` y `#habilidades` completas con tarjetas `.info-card` y grupos `.skill-card`.

- [ ] **Step 1: Añadir pruebas fallidas de contenido**

Añadir:

```python
def test_about_and_skills_content(self):
    text = load_page().text
    for phrase in [
        "Sobre mí",
        "Benjamín Ignacio Valenzuela Muñoz",
        "Ayudante",
        "Álgebra Lineal",
        "Staff en evento universitario",
        "Arch Linux",
        "Hyprland",
        "KDE Plasma",
        "i3wm",
        "Ubuntu",
        "antiX",
        "Linux Mint XFCE",
        "Tkinter",
        "ReportLab",
        "Firebase",
        "Excel",
    ]:
        self.assertIn(phrase, text)
```

- [ ] **Step 2: Ejecutar y comprobar el fallo**

Run: `py -m unittest discover -s tests -v`

Expected: FAIL en `test_about_and_skills_content`.

- [ ] **Step 3: Implementar ambas secciones**

En `#sobre-mi`, incluir un párrafo en primera persona con nombre completo, edad, San Carlos, Región de Ñuble y Universidad del Bío-Bío; tarjetas sin fechas para Educación (Ingeniería Civil en Informática, Universidad del Bío-Bío) y Experiencia (Ayudante de Álgebra Lineal; Staff en evento universitario); nota breve sobre aprender construyendo.

En `#habilidades`, crear tres tarjetas de vidrio:

- Desarrollo: Flutter y Dart; HTML5, CSS3 y JavaScript; Java; Python; LaTeX.
- Entornos: Arch Linux con Hyprland; KDE Plasma; i3wm; Ubuntu; antiX Linux; Linux Mint XFCE.
- Herramientas: Tkinter; ReportLab; Firebase; Excel nivel intermedio.

Usar etiquetas, sin porcentajes ni barras de nivel. Añadir estilos de grid responsive y hover.

- [ ] **Step 4: Verificar y capturar**

Run: `py -m unittest discover -s tests -v`

Expected: todos los tests PASS.

Capturar `file:///C:/CarpetaPruebas/MiPortafolio/index.html#sobre-mi` a 1440×1100 y `#habilidades` a 390×844; revisar legibilidad, alineación y ausencia de desbordamiento.

- [ ] **Step 5: Commit**

```powershell
git add index.html css/styles.css tests/test_site.py
git commit -m "feat: add about and skills sections"
```

---

### Tarea 4: Proyectos y diálogos de detalle

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `js/script.js`
- Create: `tests/test_projects.js`
- Test: `tests/test_site.py`

**Interfaces:**
- Consumes: `.glass`, `.section`, `.tag-list` y layout de tarjetas.
- Produces: `PROJECTS` (objeto indexado por ID), `getProject(id)` que devuelve el proyecto o `null`, `openProjectDialog(id)`, `closeProjectDialog()`, `initProjectDialogs()` e `init()` invocado al cargar el documento. IDs: `cosecha-berries`, `mis-notas`, `mermas-mcdonalds`, `generador-horarios`, `prototipos-web`.

- [ ] **Step 1: Añadir pruebas fallidas de proyectos y datos**

Añadir a `tests/test_site.py`:

```python
def test_projects_content_and_dialog(self):
    page = load_page()
    for value in [
        "cosecha_berries",
        "Diciembre 2025",
        "Mis Notas",
        "Enero 2026",
        "Mermas McDonald's",
        "Febrero 2026",
        "Generador de Horarios",
        "Marzo 2026",
        "Ale Sushi",
        "SebTech",
        "El Rey del Ahorro",
        "LUK'S Crepería",
        "Ágape Restobar",
        "Tasty Food Chillán",
        "Superbikers",
    ]:
        self.assertIn(value, page.text)
    project_ids = {
        attrs.get("data-project-id")
        for tag, attrs in page.tags
        if tag == "button" and attrs.get("data-project-id")
    }
    self.assertEqual(
        project_ids,
        {"cosecha-berries", "mis-notas", "mermas-mcdonalds", "generador-horarios", "prototipos-web"},
    )
    self.assertIn("project-dialog", page.ids)
```

Crear `tests/test_projects.js`:

```javascript
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PROJECTS, getProject } = require('../js/script.js');

test('catálogo de proyectos completo', () => {
  assert.deepEqual(Object.keys(PROJECTS), [
    'cosecha-berries',
    'mis-notas',
    'mermas-mcdonalds',
    'generador-horarios',
    'prototipos-web',
  ]);
});

test('los datos clave no se pierden', () => {
  assert.equal(getProject('cosecha-berries').date, 'Diciembre 2025');
  assert.equal(getProject('mis-notas').date, 'Enero 2026');
  assert.equal(getProject('mermas-mcdonalds').date, 'Febrero 2026');
  assert.equal(getProject('generador-horarios').date, 'Marzo 2026');
  assert.ok(getProject('prototipos-web').tech.includes('JavaScript'));
});

test('un id desconocido devuelve null', () => {
  assert.equal(getProject('no-existe'), null);
});
```

- [ ] **Step 2: Ejecutar y comprobar el fallo**

Run: `py -m unittest discover -s tests -v`

Expected: FAIL en `test_projects_content_and_dialog` porque faltan tarjetas y diálogo.

Run: `node --test tests/test_projects.js`

Expected: FAIL porque `PROJECTS` no está exportado.

- [ ] **Step 3: Implementar datos, tarjetas y diálogo**

En `js/script.js`, definir `PROJECTS` con campos `title`, `date`, `category`, `description`, `detail` y `tech`. Mantener la inicialización DOM detrás de `if (typeof document !== "undefined")` y exportar `PROJECTS` y `getProject` al final:

```javascript
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PROJECTS, getProject };
}
```

En `index.html`, crear dos grupos:

- Desarrollo móvil y de escritorio: `cosecha_berries` (Diciembre 2025), `Mis Notas` (Enero 2026), `Mermas McDonald's` (Febrero 2026), `Generador de Horarios` (Marzo 2026).
- Desarrollo web y emprendimientos: una tarjeta grupal con Ale Sushi, SebTech, El Rey del Ahorro, LUK'S Crepería, Ágape Restobar, Tasty Food Chillán y Superbikers.

Cada tarjeta debe mostrar título, fecha, categoría, descripción breve, tecnologías y un botón `data-project-id` con `aria-haspopup="dialog"`. Añadir `dialog#project-dialog` con título, meta, descripción, lista de tecnologías y botón de cierre. No inventar estados ni enlaces. Las tarjetas deben ser legibles sin JavaScript.

En CSS, maquetar las tarjetas con previsualizaciones abstractas de CSS, sin capturas falsas, y estilos de diálogo con vidrio, scroll interno y responsive.

- [ ] **Step 4: Verificar pruebas y comportamiento**

Run: `py -m unittest discover -s tests -v`

Expected: todos los tests PASS.

Run: `node --test tests/test_projects.js`

Expected: 3 tests PASS.

Abrir `index.html`, pulsar "Ver detalle" en cada proyecto, comprobar contenido correcto, cerrar con Escape y con el botón, y verificar que el foco vuelve al botón que abrió el diálogo.

- [ ] **Step 5: Commit**

```powershell
git add index.html css/styles.css js/script.js tests/test_site.py tests/test_projects.js
git commit -m "feat: add project cards and detail dialogs"
```

---

### Tarea 5: Contacto con iconos de marca y copia de correo

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `js/script.js`
- Test: `tests/test_site.py`

**Interfaces:**
- Consumes: `.glass`, `.section` y `init()`.
- Produces: `copyText(text)` que devuelve una promesa booleana, `initCopyEmail()` y los enlaces con clases `contact-link--gmail`, `contact-link--github`, `contact-link--linkedin`, `contact-link--whatsapp`; pie de página completo.

- [ ] **Step 1: Añadir pruebas fallidas de contacto**

Añadir:

```python
def test_contact_links_and_brand_colors(self):
    page = load_page()
    hrefs = {link.get("href", "") for link in page.links}
    self.assertIn("mailto:benjavalenz36@gmail.com", hrefs)
    self.assertIn("https://github.com/benjanubi", hrefs)
    self.assertIn("https://www.linkedin.com/in/benjam%C3%ADn-valenzuela-mu%C3%B1oz-a666a53a8", hrefs)
    self.assertIn("https://wa.me/56971383760", hrefs)
    self.assertIn("+56 9 7138 3760", page.text)
    self.assertIn("Diseñado y desarrollado por Benjamín Valenzuela", page.text)
    self.assertIn("San Carlos, Chile", page.text)
    external = [
        link for link in page.links
        if link.get("href", "").startswith("https://")
        and ("github.com" in link["href"] or "linkedin.com" in link["href"] or "wa.me" in link["href"])
    ]
    self.assertEqual(len(external), 3)
    for link in external:
        self.assertEqual(link.get("target"), "_blank")
        self.assertIn("noopener", link.get("rel", ""))

def test_brand_colors_and_copy_fallback(self):
    css = CSS.read_text(encoding="utf-8").lower()
    for token in ["--gmail: #ea4335", "--github: #ffffff", "--linkedin: #0a66c2", "--whatsapp: #25d366"]:
        self.assertIn(token, css)
    js = JS.read_text(encoding="utf-8")
    self.assertIn("navigator.clipboard", js)
    self.assertIn("execCommand", js)

def test_no_placeholder_content(self):
    html = INDEX.read_text(encoding="utf-8").lower()
    for placeholder in ["tu-correo", "ejemplo.com", "lorem ipsum", "todo:", "tbd"]:
        self.assertNotIn(placeholder, html)
```

- [ ] **Step 2: Ejecutar y comprobar el fallo**

Run: `py -m unittest discover -s tests -v`

Expected: FAIL en las tres pruebas nuevas.

- [ ] **Step 3: Implementar contacto, iconos y copia**

En `index.html`, crear `#contacto` con mensaje "Hablemos", texto breve y cuatro enlaces de vidrio. Incluir SVG en línea con los iconos de Gmail, GitHub, LinkedIn y WhatsApp; cada icono usa `fill="currentColor"` y su color se define en CSS con las variables de marca. Mostrar los datos indicados y añadir `target="_blank"` + `rel="noopener noreferrer"` solo a GitHub, LinkedIn y WhatsApp. Añadir botón "Copiar correo" y un estado `aria-live="polite"`.

En `script.js`, implementar `copyText(text)` usando `navigator.clipboard.writeText` cuando esté disponible y un textarea temporal con `document.execCommand("copy")` como fallback. El botón debe cambiar su texto a "Correo copiado" o "No se pudo copiar" durante unos segundos, sin lanzar excepciones.

En CSS, definir los colores de marca, estilos de tarjeta de contacto, hover y `overflow-wrap: anywhere` para la URL de LinkedIn; asegurar contraste del texto.

Completar el pie de página con "Diseñado y desarrollado por Benjamín Valenzuela · 2026", "San Carlos, Chile" y un enlace "Volver arriba" hacia `#inicio`.

- [ ] **Step 4: Verificar pruebas y copia manual**

Run: `py -m unittest discover -s tests -v`

Expected: todos los tests PASS.

Abrir el sitio, probar el botón de copiar desde `file://`, comprobar el mensaje visual y pegar el correo en un editor. Verificar que los cuatro enlaces apuntan al destino correcto.

- [ ] **Step 5: Commit**

```powershell
git add index.html css/styles.css js/script.js tests/test_site.py
git commit -m "feat: add branded contact section and copy email"
```

---

### Tarea 6: Interacciones, responsive y auditoría final

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `js/script.js`
- Modify: `README.md`
- Test: `tests/test_site.py`

**Interfaces:**
- Consumes: todas las secciones y funciones anteriores.
- Produces: `initHeader()`, `initNavObserver()`, `initReveal()`, `initPointerGlow()`, `initAmbient()` y `init()`; clases `is-scrolled`, `is-visible`, `is-active`; atributo `aria-current="page"` en el enlace activo.

- [ ] **Step 1: Añadir pruebas fallidas de accesibilidad, responsive y movimiento**

Añadir:

```python
def test_accessibility_and_motion_css(self):
    css = CSS.read_text(encoding="utf-8").lower()
    for token in [
        "skip-link",
        "focus-visible",
        "scroll-margin-top",
        "overflow-x",
        "@media (max-width",
        "prefers-reduced-motion",
    ]:
        self.assertIn(token, css)
    js = JS.read_text(encoding="utf-8")
    self.assertIn("IntersectionObserver", js)
    self.assertIn("aria-current", js)
    self.assertIn("matchMedia", js)

def test_no_external_runtime_dependencies(self):
    html = INDEX.read_text(encoding="utf-8").lower()
    self.assertNotIn('<script src="http', html)
    self.assertNotIn('rel="stylesheet" href="http', html)
    self.assertNotIn("@import url(http", CSS.read_text(encoding="utf-8").lower())
```

- [ ] **Step 2: Ejecutar y comprobar el fallo**

Run: `py -m unittest discover -s tests -v`

Expected: FAIL en `test_accessibility_and_motion_css`.

- [ ] **Step 3: Implementar interacciones y pulido**

En `script.js`:

- Añadir `document.documentElement.classList.add("js")` dentro de `init()`.
- `initHeader()`: alterna `.is-scrolled` en el header al superar 24 px de scroll.
- `initNavObserver()`: usa `IntersectionObserver` para marcar el enlace de la sección visible con `.is-active` y `aria-current="page"`.
- `initReveal()`: añade `.is-visible` a `.reveal` al entrar en pantalla; si no hay `IntersectionObserver`, mostrar todo.
- `initPointerGlow()`: actualiza `--mx` y `--my` en tarjetas `.glass--interactive` con `requestAnimationFrame`.
- `initAmbient()`: movimiento de parallax muy leve para orbes; desactivar con `matchMedia("(prefers-reduced-motion: reduce)")`.
- Reducir o desactivar todo lo anterior cuando el usuario prefiera movimiento reducido.

En CSS:

- `html { scroll-behavior: smooth; scroll-padding-top: 110px; }` y `section { scroll-margin-top: 110px; }`.
- `.js .reveal` oculto con transformación y opacidad; `.js .reveal.is-visible` visible. Sin JS, visible.
- `:focus-visible` claro y visible.
- `overflow-x: clip` en `body` y `overflow-wrap: anywhere` en enlaces largos.
- Ajustes para 360, 768, 1024 y 1440 px.
- En `prefers-reduced-motion: reduce`, desactivar animaciones, transiciones, scroll suave y parallax.

Actualizar `README.md` con estructura, cómo abrir, cómo editar proyectos en `PROJECTS`, cómo cambiar contacto y notas de compatibilidad.

- [ ] **Step 4: Ejecutar todas las verificaciones**

Run: `py -m unittest discover -s tests -v`

Expected: todos los tests PASS.

Run: `node --test tests/test_projects.js`

Expected: 3 tests PASS.

Run: `node --check js/script.js`

Expected: sin salida y exit code 0.

Capturar y revisar las cuatro anchuras:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=1440,1100 --screenshot="$env:TEMP\portafolio-1440.png" "file:///C:/CarpetaPruebas/MiPortafolio/index.html"
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=1024,900 --screenshot="$env:TEMP\portafolio-1024.png" "file:///C:/CarpetaPruebas/MiPortafolio/index.html#proyectos"
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=768,1024 --screenshot="$env:TEMP\portafolio-768.png" "file:///C:/CarpetaPruebas/MiPortafolio/index.html#habilidades"
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=2000 --window-size=360,800 --screenshot="$env:TEMP\portafolio-360.png" "file:///C:/CarpetaPruebas/MiPortafolio/index.html#contacto"
```

Revisar cada imagen. No debe haber scroll horizontal, texto cortado, botones fuera de pantalla ni paneles ilegibles.

- [ ] **Step 5: Auditoría manual final**

Comprobar en Edge:

- Skip link visible al tabular.
- Navegación por teclado en nav, botones, enlaces y diálogos.
- Diálogo: abrir, Tab, Escape, foco devuelto.
- Copia de correo y fallback si el portapapeles no está disponible.
- Enlaces de GitHub, LinkedIn y WhatsApp abren en pestaña nueva; correo abre el cliente.
- Sin errores en consola.
- Con la emulación de movimiento reducido, el contenido aparece de inmediato y no hay parallax.

- [ ] **Step 6: Commit final**

```powershell
git add index.html css/styles.css js/script.js README.md tests/test_site.py
git commit -m "feat: polish interactions and responsive portfolio"
```
