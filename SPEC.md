# Personal Mail Tracker — Product and Technical Specification

Status: Draft for alignment  
Date: 2026-11-19

## 1. Product definition

Personal Mail Tracker is a private, single-user application that connects multiple email accounts and turns their mail activity into one searchable, actionable dashboard. The first provider is Gmail / Google Workspace. The architecture must permit Microsoft 365 and generic IMAP providers later without leaking provider-specific concepts into the product model.

The product consists of:

1. A Cloudflare-hosted web application for onboarding, account management, search, analytics, and settings.
2. A shared Chrome and Firefox WebExtension that provides a compact tracker UI and augments Gmail itself.
3. A Cloudflare-hosted API and synchronization pipeline that securely reads mailbox metadata and selected message content through provider APIs.

This specification uses “tracking” to mean tracking the user's own mailbox activity, workload, and follow-ups. Tracking whether recipients opened or clicked outgoing mail is out of scope for the MVP and is described separately under Future Work.

## 2. Goals

- Connect two or more Gmail or Google Workspace accounts to one personal profile.
- Provide a unified inbox/activity view without requiring the user to switch Google accounts.
- Highlight unanswered mail, promised follow-ups, stale conversations, high-volume senders, and account-level trends.
- Make the most useful tracker context available inside `mail.google.com` in Chrome and Firefox.
- Keep all data private to one owner, minimize stored message content, and make account disconnection and data deletion straightforward.
- Deploy the application backend, frontend, database, jobs, and static assets on Cloudflare where practical.
- Use the repository's Portless-backed development workflow exclusively for local application access.

## 3. Non-goals for the MVP

- Sending, replying to, deleting, moving, labeling, or otherwise mutating mail.
- Supporting providers other than Gmail / Google Workspace.
- Team workspaces, shared inboxes, delegation, billing, or public signup.
- Replacing the Gmail inbox or implementing a full mail client.
- Guaranteed read receipts, recipient surveillance, or pixel-based open tracking.
- Mobile applications.
- Training models on mailbox data.

## 4. Primary user journeys

### 4.1 First run

1. The owner signs into Personal Mail Tracker.
2. The owner connects a Google account through OAuth.
3. The app explains the exact requested Gmail permissions before Google consent.
4. An initial sync begins asynchronously and reports progress.
5. The owner may connect additional Google accounts while the first sync runs.
6. The dashboard becomes usable from partial results and clearly indicates sync freshness.

### 4.2 Daily dashboard

The owner opens the web app and sees:

- Unified “Needs attention” queue across all accounts.
- Unanswered received threads.
- Sent threads awaiting a reply.
- Follow-ups due today or overdue.
- Recently active and recently quiet conversations.
- Account health and last successful sync.
- Mail volume trends and response-time summaries.

Every item shows its source account and links directly to the corresponding Gmail conversation using a provider deep link. Filters include account, label/category, direction, people/domain, status, date range, and attachment presence.

### 4.3 Gmail integration

When the owner visits Gmail with the extension installed:

- A small, clearly branded tracker control is added to Gmail.
- Opening it shows the tracker panel without navigating away from Gmail.
- On a conversation, the panel shows tracker-derived context: account, last activity, reply state, age, follow-up state, and a link to the full dashboard.
- The injected UI is isolated from Gmail styling (Shadow DOM) and fails closed if Gmail's DOM changes.
- The extension never reads Google session cookies or scrapes message bodies for server synchronization. Mail data comes from the authenticated backend and Gmail API.

Browser-native side panels may be offered as an additional entry point. Chrome and Firefox have different sidebar APIs, so the Gmail-injected panel is the consistent cross-browser experience.

## 5. Functional requirements

### 5.1 Identity and connected accounts

- One application owner profile in the MVP.
- Application authentication must be distinct from connected mailbox authorization.
- The owner can connect, rename, color-code, pause, reauthorize, and disconnect each mailbox.
- OAuth tokens are stored encrypted, never returned to the browser, and refreshed only by the backend.
- Disconnecting an account revokes its token when possible and offers immediate deletion of all derived data.
- Duplicate connection of the same provider account is prevented.

### 5.2 Synchronization

- Initial sync imports a bounded configurable history, defaulting to 90 days.
- Incremental Gmail synchronization uses mailbox `historyId` values.
- Gmail push notifications arrive through Google Cloud Pub/Sub and invoke a public Worker webhook.
- Webhook handling validates the request, acknowledges quickly, and enqueues idempotent sync work.
- Gmail watches are renewed daily because they expire and must be renewed at least every seven days.
- A scheduled reconciliation job catches delayed/dropped notifications and expired history cursors.
- Sync work is retryable, idempotent, rate-limit aware, and isolated per connected account.
- The UI exposes sync state: pending, syncing, current, degraded, auth required, or failed.

