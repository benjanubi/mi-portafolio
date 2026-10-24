# Diseño — Portafolio personal con estética liquid glass

**Fecha:** 2026-10-23  
**Proyecto:** MiPortafolio  
**Autor:** Benjamín Ignacio Valenzuela Muñoz

---

## 1. Intención

Crear un portafolio personal local que funcione como una **carta de presentación** de Benjamín Ignacio Valenzuela Muñoz: quién es, qué estudia, qué habilidades tiene y qué proyectos ha construido.

El sitio estará orientado a personas y clientes que quieran conocer su trabajo, pero sin una lógica de venta agresiva. No se encasillará en un único servicio: mostrará un perfil amplio de desarrollo móvil, desarrollo web, herramientas de escritorio y manejo de entornos Linux.

La experiencia debe sentirse moderna, cuidada y tecnológica, con un efecto **liquid glass** protagonista, una paleta morada y una navegación sencilla de una sola página.

---

## 2. Objetivos

- Causar una primera impresión visual fuerte y coherente con el perfil tecnológico.
- Presentar la información en un orden claro: identidad, trayectoria, habilidades, proyectos y contacto.
- Mostrar los proyectos sin abrumar: tarjetas resumidas y detalles ampliados bajo demanda.
- Mantener el sitio rápido, autocontenido y fácil de abrir de forma local.
- Funcionar bien en escritorio, tablet y móvil.
- Cuidar legibilidad, navegación por teclado y preferencias de movimiento reducido.
- Permitir que el contenido sea fácil de editar directamente en HTML y JavaScript.

---

## 3. No objetivos

- No incluye backend, base de datos, autenticación ni panel de administración.
- No incluye blog, CMS, tienda ni sistema de reservas.
- No incluye formulario con envío real; el contacto será mediante enlaces directos y copia de correo.
- No incluye analítica ni cookies.
- No incluye descarga de CV, salvo que Benjamín entregue un archivo para enlazar.
- No incluye múltiples páginas ni rutas; todo vive en una sola página.
- No incluye testimonios, precios, métricas inventadas ni promesas comerciales.

---

## 4. Anti-objetivos

- Un vidrio tan opaco o tan brillante que dificulte leer el contenido.
- Saturar la página con animaciones, partículas o efectos 3D pesados.
- Parecer una plantilla genérica de "startup" o una landing de ventas.
- Depender de librerías externas para un sitio que puede funcionar con HTML, CSS y JavaScript.
- Mostrar proyectos como simples logos sin explicar qué se hizo.
- Sacrificar el móvil por mantener efectos de escritorio.

---

## 5. Restricciones y decisiones ya tomadas

- **Tecnología:** HTML5, CSS3 y JavaScript puro, sin frameworks ni paso de compilación.
- **Estructura:** una sola página con secciones y navegación por anclas.
- **Idioma:** español.
- **Ubicación:** `C:\CarpetaPruebas\MiPortafolio`.
- **Estética:** oscura, tecnológica y nocturna, con efecto liquid glass.
- **Color principal:** morado, tomando como referencia la paleta entregada.
- **Uso local:** debe abrirse directamente desde `index.html` sin instalar dependencias.
- **Sin datos de contacto inventados:** los enlaces reales deben ser proporcionados por Benjamín o quedar claramente marcados como pendientes.

### Paleta de referencia

La imagen entregada contiene una escala de morados, lavandas, violetas e índigos. Se usarán valores aproximados y se ajustarán buscando contraste:

| Uso | Color aproximado |
|---|---|
| Fondo profundo | `#08040f` |
| Fondo secundario | `#12071f` |
| Índigo oscuro | `#2a1550` |
| Ciruela | `#3a174f` |
| Morado profundo | `#6b1490` |
| Violeta principal | `#8b2be2` |
| Periwinkle | `#7d73c9` |
| Lavanda | `#b79ad6` |
| Lila claro | `#d7b6ef` |
| Texto principal | `#f5f0ff` |
| Texto secundario | `#b8a9cc` |
| Acento fresco | `#6ee7d8` (menta) |

El acento menta se usará con moderación para estados, etiquetas pequeñas y detalles interactivos. El resto de la identidad seguirá siendo morado.

---

## 6. Enfoques considerados

### Opción elegida: HTML, CSS y JavaScript puro, una sola página

**Ventajas:** cero instalación, apertura directa, control total del efecto visual, poco peso, fácil de publicar después.  
**Coste:** si el portafolio crece mucho, habrá que ordenar manualmente el HTML y los datos de proyectos.

