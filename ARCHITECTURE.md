## Yeebli Architecture and Product Flow

This document describes the end-to-end architecture of the Yeebli application across backend and frontend, including core domains (Leads, Events, Bookings, Memberships, Teams, Callbacks, Business/CRM, Contacts), payments (Stripe Connect + webhooks), asset upload and optimization (S3 + MediaConvert), email automation, telemetry, notifications, real-time streaming, and UX flows. It also lists key API endpoints and frontend entry points.

### Tech stack
- Backend: TypeScript, Hono, Drizzle ORM, PostgreSQL, BullMQ, AWS S3 + MediaConvert, Stripe
- Frontend: React + Vite, SWR, Tailwind CSS
- Repos: `src/repository/*` (data), `src/service/*` (business), `src/web/*` (controllers, routes, middleware)

---

## Backend Architecture

### High-level layering
- Repository: raw DB queries with Drizzle (e.g. `LeadRepository`, `EventRepository`)
- Service: business logic composition, side-effects, and integrations (Stripe, S3, email, notifications)
- Controller: HTTP handlers, validation, auth/role checks; returns JSON or error helpers
- Server: DI wiring and router registration in `src/web/server.ts`

### Auth, roles, and team access
- JWT-based auth via Hono middleware
- Roles: `master`, `owner`, `host` (and contact side for attendees)
- Team access middleware injects `hostId`/`teamId` context; controllers enforce shared access for team members/hosts

### Error handling
- Centralized helpers `serveBadRequest(c, ERRORS.X)` and `serveInternalServerError` (see `src/web/controller/resp/error.ts`)

### Team access model (in-depth)
- Middleware: `teamAccess(teamService)` runs after JWT on many authenticated routes (e.g., `/lead`, `/event`, `/asset`, etc.).
- Behavior:
  - Reads optional headers/params to determine team context; fetches whether current user is team host or member.
  - If team context valid, sets `hostId` (team host) and `teamId` on the request context via `c.set(...)`.
  - Controllers read `hostId` to scope operations. Example in `LeadController.getLeads`: when `hostId` exists, fetch host-scoped lists regardless of the current user's own `id`.
- Permission rules in controllers typically allow:
  - `master` or `owner`: global access
  - Resource owner: allowed
  - Team member or team host (when `hostId`/`teamId` present and validated): allowed
  - Otherwise: `ERRORS.NOT_ALLOWED`
- Examples:
  - Lead update/delete: checks for team membership/host via `teamService.isTeamMember/isTeamHost` before allowing.
  - Event update/delete: same checks to ensure team users can manage host resources.

---

## Core Domains

### Leads
- Controller: `src/web/controller/lead.ts`
- Service: `src/service/lead.ts`
- Repository: `src/repository/lead.ts`

Capabilities
- Create single/bulk leads (optionally linked to `event_id`)
- Search by name/tag/event; pagination; host/team scoping
- Tags: create/assign/unassign/list per host and per lead
- Event access validation: token + email + event code checks
- Purchase flow: validates memberships, calculates price, creates Stripe checkout, persists payments
- On create: ensures CRM Contact + Stripe customer exists; emits host notifications

Key flows
- Lead created with `event_id`: status `registered_for_event`, confirmation email with gateway link
- External form: creates lead and either
  - Free membership → activates membership, creates booking + free payment, sends ICS ticket
  - Paid membership → creates pending payment + Stripe Checkout session

Key endpoints (prefix `/v1` omitted below for brevity)
- `POST /lead` (create), `POST /lead/bulk`, `GET /lead`, `GET /lead/:id`, `PUT /lead/:id`, `DELETE /lead/:id`
- Search/unique: `POST /lead/search`, `POST /lead/unique-leads`, `POST /lead/bulk-delete`
- Tags: `POST /lead/tag`, `POST /lead/tag/assign`, `DELETE /lead/tag/:id`, `DELETE /lead/tag/:id/lead/:lead_id`, `GET /lead/tags/host`
- Event access + purchase: `POST /lead/lead-validate-event`, `POST /lead/validate-ticket-payment`, `POST /lead/external-form`, `POST /lead/purchase-membership`