### 5.3 Stored mail data

Default storage is metadata-first:

- Provider account, message ID, thread ID, history cursor.
- Subject, participants, normalized email addresses/domains.
- Sent/received timestamps, labels, direction, unread/starred state, attachment metadata.
- A short snippet where permission and user settings allow it.
- Derived state such as last inbound/outbound event, reply status, response duration, follow-up status, and staleness.

Full message bodies and attachment bytes are not persisted in the MVP. Search is therefore over stored metadata and snippets, not complete message content.

### 5.4 Dashboard modules

MVP modules:

- **Needs attention:** ranked union of unanswered, awaiting reply, overdue follow-up, and stale important threads.
- **Unified activity:** chronological activity across accounts.
- **Awaiting my reply:** latest meaningful message is inbound.
- **Awaiting their reply:** latest meaningful message is outbound.
- **Follow-ups:** manual due date, snooze, note, and completion state.
- **People and domains:** message volume, last contact, inbound/outbound balance, median response times.
- **Trends:** sent/received volume and response-time trend by day/week and account.
- **Search:** subject, participant, domain, account, dates, status, and labels.
- **Account health:** last sync, next watch renewal, recent error, and reauthorization action.

Ranking is deterministic in the MVP. It combines age, unread state, direct-recipient status, follow-up due date, and whether the user has previously replied in the thread. Users can dismiss or snooze an item; these actions train no model.

### 5.5 Extension

- One TypeScript codebase produces Chrome and Firefox Manifest V3 builds.
- Shared features: sign in, connection status, current Gmail-thread context, compact needs-attention list, badge count, settings link, and injected Gmail panel.
- Browser-specific manifest fragments adapt Chrome `sidePanel` and Firefox `sidebar_action` where used.
- Minimum host permission is limited to the production app/API origins and `https://mail.google.com/*`.
- Content scripts communicate with the background/service worker; authenticated API requests originate from an extension context, not the page content script.
- No remotely hosted executable code.
- Gmail DOM integration lives behind an adapter with fixture-based tests so selector changes are localized.
- If the adapter cannot identify the active account or thread safely, it shows a non-destructive fallback link to the dashboard.

### 5.6 Settings, privacy, and export

- Configure initial sync window, account color/name, timezone, and dashboard thresholds.
- Export application-owned state and normalized metadata as JSON or CSV.
- Delete one account's data or all application data.
- Show an audit trail for account connect, disconnect, sync, token refresh failure, export, and deletion events.
- Provide a privacy page that enumerates stored fields and OAuth scopes.

## 6. Gmail feasibility and constraints

The Gmail API supports message/thread access and incremental mailbox history. Gmail push notifications do not contain message data; they contain the mailbox identity and a new history ID. The backend must call `history.list` and fetch changed resources.

Push delivery requires a Google Cloud Pub/Sub topic even though the application runs on Cloudflare. Pub/Sub sends HTTPS push requests to a Cloudflare Worker endpoint. This small Google Cloud dependency is unavoidable for Gmail server push; periodic API polling remains the fallback.

Appearance “inside Gmail” is possible on Chrome and Firefox through a WebExtension content script that injects application UI into `mail.google.com`. It is not a native Gmail feature and can break when Gmail changes its private DOM. A browser extension must be installed in each browser/profile. Safari and mobile Gmail are not covered by the MVP.

A Google Workspace Add-on is not selected for the MVP: it offers a Google-supported Gmail surface but has a more constrained card-based UI and would be a separate distribution/runtime path. It may be evaluated later as a resilient fallback.

## 7. Architecture

### 7.1 Repository layout

```text
apps/
  web/          # Cloudflare-hosted dashboard and HTTP API
  extension/    # Chrome + Firefox WebExtension builds
packages/
  core/         # Provider-neutral domain rules and derived-state logic
  contracts/    # Shared API schemas and generated/typed client contracts
  gmail/        # Gmail provider adapter, OAuth, mapping, sync cursor logic
  ui/           # Shared presentational components where practical
```

The `core` package must not import Gmail, Cloudflare, browser-extension, database, or UI modules.

### 7.2 Cloud services

- **Cloudflare Workers:** web app server/API, OAuth callbacks, Pub/Sub webhook, extension API.
- **Cloudflare D1:** relational application state and normalized mailbox metadata.
- **Cloudflare Queues:** initial sync, incremental sync, derivation, deletion, and export work.
- **Cloudflare Cron Triggers:** daily watch renewal and periodic reconciliation.
- **Cloudflare R2:** optional generated exports only; not message bodies or attachments.
- **Cloudflare secrets/bindings:** OAuth client secret and token-encryption key.
- **Google Cloud Pub/Sub:** Gmail notification transport to the Worker webhook.

