# Mood & Dairy

A warm, responsive self-care and journaling application in `~/Desktop/Mood & Dairy`.

## Current setup status

- Next.js **16.4.6** (the latest stable version in the locally cached npm registry), React 19.3.1, TypeScript, Tailwind CSS 4, Auth.js v5, Prisma 7, PostgreSQL 16, Lucide, Sonner, and shadcn-style Radix components are installed.
- A private `.env` has been generated with random database credentials and an Auth.js secret. It is ignored by Git. Never commit it.
- A dedicated PostgreSQL cluster is initialized in `.data/postgres`, bound to `127.0.0.1:55439` when started.
- The initial committed Prisma migration has been applied to the actual PostgreSQL `bloom` database. Because this task's sandbox prohibits sockets, it was applied transactionally with PostgreSQL's native standalone backend, and recorded with its exact SHA-256 checksum in `_prisma_migrations`.
- Domain/security/redirect/connection tests and full TypeScript checks pass, including the installed chart/motion/form integrations. SQL checks for uniqueness, foreign keys, per-user queries/updates, and cascading deletion passed with all test records rolled back.
- **Live integration checks passed in the normal Linux terminal**, as confirmed by the supplied test output: signup, credentials login, sessions, protected routes, diary CRUD and account isolation, mood upserts and privacy, input/origin protection, saved quotes, profile/theme persistence, password changes, session invalidation, and logout. Temporary test accounts were removed, personal records were preserved, and the test-owned server stopped cleanly. Browser visual/accessibility verification remains separate from these HTTP/API checks. The task sandbox itself cannot connect to the separately running local server.
- All requested UI dependencies are installed: Framer Motion 12.43.0, Recharts 3.10.1, React Hook Form 7.92.0, and the Hook Form Zod resolver 5.9.2. Their integrations pass full TypeScript checks. Charts use Recharts, auth forms use React Hook Form/Zod, and transitions/mood interactions use Framer Motion.


## Start on your desktop

From your normal Linux terminal (Ctrl+Alt+T), run this one command:

```bash
bash "$HOME/Desktop/Mood & Dairy/scripts/launch.sh"
```

The launcher installs all dependencies, starts PostgreSQL, applies migrations, checks TypeScript, runs the tests, builds the app, and starts the production server. It verifies a live database health endpoint and runs real signup, login, diary/mood CRUD, account-isolation, quote, profile, password-change, and logout checks using temporary test accounts. It deletes those test accounts afterward and opens your browser only after those checks pass. These live checks are implemented but cannot be executed inside the restricted task sandbox. It defaults to **http://localhost:3000** and selects ports 3001–3010 if another application already uses 3000. It prints the exact URL and does not stop the other application. Keep the terminal open while using Mood & Dairy. Press Ctrl+C to stop the web server.

Your existing `.env`, account information, and writing are preserved. No shared demo login or pretend personal records are seeded. This machine already has the PostgreSQL binaries at `/usr/lib/postgresql/16/bin`.

`Start Mood & Dairy.desktop` in the project folder invokes the same launcher; your desktop may first ask you to mark that shortcut as trusted.

For a development session instead:

```bash
cd "$HOME/Desktop/Mood & Dairy"
npm run setup
npm run dev
```

For subsequent launches:

```bash
npm run db:start
npm run dev
```

Stop the web server with Ctrl+C. Stop the project database with `npm run db:stop`.

If a database is already running on port 55439, stop that other instance or use an external database URL. Never run two PostgreSQL processes against `.data/postgres`.

## Features