### Alternativa descartada: React con Vite

Permitiría componentes y animaciones más estructuradas, pero añade Node, dependencias y compilación para un sitio que no lo necesita. Se descartó por simplicidad y porque el usuario prefirió una sola página ligera.

### Alternativa descartada: varias páginas HTML

Daría más espacio a cada proyecto, pero fragmenta la lectura y añade navegación. Se descartó porque la intención es una carta de presentación breve y directa.

---

## 7. Dirección visual

### Ambiente

Fondo casi negro con tinte ciruela, iluminado por manchas de luz violeta, índigo y lavanda. Las superficies principales serán paneles de vidrio con desenfoque, bordes luminosos y reflejos suaves. La sensación debe ser la de una interfaz de cristal flotando sobre una escena nocturna, no la de un cristal plano.

### Tipografía

- Títulos: `"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif`, con tracking ajustado y pesos altos.
- Texto: `"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif`.
- Etiquetas técnicas: `"Cascadia Code", "Consolas", monospace`.
- Sin fuentes externas obligatorias, para que el sitio siga funcionando sin conexión.

### Vidrio

Los paneles usarán:

- Fondo translúcido con blanco de baja opacidad y tinte morado.
- `backdrop-filter: blur(...) saturate(...)`.
- Borde de 1 px con gradiente o blanco translúcido.
- Sombra exterior oscura y brillo interior en el borde superior.
- Reflejo radial que sigue levemente al puntero en dispositivos con mouse.
- Ruido sutil y gradientes para evitar un acabado plástico.

Debe existir una variante sin `backdrop-filter` para navegadores que no lo soporten, manteniendo contraste suficiente.

### Composición

- Contenedor máximo de aproximadamente 1200 px.
- Espaciado generoso entre secciones.
- Tarjetas con radios grandes y jerarquía tipográfica clara.
- Líneas y etiquetas finas como contrapunto técnico.
- Movimiento contenido: aparición al hacer scroll, flotación lenta de luces y transiciones de hover.

---

## 8. Estructura de la página

### 8.1 Navegación

Barra superior fija en formato píldora de vidrio.

- Marca: monograma `BV` y nombre corto.
- Enlaces: Inicio, Sobre mí, Habilidades, Proyectos, Contacto.
- Indicador de sección activa.
- En móvil: marca + botón "Hablemos"; el resto de enlaces se puede omitir o mover a una fila compacta.
- Enlace de salto al contenido para lectores de pantalla.
- Fondo de la barra que aumenta su opacidad al hacer scroll.

### 8.2 Hero / Inicio

- Etiqueta pequeña: `Portafolio · 2026`.
- Nombre completo como título principal.
- Bajada: desarrollador de software y estudiante de Ingeniería Civil en Informática.
- Texto breve: aplicaciones móviles, herramientas de escritorio y sitios web con foco en soluciones útiles.
- Botones: "Ver proyectos" y "Hablemos".
- Tarjeta de vidrio con monograma `BV`, ubicación San Carlos, Chile; edad 20; Universidad del Bío-Bío.
- Chips técnicos: Flutter, Python, Linux.
- Indicador discreto de scroll.
- Sin foto personal, porque no se entregó una. Se usará un monograma abstracto y tratado visualmente, no una foto falsa.

### 8.3 Sobre mí

Texto en primera persona, breve y humano. Debe responder quién es, qué estudia, dónde vive y cómo entiende su trabajo.

Puntos concretos:

- 20 años, San Carlos, Región de Ñuble, Chile.
- Estudiante de Ingeniería Civil en Informática en la Universidad del Bío-Bío.
- Ayudante del ramo Álgebra Lineal.
- Staff en un evento universitario.
- Interés por el desarrollo móvil, las herramientas académicas, la automatización y los entornos Linux.

Se acompañará con tarjetas de "Educación" y "Experiencia", y una breve nota de enfoque: aprender construyendo, cuidar la utilidad y la presentación de lo que desarrolla. Las tarjetas serán simples y sin fechas, porque no se entregaron años ni nombres de cursos o eventos; no se inventará una línea de tiempo.

### 8.4 Habilidades

Tres grupos de tarjetas de vidrio:

1. **Desarrollo**
   - Flutter y Dart
   - HTML5, CSS3 y JavaScript
   - Java
   - Python
   - LaTeX

2. **Entornos**
   - Arch Linux con Hyprland
   - KDE Plasma
   - i3wm
   - Ubuntu
   - antiX Linux
   - Linux Mint XFCE

