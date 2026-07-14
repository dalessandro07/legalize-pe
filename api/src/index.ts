import { Hono } from "hono";
import { cors } from "hono/cors";
import { PORT } from "./config.js";
import { basicAuth } from "./auth.js";
import { loadIndex, getIndex } from "./indexer.js";
import { requestLogger, logStartup } from "./logger.js";
import normsRouter from "./routes/norms.js";
import statsRouter from "./routes/stats.js";

const app = new Hono();

app.use("*", cors());
app.use("*", requestLogger());

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

const result = await loadIndex();
logStartup(`Listening on :${PORT}`);
logStartup(`Index: ${result.count.toLocaleString()} norms (${result.source}, ${result.elapsed}ms)`);

export default {
  port: PORT,
  fetch: app.fetch,
};
