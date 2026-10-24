from html.parser import HTMLParser
from pathlib import Path
import re
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
        self.assertTrue(
            {"inicio", "sobre-mi", "habilidades", "proyectos", "contacto"}.issubset(
                set(page.ids)
            )
        )
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
        for path in (
            INDEX,
            CSS,
            JS,
            ROOT / "assets" / "favicon.svg",
            ROOT / "assets" / "pfp.jpg",
            ROOT / "README.md",
        ):
            self.assertTrue(path.is_file(), str(path))

    def test_avatar_photo_replaces_initials(self):
        page = load_page()
        avatars = [
            attrs
            for tag, attrs in page.tags
            if tag == "img" and attrs.get("class") == "avatar__img"
        ]
        self.assertEqual(len(avatars), 2)
        for attrs in avatars:
            self.assertEqual(attrs.get("src"), "assets/pfp.jpg")
            self.assertEqual(attrs.get("alt"), "")
        self.assertNotIn("BV", page.text)

    def test_avatar_zoom_is_tighter_in_navigation(self):
        css = CSS.read_text(encoding="utf-8")
        self.assertIn("object-fit: cover", css)
        self.assertIn("scale(var(--avatar-zoom))", css)
        nav = re.search(r"\.nav__monogram\s*\{([^}]*)\}", css, re.S)
        hero = re.search(r"\.hero-card__monogram\s*\{([^}]*)\}", css, re.S)
        self.assertIsNotNone(nav)
        self.assertIsNotNone(hero)
        nav_zoom = re.search(r"--avatar-zoom:\s*([\d.]+)", nav.group(1))
        hero_zoom = re.search(r"--avatar-zoom:\s*([\d.]+)", hero.group(1))
        self.assertIsNotNone(nav_zoom)
        self.assertIsNotNone(hero_zoom)
        self.assertGreater(float(nav_zoom.group(1)), float(hero_zoom.group(1)))
        self.assertNotIn("var(--violet)", nav.group(1))
        self.assertNotIn("var(--violet)", hero.group(1))

    def test_favicon_is_dedenne_inspired(self):
        svg = (ROOT / "assets" / "favicon.svg").read_text(encoding="utf-8")
        self.assertNotIn(">BV<", svg)
        lowered = svg.lower()
        for color in ("#8b2be2", "#eab27a", "#e9826f"):
            self.assertIn(color, lowered)
        self.assertIn('viewBox="0 0 64 64"', svg)

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
            {
                "cosecha-berries",
                "mis-notas",
                "mermas-mcdonalds",
                "generador-horarios",
                "prototipos-web",
            },
        )
        self.assertIn("project-dialog", page.ids)

    def test_contact_links_and_brand_colors(self):
        page = load_page()
        hrefs = {link.get("href", "") for link in page.links}
        self.assertIn("mailto:benjavalenz36@gmail.com", hrefs)
        self.assertIn("https://github.com/benjanubi", hrefs)
        self.assertIn(
            "https://www.linkedin.com/in/benjam%C3%ADn-valenzuela-mu%C3%B1oz-a666a53a8",
            hrefs,
        )
        self.assertIn("https://wa.me/56971383760", hrefs)
        self.assertIn("+56 9 7138 3760", page.text)
        self.assertIn("Diseñado y desarrollado por Benjamín Valenzuela", page.text)
        self.assertIn("San Carlos, Chile", page.text)
        external = [
            link
            for link in page.links
            if link.get("href", "").startswith("https://")
            and (
                "github.com" in link["href"]
                or "linkedin.com" in link["href"]
                or "wa.me" in link["href"]
            )
        ]
        self.assertEqual(len(external), 3)
        for link in external:
            self.assertEqual(link.get("target"), "_blank")
            self.assertIn("noopener", link.get("rel", ""))

    def test_brand_colors_and_copy_fallback(self):
        css = CSS.read_text(encoding="utf-8").lower()
        for token in [
            "--gmail: #ea4335",
            "--github: #ffffff",
            "--linkedin: #0a66c2",
            "--whatsapp: #25d366",
        ]:
            self.assertIn(token, css)
        js = JS.read_text(encoding="utf-8")
        self.assertIn("navigator.clipboard", js)
        self.assertIn("execCommand", js)

    def test_no_placeholder_content(self):
        html = INDEX.read_text(encoding="utf-8").lower()
        for placeholder in ["tu-correo", "ejemplo.com", "lorem ipsum", "todo:", "tbd"]:
            self.assertNotIn(placeholder, html)

    def test_project_note_has_no_unverified_promises(self):
        html = INDEX.read_text(encoding="utf-8")
        self.assertIn("Proyecto local", html)
        self.assertNotIn("se añadirán", html)

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


if __name__ == "__main__":
    unittest.main()
