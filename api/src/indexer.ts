import { resolve } from "node:path";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { CORPUS_ROOT } from "./config.js";
import { readNormFrontmatter, type NormMeta } from "./lib/parser.js";
import { logStartup, logWarn } from "./logger.js";

export interface NormsIndex {
  byId: Map<string, NormMeta>;
  all: NormMeta[];
  byRank: Map<string, NormMeta[]>;
  byJurisdiction: Map<string, NormMeta[]>;
  builtAt: number;
}

let currentIndex: NormsIndex = {
  byId: new Map(),
  all: [],
  byRank: new Map(),
  byJurisdiction: new Map(),
  builtAt: 0,
};

export function getIndex(): NormsIndex {
  return currentIndex;
}

function getCachePath(): string {
  return resolve(CORPUS_ROOT, ".cache", "norms-index.json");
}

function indexToJSON(index: NormsIndex): string[] {
  return index.all.map((n) =>
    JSON.stringify({
      i: n.identifier,
      f: n.filePath,
      t: n.title,
      c: n.country,
      r: n.rank,
      p: n.publication_date,
      u: n.last_updated,
      s: n.status,
      o: n.source,
      j: n.jurisdiction,
      sc: n.scope,
    }),
  );
}

function indexFromJSON(loadedIndex: NormsIndex, lines: string[]): void {
  for (const line of lines) {
    const d = JSON.parse(line) as {
      i: string;
      f: string;
      t: string;
      c: string;
      r: string;
      p: string;
      u: string;
      s: string;
      o: string;
      j: string;
      sc: string;
    };

    const norm: NormMeta = {
      identifier: d.i,
      filePath: d.f,
      title: d.t,
      country: d.c,
      rank: d.r,
      publication_date: d.p,
      last_updated: d.u,
      status: d.s,
      source: d.o,
      jurisdiction: d.j,
      scope: d.sc,
    };

    loadedIndex.all.push(norm);
    loadedIndex.byId.set(d.i, norm);

    const rankKey = d.r.toLowerCase();
    if (!loadedIndex.byRank.has(rankKey)) loadedIndex.byRank.set(rankKey, []);
    loadedIndex.byRank.get(rankKey)!.push(norm);

    const jurKey = d.j.toLowerCase();
    if (!loadedIndex.byJurisdiction.has(jurKey)) loadedIndex.byJurisdiction.set(jurKey, []);
    loadedIndex.byJurisdiction.get(jurKey)!.push(norm);
  }
}

export async function loadIndex(): Promise<{ count: number; elapsed: number; source: "cache" | "build" }> {
  const cachePath = getCachePath();

  if (existsSync(cachePath)) {
    const start = performance.now();
    try {
      const raw = readFileSync(cachePath, "utf-8");
      const lines = raw.trim().split("\n");

      const newIndex: NormsIndex = {
        byId: new Map(),
        all: [],
        byRank: new Map(),
        byJurisdiction: new Map(),
        builtAt: Date.now(),
      };

      indexFromJSON(newIndex, lines);

      currentIndex = newIndex;
      const elapsed = Math.round(performance.now() - start);
      logStartup(`Index loaded from cache: ${currentIndex.all.length.toLocaleString()} norms (${elapsed}ms)`);
      return { count: currentIndex.all.length, elapsed, source: "cache" };
    } catch (e) {
      logWarn(`Cache load failed: ${e}`);
    }
  }

  return buildIndex();
}

export async function buildIndex(): Promise<{ count: number; elapsed: number; source: "cache" | "build" }> {
  const start = performance.now();

  const corpusRoot = resolve(CORPUS_ROOT);
  const glob = new Bun.Glob("{pe,pe-*}/**/*.md");

  const newById = new Map<string, NormMeta>();
  const newByRank = new Map<string, NormMeta[]>();
  const newByJurisdiction = new Map<string, NormMeta[]>();

  const files = [...glob.scanSync({ cwd: corpusRoot, absolute: true, dot: false })];
  const totalFiles = files.length;

  logStartup(`Building index from ${totalFiles.toLocaleString()} files...`);

  let processed = 0;
  let failed = 0;

  const metaList: NormMeta[] = [];

  const BATCH = 64;
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.all(batch.map((fp) => readNormFrontmatter(fp)));

    for (const norm of results) {
      if (!norm || !norm.identifier) {
        failed++;
        continue;
      }

      metaList.push(norm);
      newById.set(norm.identifier, norm);

      const rankKey = norm.rank.toLowerCase();
      if (!newByRank.has(rankKey)) newByRank.set(rankKey, []);
      newByRank.get(rankKey)!.push(norm);

      const jurKey = norm.jurisdiction.toLowerCase();
      if (!newByJurisdiction.has(jurKey)) newByJurisdiction.set(jurKey, []);
      newByJurisdiction.get(jurKey)!.push(norm);

      processed++;
    }

    if (processed % 5000 === 0) {
      logStartup(`  Progress: ${processed.toLocaleString()} / ${totalFiles.toLocaleString()}`);
    }
  }

  currentIndex = {
    byId: newById,
    all: metaList,
    byRank: newByRank,
    byJurisdiction: newByJurisdiction,
    builtAt: Date.now(),
  };

  const cachePath = getCachePath();
  let cacheSaved = false;
  try {
    mkdirSync(resolve(cachePath, ".."), { recursive: true });
    writeFileSync(cachePath, indexToJSON(currentIndex).join("\n") + "\n", "utf-8");
    cacheSaved = true;
  } catch (e) {
    logWarn(`Cache write failed: ${e}`);
  }

  const elapsed = Math.round(performance.now() - start);
  const cacheNote = cacheSaved ? " — cache saved" : "";
  logStartup(`Index built: ${processed.toLocaleString()} norms (${elapsed}ms)${cacheNote}`);
  return { count: processed, elapsed, source: "build" };
}