### Events
- Controller: `src/web/controller/event.ts`
- Service: `src/service/event.ts`
- Repository: `src/repository/event.ts`

Capabilities
- Create/update/delete events with attached memberships and dates
- Fetch lists/details; compute `leadCount`; surface click analytics and attendance stats
- Stream endpoint (prerecorded) validates host vs lead token and membership
- Cancellation informs attendees via email

Key endpoints
- `GET /event` (queryable), `GET /event/:id`, `GET /event/:id/memberships`
- `POST /event` (create), `PUT /event/:id` (update), `DELETE /event/:id`, `POST /event/cancel`
- `POST /event/stream` (host or attendee; attendee requires active membership)
- `GET /event/server-time` (clock sync)

### Bookings
- Service: `src/service/booking.ts`
- Repository: `src/repository/booking.ts`

Creation
- Free path (via LeadsController external form or purchase-membership): creates booking immediately
- Paid path (via Stripe webhook): creates booking on `checkout.session.completed`
- Emits host notification including lead and event metadata

Key endpoints
- `POST /booking` (internal use), `GET /booking/lead/:lead_id`

Booking lifecycle (detailed)
- Creation sources:
  - Free membership (lead external form or purchase-membership): controller updates lead membership, then `BookingService.create()` with `metadata` containing `event_name`, `lead_name`, `lead_email`, and `dates`.
  - Stripe webhook (lead upgrade): after payment success, activates lead membership, then creates booking.
- Data linkage:
  - `bookings` table links `event_id`, `lead_id`, `host_id`, `membership_id`, and stores `metadata` (names, dates) for denormalized reporting and notifications.
- Retrieval:
  - By lead: `GET /booking/lead/:lead_id` returns bookings with joined `event` snapshot for dashboards.
- Notifications:
  - On create → host receives `new_booking` notification with deep-link to `event-edit/:event_id`.

### Memberships (Pricing/Access Tiers)
- Controller: `src/web/controller/membership.ts`
- Service: `src/service/membership.ts`
- Repository: `src/repository/membership.ts`

Capabilities
- Create/update/delete membership plans with dates (timestamps for event occurrences)
- Query memberships by user/host; fetch events linked to a membership
- Batch create memberships with dates during event/course creation
- Delete dates individually; update membership details (price, billing type, description)

Key concepts
- Memberships define pricing tiers: `price`, `billing` (per-day/package), `payment_type` (one_off/recurring)
- Each membership can have multiple `dates` (stored as Unix timestamps) for multi-day events
- Events link to memberships via junction tables; leads select a membership when registering

Key endpoints
- `GET /membership` (list), `GET /membership/:id`, `GET /membership/:id/dates-for-plan`
- `POST /membership`, `PUT /membership/:id`, `DELETE /membership/:id`, `DELETE /membership/:id/dates/:dateId`

### Business (Host profiles/branding)
- Controller: `src/web/controller/business.ts`
- Service: `src/service/business.ts`
- Repository: `src/repository/business.ts`

Capabilities
- Upsert business details: name, email, phone, address, website, logo
- Upload/update business logo (stored in S3 as asset)
- Fetch business by user/host; admin view lists all businesses
- Business details used in email templates (ICS tickets, confirmations, etc.)

Key endpoints
- `GET /business/my`, `POST /business/my` (upsert), `POST /business/logo` (upload)
- `GET /business` (admin: list all with pagination)

### Contacts (CRM for attendees)
- Controller: `src/web/controller/contact.ts`
- Service: `src/service/contact.ts`
- Repository: `src/repository/contact.ts`

Purpose
- Separate from `User` (hosts); represents leads/attendees who register and can log in to view their bookings
- Created automatically when a lead is captured (via `LeadService.create`)
- Stores encrypted password, Stripe customer ID, email verification tokens

Capabilities
- Register/login (JWT-based); email verification flow with 6-digit token
- Password reset (request token → reset with token)
- In-app password change
- Update contact details
- List payment methods (Stripe customer payment methods)