3. **Herramientas**
   - Tkinter
   - ReportLab
   - Firebase
   - Excel nivel intermedio

Las habilidades se mostrarán como etiquetas y grupos, sin barras de porcentaje ni niveles inventados. Cada grupo puede incluir una frase breve que explique su uso.

### 8.5 Proyectos

Sección con dos grupos y tarjetas resumidas. Cada tarjeta abre un diálogo de vidrio con el detalle.

#### Desarrollo móvil y de escritorio

- **cosecha_berries** — Diciembre 2025. Aplicación móvil en Flutter para el seguimiento y control de cosechas de berries. Etiquetas: Flutter, Dart, gestión de datos.
- **Mis Notas** — Enero 2026. App personal de notas y lector de PDFs construida con Flutter y Firebase. Etiquetas: Flutter, Firebase, productividad.
- **App de Mermas McDonald's** — Febrero 2026. Aplicación en Flutter para que gerentes de turno registren y controlen residuos y mermas. Etiquetas: Flutter, operaciones, registro.
- **Generador de Horarios** — Marzo 2026. Herramienta de escritorio en Python con Tkinter y ReportLab para generar PDFs con horarios universitarios. Etiquetas: Python, Tkinter, ReportLab.

#### Desarrollo web y emprendimientos

- **Prototipos web para negocios locales** — Una sola tarjeta grupal con los sitios y sistemas para Ale Sushi, SebTech, El Rey del Ahorro, LUK'S Crepería, Ágape Restobar, Tasty Food Chillán y Superbikers. Etiquetas: HTML, CSS, JavaScript, diseño web. Tendrá un único diálogo que reúne los siete nombres, ya que no se entregó información distinta para cada negocio.

Cada diálogo de proyecto incluirá la descripción entregada, las tecnologías y la fecha. No se inventarán contextos, estados, enlaces, repositorios ni resultados. Si no hay enlace público, se indicará "Proyecto local" o se omitirá el botón.

Las tarjetas pueden incluir una **previsualización abstracta** hecha con CSS —formas, paneles y líneas que evocan una interfaz—, nunca una captura falsa presentada como real.

### 8.6 Contacto

Panel final de vidrio con un mensaje directo y cordial: "Hablemos" o "¿Tienes una idea o proyecto en mente?".

Acciones previstas, cada una con su icono y color característico:

- **Correo:** `benjavalenz36@gmail.com`, enlace `mailto:`, icono de sobre y rojo Gmail `#EA4335`.
- **GitHub:** `https://github.com/benjanubi`, icono de GitHub y blanco de marca `#FFFFFF` sobre fondo oscuro.
- **LinkedIn:** `https://www.linkedin.com/in/benjamín-valenzuela-muñoz-a666a53a8`, icono de LinkedIn y azul `#0A66C2`.
- **WhatsApp:** `+56 9 7138 3760`, enlace `https://wa.me/56971383760`, icono de WhatsApp y verde `#25D366`.

Cada enlace será una tarjeta o píldora de vidrio con el icono en su color de marca, texto legible y un estado de hover coherente con el resto del sitio. Los iconos serán SVG en línea, sin depender de una librería externa. El color de marca se usará en el icono y en detalles; el texto mantendrá el contraste de la interfaz.

También se incluirá un botón para copiar el correo con confirmación visual accesible. El mensaje secundario aclarará que Benjamín también está abierto a oportunidades académicas y colaboraciones.

### 8.7 Pie de página

- "Diseñado y desarrollado por Benjamín Valenzuela · 2026".
- San Carlos, Chile.
- Enlace para volver arriba.

---

## 9. Interacciones y comportamiento

- **Scroll suave** entre secciones, respetando `prefers-reduced-motion`.
- **Sección activa** resaltada en la navegación mediante `IntersectionObserver`.
- **Aparición progresiva** de bloques al entrar en pantalla; sin bloquear el contenido si JavaScript falla.
- **Reflejo líquido** en tarjetas: variables CSS actualizadas con la posición del puntero, limitadas a dispositivos con hover.
- **Luces ambientales** con movimiento lento y parallax muy leve; se desactivan con movimiento reducido.
- **Diálogos de proyecto** con `<dialog>`, cierre con Escape, botón visible y foco contenido.
- **Botón de copiar correo** con confirmación visual accesible.
- **Navegación móvil** sin menús profundos ni dependencias.

---

## 10. Accesibilidad

