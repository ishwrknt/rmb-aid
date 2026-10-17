# SMART

**Simulation Methodology based Agentic Research Tool**

SMART guides a coding assistant from a plain-language task through an approved
plan, implementation, validation, and delivery. It tracks progress in
`PROGRESS.md` and records measured results in `smart_metrics.jsonl`.

## Install SMART

For the complete terminal-to-chat setup and common error fixes, see the
[installation and troubleshooting guide](docs/how-to/install-rmbaid.md).
The Bash helper is `tools/smart-install.sh`; run it with `--help` to see its
check, install, user-install, and project-setup modes.

Install the GitHub preview, then configure your project:

```bash
npm install --global https://github.com/ishwrknt/rmb-aid/releases/download/v6.2.3-smart.2/rmb-aid-6.2.3-smart.2.tgz
smart install --directory /path/to/your/project
```

Requires Node.js 22 or later, npm, and an agentic coding assistant.
SMART supplies workflows and prompts; your coding assistant supplies the AI
model, tool access, and any associated subscription or API usage.

From this repository, install dependencies and run the installer:

```bash
npm ci
node tools/installer/rmbaid-cli.js install --directory /path/to/your/project
```

To test the packaged version, create an archive and install it locally:

```bash
npm pack --pack-destination /tmp
npm install --global /tmp/rmb-aid-6.2.3-smart.2.tgz
smart install --directory /path/to/your/project
```

Select your coding tool. In its agent chat, invoke
`rmbaid-smart-pipeline` and describe your task:

> Build a physics tracker Android app that records acceleration and exports CSV.

SMART shows a plan and waits for approval. After approval it creates planning
documents, implements each epic, validates the result, and saves progress.
Invoke the same skill to resume the approved task in a later session.

For unattended setup with Codex:

```bash
smart install --directory . --modules rmbaid --tools codex --yes
```

The package retains the compatibility name `rmb-aid` and the aliases
`rmb-aid` and `rmbaid`. It has not yet been published to npm; do not use
`npx smart`, which may resolve to an unrelated package.

New source-build installations use `SMART/` and `SMART-output/`. Existing
`_rmbaid/` installations remain recognized and retain their settings on update.

## Other Coding Tools

Print the self-contained runtime prompt:

```bash
smart prompt
```

Load the output as instructions in Aider or another coding assistant.
This command works offline and does not change your project.
Installation integrations are available for Codex, Windsurf, Claude Code,
Cursor, GitHub Copilot, and other tools supported by the installer.

## Seven Roles, Four Layers

| Layer      | Role    | Responsibility                                 |
| ---------- | ------- | ---------------------------------------------- |
| Perception | Drishti | Understand the task, requirements, and domain  |
| Planning   | Bodhi   | Decompose the task into phases and goals       |
| Planning   | Tarka   | Sequence tasks and resolve dependencies        |
| Execution  | Karma   | Implement the planned software                 |
| Execution  | Yukti   | Diagnose and fix failures                      |
| Validation | Satya   | Check scientific and technical correctness     |
| Validation | Siddhi  | Confirm completion and record measured metrics |

These are coordinated roles in your coding assistant, not seven independent
model services. Validation uses analytical solutions, benchmarks, cross-checks,
or automated tests as appropriate. An epic cannot be marked complete with
failed or unavailable validation. Five unsuccessful retries require user input.

## Develop Locally

```bash
npm ci
npm run quality
node tools/installer/rmbaid-cli.js install
```

The quality suite includes metrics tests and a packed-archive smoke test:
offline prompt output, installation into a fresh project, and preservation
of user progress on reinstall.

## Releases

See [release instructions](docs/how-to/release-smart.md) for the publishing
procedure. SMART is distributed as a GitHub preview. Automated installation,
metrics, documentation, and skill checks run before uploading a preview.
Full model-driven task delivery and remaining development-tool dependency
advisories still need review before a stable release.

## License and Attribution

MIT. SMART is developed by Ishwar and builds on the BMAD-derived workflow and
installer code in this repository. See [LICENSE](LICENSE).
