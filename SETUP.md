# Ecommerce Boilerplate — New Client Setup

A fully functional Next.js + Express ecommerce platform. Follow these steps for each new client.

---

## 1. Brand config (5 minutes)

Edit `brand.config.js` in the project root:

```js
storeName: "Client Store Name",
tagline: "Their tagline",
domain: "theirdomain.co.za",
contact: { phone: "+27 ...", email: "info@..." },
social: [{ href: "https://instagram.com/...", label: "Instagram", icon: "instagram" }],
eft: { bank: "FNB", accountName: "...", accountNumber: "...", branchCode: "..." },
```

Place the client's logo at `/public/images/logo.png` and update `brand.logo` if using a different filename.

---

## 2. Environment variables

**Frontend** — copy `.env.local.example` → `.env.local` and set:
```
BACKEND_URL=http://localhost:5001
```

**Backend** — copy `backend/.env.example` → `backend/.env` and fill in:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — random 64-char string
- `FRONTEND_URL` / `BACKEND_URL` — deployment URLs
- `STORE_NAME` — displayed in email templates
- `CLOUDINARY_*` — Cloudinary credentials
- `EMAIL_*` — SMTP credentials
- `ADMIN_EMAIL` — where new order notifications go
- `PAYFAST_*` — PayFast credentials (keep `PAYFAST_SANDBOX=true` until go-live)

---

## 3. Install and run

```bash
# Frontend
npm install
npm run dev          # http://localhost:3000

# Backend
cd backend
npm install
npm run dev          # http://localhost:5001
```

---

## 4. Create first admin user

```bash
cd backend
node scripts/promoteAdmin.js admin@example.com
```

Then log in at `/account` with that email and visit `/admin`.

---

## 5. Homepage design

`src/app/page.js` is a blank placeholder — **replace it entirely** with the client's design.

Use any of the existing components as building blocks:
- `HomepageCollections` — fetches and displays collections
- `RandomFeaturedProducts` — shows random products from shop
- `CategoryCarousel` — scrollable category row
- `GalleryCarousel` — image slideshow
- `FeaturedProductTile` — large hero product tile
- `NewsletterForm` — email capture
- `RevealOnScroll` — scroll-reveal wrapper

---

## 6. About page

`src/app/about/page.js` is a placeholder — replace with the client's brand story and visuals.

---

## 7. Custom orders images

Add the client's custom work photos to `/public/images/custom/` and list them in `src/app/custom-orders/page.js`:

```js
const customImages = [
  "/images/custom/photo1.jpg",
  "/images/custom/photo2.jpg",
];
```

---

## 8. Go-live checklist

- [ ] `PAYFAST_SANDBOX=false` in Railway/backend env vars
- [ ] Real bank account details set in `brand.config.js` → `eft`
- [ ] `BACKEND_URL` set to public Railway URL (for PayFast notify_url)
- [ ] `FRONTEND_URL` set to production domain
- [ ] DNS pointed to Netlify / Railway
- [ ] Send a test order end-to-end (card + EFT)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | Express 5, Node.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcryptjs |
| Images | Cloudinary |
| Payments | PayFast |
| Email | Nodemailer (SMTP) |
| Frontend deploy | Netlify |
| Backend deploy | Railway |

---

## Key file map

```
brand.config.js          ← client brand values (edit this first)
src/app/page.js          ← homepage (rebuild per client)
src/app/about/page.js    ← about page (rebuild per client)
src/app/admin/page.js    ← admin dashboard (ready to use)
src/app/checkout/page.js ← checkout + EFT details (auto from brand.config)
backend/utils/sendEmail.js ← email templates (store name from STORE_NAME env)
backend/controllers/     ← all API logic (rarely needs changing)
backend/models/          ← MongoDB schemas (extend as needed)
```
