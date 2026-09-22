# 📄 W-Spread

**Predictive Financial Control Center** — an anxiety-relief tool built on a *Decision Support System* (DSS) that turns historical cash-flow data into forward-looking action indicators.

> Built for [RevenueCat Shipaton 2026](https://revenuecat-shipaton-2026.devpost.com/) 🐱

---

## 🚀 The Problem

Most finance apps fail for one simple reason: **users are too lazy to log transactions manually**, and a raw balance number doesn't answer the question that actually keeps people up at night — *"How long can I survive on the money I have?"*

## 💡 The Solution

W-Spread automates the entire process:

1. **Upload** a PDF bank e-statement (BCA, Mandiri, or BRI)
2. **Automated parsing** extracts each transaction from the statement text — near-zero manual entry
3. **Runway prediction** is calculated from the parsed transaction history (monthly average revenue vs. expense)
4. **Financial Health Score** + gamification (streak, level, visual weather UI) keeps users engaged
5. **What-If Simulator** (premium feature) — simulate the impact of a decision (e.g. hiring a new employee) on Runway *before* you make it
6. **Statement upload history/log** — every upload attempt is recorded so you can review past statements and their parsed results

---

## ✨ Features (MVP — Hackathon Scope)

| Feature | Tier |
|---|---|
| Upload & parsing of bank e-statements (PDF) | Free |
| Live Runway dashboard | Free |
| Financial Health Score + Streak + Visual Weather UI | Free |
| Statement upload history/log | Free |
| Leveling system (Survivor / Builder / Fortress) | Free |
| What-If Decision Engine (simulate decision impact on Runway) | 🔒 Premium |

> Enterprise features (Monte-Carlo modeling, multi-entity consolidation, API/audit log) and B2B growth loops are on the [Roadmap](#-roadmap).

---

## 💰 Monetization

W-Spread uses **RevenueCat SDK** to manage subscriptions:

| Plan | Monthly | Yearly | Features |
|---|---|---|---|
| Free | $0 | $0 | Runway calculator, Health Score, Streak, statement upload (20/month) |
| Business | $10/mo | $96/yr (~$8/mo) | + Unlimited What-If Simulator, unlimited statement uploads, Personal vs. Business cash split |
| Enterprise | $20/mo | $192/yr (~$16/mo) | + Predictive Cashflow Analytics & Valuation, multi-account/entity consolidation, API & audit log |

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Express.js + TypeScript + Prisma ORM + PostgreSQL (see the separate `w-spread-backend` repo — details below)
- **File Storage:** Supabase Storage (used by the backend for avatar and e-statement file uploads)
- **OCR/Parsing:** No third-party OCR service — statement PDFs are text-extracted with [`pdf-parse`](https://www.npmjs.com/package/pdf-parse) and parsed with a custom bank-statement transaction parser
- **Monetization:** RevenueCat SDK + RevenueCat Paywalls

---

## 🔌 Backend

The backend for this app lives in its own repository and is **already deployed** — you don't need to run anything locally to try the app:

- **Live API:** `https://w-spread-backend.vercel.app`
- **Source code:** [Panjiiiiiii/w-spread-backend](https://github.com/Panjiiiiiii/w-spread-backend) — clone it if you want to self-host it or inspect/modify the API. That repo has its own README with full setup instructions (environment variables, Prisma migration steps, etc.); this README doesn't duplicate that here.

```bash
git clone https://github.com/Panjiiiiiii/w-spread-backend.git
```

---

## 📲 Getting Started

```bash
# Clone the repo
git clone https://github.com/<username>/w-spread.git
cd w-spread

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# For a physical device, replace localhost with your computer's LAN IP.

# Run the app
npx expo start
```

### Environment Variables

```
# Use the deployed backend (recommended, no local setup needed):
EXPO_PUBLIC_API_URL=https://w-spread-backend.vercel.app/api/v1
# Or, if running the backend locally instead:
# EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1

EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=
EXPO_PUBLIC_REVENUECAT_BUSINESS_ENTITLEMENT=business
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_ENTITLEMENT=enterprise
EXPO_PUBLIC_REVENUECAT_BUSINESS_MONTHLY_PRODUCT_ID=
EXPO_PUBLIC_REVENUECAT_BUSINESS_YEARLY_PRODUCT_ID=
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_MONTHLY_PRODUCT_ID=
EXPO_PUBLIC_REVENUECAT_ENTERPRISE_YEARLY_PRODUCT_ID=
```

---

## 🎬 Demo

📹 Demo video: Not yet published
📱 Download: Not yet published on the App Store or Play Store

---

## 🗺️ Roadmap

- [ ] Full Business Tier: multi-variable What-If (payroll + vendor + new equipment combined)
- [ ] Enterprise Tier: AI-powered Scenario Modeling, multi-entity consolidation, API & audit log
- [ ] B2B acquisition loop (incubator/SME association partnerships)
- [ ] Investor/Partner Read-Only Link for warm lead acquisition
- [ ] Share-My-Runway card generator (Spotify Wrapped-style viral loop)

---
