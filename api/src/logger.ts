import type { Context, Next } from "hono";

function ts(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export function logStartup(msg: string): void {
  console.log(`[${ts()}] [STARTUP] ${msg}`);
}

export function logInfo(msg: string): void {
  console.log(`[${ts()}] [INFO] ${msg}`);
}

export function logWarn(msg: string): void {
  console.warn(`[${ts()}] [WARN] ${msg}`);
}

export function logError(msg: string): void {
  console.error(`[${ts()}] [ERROR] ${msg}`);
}

export function requestLogger() {
  return async (c: Context, next: Next) => {
    const start = Date.now();
    const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim()
      || c.req.header("x-real-ip")
      || "—";
    const ua = c.req.header("user-agent")?.slice(0, 64) || "—";
    await next();
    const ms = Date.now() - start;
    const qs = c.req.query();
    const qsStr = Object.keys(qs).length
      ? "?" + new URLSearchParams(qs as Record<string, string>).toString()
      : "";
    console.log(`[${ts()}] [REQ] ${ip} "${ua}" ${c.req.method} ${c.req.path}${qsStr} → ${c.res.status} (${ms}ms)`);
  };
}
