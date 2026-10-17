---
title: Release SMART
description: Build, verify, and publish the SMART package
---

## Distribution

SMART can be distributed as an npm-compatible archive through GitHub Releases.
The npm package name is `rmb-aid`; the executable is `smart`. The first npm
publication requires an authenticated account with permission to publish that
name. A registry 404 is not proof of name ownership or guaranteed availability.

## Prepare a Release

1. Set an unused version in `package.json` and synchronize the lockfile.
2. Review changes and commit with a Conventional Commit message.
3. In the exact checkout to push, run `npm ci` and `npm run quality` on HEAD.
4. Run `npm pack --pack-destination /tmp` to create the archive.
5. Push the tested commit to a release branch and attach its archive to a GitHub release.

The smoke test extracts the archive and reuses the checkout's installed
dependencies. It verifies required assets, offline CLI output, clean Codex
installation, and preservation of project progress during reinstall.

## Publish to npm

Authenticate with `npm login` in your own terminal. Never put credentials in
the repository or chat. Verify your account with `npm whoami`, then publish
the tested archive:

```bash
npm publish /tmp/rmb-aid-6.2.3-smart.2.tgz --access public --tag next
```

For a stable release, use `--tag latest` after reviewing the preview. npm
versions cannot be overwritten; bump the version for subsequent changes.
After publication, verify `npm view rmb-aid version` and test the public install
command in a fresh directory before changing the README instructions.

## GitHub Actions

The manual Publish SMART workflow runs on `ishwrknt/rmb-aid` main and validates
the checkout before packing and publishing. Configure an `npm` GitHub environment
and an `NPM_TOKEN` secret with package publish permissions. The workflow does not
bump versions, commit, push, or send notifications. The quality workflow runs the
same test commands as the local quality script.

## Portable Prompt

`smart prompt` prints the installed pipeline skill without YAML frontmatter.
It uses no network and can be loaded into any coding assistant that accepts
project instructions. The host must provide file, terminal, and model access.
