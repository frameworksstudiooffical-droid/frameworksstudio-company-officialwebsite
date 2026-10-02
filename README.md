# Frameworks Studio — Premium Web Agency Website

Ultra-luxurious, high-converting digital agency website engineered for **Frameworks Studio**.

---

## 🚀 Key Highlights & Features

- **Live Client Showcase Integration:**
  - ✂️ **LUMÉA Studio (Salon & Spa)**: `www.lumeastudio.in` — [Live Demo](https://lumea-studio-orpin.vercel.app/)
  - 🩺 **SmileCare Dental Clinic**: `www.smilecaredental.com` — [Live Demo](https://simlecare-com.vercel.app/)
  - 🏋️‍♂️ **Isotropy Fitness**: `www.isotropyfitness.com` — [Live Demo](https://isotropy-nine.vercel.app/)
  - 🎸 **MelodyMart Music Store (E-Commerce)**: `www.melodymart.in` — [Live Demo](https://melodymart-com.vercel.app/)
  - *Interactive In-App Modal*: Allows visitors to preview client sites inside live responsive viewports (Desktop 100%, Tablet 768px, Mobile 375px) without leaving your agency website!

- **Transparent 3-Tier Pricing Architecture:**
  - **Basics**: **₹19,999** (was <del>₹29,999</del> — *Save ₹10,000*)
  - **Standard (⭐ Most Popular)**: **₹39,999** (was <del>₹44,999</del> — *Save ₹5,000*)
  - **Premium**: **₹69,999** (was <del>₹94,999</del> — *Save ₹25,000*)
  - Interactive "Select Plan" buttons auto-scroll to the contact form and automatically choose that plan with a visual glow effect.

- **Delivery Guarantee:**
  - **⚡ 48 — 72 Hours Rapid Delivery Sprint** highlighted across metrics, process, and pricing.

---

## 🔌 Live Contact API & Cloudflare Turnstile

The contact form is protected by Cloudflare Turnstile CAPTCHA and proxied through Vercel's Edge Gateway so your real backend server remains shielded and completely hidden from public inspect/DevTools:

- **Public Frontend Endpoint:** `POST /api/contact` (Proxied transparently by Vercel edge rewrite)
- **Backend Origin (Hidden):** Configured securely in `vercel.json` and `.env`
- **Cloudflare Turnstile Site Key:** `0x4AAAAAAFKUiavTO6RyaYd1`
- **WhatsApp Support Number:** `+91 6383976149`

### Environment Configuration:
- `.env` contains the environment variables.
- `js/env.js` exposes these variables to client-side scripts.

```env
API_BASE_URL=https://your-api-domain.up.railway.app
CONTACT_ENDPOINT=https://your-api-domain.up.railway.app/api/contact
CLOUDFLARE_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
WHATSAPP_NUMBER=your_whatsapp_phone_number_here
```

---

## 📂 Project Structure

```text
F:\frameworks-studio\
├── .env              # Backend API & Turnstile environment variables
├── .env.example      # Template for environment configuration
├── index.html        # Complete agency homepage & interactive modals
├── assets\
│   └── logo.png      # Official Frameworks Studio 3D isometric logo
├── css\
│   └── styles.css    # Luxury dark glassmorphism, animations, glow effects
├── js\
│   ├── env.js        # Environment bridge for client-side JavaScript
│   └── app.js        # API submission, Turnstile validation, WhatsApp fallback
├── vercel.json       # Production security headers and edge caching rules
└── README.md         # Documentation & guide
```

---

## 🌐 Deploy to Vercel

You can deploy this site in 30 seconds:
1. Open terminal in `F:\frameworks-studio`
2. Run `npx vercel`
3. Press enter to accept defaults — your agency site is live globally!