Key endpoints
- `POST /contact/login`, `GET /contact/me`
- `POST /contact/send-token`, `POST /contact/verify-registration`
- `POST /contact/request-reset-password`, `POST /contact/reset-password`, `POST /contact/reset-password-in-app`
- `PUT /contact/details`, `GET /contact/payment-methods`

### Teams (Collaboration, detailed)
- Controller: `src/web/controller/team.ts`
- Service: `src/service/team.ts`
- Repository: `src/repository/team.ts`
- Middleware: `src/web/middleware/team.ts`

Purpose
- Allow a host to invite team members (other users) to manage their resources (leads, events, assets)
- Team host retains ownership; members get scoped access via `hostId` injection

Capabilities
- Create team (host-owned)
- Invite members by email; sends transactional email with accept link
  - If invitee has no account, auto-creates User with temp password and sends credentials
- Accept/reject invitations
- List team members with pagination
- Revoke access (remove member)
- Dashboard: shows team invitations, members, and user's teams

Team access flow (detailed)
- Middleware `teamAccess(teamService)` runs after JWT on protected routes
- Checks headers/params for team context; if present, validates user is team host or member
- Sets `c.set('hostId', ...)` and `c.set('teamId', ...)` for controllers to use
- Controllers read `hostId` to scope queries (e.g., `LeadService.findByUserIdWithEvents(hostId)`)
- Permission checks in controllers: allow master/owner, resource owner, or team member/host

Key endpoints
- `POST /team/create`, `POST /team/invite`, `POST /team/revoke-access`
- `GET /team/dashboard`, `GET /team/invitations`, `GET /team/my-invitations`, `GET /team/my-teams`, `GET /team/my-team/members`
- `POST /team/invitations/:id/accept`, `POST /team/invitations/:id/reject`, `DELETE /team/invitations/:id`

### Callbacks (Lead follow-up tracking)
- Controller: `src/web/controller/callback.ts`
- Service: `src/service/callback.ts`
- Repository: `src/repository/callback.ts`

Purpose
- Track when leads request callbacks or when hosts schedule follow-ups
- Two types: `instant` (lead clicked "Call me back" during event) and `scheduled` (host manually schedules)

Capabilities
- Create callback with lead/event/host linkage, type, status (`called`/`uncalled`), and notes
- List callbacks by lead, event, or host
- Fetch uncalled callbacks (to-do list for hosts)
- Mark callback as called
- Update/delete callbacks

Lead status integration
- When lead status updated to `call_back` or `scheduled_call_back` in LeadController, auto-creates callback if not exists

Key endpoints
- `POST /callback`, `GET /callback/:id`, `GET /callback/lead/:leadId`, `GET /callback/uncalled`, `GET /callback/scheduled`
- `PUT /callback/:id`, `DELETE /callback/:id`, `POST /callback/:id/called`

### Email and Bulk Email (Marketing/Automation)
- Controller: `src/web/controller/email.ts`
- Service: `src/service/email.ts`
- Repository: `src/repository/email.ts`
- Task processor: `src/task/email-processor.ts`

Purpose
- Bulk email campaigns to leads/contacts filtered by events, tags, membership, or status
- Automated follow-up emails triggered by cron (countdown, final reminder, day-of, thank-you, post-event)

Capabilities
- Create bulk email: specify subject, body, button, recipients (by event/tag/status/membership)
- Toggle bulk email on/off
- List/update/delete bulk emails
- Follow-up email templates: create/list/update/delete custom follow-up sequences
- Automated triggers via GET endpoints (called by cron jobs): countdown, final-reminder, event-day, thank-you, post-event-upsell

Automated email flow
- Lead has `email_*` boolean flags (e.g., `email_event_countdown`, `email_final_reminder`)
- Cron hits trigger endpoints; service queries leads due for email, sends via queue, then marks flag as sent

Email processing
- Transactional/template emails queued via BullMQ (`TASK.ProcessEmail`) to avoid blocking HTTP requests
- `sendTemplateEmail` and `sendTransactionalEmail` helpers push jobs to worker

