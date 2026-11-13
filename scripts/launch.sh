#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"
if [[ -x "$HOME/.nvm/versions/node/v24.19.0/bin/node" ]]; then
  export PATH="$HOME/.nvm/versions/node/v24.19.0/bin:$PATH"
fi
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is missing from this terminal. Install Node.js 24.11 or newer."
  exit 1
fi
exec node scripts/launch.mjs
