# Port derivation shared by backend-up.sh and e2e.sh. Sourced, not run.
#
# A port comes from the checkout's path, so each checkout keeps the same one
# across runs and two checkouts never want the same one. The scan walks on when
# something else already holds a block, which is also what covers the case of
# two paths hashing to the same offset.

PORT_SLOTS=300

port_free() {
  ! (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
}

# claim_ports <base> <width>: sets $claimed_port to the start of the first free
# block of <width> consecutive ports, scanning blocks from this checkout's
# offset.
claim_ports() {
  local base=$1 width=$2 seed offset i port p taken
  seed=$(printf '%s' "$PWD" | shasum | cut -c1-4)
  offset=$((0x$seed % PORT_SLOTS))
  for i in $(seq 0 $((PORT_SLOTS - 1))); do
    port=$((base + width * ((offset + i) % PORT_SLOTS)))
    taken=
    for ((p = port; p < port + width; p++)); do
      port_free "$p" || taken=1
    done
    if [ -z "$taken" ]; then
      claimed_port=$port
      return 0
    fi
  done
  echo "No free block of $width ports from $base to $((base + width * PORT_SLOTS - 1))." >&2
  exit 1
}