Key endpoints
- Bulk: `POST /email`, `POST /email/toggle`, `GET /email`, `GET /email/:id`, `PUT /email/:id`, `DELETE /email/:id`
- Follow-up: `POST /email/follow-up`, `GET /email/follow-up`, `PUT /email/follow-up/:id`, `DELETE /email/follow-up/:id`
- Triggers (unauthenticated, called by cron): `GET /email/trigger/countdown`, `GET /email/trigger/final-reminder`, `GET /email/trigger/event-day`, `GET /email/trigger/thank-you`

### Google Auth (OAuth integration)
- Controller: `src/web/controller/google.ts`
- Service: `src/service/google.ts`

Purpose
- Allow users to sign in with Google OAuth
- Fetches Google profile, creates/updates user, optionally uploads profile image to S3

Flow
- `GET /user/auth/google` → generates OAuth URL with state
- User redirects to Google → callback to `GET /user/auth/google/callback?code=...`
- Exchanges code for tokens, fetches profile, creates/updates user, returns JWT

Key endpoints
- `GET /user/auth/google`, `GET /user/auth/google/callback`

### ICS Calendar (Event ticket attachments)
- Service: `src/service/ics.ts`

Purpose
- Generate .ics calendar files attached to ticket emails
- Contains event name, dates, location/URL, host details

Usage
- Called by LeadController and StripeController webhook when sending ticket emails
- `createAttachment(event, lead, host, business, dates, buttonLink)` returns ICS buffer for email attachment

### Admin (Platform management)
- Controller: `src/web/controller/admin.ts`
- Service: `src/service/admin.ts`
- Repository: `src/repository/admin.ts`

Capabilities
- List/create/update/delete users (requires `master` or `owner` role)
- List all leads and events (global view)
- User management: update subscription status, roles, etc.

Key endpoints
- `GET /admin/users`, `GET /admin/user/:id`, `POST /admin/user`, `PUT /admin/user/:id`, `DELETE /admin/user/:id`
- `GET /admin/leads`, `GET /admin/events`

### Background Jobs (BullMQ + Tasker)
- Queue: `src/lib/queue.ts` (BullMQ with Redis)
- Worker: `src/task/tasker.ts`
- Email processor: `src/task/email-processor.ts`

Purpose
- Decouple email sending from HTTP requests for better performance and reliability
- Process bulk emails, follow-ups, transactional emails, event-end notifications

Task types
- `send_code_completion`: welcome/verification emails
- `process_email`: templated emails (tickets, confirmations, etc.)
- `bulk_send_follow_up_emails`: bulk email campaigns
- `event_end_notification`: notify host when event stream ends

Worker lifecycle
- Initialized in `Server.configure()` via `registerWorker(userService, emailService)`
- Listens to default queue; logs completions/failures
- Shutdown via `Server.shutDownWorker()`

### Payments and Stripe Connect
- Controller: `src/web/controller/stripe.ts`
- Services: `StripeService` (secrets-loaded), `PaymentService`

Stripe Connect (host payouts)
- OAuth initiation: `GET /stripe/connect/oauth`
- OAuth callback: `GET /stripe/connect/oauth/callback`
- Get account status: `GET /stripe/connect/status`
- Saved cards (customer PMs): `GET /stripe/list/payment/methods`

Connect flow details
- Initialization: `StripeService.initialize()` loads API keys from AWS Secrets Manager; invoked in `Server.configure()` before controllers.
- Initiate OAuth: generates a random `state`, stores in user row (`stripe_oauth_state`), returns Stripe Connect URL built from server base URL.
- Callback:
  - Validates `state` matches user record; exchanges `code` for `stripe_user_id` (Connect account id).
  - Persists `stripe_connect_id` and sets `stripe_connect_status` to `active`.
- Account lifecycle:
  - `account.updated` webhook sets status to `pending|active|restricted|rejected` based on Stripe flags (`charges_enabled`, `payouts_enabled`, requirements).
  - Hosts without `stripe_connect_id` are blocked from creating paid checkouts; a transactional email prompts them to connect.

