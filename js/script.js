(function () {
  "use strict";

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

  function init() {
    document.documentElement.classList.add("js");
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
