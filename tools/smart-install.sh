#!/usr/bin/env bash
# Standalone SMART setup diagnostics for Linux, macOS, and WSL.
set -euo pipefail

release='6.2.3-smart.2'
release_url="smart-agentic@${release}"
directory="$PWD"
tool='codex'
install_mode=''
setup=0

usage() {
  cat <<'HELP'
SMART installation helper (Bash)

  bash smart-install.sh --check --directory /path/to/project --tool codex
  bash smart-install.sh --install
  bash smart-install.sh --user-install
  bash smart-install.sh --setup --directory /path/to/project --tool windsurf

Default: checks only. No project files, npm settings, or shell profiles are changed.
--install       Install/update the pinned SMART release using npm's global prefix.
--user-install  Install/update under $HOME/.local, without sudo or npm config changes.
--setup         Install project skills using the selected tool's existing installer.
--directory     Target project (defaults to the current directory).
--tool          codex, windsurf, claude-code, or cursor (defaults to codex).
--help          Show this help.

Combine --install or --user-install with --setup to do both steps.
HELP
}

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
arg_error() { printf 'ERROR: %s\n' "$*" >&2; usage >&2; exit 2; }

while (($#)); do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --check) shift ;;
    --install|--user-install)
      [[ -z "$install_mode" ]] || arg_error 'Choose either --install or --user-install.'
      install_mode="$1"; shift ;;
    --setup) setup=1; shift ;;
    --directory|--tool)
      (($# >= 2)) && [[ -n "$2" && "$2" != --* ]] || arg_error "$1 requires a value."
      if [[ "$1" == --directory ]]; then directory="$2"; else tool="$2"; fi
      shift 2 ;;
    *) arg_error "Unknown argument: $1" ;;
  esac
done

case "$tool" in
  codex) skill_root='.agents/skills' ;;
  windsurf) skill_root='.windsurf/skills' ;;
  claude-code) skill_root='.claude/skills' ;;
  cursor) skill_root='.cursor/skills' ;;
  *) arg_error "Unsupported tool: $tool. Use smart install interactively for other tools." ;;
esac

command -v node >/dev/null 2>&1 || fail 'Node.js is missing. Install Node.js 22 or later from https://nodejs.org/en/download, then reopen your terminal.'
node_version=$(node --version) || fail 'Node.js could not run. Check which environment supplies node.'
[[ "$node_version" =~ ^v([0-9]+)\. ]] || fail "Cannot read Node.js version: $node_version"
((BASH_REMATCH[1] >= 22)) || fail "Node.js $node_version is too old. Activate Node.js 22 or later, then reopen your terminal."
command -v npm >/dev/null 2>&1 || fail 'npm is missing. Install a Node.js distribution that includes npm.'
printf 'Node: %s (%s)\n' "$node_version" "$(command -v node)"
npm_version=$(npm --version) || fail 'npm could not run. Check the active Node.js environment.'
printf 'npm: %s (%s)\n' "$npm_version" "$(command -v npm)"
printf 'Project: %s\nTool: %s\nRelease: %s\n' "$directory" "$tool" "$release"

if [[ -d "$directory" ]] && command -v df >/dev/null 2>&1; then
  printf '\nProject disk space:\n'
  df -h "$directory" || true
fi

if [[ -n "$install_mode" ]]; then
  printf '\nInstalling the SMART npm package:\n%s\n' "$release_url"
  npm_args=(install --global)
  if [[ "$install_mode" == --user-install ]]; then
    [[ -n "${HOME:-}" ]] || fail 'HOME is not set; cannot choose a user installation directory.'
    npm_args+=(--prefix "$HOME/.local")
    printf 'Installation prefix: %s/.local\n' "$HOME"
  fi
  if ! npm "${npm_args[@]}" "$release_url"; then
    printf '\nInstallation failed. Keep the npm error above for diagnosis.\n' >&2
    printf 'EACCES: retry with --user-install. ENOSPC: free disk space first.\n' >&2
    printf 'E404: verify the version has been published to npm. Network errors: check your connection and retry.\n' >&2
    exit 1
  fi
fi

cli=''
global_root=$(npm root --global 2>/dev/null) || global_root=''
if [[ -n "$global_root" && -f "$global_root/smart-agentic/tools/installer/smart-cli.js" ]]; then
  cli="$global_root/smart-agentic/tools/installer/smart-cli.js"
fi
user_cli="${HOME:-}/.local/lib/node_modules/smart-agentic/tools/installer/smart-cli.js"
if [[ -f "$user_cli" && ( "$install_mode" == --user-install || -z "$cli" ) ]]; then cli="$user_cli"; fi

# A source checkout can be used without installing a global executable.
script_dir=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
source_cli="$script_dir/installer/smart-cli.js"
if [[ -z "$cli" && -f "$source_cli" && -d "$script_dir/../node_modules" ]]; then cli="$source_cli"; fi
[[ -n "$cli" ]] || fail 'SMART is not installed. Run this helper with --install or --user-install; in a source checkout, run npm ci first.'

printf '\nSMART CLI: %s\n' "$cli"
SMART_NO_UPDATE_CHECK=1 node "$cli" --version || fail 'SMART could not start. Reinstall using --install or --user-install.'
if ! command -v smart >/dev/null 2>&1; then
  printf '\nThe smart command is not on PATH. This helper can still run the installed CLI.\n'
  if [[ "$cli" == "$user_cli" ]]; then
    printf 'For this terminal, run: export PATH=%q:"$PATH"\n' "$HOME/.local/bin"
  elif [[ -n "$global_root" && "$cli" == "$global_root/"* ]]; then
    prefix=$(npm prefix --global)
    printf 'For this terminal, run: export PATH=%q:"$PATH"\n' "$prefix/bin"
  else
    printf 'This is a source checkout. Use: node %q install --directory %q\n' "$cli" "$directory"
  fi
fi

if ((setup)); then
  printf '\nInstalling project skills into %s for %s. Existing settings follow the installer update policy.\n' "$directory" "$tool"
  SMART_NO_UPDATE_CHECK=1 node "$cli" install --directory "$directory" --modules smart --tools "$tool" --yes ||
    fail 'Project setup failed. Check the error above; on Linux shared drives, use a Linux home-directory project if symlinks are unsupported.'
fi

if [[ -f "$directory/SMART/_config/manifest.yaml" && -f "$directory/_rmbaid/_config/manifest.yaml" ]]; then
  fail 'Both SMART/ and _rmbaid/ installations exist. Resolve the duplicate installation before continuing.'
elif [[ -f "$directory/SMART/_config/manifest.yaml" ]]; then
  printf '\nInstallation folder: SMART/\n'
elif [[ -f "$directory/_rmbaid/_config/manifest.yaml" ]]; then
  printf '\nInstallation folder: _rmbaid/ (legacy installation, preserved for compatibility).\n'
else
  printf '\nNo project installation manifest found.\n'
fi

skill="$directory/$skill_root/smart-pipeline/SKILL.md"
if [[ -f "$skill" ]]; then
  printf 'READY: %s\n' "$skill"
  printf 'Reopen the project in your coding assistant and send:\nUse smart-pipeline to build [your task].\n'
elif [[ -n "$install_mode" && "$setup" == 0 ]]; then
  printf '\nTerminal installation verified. Next, run this helper with --setup --directory %q --tool %q\n' "$directory" "$tool"
else
  fail "Project skill is missing at $skill. Run this helper with --setup --directory \"$directory\" --tool $tool."
fi
