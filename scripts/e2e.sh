#!/usr/bin/env bash
# Runs Playwright against whatever backend `.env.local` names. A deployment
# somebody else configured — the cloud dev deployment — is used exactly as
# `test:web` always used it. An anonymous one, or no .env.local at all, means
# this checkout owns its backend: bring it up, push this branch to it, run the
# suite as a child of `convex dev`, stop it again. Nothing outside this
# worktree sees that push.
#
# Extra arguments go to `playwright test` (flags and paths, no spaces).
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=.env.local

if [ -f "$ENV_FILE" ] && ! grep -qE '^CONVEX_DEPLOYMENT=anonymous:' "$ENV_FILE"; then
  set -a
  . "./$ENV_FILE"
  set +a
  exec bunx playwright test "$@"
fi

# Idempotent, and it re-applies the deployment switches the suite needs
# (TEST_SECRET, OPTIONS_FIXTURES, auth keys) before the push below.
scripts/backend-up.sh

status_file=$(mktemp)
trap 'rm -f "$status_file"' EXIT

# `convex dev` owns the backend process, so the suite has to run as its child:
# the deployment is only up for the length of the command it starts. That
# command's exit status doesn't reach us — `convex dev` exits 0 whenever its own
# push succeeded — so the suite reports its own, and an empty file means it
# never got to run.
bunx convex dev --once --tail-logs disable \
  --start "bunx playwright test $*; echo \$? >$status_file"

status=$(cat "$status_file")
exit "${status:-1}"
