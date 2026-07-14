# legalize-pe API

HTTP API for querying the Peruvian legal corpus: 21,244 norms as Markdown with YAML frontmatter, covering national legislation and 26 regional jurisdictions. Each norm is a `.md` file; each reform is a git commit with its real publication date.

Base URL: `http://<host>:3000`

---

## Authentication

HTTP Basic Auth on all endpoints except `/health`.

```
Authorization: Basic <base64(user:password)>
```

Credentials configured via `API_USER` / `API_PASS` environment variables.

Failure returns `401 Unauthorized` with `WWW-Authenticate: Basic realm="legalize-pe-api"`.

---

## Endpoints

### `GET /health`

No auth. Used by Coolify for health checks.

**Response 200**

```json
{ "status": "ok", "total_norms": 21244 }
```

---

### `GET /stats`

Corpus statistics: counts by rank, jurisdiction, and date range.

**Response 200**

| Field | Type | Description |
|-------|------|-------------|
| `total_norms` | integer | Total norms indexed |
| `total_ranks` | integer | Number of distinct norm ranks |
| `total_jurisdictions` | integer | Number of distinct jurisdictions |
| `by_rank` | object | `{ rank: count }` sorted by count descending |
| `by_jurisdiction` | object | `{ code: count }` sorted by count descending |
| `date_range` | object | `{ earliest_publication, latest_publication, latest_update }` |

**Example**

```bash
curl -u user:pass http://localhost:3000/stats
```

---

### `GET /norms`

