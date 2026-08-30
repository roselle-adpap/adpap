# ADPAP — Alliance of Data Privacy Advocates Philippines

Membership Application & Member Portal web app for the Alliance of Data Privacy
Advocates Philippines (ADPAP), initiated and supported by **GlobalKnowledge PH, Inc.**

Built with React + Vite + TypeScript + Tailwind CSS, deployable on **Netlify**,
backed by **Supabase** (Postgres + Auth + Storage) and **Resend** (email).

This README is written for a non-programmer to follow step by step. Every spot
that needs your input is marked **ADMIN SETUP REQUIRED**.

---

## 1. What you're deploying

- **Public site**: Home, About, Membership comparison, multi-step Application
  form, Membership Verification page, Privacy Notice, Terms.
- **Member Portal**: sign-in with email + membership number, view status,
  benefits, digital membership ID (with QR code), printable certificate.
- **Admin Dashboard**: review/approve/reject applications, verify payments,
  activate memberships, assign membership numbers, mark founding members,
  export members to CSV, view analytics.
- **Backend**: one Netlify Function (`submit-application`) that validates
  submissions, writes to Supabase, uploads proof-of-payment to Supabase
  Storage, and emails the Secretariat + applicant via Resend.

### Demo mode

If you deploy the frontend without configuring Supabase, the app still fully
works using your browser's local storage as a stand-in database, so you can
click through the entire experience (apply → admin approves → member logs in)
before wiring up the real backend. Look for the "Demo mode" notices in the UI.
**No emails are sent in demo mode.**

---

## 2. Prerequisites

