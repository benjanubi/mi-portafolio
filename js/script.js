(function () {
  "use strict";

  const motionQuery =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };

  const PROJECTS = {
    "cosecha-berries": {
      title: "cosecha_berries",
      date: "Diciembre 2025",
      category: "Desarrollo móvil",
      description:
        "Aplicación móvil desarrollada en Flutter para el seguimiento y control de cosechas de berries.",
      detail:
        "El proyecto se centró en organizar el registro de cosechas dentro de una app móvil, con una navegación simple y pensada para el trabajo en terreno.",
      tech: ["Flutter", "Dart", "Gestión de datos"],
    },
    "mis-notas": {
      title: "Mis Notas",
      date: "Enero 2026",
      category: "Desarrollo móvil",
      description:
        "App personal de toma de notas y lector de PDFs construida con Flutter y Firebase.",
      detail:
        "Reúne la toma de notas y la lectura de documentos en una experiencia móvil enfocada en productividad personal.",
      tech: ["Flutter", "Firebase", "Productividad"],
    },
    "mermas-mcdonalds": {
      title: "Mermas McDonald's",
      date: "Febrero 2026",
      category: "Desarrollo móvil",
      description:
        "Aplicación en Flutter diseñada para que gerentes de turno registren y controlen residuos y mermas.",
      detail:
        "El foco estuvo en facilitar el registro operativo desde el móvil y ordenar la información de mermas de cada turno.",
      tech: ["Flutter", "Operaciones", "Registro"],
    },
    "generador-horarios": {
      title: "Generador de Horarios",
      date: "Marzo 2026",
      category: "Herramienta de escritorio",
      description:
        "Herramienta en Python con interfaz Tkinter y motor ReportLab para generar PDFs con horarios universitarios.",
      detail:
        "Combina una interfaz gráfica para construir los horarios con un motor de reportes que compila el resultado en un documento PDF.",
      tech: ["Python", "Tkinter", "ReportLab"],
    },
    "prototipos-web": {
      title: "Prototipos web para negocios locales",
      date: "Proyectos locales",
      category: "Diseño y desarrollo web",
      description:
        "Sitios y sistemas desarrollados para negocios locales, con foco en una presentación clara y funcional.",
      detail:
        "Trabajos de diseño y desarrollo web para distintos emprendimientos de la zona: Ale Sushi, SebTech, El Rey del Ahorro, LUK'S Crepería, Ágape Restobar, Tasty Food Chillán y Superbikers.",
      tech: ["HTML", "CSS", "JavaScript", "Diseño web"],
    },
  };

  function getProject(id) {
    return Object.prototype.hasOwnProperty.call(PROJECTS, id)
      ? PROJECTS[id]
      : null;
  }

  function openProjectDialog(id) {
    const dialog = document.getElementById("project-dialog");
    const project = getProject(id);
    if (!dialog || !project) return;

    const title = document.getElementById("project-dialog-title");
    const meta = document.getElementById("project-dialog-meta");
    const description = document.getElementById("project-dialog-description");
    const detail = document.getElementById("project-dialog-detail");
    const tech = document.getElementById("project-dialog-tech");

    if (!title || !meta || !description || !detail || !tech) return;

    title.textContent = project.title;
    meta.textContent = project.date + " · " + project.category;
    description.textContent = project.description;
    detail.textContent = project.detail;
    tech.replaceChildren();

    project.tech.forEach(function (technology) {
      const item = document.createElement("li");
      item.textContent = technology;
      tech.appendChild(item);
    });

    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    document.body.classList.add("dialog-open");
  }

  function closeProjectDialog() {
    const dialog = document.getElementById("project-dialog");
    if (!dialog) return;

    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }

    document.body.classList.remove("dialog-open");
  }

  function initProjectDialogs() {
    const dialog = document.getElementById("project-dialog");
    if (!dialog) return;

    document.querySelectorAll("[data-project-id]").forEach(function (button) {
      button.addEventListener("click", function () {
        openProjectDialog(button.dataset.projectId);
      });
    });

    dialog.querySelectorAll("[data-dialog-close]").forEach(function (button) {
      button.addEventListener("click", closeProjectDialog);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeProjectDialog();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("dialog-open");
    });

    dialog.addEventListener("cancel", function () {
      document.body.classList.remove("dialog-open");
    });
  }

  function copyText(text) {
    if (!text) return Promise.resolve(false);

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(text);
        }
      );
    }

    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    if (typeof document === "undefined" || !document.body) return false;

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-9999px";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(field);
    return copied;
  }

  function initCopyEmail() {
    const button = document.querySelector("[data-copy-email]");
    const status = document.querySelector("[data-copy-status]");
    if (!button) return;

    const email = "benjavalenz36@gmail.com";
    let resetTimer = 0;

    button.addEventListener("click", function () {
      copyText(email).then(function (copied) {
        window.clearTimeout(resetTimer);

        if (status) {
          status.textContent = copied
            ? "Correo copiado al portapapeles"
            : "No se pudo copiar. Escríbelo manualmente.";
          status.dataset.state = copied ? "success" : "error";
        }

        button.textContent = copied ? "Correo copiado" : "No se pudo copiar";

        resetTimer = window.setTimeout(function () {
          button.textContent = "Copiar correo";
          if (status) {
            status.textContent = "";
            delete status.dataset.state;
          }
        }, 3200);
      });
    });
  }

  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    }

    update();
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
  }

  function initNavObserver() {
    const links = Array.prototype.slice.call(
      document.querySelectorAll('.nav__links a[href^="#"]')
    );
    if (!links.length) return;

    const sections = [];
    links.forEach(function (link) {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) sections.push({ link: link, section: section });
    });
    if (!sections.length) return;

    function setActive(activeLink) {
      links.forEach(function (link) {
        const isActive = link === activeLink;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    if (typeof IntersectionObserver !== "function") {
      setActive(sections[0].link);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const match = sections.find(function (item) {
            return item.section === entry.target;
          });
          if (match) setActive(match.link);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (item) {
      observer.observe(item.section);
    });
  }

  function initReveal() {
    const items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    if (motionQuery.matches || typeof IntersectionObserver !== "function") {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initPointerGlow() {
    if (motionQuery.matches) return;

    const cards = document.querySelectorAll(".glass--interactive");

    cards.forEach(function (card) {
      let frame = 0;
      let px = 50;
      let py = 0;

      function paint() {
        card.style.setProperty("--mx", px.toFixed(2) + "%");
        card.style.setProperty("--my", py.toFixed(2) + "%");
        frame = 0;
      }

      function updateGlow(event) {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        px = ((event.clientX - rect.left) / rect.width) * 100;
        py = ((event.clientY - rect.top) / rect.height) * 100;
        if (!frame) frame = window.requestAnimationFrame(paint);
      }

      card.addEventListener("pointermove", updateGlow);
      card.addEventListener("pointerenter", updateGlow);
    });
  }

  function initAmbient() {
    if (motionQuery.matches) return;

    const orbs = Array.prototype.slice.call(document.querySelectorAll(".orb"));
    if (!orbs.length) return;

    const rates = [0.05, -0.035, 0.025];
    let ticking = false;

    function update() {
      const offset = window.scrollY;
      orbs.forEach(function (orb, index) {
        const rate = rates[index % rates.length];
        orb.style.transform = "translate3d(0, " + (offset * rate).toFixed(1) + "px, 0)";
      });
      ticking = false;
    }

    update();
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
  }

  function init() {
    document.documentElement.classList.add("js");
    initHeader();
    initNavObserver();
    initReveal();
    initPointerGlow();
    initAmbient();
    initProjectDialogs();
    initCopyEmail();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { PROJECTS, getProject, copyText };
  }
})();
