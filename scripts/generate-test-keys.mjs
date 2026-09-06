// Mints an ephemeral RS256 keypair for hermetic CI runs, in the same format
// @convex-dev/auth expects (PKCS8 with spaces for JWT_PRIVATE_KEY, JWKS JSON).
// Writes jwt-private-key.txt and jwks.json to the directory given as the first
// argument, defaulting to /tmp. Anything that can run concurrently with another
// checkout must pass a directory of its own: the two files are read back as a
// pair, and a keypair from one run mixed with one from another authenticates
// nothing.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const outDir = process.argv[2] ?? "/tmp";

const { privateKey, publicKey } = await generateKeyPair("RS256", { extractable: true });
const pkcs8 = (await exportPKCS8(privateKey)).trimEnd().replace(/\n/g, " ");
const jwk = await exportJWK(publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...jwk }] });

writeFileSync(join(outDir, "jwt-private-key.txt"), pkcs8);
writeFileSync(join(outDir, "jwks.json"), jwks);
