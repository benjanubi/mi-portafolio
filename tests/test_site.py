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
            ROOT / "README.md",
        ):
            self.assertTrue(path.is_file(), str(path))

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


if __name__ == "__main__":
    unittest.main()