Do not use Cloudflare KV as the source of truth for mailbox or follow-up state. It may be added only for disposable cache data.

### 7.3 Logical flow

```text
Gmail API ──notification──> Google Pub/Sub ──HTTPS push──> Worker webhook
                                                           │
                                                           v
Browser/Web app ──HTTPS──> Worker API <──> D1 <── Worker Queue consumer
       │                         │
       └── Gmail deep link       └── OAuth / Gmail API fetches
```

### 7.4 Provider boundary

Define a provider-neutral mail adapter with operations equivalent to:

- Begin authorization and exchange/refresh/revoke credentials.
- Read provider identity and capabilities.
- Perform bounded initial synchronization.
- Read changes after an opaque cursor.
- Fetch normalized threads/messages needed for those changes.
- Create, renew, and stop change subscriptions.
- Build a deep link to a provider conversation.

Provider IDs and cursors remain opaque outside the adapter. Normalized domain entities use application IDs plus `(provider, providerAccountId, providerResourceId)` uniqueness constraints.

## 8. Domain model

- **Owner:** the one application user.
- **Mailbox:** one connected provider account and its auth/sync state.
- **Contact:** normalized email address plus optional display name and domain.
- **Conversation:** provider thread projected into provider-neutral state.
- **Mail event:** one inbound or outbound message within a conversation.
- **Participant:** contact role on a mail event (`from`, `to`, `cc`, `bcc`).
- **Follow-up:** application-owned reminder/note/status attached to a conversation.
- **Sync cursor:** opaque provider position last fully processed.
- **Subscription:** expiring provider push-watch state.
- **Attention item:** derived, reproducible dashboard reason for surfacing a conversation.
- **Sync run:** auditable unit of initial, incremental, reconciliation, or deletion work.

## 9. Security requirements

- Request the narrowest Gmail scopes that satisfy the approved feature set; default to read-only mail access and basic identity.
- Complete Google's OAuth app verification/security requirements before distributing beyond personal/testing use.
- Encrypt refresh/access tokens at the application layer with key material stored as a Cloudflare secret.
- Redact authorization headers, tokens, message snippets, and Pub/Sub payload data from logs.
- Validate OAuth state and PKCE, webhook authenticity/authorization, API origin, and every resource's owner/mailbox association.
- Use short-lived, audience-bound sessions for web and extension clients.
- Apply CSRF protection to cookie-authenticated mutations and strict CORS allowlists to extension/API traffic.
- Keep synchronization and derivation idempotent; never advance a cursor before all corresponding changes commit.
- Maintain dependency, secret, and extension permission review gates in CI.

## 10. API surface (MVP)

Representative routes, subject to typed-contract refinement:

- `GET /api/session`
- `GET /api/mailboxes`
- `POST /api/mailboxes/google/authorize`
- `GET /api/oauth/google/callback`
- `POST /api/mailboxes/:id/sync`
- `PATCH /api/mailboxes/:id`
- `DELETE /api/mailboxes/:id`
- `GET /api/dashboard`
- `GET /api/conversations`
- `GET /api/conversations/:id`
- `PUT /api/conversations/:id/follow-up`
- `DELETE /api/conversations/:id/follow-up`
- `POST /api/attention/:id/dismiss`
- `POST /api/attention/:id/snooze`
- `POST /api/webhooks/google/pubsub`
- `POST /api/exports`
- `DELETE /api/owner/data`

All collection endpoints use cursor pagination. API schemas are runtime validated and shared with the web and extension clients through `packages/contracts`.

## 11. Scaffold and local development

The currently published CLI (`@jfdevelops/cli` 0.8.0) offers a `node-app` application template. Use it to establish the repository conventions and workspace, then add the browser/frontend/Cloudflare-specific dependencies and applications deliberately.

Proposed non-interactive scaffold command:

```sh
npx @jfdevelops/cli create . \
  --kind app \
  --template node-app \
  --package-manager pnpm \
  --formatter prettier \
  --agents all \
  --monorepo \
  --namespace mail-tracker \
  --app-name web \
  --apps-dir apps \
  --libraries-dir packages \
  --packages core,contracts,gmail,ui \
  --no-git \
  --yes \
  --conflicts keep
```

`--no-git` is intentional when scaffolding inside an existing repository. If this directory is confirmed not to be a Git repository and the owner wants the CLI to create it, replace it with `--git`.

After scaffolding, local application commands must run through the repository's configured Portless development command. Browser access and automated preview must use the configured Portless URL; raw localhost or `127.0.0.1` URLs are prohibited. If Portless fails, fix Portless rather than bypassing it.

