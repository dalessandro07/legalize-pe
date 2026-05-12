# Legalize — Perú

Legislación peruana como repositorio Git. Cada ley es un archivo Markdown, cada reforma un commit con la fecha real de publicación.

**Web:** [legalize.crafter.ing](https://legalize.crafter.ing)

## Estadísticas

| Categoría | Cantidad |
|-----------|----------|
| Normas legales | 1,617 |
| Reformas constitucionales | 31 |

## Funcionalidades

### Búsqueda y filtros

- **Búsqueda full-text** — Fuzzy search con Fuse.js por título, identificador y contenido
- **Filtro por tipo** — Ley, Decreto Legislativo, Decreto Supremo, etc.
- **Filtro por estado** — Vigente, derogada, modificada
- **Filtro por materia** — Civil, penal, laboral, tributario y 30+ categorías
- **Filtro por fecha** — Rango de años (desde/hasta)
- **Ordenamiento** — Por relevancia, fecha o título
- **Paginación** — 50 resultados por página con "cargar más"

### Lectura de normas

- **Tabla de contenidos** — Navegación rápida por secciones
- **Deep links** — Enlaces directos a artículos específicos (`#articulo-1`)
- **Texto justificado** — Formato optimizado para lectura legal
- **Light/Dark mode** — Toggle de tema con persistencia

### Historial y versiones

- **Historial de versiones** — Ver cambios de cada norma a lo largo del tiempo
- **Comparador de versiones** — Diff unificado y lado a lado estilo GitHub

### Citas y compartir

- **Generador de citas** — Formato legal peruano, APA 7, URL permanente
- **Compartir** — Twitter, LinkedIn, WhatsApp, copiar enlace
- **Export PDF** — Imprimir o guardar como PDF

### Extras

- **PWA** — Funciona offline, instalable en móvil
- **RSS Feed** — `/feed.xml` con las 50 normas más recientes
- **Descarga** — Exportar normas en Markdown

### API

| Endpoint | Descripción |
|----------|-------------|
| `GET /feed.xml` | RSS feed con las 50 normas más recientes |
| `GET /api/normas/:id/history` | Historial de commits de una norma |
| `GET /api/normas/:id/at/:commit` | Contenido en un commit específico |
| `GET /api/normas/:id/diff?from=X&to=Y` | Diff unificado entre versiones |
| `GET /api/normas/:id/compare?from=X&to=Y` | Comparación lado a lado |

```bash
# RSS feed
curl "https://legalize.crafter.ing/feed.xml"

# Historial del Código Civil
curl "https://legalize.crafter.ing/api/normas/dleg-295/history"

# Diff entre dos versiones
curl "https://legalize.crafter.ing/api/normas/dleg-295/diff?from=abc123&to=def456"
```

## Inicio rápido

```bash
git clone https://github.com/crafter-research/legalize-pe.git
cd legalize-pe

# Ver el Artículo 2 de la Constitución
grep -A 20 "Artículo 2" leyes/pe/constitucion-1993.md

# Historial de reformas constitucionales
git log --oneline --date=short --format="%ad %s" -- leyes/pe/reformas-constitucionales/
```

## Estructura

```
legalize-pe/
├── apps/
│   ├── web/                    # Astro + PWA
│   └── api/                    # Next.js API REST
├── packages/
│   ├── git/                    # Utilidades Git para historial
│   ├── parser/                 # Parser de frontmatter YAML
│   └── scraper/                # Scraping de fuentes oficiales
└── leyes/
    └── pe/                     # Legislación nacional
        ├── constitucion-1993.md
        ├── dleg-295.md         # Código Civil
        ├── dleg-635.md         # Código Penal
        └── reformas-constitucionales/
```

## Normas principales

| Norma | Identificador |
|-------|---------------|
| Constitución Política | `constitucion-1993` |
| Código Civil | `dleg-295` |
| Código Penal | `dleg-635` |
| Código Procesal Civil | `dleg-768` |
| Código Procesal Penal | `dleg-957` |
| Código Procesal Constitucional | `ley-31307` |
| LO del Poder Judicial | `ds-017-93-jus` |
| LO de Municipalidades | `ley-27972` |

## Formato

```yaml
---
titulo: "Decreto Legislativo N° 295 - Código Civil"
identificador: "dleg-295"
rango: "decreto-legislativo"
fechaPublicacion: "1984-07-25"
estado: "vigente"
fuente: "https://spij.minjus.gob.pe"
---

# Código Civil

TÍTULO PRELIMINAR

Artículo I.- La ley se deroga sólo por otra ley...
```

## Stack

- **Monorepo:** Turborepo + pnpm
- **Web:** Astro (static + SSR)
- **API:** Next.js + Drizzle + Turso
- **PWA:** Workbox
- **Búsqueda:** Fuse.js
- **Git:** simple-git

## Desarrollo

```bash
pnpm install
pnpm dev          # Inicia web en localhost:4321
pnpm build        # Build de producción
```

## Fuentes

- [SPIJ](https://spij.minjus.gob.pe) — Sistema Peruano de Información Jurídica
- [El Peruano](https://elperuano.pe) — Diario Oficial

El texto legislativo es de dominio público según el Decreto Legislativo 822, Artículo 9.

## Licencia

- **Contenido legislativo:** Dominio público
- **Código:** [MIT](LICENSE)

---

[Crafter Station](https://www.crafterstation.com)
