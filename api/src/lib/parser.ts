import { parse as parseYaml } from "yaml";

export interface NormMeta {
  identifier: string;
  filePath: string;
  title: string;
  country: string;
  rank: string;
  publication_date: string;
  last_updated: string;
  status: string;
  source: string;
  jurisdiction: string;
  scope: string;
}

export interface ParsedNorm {
  meta: NormMeta;
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(content: string): { meta: Record<string, unknown>; body: string } | null {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return null;

  const yamlStr = match[1];
  const body = content.slice(match[0].length);

  let meta: Record<string, unknown> = {};
  try {
    meta = parseYaml(yamlStr) as Record<string, unknown>;
    if (typeof meta !== "object" || meta === null) {
      meta = {};
    }
  } catch {
    return null;
  }

  return { meta, body };
}

export function toNormMeta(filePath: string, meta: Record<string, unknown>): NormMeta {
  const jurisdiction = (meta.jurisdiction as string) || extractJurisdiction(filePath);
  return {
    identifier: (meta.identifier as string) || "",
    filePath,
    title: (meta.title as string) || "",
    country: (meta.country as string) || "pe",
    rank: (meta.rank as string) || "",
    publication_date: String(meta.publication_date || ""),
    last_updated: String(meta.last_updated || ""),
    status: (meta.status as string) || "",
    source: (meta.source as string) || "",
    jurisdiction,
    scope: (meta.scope as string) || (jurisdiction === "pe" ? "Nacional" : "Regional"),
  };
}

function extractJurisdiction(filePath: string): string {
  const match = filePath.match(/pe(?:-([a-z]{3}(?:-met)?))?\//);
  return match ? (match[1] ? `pe-${match[1]}` : "pe") : "pe";
}

export async function readNormFile(filePath: string): Promise<ParsedNorm | null> {
  try {
    const content = await Bun.file(filePath).text();
    const parsed = parseFrontmatter(content);
    if (!parsed) return null;
    return {
      meta: toNormMeta(filePath, parsed.meta),
      body: parsed.body.trim(),
    };
  } catch {
    return null;
  }
}

export async function readNormFrontmatter(filePath: string): Promise<NormMeta | null> {
  try {
    const content = await Bun.file(filePath).slice(0, 65536).text();
    const parsed = parseFrontmatter(content);
    if (!parsed) return null;
    return toNormMeta(filePath, parsed.meta);
  } catch {
    return null;
  }
}
