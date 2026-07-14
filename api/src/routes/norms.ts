import { Hono } from "hono";
import { getIndex, buildIndex } from "../indexer.js";
import { readNormFile } from "../lib/parser.js";
import { searchNorms, type SearchParams } from "../lib/search.js";
import { LRUCache } from "../cache.js";

const app = new Hono();

const contentCache = new LRUCache<string, { meta: Record<string, unknown>; body: string }>();

function normToJSON(meta: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...meta };
  delete copy.filePath;
  return copy;
}

app.get("/", (c) => {
  const params: SearchParams = {
    rank: c.req.query("rank") || undefined,
    jurisdiction: c.req.query("jurisdiction") || undefined,
    q: c.req.query("q") || undefined,
    from: c.req.query("from") || undefined,
    to: c.req.query("to") || undefined,
    page: parseInt(c.req.query("page") || "1", 10),
    limit: parseInt(c.req.query("limit") || "20", 10),
    sort: (c.req.query("sort") as SearchParams["sort"]) || undefined,
    order: (c.req.query("order") as SearchParams["order"]) || undefined,
  };

  const index = getIndex();
  const result = searchNorms(index.all, params);
  return c.json({
    total: result.total,
    page: result.page,
    limit: result.limit,
    results: result.results.map((n) => n as unknown as Record<string, unknown>).map(normToJSON),
  });
});

app.get("/:identifier", async (c) => {
  const identifier = c.req.param("identifier");
  const index = getIndex();
  const meta = index.byId.get(identifier);

  if (!meta) {
    return c.json({ error: "Norm not found" }, 404);
  }

  const cached = contentCache.get(meta.filePath);
  if (cached) {
    return c.json({
      meta: normToJSON(cached.meta),
      content: cached.body,
    });
  }

  const norm = await readNormFile(meta.filePath);
  if (!norm) {
    return c.json({ error: "Failed to read norm file" }, 500);
  }

  contentCache.set(meta.filePath, {
    meta: norm.meta as unknown as Record<string, unknown>,
    body: norm.body,
  });

  return c.json({
    meta: normToJSON(norm.meta as unknown as Record<string, unknown>),
    content: norm.body,
  });
});

app.get("/:identifier/content", async (c) => {
  const identifier = c.req.param("identifier");
  const index = getIndex();
  const meta = index.byId.get(identifier);

  if (!meta) {
    return c.json({ error: "Norm not found" }, 404);
  }

  const cached = contentCache.get(meta.filePath);
  if (cached) {
    return c.text(cached.body);
  }

  const norm = await readNormFile(meta.filePath);
  if (!norm) {
    return c.json({ error: "Failed to read norm file" }, 500);
  }

  contentCache.set(meta.filePath, {
    meta: norm.meta as unknown as Record<string, unknown>,
    body: norm.body,
  });

  return c.text(norm.body);
});

app.post("/reload", async (c) => {
  console.log("Reloading index...");
  const result = await buildIndex();
  contentCache.clear();
  return c.json({ ok: true, count: result.count, elapsed_ms: result.elapsed });
});

export default app;