- A [GitHub](https://github.com) account (to hold the code)
- A [Netlify](https://netlify.com) account (free tier is fine to start)
- A [Supabase](https://supabase.com) account (free tier is fine to start)
- A [Resend](https://resend.com) account (free tier is fine to start) and a
  domain you can verify for sending email (or use Resend's test domain while
  developing)

---

## 3. Set up Supabase (the database)

1. Go to [supabase.com](https://supabase.com) → **New project**. Choose a
   name (e.g. `adpap`), a strong database password (save it somewhere safe),
   and a region close to the Philippines (e.g. Singapore).
2. Once the project is ready, open **SQL Editor** → **New query**.
3. Open `supabase/schema.sql` from this project, copy its entire contents,
   paste into the SQL Editor, and click **Run**. This creates all tables,
   security rules, the public verification view, and the private storage
   bucket for proof-of-payment files.
4. Add your first administrator:
   - Go to **Authentication → Users → Add user** and create a user with your
     Secretariat email and a password (or send a magic link/invite).
   - Go back to **SQL Editor** and run:
     ```sql
     insert into admin_users (email, full_name, role)
     values ('you@gkphilippines.com', 'Your Name', 'superadmin');
     ```
     Use the **same email** you just created in Authentication.
5. Collect your keys from **Project Settings → API**:
   - **Project URL** → you'll use this as `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
     never put it in frontend code or commit it to GitHub)

---

## 4. Set up Resend (email)

1. Sign up at [resend.com](https://resend.com).
2. Add and verify a sending domain (**Domains → Add Domain**, then add the
   DNS records it gives you at your domain registrar). While testing, you can
   send from Resend's shared test domain, but production emails to real
   applicants should come from a verified domain you control.
3. Go to **API Keys → Create API Key** → copy it. This is `RESEND_API_KEY`.
4. Decide your "from" address, e.g.
   `ADPAP Secretariat <noreply@gkphilippines.com>`. This is `RESEND_FROM_EMAIL`.

---

## 5. Push this project to GitHub

1. Create a new empty repository on GitHub (e.g. `adpap-membership-app`).
2. From this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial ADPAP membership app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/adpap-membership-app.git
   git push -u origin main
   ```

---

## 6. Deploy to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import
   an existing project** → connect GitHub → choose your repository.
2. Build settings should auto-detect from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. **Before the first deploy** (or right after, then redeploy), go to
   **Site settings → Environment variables** and add:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your Supabase anon public key |
   | `SUPABASE_URL` | same Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service_role key |
   | `RESEND_API_KEY` | your Resend API key |
   | `RESEND_FROM_EMAIL` | your verified "from" address |
   | `SECRETARIAT_EMAIL` | `secretariat@gkphilippines.com,roselle@gkphilippines.com` (comma-separated; or leave unset — this is the default) |

4. Click **Deploy site**. Netlify will build and give you a live URL (you can
   later add a custom domain under **Domain settings**).
5. Trigger a redeploy after adding environment variables if you added them
   after the first build (**Deploys → Trigger deploy → Clear cache and
   deploy site**).

---

## 7. Try it end to end

1. Visit your live site → **Apply** → complete an Individual application with
   a test proof-of-payment file → submit.
2. Check the Secretariat inbox (`SECRETARIAT_EMAIL`) and the applicant email
   you used — both should receive emails within a few seconds.
3. In Supabase → **Table Editor → applications**, confirm the row was
   created with `status = submitted`.
4. Go to `/admin-login` on your site, sign in with the admin email/password
   you created in Supabase Auth.
5. Open the application, click **Approve & Assign Membership No.**, then
   **Activate Membership**. This creates a row in **members**.
6. Go to `/member-login`, sign in with the applicant's email + the assigned
   membership number, and confirm the Member Portal shows the right status,
   benefits, digital ID, and certificate.
7. Go to `/verify`, enter the membership number, and confirm only the public
   fields (name, number, category, status, validity) are shown.

**If you see "The server is not fully configured yet (missing SUPABASE_URL /
SUPABASE_SERVICE_ROLE_KEY environment variables)"** when submitting an
application: this means step 6's environment variables haven't been added to
Netlify yet (or a deploy hasn't run since adding them). Nothing was saved or
emailed for that submission — go to Site settings → Environment variables,
confirm `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are both set, then
trigger a redeploy (Deploys → Trigger deploy → Clear cache and deploy site).

---

## 8. Local development

```bash
npm install
cp .env.example .env
# Fill in at least VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY,
# or leave them blank to use demo mode.
npm run dev
```

To test the Netlify Function locally too (so the real submit-application
backend runs instead of demo mode), install the Netlify CLI and run:

```bash
npm install -g netlify-cli
netlify dev
```

`netlify dev` reads the same `.env` file and proxies `/.netlify/functions/*`
to your local function code.

---

## 9. Where to configure payment instructions

Open `src/data/paymentConfig.ts`. Each payment method (`bank_transfer`,
`gcash`, `maya`) is disabled by default with blank fields, marked **ADMIN
SETUP REQUIRED**. Fill in the real account details and set `enabled: true`
once GlobalKnowledge PH finalizes them. Until you do this, applicants correctly
see "Payment Instructions will be provided by the ADPAP Secretariat" instead
of placeholder banking details.

---

## 10. Project structure

```
adpap-app/
├─ src/
│  ├─ pages/                 # Route-level pages (Home, About, Apply, Admin, ...)
│  ├─ components/            # Reusable UI (Navbar, Footer, form fields, cards)
│  │  ├─ apply/               # Multi-step application form steps
│  │  └─ admin/                # Admin dashboard pieces
│  ├─ context/AuthContext.tsx # Member + admin session state
│  ├─ data/                   # Membership plans & payment config (edit here)
│  ├─ lib/                    # Supabase client, validation, admin data layer
│  └─ types/                  # Shared TypeScript types
├─ netlify/functions/
│  └─ submit-application.ts   # Validates, saves, uploads file, sends emails
├─ supabase/schema.sql        # Full database schema + RLS policies
├─ netlify.toml
├─ .env.example
└─ README.md                  # You are here
```

---

## 11. Security notes

- The Supabase **anon key** is safe to ship to the browser because every
  table has Row Level Security enabled — the public can only read the
  `public_members` view (name, membership number, category, status,
  validity) and cannot read or write applicant PII directly.
- The Supabase **service_role key** and **Resend API key** live only in
  Netlify's server-side environment variables and are used only inside
  `netlify/functions/submit-application.ts`. They are never sent to the
  browser.
- Application submissions are always validated again on the server
  (`netlify/functions/submit-application.ts`) — never trust client-side
  validation alone.
- Proof-of-payment files are stored in a **private** Supabase Storage bucket;
  the Admin Dashboard views them via short-lived signed URLs, not public
  links.
- File uploads are restricted to JPG/JPEG/PNG/PDF and 5MB in the browser;
  consider also setting a bucket-level size limit in Supabase Storage
  settings for defense in depth.
- Admin access requires both a Supabase Auth account **and** a matching row
  in `admin_users` — creating an Auth user alone does not grant access.

---

## 12. Extending the app later

The schema and code are intentionally structured so the following can be
added without a rewrite: Officer Elections & Online Voting, Event/Convention
Registration, a member-only video library, a Member Directory, Committees/
Chapters, CPD & training history tracking, a referral system, a merchandise
store, and automated renewal-reminder emails (60/30/7 days before expiry —
the `renewals` table already has a `status` column with `reminder_60` /
`reminder_30` / `reminder_7` states ready for a scheduled Netlify Function).

---

## 13. Support

For questions about this deployment, contact the developer who set it up. For
ADPAP membership questions, the in-app contact is always
**secretariat@gkphilippines.com**.
