# Glama Hair & Beauty Studio — Luxury Salon Operating System

A complete, production-grade luxury salon platform inspired by the editorial art direction of the **Glama Hair & Beauty Studio** design. Built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS v4**, **Supabase PostgreSQL & Auth**, **Framer Motion**, and the official **Meta WhatsApp Business Platform Cloud API**.

---

## 🌟 Key Features

### 1. High-Fashion Public Customer Website
- **Editorial Hero Section**: Matches the Glama reference composition with Cormorant Garamond headlines, fluid italic accents, handwritten script annotations (*"Beauty Looks Good on You ♡"*), pill action buttons, overlapping client trust avatars, and a 4.9/5 star verified badge.
- **Trust & Benefits Strip**: 4 signature pillars (Premium Products, Expert Stylists, Hygienic & Safe, Relaxing Atmosphere) with soft blush circular icons.
- **"Complete Beauty Care Under One Roof"**: 6 photographic category cards (Hair Services, Skin Care, Makeup, Nail Care, Beauty Treatments, Bridal Packages) with hover zoom and exploratory links.
- **Split "About Us" Experience**: Salon interior architecture photography, play video trigger modal, feature check badges, and stats card (10+ Years, 5,000+ Clients, 20+ Experts).
- **"Real Transformations" Gallery**: Category filter tabs (All, Hair, Makeup, Nails, Skin Care, Bridal), responsive grid, and interactive Before/After comparison viewer.
- **"What Our Clients Say"**: Testimonials with carousel navigation, 5 gold stars, client portraits, and verified service badges.
- **Dark Espresso Booking CTA Banner**: Full-width `#201817` section with beauty portrait and floating white info card (flexible scheduling, 123 Beauty Street NY, phone).
- **Multi-Column Editorial Footer**: Complete links, operating hours, social handles, and legal disclosures.
- **Dedicated Sub-Pages**: `/about`, `/services`, `/gallery`, `/pricing`, `/blog`, `/blog/[slug]`, `/contact`, `/privacy`, `/terms`.

### 2. Multi-Step Customer Booking Engine (`/book`)
- **Step 1 — Service Selection**: Choose treatments, inspect duration and price, select optional add-ons (e.g. Deep Conditioning Moisture Mask, Olaplex Bond Protection).
- **Step 2 — Stylist Selection**: Choose a specific specialist or select *"Any Available Stylist"* for maximum schedule flexibility.
- **Step 3 — Date Selection**: Real-time calendar matching salon operating hours and specialist shifts.
- **Step 4 — Live Dynamic Time Slots**: Calculated dynamically to account for salon opening hours, lunch breaks (13:00–14:00), specialist shifts, buffers, and existing appointments to strictly prevent overlapping bookings.
- **Step 5 — Contact & Explicit WhatsApp Consent**: Collects name, phone, email, notes, and an explicit opt-in checkbox for automated WhatsApp updates.
- **Step 6 — Review & Payment Options**: Review booking snapshot, total amount, and choose between *Pay at Salon* (Cash/UPI/Card) or *Pay Deposit Online*.
- **Step 7 — Instant Confirmation & Reference Receipt**: Generates unique `GLM-YYYYMMDD-XXXX` reference code, confetti celebration, and dispatches automated confirmation.