- HTML semántico: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Un solo `h1`; jerarquía de encabezados coherente.
- Enlace "Saltar al contenido".
- Foco visible en todos los elementos interactivos.
- Contraste de texto suficiente sobre el vidrio.
- Etiquetas `aria-label` donde el texto visible no baste.
- Diálogos con título, descripción y cierre accesible.
- Respeto por `prefers-reduced-motion` y por la navegación sin JavaScript.
- El contenido principal debe seguir siendo legible si los efectos visuales no cargan.
- Sin JavaScript, las tarjetas de proyecto conservan fecha, descripción y tecnologías; los diálogos son una mejora progresiva y no la única vía para entender cada proyecto.

---

## 11. Rendimiento y compatibilidad

- Sin frameworks, fuentes externas obligatorias ni imágenes pesadas.
- Las previsualizaciones de proyectos serán CSS/SVG, no capturas de pantalla.
- Limitar la cantidad de capas con `backdrop-filter` para evitar caídas de rendimiento.
- Usar `requestAnimationFrame` para el seguimiento del puntero.
- Fallback para `backdrop-filter`.
- Probar en Chrome/Edge actuales y en una ventana móvil emulada.
- Sin errores en consola.
- **Alcance de navegadores:** Chromium actual es el objetivo principal. Firefox y Safari recibirán un intento razonable de compatibilidad mediante `-webkit-backdrop-filter`, fallback de opacidad y reducción de capas en móvil; no se podrá verificar WebKit real desde Windows en esta entrega.

---

## 12. Archivos previstos

```text
MiPortafolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── favicon.svg
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-10-23-portafolio-liquid-glass-design.md
└── README.md
```

No se creará `package.json` ni se requerirá un servidor de desarrollo. El sitio debe poder abrirse con doble clic en `index.html`.

---

## 13. Contenido y límites

- Todo el contenido será en español.
- No se inventarán cargos, clientes, métricas, testimonios ni fechas distintas a las entregadas.
- Las fechas de los proyectos se mostrarán como fueron proporcionadas.
- Los nombres de los negocios se usarán solo como referencia de proyectos realizados.
- El tono será cercano, claro y profesional, sin exageraciones.
- La sección "Sobre mí" se escribirá en primera persona.
- La página no prometerá disponibilidad inmediata ni resultados comerciales.

---

## 14. Criterios de aceptación

1. El sitio abre localmente desde `index.html` sin instalar dependencias.
2. Se ve coherente en anchos de 360 px, 768 px, 1024 px y 1440 px.
3. La navegación lleva a todas las secciones y marca la sección activa.
4. El efecto liquid glass es visible en la navegación, las tarjetas y el hero, sin perjudicar la lectura.
5. La paleta morada domina la página y el acento adicional se usa con moderación.
6. Los cinco proyectos y el grupo de emprendimientos aparecen con sus descripciones.
7. Cada proyecto abre un detalle y el diálogo se puede cerrar con Escape.
8. La página se puede recorrer con teclado y el foco es visible.
9. Con movimiento reducido, no hay animaciones ambientales ni desplazamientos automáticos.
10. No hay enlaces falsos ni datos de contacto inventados.
11. No hay errores en consola ni desbordamiento horizontal en móvil.

---

## 15. Decisiones que quedan al constructor

- Ajuste fino de espaciados, tamaños tipográficos y radios.
- Composición exacta de las previsualizaciones abstractas.
- Intensidad del ruido, los brillos y las sombras.
- Redacción final de textos breves, manteniendo los hechos entregados.
- Distribución de las tarjetas en uno o dos columnas según el ancho.
- Nivel de detalle de cada diálogo de proyecto.
- Uso exacto del acento menta dentro de la paleta morada.
- Comportamiento exacto de la sección de contacto si aún no hay datos reales: se priorizará un panel sobrio con el correo pendiente claramente marcado antes que un enlace falso.

---

## 16. Datos del cliente

Datos confirmados para la sección de contacto:

- Correo: `benjavalenz36@gmail.com`.
- GitHub: `https://github.com/benjanubi`.
- LinkedIn: `https://www.linkedin.com/in/benjamín-valenzuela-muñoz-a666a53a8`.
- WhatsApp: `+56 9 7138 3760` / `https://wa.me/56971383760`.

Pendientes opcionales: enlaces públicos a proyectos o repositorios, archivo de CV y confirmación sobre si se quiere mostrar la edad en el hero o solo en "Sobre mí". No se inventarán enlaces ni se presentarán como funcionales los que no existan.