- Marketing landing page with botanical SVG art, feature sections, and clearly labeled sample testimonials.
- Email/password registration and login, protected app routes, JWT sessions, database-backed login throttling, and optional verified Google login.
- Personalized dashboard with real counters, daily check-in, recent entries, streaks, a daily quote, and real mood trends. New accounts start with thoughtful empty states.
- Eight mood options, dated check-ins, optional notes, daily upserts, deletion with confirmation, and paginated mood history.
- Monthly calendar with month navigation, mood colors/emojis, diary indicators, and date detail panels.
- Private diary with title/content/date/mood/tags, title/content/tag search, date and mood filters, sort, reading view, distraction-free editor, unsaved-change protection, editing, and confirmed deletion.
- Daily/category quotes with saved favorites, copy and Web Share API support.
- Weekly/monthly emotional trends and distribution, current streaks, and an explanation that ordinal mood scores are reflection tools, not medical assessments.
- Profile name and HTTPS image link, image fallback, light/dark/system preferences saved per account, password changes that revoke old sessions, logout, and JSON data export.
- Responsive sidebar, mobile navigation, keyboard focus indicators, Radix dialog focus management, reduced-motion support, loading states, errors, and toast feedback.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run launch` | Full setup, type/test/build checks, server launch, and browser opening |
| `npm run setup` | Install dependencies, start local PostgreSQL, deploy migrations |
| `npm run dev` | Run Next.js development server |
| `npm run build` | Generate Prisma client and production build |
| `npm start` | Run the production build |
| `npm run typecheck` | Generate Prisma types and check TypeScript |
| `npm test` | Run domain, validation, and password tests |
| `npm run test:integration` | Reuse a local Mood & Dairy, or start/stop a temporary app server, and run live API/account-isolation checks |
| `npm run db:start` | Initialize/start the project-owned PostgreSQL cluster |
| `npm run db:stop` | Stop the project-owned PostgreSQL cluster |
| `npm run db:migrate -- --name change_name` | Create/apply a schema change in development |
| `npm run db:deploy` | Apply committed migrations |
| `npm run db:studio` | Inspect data in Prisma Studio |

`tests/database.sql` contains transactional SQL integration checks. With the server running, use your normal PostgreSQL client to execute it against the local database; it rolls back its test users and records.

## Optional Google sign-in

Email/password needs no external credentials. For Google sign-in, create a Google OAuth web application and add these to `.env`:

```dotenv
AUTH_GOOGLE_ID="your-client-id"
AUTH_GOOGLE_SECRET="your-client-secret"
```

Authorized origin: `http://localhost:3000`

Callback URI: `http://localhost:3000/api/auth/callback/google`

Restart Next.js. The Google button appears only when both values exist. Google sign-in requires a verified Google email. Accounts already registered with a password must continue using their password; the application does not silently link an OAuth account to an existing password account.

## External PostgreSQL / Docker

For a managed PostgreSQL service, replace `DATABASE_URL` with its PostgreSQL connection string, including the provider's TLS settings. `db:start` skips local startup for an external URL before checking for local PostgreSQL binaries. Run `npm run db:deploy`.

A `compose.yaml` is provided as an alternative when Docker is available. Set `POSTGRES_PASSWORD`, start `docker compose up -d`, and set the same password in `DATABASE_URL`. Use Docker or the native local cluster, never both on the same port.

## Structure

```text
src/
  app/
    (app)/             Authenticated pages and shared layout
    api/               Auth and validated private APIs
    login/, signup/    Account pages
    privacy/, terms/   Honest installation-specific disclosures
    globals.css        Pastel design tokens, layouts, animation, breakpoints
  components/          Feature UI, app shell, data/theme providers
    ui/                shadcn-style Button, Input, Textarea, Radix Dialog
  lib/                 DB, password hashing, validation, rate limits, date helpers
  generated/prisma/    Generated client, ignored by Git
  types/               Auth.js session/JWT augmentation
prisma/
  schema.prisma
  migrations/
scripts/               Idempotent local setup and launch helpers
tests/                 Meaningful domain/security and database checks
public/                Original botanical branding and local licensed font
```

## Data and security model

Every private API checks a valid Auth.js session. Every database query and mutation includes that session's user ID; clients cannot supply a different owner. Diary updates/deletes use both entry ID and user ID. Daily moods and saved quotes have database unique constraints. User-owned data uses foreign keys with cascading deletion.

Passwords use Node's salted scrypt and timing-safe comparison. Login and password-change attempts use atomic PostgreSQL counters. Mutations verify the configured request origin and require JSON. JSON bodies are bounded to 128 KiB. Forms are validated both in the UI and API. Diary text is rendered as text, never injected HTML. Password updates increment a session version so prior sessions become invalid. Auth.js handles authentication CSRF/session cookies. The journal session cookie uses a Mood & Dairy-specific name to keep sessions separate from other localhost applications. Security response headers disable framing and MIME sniffing.