### 3. Owner-Only Admin CMS (`/admin`)
- **Executive KPI Dashboard**: Today's bookings, upcoming appointments, completed count, revenue collected, outstanding balances, repeat customer rate, cancellation rate, and WhatsApp queue.
- **Appointment Calendar (`/admin/calendar`)**: Day/week/month filters, stylist selector, status transition controls (Pending -> Confirmed -> Completed -> Cancelled).
- **Customer CRM (`/admin/customers`)**: Searchable client database, visit histories, lifetime spend, specialist formulas/notes, and WhatsApp consent compliance. Immediate enforcement of client STOP/opt-out requests.
- **Services & Menu Manager (`/admin/services`)**: Full CRUD for services, categories, prices, durations, cover images, add-ons, and the critical **`is_haircut`** flag.
- **Staff & Shift Manager (`/admin/staff`)**: Specialist profiles, biographies, photos, rating stats, and shift hours.
- **Website CMS Editor (`/admin/cms`)**: Live editor for salon name (renamable with 0 code changes), tagline, contact numbers, address, hours, deposit rate, and haircut reminder delay. Changes reflect live on the public site immediately.
- **Payments & Billing (`/admin/payments`)**: Ledger tracking cash, UPI, card, and online deposits. Includes a printable salon receipt generator.
- **Inventory & Expenses (`/admin/inventory`)**: Backbar and retail product stock levels with automated low-stock warnings, unit costs, and operational expense logs.
- **WhatsApp Cloud API Automation Center (`/admin/whatsapp`)**: Complete monitoring station for scheduled reminder jobs, manual trigger/retry actions, template previews, and Meta Cloud API status.
- **Reports & Financial Analytics (`/admin/reports`)**: Gross revenue, expenses, net salon profit, service popularity rankings, and specialist productivity.

### 4. Automated WhatsApp CRM & 30-Day Haircut Reminders
- Built for the official **Meta WhatsApp Business Platform Cloud API**.
- **Automated 30-Day Haircut Reminder Workflow**:
  1. An appointment flagged as a haircut (`is_haircut = true`) is marked `completed`.
  2. The system checks customer's explicit WhatsApp consent (`whatsapp_consent = true` and `whatsapp_opt_out = false`).
  3. A scheduled job is inserted into `reminder_jobs` set for 30 days later (configurable by salon owner).
  4. Scheduled cron worker (`/api/cron/reminders`) processes due jobs, rechecks opt-out status immediately before dispatch, and sends the pre-approved template:
     > *"Hey {{customer_name}}! ✨ It's been about a month since your last haircut at {{salon_name}}. Ready for a fresh look? Book your next appointment here: {{booking_url}}"*
  5. Stores Meta message ID, status, and delivery logs.
  6. Incoming webhook endpoint (`/api/whatsapp/webhook`) automatically parses "STOP" or "UNSUBSCRIBE" messages to suppress future marketing.
  7. Safe simulation/test mode when Meta credentials have not yet been provided, with clear UI indicators and zero fake delivery claims.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS v4 with custom luxury beauty theme |
| **Animation** | Framer Motion & Canvas Confetti |
| **Icons** | Lucide React |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security, Triggers & Extensions) |
| **Storage** | Supabase Storage (Public & Private buckets) |
| **Messaging** | Official WhatsApp Business Platform Cloud API (Meta Graph API v21.0) |
| **Deployment** | Vercel & Supabase Cloud |

---

## 📁 Project Architecture

