# Local development

What runs where, and the things about the local setup that are not obvious
from the code.

## Checks

`package.json` defines four: `check:format` (oxfmt), `check:lint` (oxlint),
`check:types` (tsc), `test` (bun test). They run in three places:

| where | what |
| --- | --- |
| `.husky/pre-commit` | format + lint on staged files, then `check:types` |
| `ci.yml` `checks` job | all four, on every PR and merge-queue run |
| you | `bun run gate` |

`gate` is the one pre-PR command: the four checks in that order, then the e2e
suite, stopping at the first failure. The pipeline's gate stage runs the same
script, so a green `gate` locally is the same bar the agent branches clear.

Ignore lists live in `.oxfmtrc.json` and `.oxlintrc.json` (`ignorePatterns`,
one per tool, which is what oxc's docs recommend; there is no shared file).
`docs/**` is ignored by both.

## E2E

`bun run test:web` is `scripts/e2e.sh`. It runs Playwright against a Vite dev
server on a port of this checkout's own (`E2E_WEB_PORT`, derived from the
checkout's path the same way the backend ports are), backed by whichever
deployment `.env.local` names:

- a cloud deployment (`CONVEX_DEPLOYMENT=dev:…`) is sourced and used as is —
  the same command this script replaced;
- an anonymous one, or no `.env.local` at all, means this checkout's own local
  backend (below): the script brings it up, pushes this branch to it, and runs
  the suite as a child of `convex dev` so the backend is only alive for the
  length of the run.

`convex dev --start` exits 0 whenever its own push succeeded, so the script
carries Playwright's exit status out itself. A red suite is a red `test:web`.

`.env.local` needs `CONVEX_DEPLOYMENT`, `VITE_CONVEX_URL`, `CONVEX_SITE_URL`
and `TEST_SECRET` for the cloud path; the local path writes everything but
`TEST_SECRET` itself and the helpers fall back to `VITE_CONVEX_SITE_URL`.
Server state is seeded and cleared through the HTTP helpers in
`playwright/helpers/convex.ts`, never through the UI.

Two settings in `playwright.config.ts` matter when reading results:

- `retries: 1` locally. A spec that fails once and passes on retry is reported
  as **flaky**, and the run is green. Use `--retries 0` to see the real
  failure rate, or read the "flaky" line rather than the exit code.
- `reuseExistingServer`, but only when `E2E_WEB_PORT` is unset: a bare
  `bunx playwright test` still reuses a dev server you already have on `:5173`.
  `test:web` sets the variable to a port it claimed free, so it always starts
  its own server rather than risk adopting another checkout's.

Agent sandboxes usually cannot bind a Vite port (`listen EPERM`), so the
pipeline's implement agent cannot run this suite; its gate stage runs
`bun run gate` outside the agent, against the worktree's own local backend.
CI runs it against a throwaway Docker Convex backend (`ci.yml` `e2e` job).

## Local backend (optional)

`bun run backend:up` gives this checkout its own Convex backend instead: an
**anonymous local deployment**, a CLI-managed binary with its state under
`.convex/` (gitignored). No cloud account, no cost, and no way for a push to
reach anyone else's client. The script picks a port pair from the checkout's
path (`scripts/ports.sh`) so two worktrees can run at once, writes the URLs
into `.env.local`, and
sets the switches the e2e suite needs (`TEST_SECRET`, `OPTIONS_FIXTURES`, auth
keys). After that, `convex:dev`, `dev` and `test:web` all use it with no extra
flags. It is the pipeline's default, and optional for humans.

Reach for it when:

- you are changing `convex/schema.ts` or a status literal, and don't want the
  shared deployment refusing the push (below) or serving your half-migrated
  API to someone else;
- you want two branches checked out and testable at the same time.

Stay on the cloud dev deployment for anything that needs a **public URL** —
phone testing, the Convex dashboard. The local backend has neither.

`bun run backend:reset` throws the instance away and rebuilds it from scratch.
That is the way out of a push refused by rows an earlier run left behind; it
only ever touches a local deployment, and refuses to run when `.env.local`
names a cloud one through either `CONVEX_DEPLOYMENT` or `VITE_CONVEX_URL`.

## The cloud dev deployment is shared

`bun run convex:dev`, `bunx convex dev --once`, and by extension `test:web`
push the **current branch's** functions and schema to whatever `.env.local`
names. While that is the one cloud dev deployment:

- Any other local client of that deployment, another worktree or `main`
  checked out elsewhere, is now on this branch's API.
- A schema change is **refused** while stored rows violate it
  (`Schema validation failed … Path: .status`). Rows from earlier e2e runs are
  the usual cause. Clear them with the suite's cleanup endpoint, then push
  again:

  ```sh
  set -a && source .env.local && set +a
  bun -e 'import { cleanup } from "./playwright/helpers/convex"; await cleanup()'
  bunx convex dev --once
  ```

## Generated files

- `src/routeTree.gen.ts` is written by the TanStack Router Vite plugin during
  `bun run dev` / `bun run build`. Regenerate it, never hand-edit it.
- `convex/_generated/**` is written by the Convex CLI. Commit it only when a
  function signature actually changed. Any push, cloud or local, may also
  rewrite `server.d.ts` and `server.js` (the local CLI adds an `env` export the
  committed files lack). That is CLI version drift (#165), not part of your
  change; restore the files before committing:

  ```sh
  git restore --source=main convex/_generated
  ```

## Auth in development

Sign-in is anonymous and happens once in the `/$topic` layout via
`hooks/use-anonymous-auth`. Every `signIn("anonymous")` call mints a new user,
so never add a second call site; the hook's ref guard exists because
StrictMode double-invokes effects in dev and a second sign-in replaces the
first identity mid-flow (#155).
