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

# --reset deletes $ENV_FILE, so both keys that can name a backend have to be
# clear before we get there: a file carrying only VITE_CONVEX_URL still points
# a client at the cloud, and still holds the reader's TEST_SECRET.
cloud=
deployment=$(read_env CONVEX_DEPLOYMENT)
deployment=${deployment%%[[:space:]]#*} # the CLI writes a trailing "# team: …" comment
case "$deployment" in
  "" | anonymous:*) ;;
  *) cloud=$deployment ;;
esac
convex_url=$(read_env VITE_CONVEX_URL)
case "$convex_url" in
  "" | http://127.0.0.1:* | http://localhost:* | "http://[::1]:"*) ;;
  *) cloud=${cloud:-$convex_url} ;;
esac
if [ -n "$cloud" ]; then
  echo "$ENV_FILE points at $cloud, not a local backend." >&2
  echo "Remove CONVEX_DEPLOYMENT/VITE_CONVEX_URL from $ENV_FILE and re-run," >&2
  echo "or keep using that deployment and skip this script." >&2
  exit 1
fi

if [ "${1:-}" = "--reset" ]; then
  rm -rf .convex "$ENV_FILE"
  echo "Discarded local backend state."
fi

# Playwright needs the same secret the deployment checks, so it outlives the
# deployment env var. Reuse it when there is one.
test_secret=$(read_env TEST_SECRET)
[ -n "$test_secret" ] || test_secret=$(openssl rand -hex 32)

# Templated, because BSD mktemp ignores TMPDIR without one.
scratch=$(mktemp -d "${TMPDIR:-/tmp}/woty-backend.XXXXXX")
trap 'rm -rf "$scratch"' EXIT

# Same ephemeral RS256 keypair the CI job mints. Rotating it just forces a new
# anonymous sign-in. Written to our own directory, not a fixed global path, so
# a second checkout minting its own pair mid-run cannot leave us with a private
# key and a JWKS from different keypairs.
bun scripts/generate-test-keys.mjs "$scratch"

vars=$scratch/env-vars
{
  printf 'TEST_SECRET=%s\n' "$test_secret"
  printf 'OPTIONS_FIXTURES=1\n'
  printf "JWT_PRIVATE_KEY='%s'\n" "$(cat "$scratch/jwt-private-key.txt")"
  printf "JWKS='%s'\n" "$(cat "$scratch/jwks.json")"
} >"$vars"

. scripts/ports.sh

# Creates the deployment, downloads the backend binary, pins the port pair and
# writes the URLs to .env.local. Only `convex dev` can do this — `convex env`
# needs a deployment that already exists. Later runs reuse the saved ports.
# Both halves have to be present: `.convex/` state without an `.env.local`
# naming it (the file was deleted, or the checkout was copied) leaves `convex
# env` with no deployment to talk to.
if [ ! -f .convex/local/default/config.json ] \
  || ! grep -qE '^CONVEX_DEPLOYMENT=anonymous:' "$ENV_FILE" 2>/dev/null; then
  claim_ports 3210 2
  bunx convex dev --once --tail-logs disable \
    --local-cloud-port "$claimed_port" --local-site-port "$((claimed_port + 1))"
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