SaaS subscription (platform plans)
- `POST /subscription/subscribe`, `GET /subscription`, `DELETE /subscription`
- Webhooks update user subscription state and send transactional emails

Lead ticket purchase (event membership)
- Controllers (Lead + Stripe):
  - For paid: create pending `payment` + Stripe Checkout session; return redirect URL
  - On webhook `checkout.session.completed` with `metadata.type = lead_upgrade`:
    - Activate `membership`, set `date_id`, mark `payment` as `succeeded`
    - Create `booking`, email ICS ticket, notify host

Checkout session metadata (lead upgrade)
- `metadata` carries: `type=lead_upgrade`, `leadId`, `eventId`, `membershipId`, `dates` (comma-separated ids)
- On webhook, these are parsed to drive lead update, payment update by `session.id`, booking creation, and ICS mail.

Webhooks
- `POST /stripe/webhook` handles:
  - `checkout.session.completed` (subscription or lead upgrade)
  - `customer.subscription.*`
  - `account.updated` (Connect status)

Security notes
- Webhook: validates `stripe-signature` header and uses raw body to construct event; rejects if missing/invalid.
- Controllers sanitize/validate input via zod validators before hitting services.

Payment persistence
- `PaymentService` persists payments, emits notifications for free-amount payments immediately; updates by `sessionId` on webhook

### Assets: Upload, Storage, Optimization (HLS)
- Controller: `src/web/controller/asset.ts`
- Service: `src/service/asset.ts`
- S3 integration: `src/service/s3.ts`

Upload paths
- Direct single upload: generate presigned PUT URL or server-side upload
- Multipart upload for large files:
  - `POST /asset/multipart` → presigned URLs per part
  - client uploads parts → `POST /asset/:id/complete` to finalize
  - For videos: completion auto-starts MediaConvert HLS job

Optimization
- MediaConvert HLS job created by `S3Service.createMediaConvertJob`
- Webhook: `POST /asset/hls-conversion-webhook` updates asset `hls_url`, notifies host, and sends status emails
- Presigned GET URLs used for delivery and short-lived access

Video optimization pipeline (details)
- After multipart completion for `video` asset, server auto-starts HLS conversion and posts a `system` notification: "Video processing started".
- MediaConvert webhook statuses handled:
  - `STATUS_UPDATE`/`PROGRESSING`: updates `mediaconvert_job_*` fields on asset
  - `COMPLETE`: persists `hls_url`, sends success email + notification
  - `ERROR`: sends failure email + notification; asset remains without `hls_url`

Guardrails
- Delete asset: blocks if linked to active event with leads (unless event cancelled)
- Rename asset preserves extension

Key endpoints
- `POST /asset` (create), `GET /asset`, `GET /asset/:id`, `PUT /asset/:id/rename`, `DELETE /asset/:id`
- Multipart: `POST /asset/multipart`, `POST /asset/:id/complete`, `POST /asset/:id/start-hls-conversion`
- Webhook: `POST /asset/hls-conversion-webhook`

### Telemetry and Engagement
- Controller: `src/web/controller/telemetry.ts`
- Service: `src/service/telemetry.ts`
- Tracks lobby, watch-time, join/leave, active sessions, and event analytics
- Host analytics endpoints secured; attendee writes allowed unauthenticated with validators

### Notifications and Email
- Notifications: `NotificationService` + controller
- Email: `EmailService` and task processor (`task/email-processor.ts`), templated transactional emails (ticket delivery, reminders, Stripe actions)

### Click Analytics
- Controller/Service/Repo: records per event/lead clicks; used for dashboard stats

### Real-time (WebSocket)
- `WebSocketService` initialized in server with event + telemetry services for live sessions/updates
- Port configurable via `WEBSOCKET_PORT` env
- Used for live event streaming, real-time notifications, chat (if implemented)

---

## Frontend Architecture