Journals are private through application access controls; they are **not end-to-end encrypted**. Database administrators can access records. Configure database disk encryption and encrypted backups for a hosted installation. Profile picture URLs load from the external image host you select. Exported JSON contains private writing; store it accordingly.

Before an internet-facing launch, supply a hosted PostgreSQL database and production secrets, set `AUTH_URL` to the HTTPS origin, configure TLS/backup/monitoring, choose a trusted reverse proxy and distributed abuse protection for registration, and complete operator-specific privacy/terms details. This is a substantial application implementation, not a claim of completed security certification or verified production deployment.

## Implementation notes

- Next.js 16.4's default TypeScript CLI capture returned empty output under this sandbox. `experimental.useTypeScriptCli: false` uses the supported compiler-API checker instead. Type checking remains enabled.
- Webpack is selected explicitly for predictable local builds in this environment.
- The locally hosted Ubuntu Sans font is distributed with its license in `public/fonts`; no Google Fonts network request is needed.
- Marketing mockup text is illustrative, separate from real account data. Testimonials are explicitly placeholders.
- The app targets a Node.js host with PostgreSQL. It has not been published to Sites' Cloudflare Worker host, whose server runtime is different.

### Streamed login redirects

Next.js can send the loading boundary before `auth()` finishes. Anonymous page requests may therefore return HTTP 200 containing Next.js’s explicit `__next-page-redirect` meta refresh to `/login`. The integration check accepts either a same-origin HTTP login redirect or that precise streamed redirect. It still rejects ordinary 200 responses, external redirects, and authenticated app-shell markup, and separately verifies that anonymous API access returns 401. Regression tests cover both redirect formats and false positives.

If startup previously stopped at “Anonymous dashboard visits must redirect,” run `npm run test:integration` in the project folder. Script-only fixes take effect immediately and do not require rebuilding or reinstalling. The test command discovers a running Mood & Dairy on ports 3000–3010. If none is running, it starts PostgreSQL, applies migrations, starts a temporary Next.js server using the existing production build, runs the checks, and stops only the server it started. It builds the app first only when no production build exists. Existing app servers and your personal records are preserved. Set `BLOOM_SMOKE_ORIGIN` to a local HTTP URL when you explicitly want to test one port.

### Connection failures

A request reported as `fetch failed` means the HTTP request did not reach an app endpoint; it is not evidence that signup or journaling failed. The integration command now manages its own local server when needed. Request errors include the exact HTTP method, URL, and underlying connection code. If a request fails before signup begins, no test-account cleanup query is needed.

### Successful live verification

The full integration run passed on this installation. The `[auth][error] CredentialsSignin` message during the password-change test is expected: the test deliberately submits the previous password and verifies that Auth.js rejects it, then signs in with the new password. A run ending with “All live integration checks passed” is successful.

The test runner stops its temporary web server afterward. To use the already-built app while PostgreSQL is running, use `npm start` and open http://localhost:3000. Keep that terminal open. For full automated setup, verification, and browser opening, use `npm run launch`.

## Publish to GitHub

The upload helper targets your specified repository `tanishkakushwaha/moodbloom` and sets this repository’s commit identity to `Tanishkakushwaha <tanishkasingh921@gmail.com>`. It preserves existing remote configuration if it points elsewhere, never force-pushes, and refuses to publish local environment or database files.

From your normal Linux terminal:

```bash
sudo apt install gh
bash "$HOME/Desktop/Mood & Dairy/scripts/push-github.sh"
```

Sign in as `Tanishkakushwaha` through GitHub’s browser login if prompted. The helper verifies access to your existing `moodbloom` repository, commits the source, adds `https://github.com/tanishkakushwaha/moodbloom.git` as its remote, and pushes `main`. It does not change the repository’s visibility or create a different repository. It prints the repository URL only after a successful push. The repository has not been uploaded merely by creating this helper.
