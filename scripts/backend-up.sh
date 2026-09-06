#!/usr/bin/env bash
# Brings up this checkout's own Convex backend: an anonymous local deployment
# (CLI-managed binary, state under ./.convex/, no cloud account, no cost) so a
# branch's pushes can never reach the shared cloud dev deployment. Each checkout
# gets its own instance on its own port pair, derived from its path — the CLI
# would otherwise hand every idle checkout port 3210 and they would collide the
# moment two ran at once.
#
# Idempotent. Pass --reset to throw the instance away and start clean, which is
# the way out of a push refused by rows an earlier run left behind
# ("Schema validation failed ... Value: ...").
set -euo pipefail

cd "$(dirname "$0")/.."

# Only consulted while no deployment is configured yet: it is what stops the
# first `convex dev` from asking a logged-in user to pick a cloud project. Once
# .env.local names the anonymous deployment the CLI resolves it from there, so
# nothing else in the repo has to set this.
export CONVEX_AGENT_MODE=anonymous

ENV_FILE=.env.local

read_env() {
  [ -f "$ENV_FILE" ] || return 0
  grep -E "^$1=" "$ENV_FILE" | tail -1 | cut -d= -f2- || true
}

deployment=$(read_env CONVEX_DEPLOYMENT)
deployment=${deployment%%[[:space:]]#*} # the CLI writes a trailing "# team: …" comment
case "$deployment" in
  "" | anonymous:*) ;;
  *)
    echo "$ENV_FILE points at $deployment, not a local backend." >&2
    echo "Remove CONVEX_DEPLOYMENT/VITE_CONVEX_URL from $ENV_FILE and re-run," >&2
    echo "or keep using that deployment and skip this script." >&2
    exit 1
    ;;
esac

if [ "${1:-}" = "--reset" ]; then
  rm -rf .convex "$ENV_FILE"
  echo "Discarded local backend state."
fi

# Playwright needs the same secret the deployment checks, so it outlives the
# deployment env var. Reuse it when there is one.
test_secret=$(read_env TEST_SECRET)
[ -n "$test_secret" ] || test_secret=$(openssl rand -hex 32)

# Same ephemeral RS256 keypair the CI job mints. Rotating it just forces a new
# anonymous sign-in.
bun scripts/generate-test-keys.mjs

vars=$(mktemp)
trap 'rm -f "$vars"' EXIT
{
  printf 'TEST_SECRET=%s\n' "$test_secret"
  printf 'OPTIONS_FIXTURES=1\n'
  printf "JWT_PRIVATE_KEY='%s'\n" "$(cat /tmp/jwt-private-key.txt)"
  printf "JWKS='%s'\n" "$(cat /tmp/jwks.json)"
} >"$vars"

port_free() {
  ! (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
}

# Stable across runs so the URLs in .env.local keep working, and spread across
# checkouts so two of them never want the same pair. Walks on if something else
# already holds it, which is also what covers a path collision.
SLOTS=300
claim_ports() {
  local seed offset i
  seed=$(printf '%s' "$PWD" | shasum | cut -c1-4)
  offset=$((0x$seed % SLOTS))
  for i in $(seq 0 $((SLOTS - 1))); do
    cloud_port=$((3210 + 2 * ((offset + i) % SLOTS)))
    site_port=$((cloud_port + 1))
    if port_free "$cloud_port" && port_free "$site_port"; then
      return 0
    fi
  done
  echo "No free port pair between 3210 and $((3210 + 2 * SLOTS - 1))." >&2
  exit 1
}

# Creates the deployment, downloads the backend binary, pins the port pair and
# writes the URLs to .env.local. Only `convex dev` can do this — `convex env`
# needs a deployment that already exists. Later runs reuse the saved ports.
if [ ! -f .convex/local/default/config.json ]; then
  claim_ports
  bunx convex dev --once --tail-logs disable \
    --local-cloud-port "$cloud_port" --local-site-port "$site_port"
fi

bunx convex env set --force --from-file "$vars"

# Push again with the switches in place: convex/http.ts reads TEST_SECRET at
# module level, so /test/* only registers if the push came after it was set.
bunx convex dev --once --tail-logs disable

# The CLI owns CONVEX_DEPLOYMENT/VITE_CONVEX_URL/VITE_CONVEX_SITE_URL in this
# file; TEST_SECRET is ours.
if [ ! -f "$ENV_FILE" ] || ! grep -qE '^TEST_SECRET=' "$ENV_FILE"; then
  printf '\nTEST_SECRET=%s\n' "$test_secret" >>"$ENV_FILE"
fi

echo "Local backend ready — $(read_env VITE_CONVEX_URL)"