### Services (API wrappers)
- Leads: `src/services/LeadsService.ts` — CRUD, tags, external form, validate access, purchase membership, bulk delete
- Events: `src/services/EventService.ts` — list/detail/create/update/delete/stream, memberships
- Stripe/Subscriptions: `src/services/PaymentService.ts` (subscribe), `src/services/AuthService.ts` (Stripe Connect OAuth + callback, subscriptions list)
- Business: (no dedicated service; typically embedded in user/settings views)
- Teams: (no dedicated service; API calls made inline from team views)
- Memberships: (API calls inline from event/course forms)

### Key views/screens
- Leads
  - Create/edit/list: `views/concepts/leads/*` using `LeadForm.tsx`, lists with tags and bulk actions
  - Callbacks: visible in lead detail view; hosts manage callback lists
- Events
  - List/Form/Edit: manage memberships/dates and asset association
  - Stream: `views/concepts/events/EventStream/*` — host vs attendee mode, validates access via `/event/stream`
- Business
  - Settings: `views/concepts/accounts/Settings/*` — manage business details, logo, Stripe Connect
- Payments
  - Event purchase initiated via Lead flows (external form/purchase membership)
  - Platform subscription dialog: `views/onboarding/Pricing/components/PaymentDialog.tsx`
  - Account settings exposes Stripe Connect setup
- Teams
  - Dashboard: view invitations, team members, accept/reject invites
  - Settings: invite members, revoke access
- Emails
  - Bulk email composer: create campaigns with audience filters
  - Follow-up sequences: manage automated email templates

### Team access UX
- Admin/host views support operating under a team host context. When acting under a team, lists and edits are scoped to the `hostId` provided by backend middleware.
- Lead/Event/Asset pages automatically reflect the team-scoped host resource lists; actions enforce permissions per controller checks.

### Routing and navigation
- Routes: `src/configs/routes.config/*` — defines all app routes (auth, concepts, admin, etc.)
- Navigation: `src/configs/navigation.config/*` — defines sidebar/menu structure per role
- Auth guard: `src/components/route/AuthorityGuard.tsx` — checks roles and permissions

### State, data, and UX
- SWR for data fetching with cache and focus revalidation disabled where appropriate
- Forms use `react-hook-form` + `zod`
- Tables: shared components with selection, bulk actions

---

## End-to-end Product Flows

### Lead → Purchase → Booking → Event Access
1) Lead capture
   - Internal app lead create (optional `event_id`) or Landing external form
2) Pricing
   - Free membership → immediately activate, create booking + free payment, send ICS ticket, return thank-you URL
   - Paid membership → create pending payment + Stripe Checkout session, return redirect URL
3) Webhook fulfillment (paid)
   - On success: activate membership, set `date_id`, mark payment `succeeded`, create booking, email ICS ticket, notify host
   - If host has no Connect account: paid checkout creation is blocked earlier; host receives a transactional email to connect Stripe
4) Access
   - Attendee follows link with `token/email/code` to `/event/stream`; validated server-side
   - Host opens same page without token to manage stream

### Team collaboration workflow
1) Host creates team via `POST /team/create`
2) Host invites members via `POST /team/invite` (email sent with accept link)
3) Invitee accepts → auto-creates user account if needed; adds to team
4) Team member logs in; operates under team context (middleware injects `hostId`/`teamId`)
5) Member can view/edit host's leads/events/assets (permissions enforced per controller)
6) Host can revoke access anytime via `POST /team/revoke-access`

### Automated email sequences (lead nurture)
1) Lead registers for event → `email_*` flags initialized to `false`
2) Cron job hits trigger endpoint (e.g., `/email/trigger/countdown`) daily
3) Service queries leads where flag is `false` and date range matches (3-5 days before)
4) Sends email via queue, updates flag to `true`
5) Repeat for final-reminder (1 day before), event-day, thank-you (day after), post-event-upsell (3 days after)

### Asset upload → Optimization → Delivery
1) Request upload (single or multipart) → S3 presigned URLs
2) Complete upload
3) If video → start HLS job; webhook updates asset with `hls_url`
4) Event playback uses short-lived presigned GET URLs

