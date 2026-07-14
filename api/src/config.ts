const env = process.env;

export const PORT = parseInt(env.PORT || "3000", 10);
export const API_USER = env.API_USER || "admin";
export const API_PASS = env.API_PASS || "changeme";
export const CORPUS_ROOT = env.CORPUS_ROOT || "..";
export const CACHE_MAX_SIZE = parseInt(env.CACHE_MAX_SIZE || "200", 10);
