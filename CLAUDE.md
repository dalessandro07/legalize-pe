# CLAUDE.md

This is the corpus repository. The cross-tool agent guide is at [AGENTS.md](./AGENTS.md) and applies to Claude as well.

## Order of precedence

1. Explicit user instruction in the current session.
2. Saved memories in `~/.claude/projects/-Users-raillyhugo-hunter-brain/memory/` (auto-loaded).
3. This file ([CLAUDE.md](./CLAUDE.md)) for Claude-Code-specific behavior.
4. [AGENTS.md](./AGENTS.md) for project conventions any agent must follow.

## What this repo is

The **public Peruvian legal corpus**. Markdown files plus git history. Listed in the [legalize.dev federation](https://github.com/legalize-dev/legalize) under "Community". Engine that produces these files: [`crafter-research/legalize-pe-engine`](https://github.com/crafter-research/legalize-pe-engine).

## What Claude should and should not do here

| Action | Allowed |
|---|---|
| Read any file to answer questions | Yes |
| Hand-correct a norm's frontmatter (typo, wrong date) | Yes, with Crafternauta identity and `[correction]` type |
| Add a new norm by hand | Yes, with Crafternauta identity and `[new]` type |
| Run analysis or grep across the corpus | Yes |
| Write any code (TypeScript, Python, etc.) | No, that goes in the engine repo |
| Add `Co-Authored-By: Claude` to a commit | No (memory rule) |
| Use em dashes (`—`) in commit messages | No (memory rule) |
| Run `git filter-branch` or rewrite history | No, without coordinating with the maintainer |

## Common tasks

### Fix a typo in a norm

```bash
# Edit the file
# Then:
GIT_AUTHOR_NAME="Crafternauta" \
GIT_AUTHOR_EMAIL="the.crafter.station@gmail.com" \
GIT_AUTHOR_DATE="<real-publication-date>T00:00:00Z" \
GIT_COMMITTER_NAME="Crafternauta" \
GIT_COMMITTER_EMAIL="the.crafter.station@gmail.com" \
GIT_COMMITTER_DATE="<real-publication-date>T00:00:00Z" \
  git commit pe/{id}.md -m "$(cat <<'EOF'
[correction] <title> fix typo in <field>

Source-Id: <id>
Source-Date: <real-publication-date>
Norm-Id: <id>
EOF
)"
```

### Search for a norm

```bash
grep -l "Constitución Política" pe/*.md
grep -A 10 "Artículo 191" pe/CON-1993.md
```

### See a norm's reform history

```bash
git log --pretty="%h %ad %s" --date=short -- pe/CON-1993.md
```

## When in doubt

Read [AGENTS.md](./AGENTS.md) (full corpus conventions) or the engine repo's [AGENTS.md](https://github.com/crafter-research/legalize-pe-engine/blob/main/AGENTS.md) (full project conventions).
