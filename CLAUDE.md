# Legalize PE

Plataforma de acceso a la legislación peruana como repositorio Git.

## Descripción

Legalize PE es una plataforma civic-tech que digitaliza y versiona la legislación peruana. Cada norma legal es un archivo Markdown con frontmatter YAML, y cada modificación legislativa es un commit con la fecha de publicación real.

## Arquitectura

```
legalize-pe/                    # Monorepo (Turborepo + pnpm)
├── apps/
│   ├── web/                    # Frontend: Astro 5 + PWA
│   │   ├── src/pages/          # Páginas estáticas y dinámicas
│   │   ├── src/pages/api/      # Endpoints Git (history, diff, compare)
│   │   └── src/lib/            # Utilidades de búsqueda y parsing
│   └── api/                    # Backend: Next.js 15 + Drizzle + Turso
│       └── src/app/api/        # API REST completa (9 endpoints)
├── packages/
│   ├── git/                    # Servicios Git (simple-git + GitHub API)
│   ├── parser/                 # Parser HTML → Markdown + frontmatter
│   └── scraper/                # Scripts de scraping (SPIJ, El Peruano)
└── leyes/
    └── pe/                     # 1,617 normas en Markdown
        ├── constitucion-1993.md
        ├── dleg-295.md         # Código Civil
        ├── dleg-635.md         # Código Penal
        └── reformas-constitucionales/
```

## Decisiones Técnicas

### Doble Sistema de API
- **Astro endpoints** (`apps/web/src/pages/api`): Endpoints de historial Git, funcionan con GitHub API en producción (Vercel serverless)
- **Next.js API** (`apps/api`): API REST completa con base de datos Turso, búsqueda full-text, estadísticas

### Contenido como Git
Las normas viven en `leyes/pe/*.md` y son la fuente de verdad. La base de datos es un índice derivado (import script).

### PWA y Offline
El sitio web es una PWA instalable con soporte offline usando Workbox.

## Convenciones

### Identificadores de Normas
- Formato: `tipo-numero` (lowercase, guiones)
- Ejemplos: `dleg-295`, `ley-27972`, `constitucion-1993`, `ds-033-2001-mtc`

### Frontmatter Requerido
```yaml
titulo: string          # Nombre completo de la norma
identificador: string   # ID único (tipo-numero)
rango: string          # decreto-legislativo, ley, decreto-supremo, etc.
fechaPublicacion: string # YYYY-MM-DD
estado: string         # vigente, derogada, modificada
fuente: string         # URL de la fuente original
```

### Commits de Contenido
- Formato: `feat(leyes): descripción breve`
- La fecha del commit debe coincidir con la fecha de publicación si es posible

## Seguridad

Los endpoints de Astro validan:
- `id`: Solo `[a-z0-9-]+` (previene path traversal)
- `commit`: Solo hashes hexadecimales de 7-40 caracteres

## Stack

| Capa | Tecnología |
|------|------------|
| Build | Turborepo, pnpm, TypeScript |
| Web | Astro 5, Fuse.js, Marked |
| API | Next.js 15, Drizzle ORM, Turso (SQLite) |
| Git | simple-git, LRU-cache |
| PWA | @vite-pwa/astro, Workbox |
| Linting | Biome |

## Desarrollo

```bash
pnpm install
pnpm dev          # Web en localhost:4321, API en localhost:3001
pnpm build        # Build de producción
pnpm lint         # Biome check
```

## Fuentes de Datos

- **SPIJ** (spij.minjus.gob.pe): Sistema Peruano de Información Jurídica
- **El Peruano** (elperuano.pe): Diario Oficial
- **LP Derecho** (lpderecho.pe): Versiones actualizadas de códigos

El contenido legislativo es de dominio público (DLeg 822, Art. 9).