## 12. Testing and quality gates

- Unit tests for reply-state derivation, attention ranking, date/timezone behavior, cursor advancement, and provider mapping.
- Contract tests for Gmail API fixtures, Pub/Sub envelopes, token refresh, retries, and expired history cursors.
- D1 migration and repository integration tests against a local Cloudflare-compatible environment.
- Queue tests proving at-least-once delivery remains idempotent.
- Web end-to-end tests for onboarding, multi-account filters, follow-ups, deletion, and degraded sync states.
- Extension tests in current stable Chrome and Firefox, plus fixture-based Gmail DOM adapter tests.
- Manual release smoke test inside a real Gmail account in both browsers.
- CI gates: format, lint, typecheck, unit/integration tests, builds for Worker/web/Chrome/Firefox, manifest validation, and migration checks.

## 13. Delivery phases

### Phase 0 — Foundation

Scaffold workspace, configure Portless, establish domain/contracts packages, Cloudflare environments, D1 migrations, CI, and local test fixtures.

### Phase 1 — Secure Gmail ingestion

Owner authentication, Google OAuth, one/multiple mailbox connections, initial sync, incremental history sync, Pub/Sub webhook, queues, watch renewal, reconciliation, account health, and deletion.

### Phase 2 — Useful dashboard

Unified activity, reply-state queues, deterministic attention ranking, filters/search, follow-ups, people/domain insights, trends, export, and responsive UI.

### Phase 3 — Browser integration

Shared WebExtension, Chrome/Firefox manifests, Gmail content adapter, injected panel, browser sidebars, store packaging, and permission/privacy review.

### Phase 4 — Hardening

OAuth verification readiness, production observability, recovery drills, performance/load tests, accessibility, data-retention controls, and release documentation.

## 14. Acceptance criteria for MVP

- The owner connects at least two Gmail accounts and sees both become current after asynchronous initial sync.
- New mail and state changes normally appear within two minutes, with reconciliation recovering missed notifications.
- The dashboard correctly distinguishes “awaiting me” and “awaiting them” for tested conversation fixtures.
- Account filters and combined views return consistent results with no cross-account identity collision.
- Follow-ups can be created, snoozed, completed, and removed without modifying Gmail.
- Disconnecting and deleting a mailbox removes credentials and derived data and records the operation without sensitive content.
- Chrome and Firefox builds install, authenticate, and show contextual tracker UI within Gmail.
- A Gmail DOM change cannot corrupt mail data or prevent use of the standalone dashboard.
- Production deploys run on Cloudflare, apart from the required Google OAuth/Pub/Sub services.
- All local preview access is through Portless.

## 15. Open decisions requiring owner approval

1. **Primary interpretation:** confirm that the MVP is a personal mailbox intelligence/follow-up tracker, not recipient open/click tracking.
2. **History window:** accept the proposed 90-day default or choose another initial import window.
3. **Stored content:** approve metadata plus Gmail snippet storage, or choose metadata-only storage.
4. **Authentication:** decide whether the owner signs in with one designated Google identity or a separate passkey/auth provider.
5. **Namespace:** approve package names such as `mail-tracker-core`, or choose a scoped namespace such as `@jfdevelops` if supported by the CLI conventions.
6. **Git initialization:** confirm whether the CLI should initialize Git in this currently empty directory.

## 16. Future work

- Microsoft Graph adapter for Outlook / Microsoft 365.
- Generic IMAP adapter, likely requiring a non-Cloudflare connector service for durable IMAP IDLE connections.
- Google Workspace Add-on as a constrained but Google-supported Gmail surface.
- Calendar/contact enrichment, local-only classification, and user-defined attention rules.
- Optional outbound open/click tracking. This requires a sending/composition integration, tracking-domain and redirect infrastructure, explicit privacy controls, and UI that treats events as probabilistic because image blocking, proxies, scanners, and link protection create false positives and false negatives.

## 17. Reference basis

- Gmail API push notifications and watch renewal: <https://developers.google.com/workspace/gmail/api/guides/push>
- Gmail API reference: <https://developers.google.com/workspace/gmail/api/reference/rest>
- Cloudflare D1: <https://developers.cloudflare.com/d1/>
- Cloudflare Queues: <https://developers.cloudflare.com/queues/get-started/>
- Cloudflare Cron Triggers: <https://developers.cloudflare.com/workers/configuration/cron-triggers/>
- Chrome Side Panel API: <https://developer.chrome.com/docs/extensions/reference/api/sidePanel>
- Firefox content scripts: <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts>
- Firefox sidebar manifest: <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/sidebar_action>
