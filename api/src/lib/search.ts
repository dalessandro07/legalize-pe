import type { NormMeta } from "./parser.js";

export interface SearchParams {
  rank?: string;
  jurisdiction?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: "publication_date" | "last_updated" | "title";
  order?: "asc" | "desc";
}

export interface SearchResult {
  total: number;
  page: number;
  limit: number;
  results: NormMeta[];
}

export function searchNorms(norms: NormMeta[], params: SearchParams): SearchResult {
  let filtered = norms;

  if (params.rank) {
    const rank = params.rank.toLowerCase();
    filtered = filtered.filter((n) => n.rank.toLowerCase() === rank);
  }

  if (params.jurisdiction) {
    const j = params.jurisdiction.toLowerCase();
    filtered = filtered.filter((n) => n.jurisdiction.toLowerCase() === j);
  }

  if (params.from) {
    filtered = filtered.filter((n) => n.publication_date >= params.from!);
  }

  if (params.to) {
    filtered = filtered.filter((n) => n.publication_date <= params.to!);
  }

  if (params.q) {
    const terms = params.q.toLowerCase().split(/\s+/).filter(Boolean);
    filtered = filtered.filter((n) => {
      const haystack = n.title.toLowerCase() + " " + n.identifier.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }

  const sort = params.sort || "publication_date";
  const order = params.order || "desc";
  const dir = order === "asc" ? 1 : -1;

  filtered.sort((a, b) => {
    const va = a[sort] || "";
    const vb = b[sort] || "";
    return va < vb ? -dir : va > vb ? dir : 0;
  });

  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const total = filtered.length;
  const start = (page - 1) * limit;
  const results = filtered.slice(start, start + limit);

  return { total, page, limit, results };
}
