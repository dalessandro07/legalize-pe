FROM oven/bun:1-slim AS deps
WORKDIR /build/api
COPY api/package.json api/bun.lock ./
RUN bun install --production --frozen-lockfile

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=deps /build/api/node_modules ./api/node_modules
COPY . .
EXPOSE 3000
WORKDIR /app/api
ENV CORPUS_ROOT=/app
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD ["bun", "-e", "(async()=>{try{const r=await fetch('http://localhost:3000/health');process.exit(r.ok?0:1)}catch{process.exit(1)}})()"]
CMD ["bun", "run", "src/index.ts"]
