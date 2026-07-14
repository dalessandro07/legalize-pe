import { Hono } from "hono";
import { cors } from "hono/cors";
import { PORT } from "./config.js";
import { basicAuth } from "./auth.js";
import { buildIndex, getIndex, loadIndex } from "./indexer.js";
import normsRouter from "./routes/norms.js";
import statsRouter from "./routes/stats.js";

const app = new Hono();

app.use("*", cors());

const auth = basicAuth();
app.use("/norms/*", auth);
app.use("/stats/*", auth);

app.route("/norms", normsRouter);
app.route("/stats", statsRouter);

app.get("/health", (c) => {
  const index = getIndex();
  return c.json({
    status: "ok",
    total_norms: index.all.length,
  });
});

console.log("Loading norm index...");
const result = await loadIndex();
console.log(`Ready: ${result.count} norms (${result.source} in ${result.elapsed}ms)`);

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`Server running at http://localhost:${PORT}`);
