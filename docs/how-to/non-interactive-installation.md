---
title: Non-Interactive Installation
description: Install SMART using command-line flags for CI/CD pipelines and automated deployments
sidebar:
  order: 2
---

Use command-line flags to install SMART non-interactively. This is useful for:

## When to Use This

- Automated deployments and CI/CD pipelines
- Scripted installations
- Batch installations across multiple projects
- Quick installations with known configurations

:::note[Prerequisites]
Requires [Node.js](https://nodejs.org) v22+ and npm.
Until npm publication, replace `npx smart-agentic` in the examples below with
`node tools/installer/smart-cli.js` from your source checkout, or `smart`
after installing the local archive. See [Release SMART](./release-smart.md).
:::

## Available Flags

### Installation Options

| Flag                       | Description                                                                         | Example                                         |
| -------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| `--directory <path>`       | Installation directory                                                              | `--directory ~/projects/myapp`                  |
| `--modules <modules>`      | Comma-separated module IDs                                                          | `--modules smart,bmb`                           |
| `--tools <tools>`          | Comma-separated tool/IDE IDs (use `none` to skip)                                   | `--tools claude-code,cursor` or `--tools none`  |
| `--custom-content <paths>` | Comma-separated paths to custom modules                                             | `--custom-content ~/my-module,~/another-module` |
| `--action <type>`          | Action for existing installations: `install` (default), `update`, or `quick-update` | `--action quick-update`                         |

### Core Configuration

| Flag                                | Description                                     | Default         |
| ----------------------------------- | ----------------------------------------------- | --------------- |
| `--user-name <name>`                | Name for agents to use                          | System username |
| `--communication-language <lang>`   | Agent communication language                    | English         |
| `--document-output-language <lang>` | Document output language                        | English         |
| `--output-folder <path>`            | Output folder path (see resolution rules below) | `SMART-output`  |

#### Output Folder Path Resolution

The value passed to `--output-folder` (or entered interactively) is resolved according to these rules:

| Input type                   | Example                    | Resolved as                                                |
| ---------------------------- | -------------------------- | ---------------------------------------------------------- |
| Relative path (default)      | `SMART-output`             | `<project-root>/SMART-output`                              |
| Relative path with traversal | `../../shared-outputs`     | Normalized absolute path — e.g. `/Users/me/shared-outputs` |
| Absolute path                | `/Users/me/shared-outputs` | Used as-is — project root is **not** prepended             |

The resolved path is what agents and workflows use at runtime when writing output files. Using an absolute path or a traversal-based relative path lets you direct all generated artifacts to a directory outside your project tree — useful for shared or monorepo setups.

### Other Options

| Flag          | Description                                 |
| ------------- | ------------------------------------------- |
| `--advanced`  | Show the full interactive setup flow        |
| `-y, --yes`   | Accept all defaults and skip prompts        |
| `-d, --debug` | Enable debug output for manifest generation |

## Module IDs

Available module IDs for the `--modules` flag:

- `smart` — SMART Master
- `bmb` — SMART Builder

Check the [SMART registry](https://github.com/smart-code-org) for available external modules.

## Tool/IDE IDs

Available tool IDs for the `--tools` flag:

**Preferred:** `claude-code`, `cursor`

Run `npx smart-agentic install` interactively once to see the full current list of supported tools, or check the [platform codes configuration](https://github.com/smart-code-org/SMART/blob/main/tools/installer/ide/platform-codes.yaml).

## Installation Modes

| Mode                  | Description                                                 | Example                                                                             |
| --------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Fully non-interactive | Provide all flags to skip all prompts                       | `npx smart-agentic install --directory . --modules smart --tools claude-code --yes` |
| Simple interactive    | Ask only the important questions and use defaults elsewhere | `npx smart-agentic install`                                                         |
| Semi-interactive      | Provide some flags; SMART prompts for the rest              | `npx smart-agentic install --directory . --modules smart`                           |
| Advanced interactive  | Show the full interactive configuration flow                | `npx smart-agentic install --advanced`                                              |
| Defaults only         | Accept all defaults with `-y`                               | `npx smart-agentic install --yes`                                                   |
| Without tools         | Skip tool/IDE configuration                                 | `npx smart-agentic install --modules smart --tools none`                            |

## Examples

### CI/CD Pipeline Installation

```bash
#!/bin/bash
# install-smart.sh

npx smart-agentic install \
  --directory "${GITHUB_WORKSPACE}" \
  --modules smart \
  --tools claude-code \
  --user-name "CI Bot" \
  --communication-language English \
  --document-output-language English \
  --output-folder SMART-output \
  --yes
```

### Update Existing Installation

```bash
npx smart-agentic install \
  --directory ~/projects/myapp \
  --action update \
  --modules smart,bmb,custom-module
```

### Quick Update (Preserve Settings)

```bash
npx smart-agentic install \
  --directory ~/projects/myapp \
  --action quick-update
```

### Installation with Custom Content

```bash
npx smart-agentic install \
  --directory ~/projects/myapp \
  --modules smart \
  --custom-content ~/my-custom-module,~/another-module \
  --tools claude-code
```

## What You Get

- A fully configured `_rmbaid/` directory in your project
- Agents and workflows configured for your selected modules and tools
- A `SMART-output/` folder for generated artifacts

## Validation and Error Handling

SMART validates all provided flags:

- **Directory** — Must be a valid path with write permissions
- **Modules** — Warns about invalid module IDs (but won't fail)
- **Tools** — Warns about invalid tool IDs (but won't fail)
- **Custom Content** — Each path must contain a valid `module.yaml` file
- **Action** — Must be one of: `install`, `update`, `quick-update`

Invalid values will either:

1. Show an error and exit (for critical options like directory)
2. Show a warning and skip (for optional items like custom content)
3. Fall back to interactive prompts (for missing required values)

:::tip[Best Practices]

- Use absolute paths for `--directory` to avoid ambiguity
- Use an absolute path for `--output-folder` when you want artifacts written outside the project tree (e.g. a shared monorepo outputs directory)
- Test flags locally before using in CI/CD pipelines
- Combine with `-y` for truly unattended installations
- Use `--debug` if you encounter issues during installation
  :::

## Troubleshooting

### Installation fails with "Invalid directory"

- The directory path must exist (or its parent must exist)
- You need write permissions
- The path must be absolute or correctly relative to the current directory

### Module not found

- Verify the module ID is correct
- External modules must be available in the registry

### Custom content path invalid

Ensure each custom content path:

- Points to a directory
- Contains a `module.yaml` file in the root
- Has a `code` field in the `module.yaml`

:::note[Still stuck?]
Run with `--debug` for detailed output, try interactive mode to isolate the issue, or report at <https://github.com/smart-code-org/SMART/issues>.
:::
