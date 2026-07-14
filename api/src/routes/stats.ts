import { Hono } from "hono";
import { getIndex } from "../indexer.js";

const app = new Hono();

app.get("/", (c) => {
  const index = getIndex();

  const byRank: Record<string, number> = {};
  for (const [rank, norms] of index.byRank) {
    byRank[rank] = norms.length;
  }

  const byJurisdiction: Record<string, number> = {};
  for (const [jur, norms] of index.byJurisdiction) {
    byJurisdiction[jur] = norms.length;
  }

  const sortedRanks = Object.entries(byRank).sort(([, a], [, b]) => b - a);
  const sortedJurisdictions = Object.entries(byJurisdiction).sort(([, a], [, b]) => b - a);

  const latest = index.all.reduce<{ publication_date: string; last_updated: string } | null>(
    (acc, n) => {
      if (!acc) return { publication_date: n.publication_date, last_updated: n.last_updated };
      if (n.publication_date > acc.publication_date) acc.publication_date = n.publication_date;
      if (n.last_updated > acc.last_updated) acc.last_updated = n.last_updated;
      return acc;
    },
    null,
  );

  return c.json({
    total_norms: index.all.length,
    total_ranks: index.byRank.size,
    total_jurisdictions: index.byJurisdiction.size,
    by_rank: Object.fromEntries(sortedRanks),
    by_jurisdiction: Object.fromEntries(sortedJurisdictions),
    date_range: latest
      ? {
          earliest_publication: findEarliest(index.all),
          latest_publication: latest.publication_date,
          latest_update: latest.last_updated,
        }
      : null,
  });
});

function findEarliest(norms: { publication_date: string }[]): string {
  let earliest = "";
  for (const n of norms) {
    if (n.publication_date && (!earliest || n.publication_date < earliest)) {
      earliest = n.publication_date;
    }
  }
  return earliest;
}

export default app;
