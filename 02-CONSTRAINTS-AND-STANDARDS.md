# 02 — Constraints and Standards

## 1. Repository Constraints

### Must Not Break

- `npm run quality` — the full quality gate must remain green at all times
- `npm run validate:skills` — all existing skills must still pass
- `npm run lint:md` — all existing markdown must still pass
- `npm run test:install` — installer tests must pass
- `npm run validate:refs` — file-reference integrity must hold

### Must Not Touch

- `.github/workflows/` — CI configuration is out of scope
- `node_modules/` — no manual edits
- Existing agent definitions in `.rmbaid-core/agents/` MUST be updated in place,
  not replaced — preserve original structure, only add to it
- Existing skills in `src/core-skills/` and `src/rmbaid-skills/` — do not modify
  existing skills

---

## 2. Markdown Standards

All markdown files MUST comply with `.markdownlint-cli2.yaml`:

- No bare URLs (use `[text](url)` format)
- No trailing spaces
- Headings: ATX style (`#`, not underline)
- Blank line before and after headings and lists
- Maximum line length: 80 characters (prose) — code blocks exempt
- No multiple consecutive blank lines
- File must end with a single newline

---

## 3. Skill Standards (SKILL-01 through SEQ-02)

Every new skill directory MUST satisfy all 14 deterministic rules
checked by `npm run validate:skills`:

| Rule | Requirement |
|---|---|
| SKILL-01 | SKILL.md exists in the skill directory |
| SKILL-02 | SKILL.md frontmatter has `name` field |
| SKILL-03 | SKILL.md frontmatter has `description` field |
| SKILL-04 | name is lowercase, hyphens only, no forbidden substrings |
| SKILL-05 | name matches the directory basename |
| SKILL-06 | description ≥ 50 chars, starts with "Use when" or "Use if" |
| SKILL-07 | SKILL.md has body content after frontmatter |
| WF-01 | workflow.md frontmatter has no `name` field |
| WF-02 | workflow.md frontmatter has no `description` field |
| PATH-02 | No `installed_path` variable in any file |
| STEP-01 | Step filenames follow `NN-name.md` format |
| STEP-06 | Step frontmatter has no `name` or `description` |
| STEP-07 | Step count is between 2 and 10 |
| SEQ-02 | No time estimates in any step |

---

## 4. Node.js Standards

- Node.js ≥ 22.0.0 (per `package.json` engines field)
- CommonJS (`require`) for new utility modules (consistent with existing tools/)
- Zero new runtime dependencies for src/smart-metrics/
- ESLint config from `eslint.config.mjs` applies to all `.js` files
- Prettier config from `prettier.config.mjs` applies to all supported files

---

## 5. Git Standards (from AGENTS.md)

- All commits MUST use Conventional Commits format
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation only changes
  - `test:` for test additions or corrections
  - `chore:` for maintenance
- Before pushing: run `npm ci && npm run quality` on HEAD

---

## 6. JSONL Schema Standards

smart_metrics.jsonl entries MUST be:

- One valid JSON object per line
- UTF-8 encoded
- No trailing comma
- Parseable by `JSON.parse()` individually
- Conforming to the schema defined in `05-VALIDATION-DESIGN.md`

---

## 7. Case Study Standards

- All case study documents MUST be self-consistent (PRD goals ↔ architecture)
- Case study lives under `case-studies/physics-tracker/`
- No references to files outside `case-studies/` except standard rmb-aid paths
- Platform: Kotlin / Android (minSdk 26, targetSdk 34)

---

## 8. Decision Standard

When a constraint conflicts with a user goal:

1. Prefer the constraint
2. Log the conflict in PROGRESS.md Decisions Log
3. Propose the least-invasive workaround