Search and list norms. Returns metadata only (no body content).

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `rank` | string | — | Filter by norm rank (exact match, case-insensitive). See [Ranks](#ranks). |
| `jurisdiction` | string | — | Filter by jurisdiction code. See [Jurisdictions](#jurisdictions). |
| `q` | string | — | Keyword search in `title` + `identifier`. Case-insensitive. Multiple words = AND logic. |
| `from` | string | — | Publication date lower bound (`YYYY-MM-DD`). |
| `to` | string | — | Publication date upper bound (`YYYY-MM-DD`). |
| `page` | integer | `1` | Page number. |
| `limit` | integer | `20` | Results per page. Max `100`. |
| `sort` | string | `publication_date` | Sort field: `publication_date`, `last_updated`, or `title`. |
| `order` | string | `desc` | Sort order: `asc` or `desc`. |

**Response 200**

```json
{
  "total": 156,
  "page": 1,
  "limit": 20,
  "results": [
    {
      "identifier": "LEY-32176-2024",
      "title": "Ley N.° 32176",
      "country": "pe",
      "rank": "ley",
      "publication_date": "2024-10-15",
      "last_updated": "2024-10-15",
      "status": "in_force",
      "source": "https://spij.minjus.gob.pe/...",
      "jurisdiction": "pe",
      "scope": "Nacional"
    }
  ]
}
```

**NormMeta fields in `results[]`**

| Field | Type | Description |
|-------|------|-------------|
| `identifier` | string | Unique norm ID (e.g. `LEY-32176-2024`, `CON-1993`) |
| `title` | string | Full title of the norm |
| `country` | string | ISO 3166-1 alpha-2 code (`pe`) |
| `rank` | string | Norm rank (e.g. `ley`, `decreto_supremo`, `constitucion`) |
| `publication_date` | string | Original publication date (`YYYY-MM-DD`) |
| `last_updated` | string | Last modification date (`YYYY-MM-DD`) |
| `status` | string | Usually `in_force` |
| `source` | string | URL to the official source |
| `jurisdiction` | string | `pe` for national, `pe-{iso}` for regional |
| `scope` | string | `Nacional` or `Regional` |

**Examples**

```bash
# All laws mentioning "minería"
curl -u user:pass "http://localhost:3000/norms?rank=ley&q=minería"

# Recent decreto_supremo from 2024, newest first
curl -u user:pass "http://localhost:3000/norms?rank=decreto_supremo&from=2024-01-01&sort=publication_date&order=desc&limit=10"

# All norms from Cusco region
curl -u user:pass "http://localhost:3000/norms?jurisdiction=pe-cus&limit=5"

# Get a specific norm by identifier
curl -u user:pass "http://localhost:3000/norms?q=CON-1993&limit=1"

# Page 3 of constitutional decrees
curl -u user:pass "http://localhost:3000/norms?rank=decreto_legislativo&page=3&limit=20"
```

---

### `GET /norms/:identifier`

Retrieve a single norm with full metadata and body content.

**Path parameter**

| Param | Type | Description |
|-------|------|-------------|
| `identifier` | string | Norm identifier (e.g. `CON-1993`, `LEY-32176-2024`, `DS-017-2011-SA`) |

**Response 200**

```json
{
  "meta": {
    "identifier": "CON-1993",
    "title": "Constitución Política del Perú",
    "country": "pe",
    "rank": "constitucion",
    "publication_date": "1993-12-30",
    "last_updated": "2024-12-11",
    "status": "in_force",
    "source": "https://lpderecho.pe/constitucion-politica-peru-actualizada/",
    "jurisdiction": "pe",
    "scope": "Nacional"
  },
  "content": "# Constitución Política del Perú\n\nPREÁMBULO\n\n..."
}
```

**Response 404**

```json
{ "error": "Norm not found" }
```

**Examples**

```bash
# Get the Constitution
curl -u user:pass http://localhost:3000/norms/CON-1993

# Get a specific law
curl -u user:pass http://localhost:3000/norms/LEY-32176-2024

# Get a regional ordinance
curl -u user:pass http://localhost:3000/norms/119-2026-GRA-CR-AREQUIPA
```

---

### `GET /norms/:identifier/content`

Returns only the body text of a norm (Markdown, no frontmatter). `Content-Type: text/plain`.

**Path parameter**

| Param | Type | Description |
|-------|------|-------------|
| `identifier` | string | Norm identifier |

**Response 200**

```
# Constitución Política del Perú

PREÁMBULO

El Congreso Constituyente Democrático...
```

**Response 404**

```json
{ "error": "Norm not found" }
```

**Example**

```bash
# Save the Constitution body to a file
curl -u user:pass http://localhost:3000/norms/CON-1993/content > constitucion.md
```

---

### `POST /norms/reload`

Rebuild the in-memory index from the filesystem. Clears the content cache. Returns the new index stats.

Use this after adding or updating norm files without restarting the server.

**Response 200**

```json
{ "ok": true, "count": 21244, "elapsed_ms": 3140 }
```

**Example**

```bash
curl -u user:pass -X POST http://localhost:3000/norms/reload
```

---

## Ranks

Common norm ranks available in the corpus. For the complete list (84 ranks), query `GET /stats`.

| Rank | Count | Description |
|------|-------|-------------|
| `acuerdo_regional` | 5,653 | Regional agreement |
| `ordenanza_regional` | 3,224 | Regional ordinance |
| `ley` | 2,569 | National law |
| `decreto_supremo` | 2,183 | Supreme decree |
| `resolucion_ministerial` | 1,696 | Ministerial resolution |
| `decreto_regional` | 898 | Regional decree |
| `resolucion_jefatural` | 442 | Chief resolution |
| `decreto_legislativo` | 432 | Legislative decree |
| `resolucion_directoral` | 426 | Directorate resolution |
| `decreto_de_urgencia` | 132 | Emergency decree |
| `decreto_ley` | 132 | Decree-law |
| `constitucion` | 1 | Constitution |
| `ley_de_reforma_constitucional` | 33 | Constitutional reform law |
| `codigo` | 1 | Code |

---

## Jurisdictions

ISO 3166-2:PE codes. `pe` = national. `pe-{iso}` = regional government.

| Code | Region | Norms |
|------|--------|-------|
| `pe` | Nacional | 10,973 |
| `pe-huv` | Huancavelica | 1,066 |
| `pe-cus` | Cusco | 816 |
| `pe-ama` | Amazonas | 723 |
| `pe-piu` | Piura | 720 |
| `pe-lor` | Loreto | 703 |
| `pe-uca` | Ucayali | 601 |
| `pe-pas` | Pasco | 499 |
| `pe-anc` | Áncash | 478 |
| `pe-are` | Arequipa | 472 |
| `pe-lal` | La Libertad | 437 |
| `pe-ica` | Ica | 421 |
| `pe-tum` | Tumbes | 412 |
| `pe-cal` | Callao | 390 |
| `pe-mdd` | Madre de Dios | 380 |
| `pe-jun` | Junín | 356 |
| `pe-lim` | Lima Región | 347 |
| `pe-lim-met` | Lima Metropolitana | 308 |
| `pe-lam` | Lambayeque | 195 |
| `pe-pun` | Puno | 166 |
| `pe-sam` | San Martín | 159 |
| `pe-moq` | Moquegua | 154 |
| `pe-apu` | Apurímac | 154 |
| `pe-aya` | Ayacucho | 134 |
| `pe-tac` | Tacna | 101 |
| `pe-caj` | Cajamarca | 6 |
| `pe-huc` | Huánuco | 1 |

---

## Agent Recipes

Common tasks an AI agent might perform using this API.

### Find a norm by identifier

```bash
curl -s -u $USER:$PASS http://localhost:3000/norms/LEY-32176-2024 | jq .
```

### Search norms by topic keyword

```bash
# Search titles for "educación", return top 5 results
curl -s -u $USER:$PASS "http://localhost:3000/norms?q=educación&limit=5" | jq '.results[] | {id: .identifier, title: .title}'
```

### Find the most recent laws

```bash
curl -s -u $USER:$PASS "http://localhost:3000/norms?rank=ley&sort=publication_date&order=desc&limit=10" | jq '.results[] | {date: .publication_date, id: .identifier}'
```

### Get norms from a specific region published in a date range

```bash
curl -s -u $USER:$PASS "http://localhost:3000/norms?jurisdiction=pe-are&from=2025-01-01&to=2025-12-31&limit=10"
```

### Retrieve the full text of a norm

```bash
curl -s -u $USER:$PASS http://localhost:3000/norms/CON-1993/content > constitucion.md
```

### Check corpus coverage for a region

```bash
curl -s -u $USER:$PASS http://localhost:3000/stats | jq '.by_jurisdiction["pe-cus"]'
# → 816
```

### Rebuild index after adding new norms

```bash
curl -s -u $USER:$PASS -X POST http://localhost:3000/norms/reload
```

### Fetch a norm and extract a specific article with grep

```bash
curl -s -u $USER:$PASS http://localhost:3000/norms/CON-1993/content | grep -A 10 "Artículo 2\."
```