```
solon/
├── public/                     # Static media & reference assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Glama Luxury Landing Page
│   │   ├── about/              # Brand Heritage & Philosophy
│   │   ├── services/           # Full Service Catalog & Filters
│   │   ├── gallery/            # Transformations Portfolio
│   │   ├── pricing/            # Luxury Packages & Investment
│   │   ├── blog/               # Beauty Journal & Editorial Guides
│   │   │   └── [slug]/         # Individual Article View
│   │   ├── contact/            # Map, Hours & Inquiries
│   │   ├── book/               # 7-Step Online Booking Wizard
│   │   ├── privacy/            # WhatsApp & Data Disclosures
│   │   ├── terms/              # Booking & Cancellation Policies
│   │   ├── admin/              # Owner-Only Studio Management OS
│   │   │   ├── layout.tsx      # Admin Shell (Sidebar + Top Bar)
│   │   │   ├── page.tsx        # Executive KPI Dashboard
│   │   │   ├── calendar/       # Dispatch & Booking Calendar
│   │   │   ├── customers/      # Customer CRM & Consent Compliance
│   │   │   ├── services/       # Service CRUD & Haircut Flagging
│   │   │   ├── staff/          # Specialist Rosters & Shifts
│   │   │   ├── cms/            # Website Brand & Content Live Editor
│   │   │   ├── payments/       # Ledger, Cash/UPI & Printable Receipts
│   │   │   ├── inventory/      # Products, Low-Stock & Expenses
│   │   │   ├── whatsapp/       # WhatsApp Cloud API Automation Center
│   │   │   └── reports/        # Financial & Popularity Analytics
│   │   └── api/                # Production Route Handlers
│   │       ├── booking/        # Transactional Booking Endpoint
│   │       ├── booking/slots/  # Dynamic Availability Engine
│   │       ├── whatsapp/send/  # Meta Cloud API Message Dispatcher
│   │       ├── whatsapp/webhook/# Meta Verification & Opt-Out Listener
│   │       └── cron/reminders/ # Scheduled Job Execution Worker
│   ├── components/
│   │   ├── public/             # Public Site Components (Hero, Navbar, etc.)
│   │   ├── booking/            # Booking Wizard Step Components
│   │   └── admin/              # Admin Components (Sidebar, Header, etc.)
│   ├── lib/
│   │   ├── supabase/           # Browser, Server & Admin Supabase Clients
│   │   ├── booking/            # Slot Calculations & Conflict Prevention
│   │   ├── whatsapp/           # Cloud API, Templates & Schedulers
│   │   ├── data-store.ts       # Unified Storage & Real-Time Sync Layer
│   │   ├── mock-data.ts        # Authentic Initial Glama Dataset
│   │   └── utils.ts            # Formatting & Helper Utilities
│   └── types/                  # Database, CRM & Booking Type Definitions
├── supabase/
│   ├── migrations/             # 20261027000000_initial_glama_schema.sql (All 24+ tables & RLS)
│   └── seed.sql                # Rich Glama Initial Database Seed
├── .env.example                # Environment Variable Reference
└── package.json                # Dependencies & Build Scripts
```

---

## 🚀 Quickstart & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website.  
Access the Owner Admin CMS at [http://localhost:3000/admin](http://localhost:3000/admin).

### 4. Run Production Build & Linting
```bash
npm run build
npm run lint
```

---

## 🗄️ Supabase Database Migration

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run `supabase/migrations/20261027000000_initial_glama_schema.sql`.
   This creates:
   - 24+ relational tables (`salon_settings`, `profiles`, `services`, `service_categories`, `stylists`, `customers`, `appointments`, `payments`, `expenses`, `inventory_products`, `reminder_jobs`, etc.)
   - PostgreSQL function `check_appointment_collision` to prevent double-bookings.
   - Database trigger `trg_haircut_completion_reminder` to automatically schedule 30-day haircut reminders upon appointment completion.
   - Row Level Security (RLS) policies protecting customer data, financial records, and owner settings.
3. Run `supabase/seed.sql` to populate the initial Glama salon data.
4. Copy your Supabase Project URL and Anon Key into `.env.local`.

---

## 💬 WhatsApp Business Cloud API Setup

1. In [Meta for Developers](https://developers.facebook.com), create a Business App and add WhatsApp.
2. Under **WhatsApp > API Setup**, copy:
   - Temporary or Permanent System User Access Token (`WHATSAPP_ACCESS_TOKEN`)
   - Phone Number ID (`WHATSAPP_PHONE_NUMBER_ID`)
   - WhatsApp Business Account ID (`WHATSAPP_BUSINESS_ACCOUNT_ID`)
3. Under **Configuration > Webhook**:
   - Set Callback URL: `https://your-domain.com/api/whatsapp/webhook`
   - Set Verify Token: matches `WHATSAPP_WEBHOOK_VERIFY_TOKEN` (default: `glama_webhook_secret_2026`)
   - Subscribe to `messages` field to capture user replies and opt-outs (`STOP`).
4. Register the approved template `glama_haircut_30d_reminder` in WhatsApp Manager with body:
   `Hey {{1}}! ✨ It's been about a month since your last haircut at {{2}}. Ready for a fresh look? Book your next appointment here: {{3}}`

---

## 🚢 Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables from `.env.example` in Vercel Project Settings.
4. Set up a Cron Job in `vercel.json` or Supabase `pg_cron` to trigger `/api/cron/reminders` every hour:
```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```
5. Deploy!
