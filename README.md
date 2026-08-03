# Soul Hues — Full-Stack Jewellery Storefront + Admin CMS

A premium jewellery brand website for **Soul Hues** by Shivani, built as
a full-stack Next.js 15 e-commerce application: a public storefront
with cart, guest checkout, Razorpay payments, and order tracking,
backed by a MongoDB-driven admin panel for managing products,
categories, orders, and site settings — no code changes needed to run
the business day to day.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS ·
MongoDB Atlas · Mongoose · Cloudinary · Razorpay · Nodemailer ·
React Hook Form · Zod · Framer Motion

---

## ⚠️ Before you start: a note on how this was built

Earlier phases of this project were written in a sandbox where
`npm install` was blocked. For this e-commerce phase (cart, checkout,
Razorpay, orders, email), `npm install` **did** succeed, and every file
— old and new — passes a real `npx tsc --noEmit` against the actual
installed library types, with zero errors. That's a meaningfully higher
bar than a syntax-only check.

What's still **not** verified, because it needs real credentials and a
running server neither of which exist in this sandbox:
- A real `next build` / `next dev` (blocked here only because Google
  Fonts couldn't be reached to fetch font metadata — not a code issue)
- An actual Razorpay test payment end to end
- An actual email actually arriving via your SMTP provider
- MongoDB writes against a live cluster

Run through one full test purchase yourself (step 1.8 below) before
trusting this in production — same advice as always, just with a
stronger starting point this time.

---

## 1. Setup

### 1.1 Install dependencies
```bash
npm install
```

### 1.2 Set up MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user (Database Access → Add New Database User).
3. Allow network access: for local dev, add your IP; for deploying to
   Vercel/Netlify, add `0.0.0.0/0` (Network Access → Add IP Address) since
   serverless functions don't have a fixed IP.
4. Copy your connection string (Connect → Drivers) — it looks like
   `mongodb+srv://user:pass@cluster.mongodb.net/`.

### 1.3 Set up Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy your **Cloud Name**, **API Key**, and
   **API Secret**.

### 1.4 Set up Razorpay (payments)
1. Create an account at [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Go to **Settings → API Keys** and generate a **Test Mode** key pair
   first (prefixed `rzp_test_...`) — use this while developing so you
   never touch real money. Switch to the **Live Mode** tab for
   production keys once you're ready to go live; the code doesn't
   change, just which keys are in `.env.local`.
3. Razorpay's test mode gives you dummy card numbers for end-to-end
   testing without a real payment: [test card details](https://razorpay.com/docs/payments/payments/test-card-upi-details/).

### 1.5 Set up email (order/payment/shipping/delivery notifications)
Any SMTP provider works. The quickest for testing is Gmail:
1. Turn on 2-Step Verification on your Google account.
2. Create an **App Password** (Google Account → Security → App
   Passwords) — use this, not your real Gmail password.
3. Use `smtp.gmail.com`, port `587`.

For production, a dedicated transactional provider (SendGrid, AWS SES,
Postmark, Mailgun) is more reliable than a personal Gmail account —
same `SMTP_*` variables, different host/credentials.

> If you skip this step, checkout and order management still work
> fully — emails are just skipped with a logged warning instead of
> sent. Nothing breaks.

### 1.6 Configure environment variables
```bash
cp .env.local.example .env.local
```
Then fill in every value in `.env.local`:

| Variable | Where it comes from |
|---|---|
| `MONGODB_URI` | Step 1.2, include a database name in the path, e.g. `/soulhues?retryWrites=true&w=majority` |
| `JWT_SECRET` | Generate with `openssl rand -base64 48` |
| `ADMIN_EMAIL` | Whatever email you want to log in with |
| `ADMIN_PASSWORD_HASH` | Run `npm run hash-password -- "your-chosen-password"` and paste the output |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Step 1.3 |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Step 1.4 — the public var must match `RAZORPAY_KEY_ID` exactly |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `EMAIL_FROM_NAME` | Step 1.5 |
| `WHATSAPP_CLOUD_API_TOKEN` / `WHATSAPP_CLOUD_API_PHONE_NUMBER_ID` | Optional — see §4 below |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev; your real domain in production |

**Never commit `.env.local`** — it's already gitignored.

### 1.7 Seed the database
This migrates the site's original product/category catalog into
MongoDB so it isn't empty on first run:
```bash
npm run seed
```
Safe to re-run — it skips anything that already exists.

> The seeded product images point at the site's existing local image
> files (real photos + SVG placeholders), not Cloudinary. They'll
> display correctly, but if you try to *delete* one via the admin image
> uploader, the "delete from Cloudinary" call will just silently no-op
> (there's nothing there to delete). Re-upload a real photo through the
> admin panel whenever you're ready to replace a seeded image with one
> properly hosted on Cloudinary.

### 1.8 Run it
```bash
npm run dev
```
- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (use the email/password from step 1.6)
- Test a full purchase with a [Razorpay test card](https://razorpay.com/docs/payments/payments/test-card-upi-details/) to confirm checkout → payment → order confirmation works end to end.

---

## 2. Admin panel

| Page | What it does |
|---|---|
| `/admin/login` | JWT-based login, HttpOnly session cookie |
| `/admin/dashboard` | Today's Orders, Pending Orders, Revenue, Monthly Revenue, recent orders, plus the original product counts and recent products |
| `/admin/products` | Search, quick-toggle Featured/Bestseller/New Arrival/Visible, edit/duplicate/delete |
| `/admin/products/new`, `/admin/products/[id]/edit` | Full form: images (drag-drop upload, drag-to-reorder, delete), all fields, all toggles |
| `/admin/orders` | Search, filter by order/payment status, sort, pagination |
| `/admin/orders/[id]` | Customer/shipping/payment details, ordered products, status action buttons, courier/tracking fields, full status timeline |
| `/admin/categories` | Create/edit/delete categories (blocks deleting a category still in use) |
| `/admin/settings` | Store name, WhatsApp number/message, Instagram, logo, hero banner, footer — all reflected live on the site immediately |

Every mutating admin action is protected two ways: `middleware.ts`
blocks unauthenticated requests to `/admin/*` and `/api/admin/*`, and
each API route independently re-checks the session (`requireAdmin()`)
as defense-in-depth.

### Changing your password later
Generate a new hash with `npm run hash-password -- "new-password"` and
update `ADMIN_PASSWORD_HASH` in `.env.local` (and in your hosting
provider's environment variables if deployed).

---

## 3. Shopping cart, checkout & payments

### Cart
- `lib/cart-context.tsx` — client-side cart state, persisted to
  `localStorage` so it survives refreshes/tab closes. Add to Cart
  buttons live on product cards, Quick View, and the product detail
  page (right alongside the original "Order on WhatsApp" button — both
  still work, side by side).
- Slide-out mini cart (opens automatically when you add an item) +
  full `/cart` page, both with quantity controls and item removal.
- Shipping is a simple placeholder rule in `lib/cart-context.tsx`
  (free above ₹999, flat ₹79 otherwise) — change `FREE_SHIPPING_THRESHOLD`
  / `FLAT_SHIPPING_RATE` there. Tax is `0` by default (`TAX_RATE`) —
  wire in a real rate once the business registers for GST.

### Checkout
`/checkout` — no account required. Name, phone, email, address, city,
state, PIN, country, and optional order notes, all Zod-validated
(`lib/validations/checkout.ts`).

**Prices are never trusted from the browser.** `/api/checkout/create-order`
re-fetches every product's real price and stock status from MongoDB
before creating the Razorpay order — tampering with the cart in
devtools can't change what you actually get charged.

### Payments (Razorpay)
1. Customer submits the checkout form → `/api/checkout/create-order`
   creates a Razorpay order + a `pending` Order document.
2. Razorpay's checkout widget opens client-side (loaded on demand from
   `checkout.razorpay.com`, not on every page load).
3. On success, `/api/checkout/verify-payment` verifies the payment
   signature **server-side** using HMAC SHA-256 against your API
   secret (`lib/razorpay.ts`) — this is what actually proves a payment
   is genuine; the client's "it succeeded" event alone is never
   trusted, since that's trivial to fake from the browser.
4. Valid signature → order marked `paid`/`confirmed`, confirmation +
   payment emails sent, store notified on WhatsApp.
   Invalid/failed → customer lands on `/order/failed`.

---

## 4. Orders, tracking & notifications

### Order status flow
`lib/order-status.ts` is the single source of truth, used by the Order
model, the admin action buttons, and the customer timeline:

```
Pending → Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered
                                    (or, from most points: Cancelled / Refunded)
```

### Customer Track Order (`/track-order`)
No login — enter the order number + the phone number used at checkout.
Shows the live status timeline and courier/tracking info if the admin
has added it.

### Emails
`lib/email/` — order confirmation, payment confirmation, shipping
notification, and delivery notification, sent automatically at the
right point in the flow (payment verification, and when the admin
moves an order to Shipped/Delivered). Uses Nodemailer, so any SMTP
provider works (see §1.5). If email isn't configured, sending is
skipped with a logged warning — checkout and order management still
work fully either way.

### WhatsApp order notifications
`lib/whatsapp-notify.ts` — when an order is paid, the store is notified
with the order number, customer name, total, and items, per spec.

**Important caveat:** truly automatic background sending (no tap
required) needs Meta's WhatsApp Business Cloud API, which requires a
verified WhatsApp Business Account — not something that can be
provisioned without your real business credentials. Without
`WHATSAPP_CLOUD_API_TOKEN` / `WHATSAPP_CLOUD_API_PHONE_NUMBER_ID`
configured, the system falls back to generating a ready-to-tap `wa.me`
link instead (same pattern the rest of the site already uses for
WhatsApp ordering). Set those two env vars once you have Cloud API
access to switch to fully automatic sending — no code changes needed.

---

## 5. How the data flows

- **MongoDB is the source of truth** for products, categories, and
  settings. Nothing product-related is hardcoded anymore.
- `data/*.json` (products, categories, testimonials, faqs, reels) still
  exist in the repo, but only as **seed source data** for `npm run
  seed` — the live site never reads them directly. (Testimonials, FAQs,
  and Reels weren't part of the original CMS spec, so those three stay
  static JSON for now; ask if you'd like them moved into MongoDB too.)
- `lib/data/*.ts` — server-side fetchers used directly by Server
  Components (homepage sections, the product detail page, the sitemap).
- `lib/settings-context.tsx` / `lib/categories-context.tsx` — the
  Settings and Categories documents are fetched once in
  `app/(site)/layout.tsx` and shared via React Context, so client
  components (Navbar, Footer, WhatsApp buttons, product cards) don't
  each fetch independently.
- `app/api/products`, `/api/categories`, `/api/settings` — public,
  read-only, used by client-side search/filter/pagination.
- `app/api/admin/*` — authenticated, used by the admin panel for all
  writes.

### Route structure
```
app/
  layout.tsx              Root HTML shell (fonts, global metadata)
  (site)/                 Public storefront — its own layout with
    layout.tsx             navbar/footer/WhatsApp button/mini cart, so
    page.tsx                the admin panel doesn't inherit any of it
    about/, contact/
    products/page.tsx      Search, filter, pagination
    products/[slug]/       Product detail: gallery, zoom, related
                            products, dynamic SEO
    cart/, checkout/       Cart page, guest checkout + Razorpay
    order/success/[orderNumber]/, order/failed/
    track-order/           Order number + phone lookup, no login
  admin/
    login/                 No sidebar chrome
    (dashboard)/           Sidebar-wrapped: dashboard, products,
                            orders, categories, settings
  api/
    products/, categories/, settings/    Public GET endpoints
    checkout/, track-order/              Public checkout + tracking
    admin/                                Authenticated CRUD + upload
    auth/                                 login/logout
```

---

## 6. Search, filtering, and pagination

`/products` fetches from `/api/products` with query params:
- `q` — full-text search (title + description)
- `category` — category slug
- `featured=true` / `bestseller=true` / `newArrival=true`
- `page`, `limit` (default 12/page, max 48)

The homepage's Best Sellers / New Arrivals sections query MongoDB
directly (Server Components), so they're always in sync with whatever's
toggled in the admin panel — no caching to invalidate.

---

## 7. SEO & performance

- `app/sitemap.ts` — dynamic, includes every visible product and
  category from MongoDB (falls back to static routes only if the DB is
  unreachable at build time).
- `app/robots.ts` — allows the storefront, blocks `/admin` and `/api`.
- Every product detail page has its own `generateMetadata` (title,
  description, Open Graph image) plus `Product` JSON-LD.
- `app/products/[slug]/loading.tsx` — skeleton shown while a product
  page's DB query resolves.
- `ProductExplorer` shows skeleton cards during search/filter/pagination
  fetches.
- Cloudinary images are served through `next/image` (`res.cloudinary.com`
  is allow-listed in `next.config.mjs`) for automatic format/size
  optimization.

---

## 8. Design (unchanged from the static build)

The redesign work from earlier in this project — the sage green +
off-white palette, Playfair Display/Poppins typography, animations,
the real Instagram photos, the corner-frame motif — is untouched. See
git history / prior conversation for that design system's rationale.
Only the **data layer** changed: everything that used to come from
`data/*.json` now comes from MongoDB, editable through `/admin`.

---

## 9. Deployment (Vercel or Netlify)

1. Push to a Git repository.
2. Import the repo into Vercel or Netlify.
3. Add every variable from `.env.local` to the platform's environment
   variables UI (never commit them).
4. Set `NEXT_PUBLIC_SITE_URL` to your real production domain.
5. Switch `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` /
   `NEXT_PUBLIC_RAZORPAY_KEY_ID` to your **Live Mode** keys once you're
   ready to accept real payments — test mode keys will decline real
   cards.
6. In MongoDB Atlas → Network Access, allow `0.0.0.0/0` (serverless
   functions don't have a static IP).
7. Deploy. Run `npm run seed` once, pointed at your production
   `MONGODB_URI`, to populate the live database (or just start fresh
   from the empty admin panel).

---

## 10. Known limitations / things to double-check

- **Type-checked, not runtime-tested** — see the note at the top of
  this file. Do one full test purchase before going live.
- **Single admin account**, via env vars — no multi-user admin, roles,
  or password-reset flow. Fine for a one-person studio; say the word if
  you need more.
- **Image reorder on category/settings uploads**: the shared
  `ImageUploader` component supports multi-image drag-reorder for
  products; category/logo/hero-banner uploads reuse it in
  single-image mode, so multi-select there only keeps the last file.
- **Testimonials, FAQs, and Featured Reels remain static JSON** — not
  part of the original CMS field list, so they weren't moved into
  MongoDB. Easy to add later if wanted.
- **WhatsApp order notification** is a tap-to-send link by default, not
  a fully automatic background send — see §4 for why, and how to
  upgrade to automatic sending later.
- **Order History page** (customers viewing all their past orders) was
  explicitly marked optional/future in the spec, so it wasn't built.
  Track Order (order number + phone) covers the "check on my order"
  need without requiring accounts.
- **Product card / Quick View WhatsApp button** is now a compact icon
  button (not full-width text) to make room for the new Add to Cart
  button — same link, same destination, just more compact. The full
  product detail page still has a full-size "Order Directly on
  WhatsApp" button.
- **Currency is hardcoded to INR** (₹) throughout — matches the
  existing site, but worth knowing if you ever need multi-currency.