### Stripe Connect (host payouts)
1) Host initiates Connect OAuth → redirected to Stripe
2) Callback persists `stripe_connect_id` and sets status `active`
3) Webhooks update account status over time

### Subscriptions (SaaS)
1) User opens subscription dialog → Stripe Checkout
2) Webhooks manage subscription status + welcome/trial emails

---

## Optimization and Performance
- Presigned GET URLs for assets reduce server load and allow secure, cached media delivery
- HLS multi-resolution outputs optimize streaming quality across devices
- Multipart uploads support large files reliably
- SWR tuning (e.g. `revalidateOnFocus: false`) reduces redundant network calls in admin screens
- Email/notification batching through background worker (BullMQ)
- DB filtering/pagination across list endpoints; Drizzle joins to prefetch relations where needed
- HLS streaming reduces bandwidth and improves adaptive playback; presigned URLs cached for 24h by default

### Background job processing
- Email sending offloaded to BullMQ worker; prevents HTTP request blocking
- Parallel processing of bulk email campaigns
- Retry logic for failed jobs

---

## Security, Configuration, and Environment
- JWT secret, Stripe keys, AWS credentials, S3 bucket, WebSocket port, frontend URL configured in env (`src/lib/env.ts`)
- Stripe keys are loaded via AWS Secrets Manager on boot; avoid storing plaintext keys in env files
- Validators (`src/web/validator/*`) gate all request bodies/queries; errors use `ERRORS.*` constants
- Webhook endpoints must be exposed with raw body support to verify signatures
- Team access: middleware checks team membership before setting `hostId`/`teamId`; controllers double-check ownership
- Passwords encrypted via `src/lib/encryption.ts` (bcrypt-like)
- Email tokens: 6-digit random codes for verification/reset

---

## Data Model Notes (selected)
- Leads: `lead_status`, `membership_active`, `membership_id`, `date_id`, `token`, `host_id`, `event_id`
  - Email flags: `email_event_countdown`, `email_final_reminder`, `email_event_day_reminder`, `email_thank_you_follow_up`, `email_post_event_upsell`
- Events: membership connections with dates; optional `asset_id` for prerecorded content; `live_video_url` for live call
- Bookings: links `lead_id`, `event_id`, `host_id`, `membership_id`, `metadata`
- Payments: status `pending|succeeded`; indexed by `checkout_session_id` for webhook updates
- Memberships: `price`, `billing`, `payment_type`, `price_point`; dates stored separately with Unix timestamps
- Teams: `host_id` (owner); junction table `team_members` links `team_id` and `user_id`
- Callbacks: `lead_id`, `event_id`, `host_id`, `callback_type`, `status`, `notes`
- Contacts: separate from `User`; represents attendees/leads with login capability

---

## Endpoint Index (selected)

Leads
- `GET /lead`, `GET /lead/:id`, `POST /lead`, `POST /lead/bulk`, `PUT /lead/:id`, `DELETE /lead/:id`
- `POST /lead/search`, `POST /lead/unique-leads`, `POST /lead/bulk-delete`
- Tags: `POST /lead/tag`, `POST /lead/tag/assign`, `DELETE /lead/tag/:id`, `DELETE /lead/tag/:id/lead/:lead_id`, `GET /lead/tags/host`
- Access/Purchase: `POST /lead/lead-validate-event`, `POST /lead/validate-ticket-payment`, `POST /lead/external-form`, `POST /lead/purchase-membership`

Events
- `GET /event`, `GET /event/:id`, `GET /event/:id/memberships`
- `POST /event`, `PUT /event/:id`, `DELETE /event/:id`, `POST /event/cancel`, `POST /event/stream`
- `GET /event/server-time`

Bookings
- `POST /booking`, `GET /booking/lead/:lead_id`

Memberships
- `GET /membership`, `GET /membership/:id`, `GET /membership/:id/dates-for-plan`
- `POST /membership`, `PUT /membership/:id`, `DELETE /membership/:id`, `DELETE /membership/:id/dates/:dateId`

