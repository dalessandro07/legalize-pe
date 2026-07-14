import type { Context, Next } from "hono";
import { API_USER, API_PASS } from "./config.js";

export function basicAuth() {
  return async (c: Context, next: Next) => {
    const auth = c.req.header("Authorization");
    if (!auth || !auth.startsWith("Basic ")) {
      c.header("WWW-Authenticate", 'Basic realm="legalize-pe-api"');
      return c.json({ error: "Unauthorized" }, 401);
    }
    const decoded = atob(auth.slice(6));
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) {
      c.header("WWW-Authenticate", 'Basic realm="legalize-pe-api"');
      return c.json({ error: "Unauthorized" }, 401);
    }
    const user = decoded.slice(0, colonIdx);
    const pass = decoded.slice(colonIdx + 1);
    if (user !== API_USER || pass !== API_PASS) {
      c.header("WWW-Authenticate", 'Basic realm="legalize-pe-api"');
      return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
  };
}
