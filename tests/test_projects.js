const { test } = require("node:test");
const assert = require("node:assert/strict");
const { PROJECTS, getProject } = require("../js/script.js");

test("catálogo de proyectos completo", () => {
  assert.deepEqual(Object.keys(PROJECTS), [
    "cosecha-berries",
    "mis-notas",
    "mermas-mcdonalds",
    "generador-horarios",
    "prototipos-web",
  ]);
});

test("los datos clave no se pierden", () => {
  assert.equal(getProject("cosecha-berries").date, "Diciembre 2025");
  assert.equal(getProject("mis-notas").date, "Enero 2026");
  assert.equal(getProject("mermas-mcdonalds").date, "Febrero 2026");
  assert.equal(getProject("generador-horarios").date, "Marzo 2026");
  assert.ok(getProject("prototipos-web").tech.includes("JavaScript"));
});

test("un id desconocido devuelve null", () => {
  assert.equal(getProject("no-existe"), null);
});