Business
- `GET /business/my`, `POST /business/my`, `POST /business/logo`
- `GET /business` (admin: list all)

Contacts (CRM)
- `POST /contact/login`, `GET /contact/me`, `GET /contact/payment-methods`
- `POST /contact/send-token`, `POST /contact/verify-registration`
- `POST /contact/request-reset-password`, `POST /contact/reset-password`, `POST /contact/reset-password-in-app`
- `PUT /contact/details`

Teams
- `POST /team/create`, `POST /team/invite`, `POST /team/revoke-access`
- `GET /team/dashboard`, `GET /team/invitations`, `GET /team/my-invitations`, `GET /team/my-teams`, `GET /team/my-team/members`
- `POST /team/invitations/:id/accept`, `POST /team/invitations/:id/reject`, `DELETE /team/invitations/:id`

Callbacks
- `POST /callback`, `GET /callback/:id`, `GET /callback/lead/:leadId`, `GET /callback/uncalled`, `GET /callback/scheduled`
- `PUT /callback/:id`, `DELETE /callback/:id`, `POST /callback/:id/called`

Email & Bulk Email
- Bulk: `POST /email`, `POST /email/toggle`, `GET /email`, `GET /email/:id`, `PUT /email/:id`, `DELETE /email/:id`
- Follow-up: `POST /email/follow-up`, `GET /email/follow-up`, `PUT /email/follow-up/:id`, `DELETE /email/follow-up/:id`
- Triggers: `GET /email/trigger/countdown`, `GET /email/trigger/final-reminder`, `GET /email/trigger/event-day`, `GET /email/trigger/thank-you`

Google Auth
- `GET /user/auth/google`, `GET /user/auth/google/callback`

Admin
- `GET /admin/users`, `GET /admin/user/:id`, `POST /admin/user`, `PUT /admin/user/:id`, `DELETE /admin/user/:id`
- `GET /admin/leads`, `GET /admin/events`

Assets
- `POST /asset`, `GET /asset`, `GET /asset/:id`, `PUT /asset/:id/rename`, `DELETE /asset/:id`
- Multipart: `POST /asset/multipart`, `POST /asset/:id/complete`, `POST /asset/:id/start-hls-conversion`
- Webhook: `POST /asset/hls-conversion-webhook`

Stripe & Subscriptions
- Connect OAuth: `GET /stripe/connect/oauth`, `GET /stripe/connect/oauth/callback`, `GET /stripe/connect/status`
- Payment methods: `GET /stripe/list/payment/methods`, product: `GET /stripe/product/:id/:priceId`
- Webhook: `POST /stripe/webhook`
- Subscriptions: `POST /subscription/subscribe`, `GET /subscription`, `DELETE /subscription`

Telemetry
- `POST /telemetry`, `POST /telemetry/watch-time`, `POST /telemetry/leave`
- `POST /telemetry/lobby-telemetry`, `POST /telemetry/lobby-telemetry/exit`
- Analytics (auth): `GET /telemetry/event/:eventId/analytics`, `GET /telemetry/event/:eventId/active`

Notifications
- `POST /notification`, `GET /notification/my`, `GET /notification/my/unread`, `GET /notification/unread-count`, CRUD by id

Click Analytics
- `POST /click`, `GET /click/event/:eventId`, `GET /click/lead/:leadId`, `GET /click/type/:type`
- `GET /click/event/:eventId/count`, `DELETE /click/event/:eventId`

---

## Notes for Developers
- Always use `serveBadRequest(c, ERRORS.X)` and related helpers for error responses
- Register the WebSocket service last in the server initialization to avoid port binding issues
- Team access middleware must wrap authenticated routes to support shared resources
- For event-linked lead creation, ensure email uniqueness per event: one email per event per lead
- Background jobs: use `sendTemplateEmail` and `sendTransactionalEmail` to queue emails; avoid blocking HTTP responses
- ICS attachments: always include in ticket emails for calendar integration
- Contact vs User: Contacts are attendees (leads who log in); Users are hosts/admins
