# 📄 W-Spread

**Predictive Financial Control Center** — an anxiety-relief tool built on a *Decision Support System* (DSS) that turns historical cash-flow data into forward-looking action indicators.

> Built for [RevenueCat Shipaton 2026](https://revenuecat-shipaton-2026.devpost.com/) 🐱

---

## 🚀 The Problem

Most finance apps fail for one simple reason: **users are too lazy to log transactions manually**, and a raw balance number doesn't answer the question that actually keeps people up at night — *"How long can I survive on the money I have?"*

## 💡 The Solution

W-Spread automates the entire process:

1. **Upload** a photo or PDF of a bank statement / e-statement
2. **OCR & Smart Parsing** automatically extracts transactions — near-zero manual entry
3. **Days of Runway** is calculated in real time from balance and historical burn rate
4. **Financial Health Score (0–100)** + gamification (streak, level, visual weather UI) keeps users engaged
5. **What-If Simulator** (premium feature) — simulate the impact of a decision (e.g. hiring a new employee) on Runway *before* you make it

---

## ✨ Features (MVP — Hackathon Scope)

| Feature | Tier |
|---|---|
| Upload & OCR parsing of bank statements | Free |
| Live Runway dashboard (single-number) | Free |
| Financial Health Score + Streak + Visual Weather UI | Free |
| Leveling system (Survivor / Builder / Fortress) | Free |
| What-If Decision Engine (simulate decision impact on Runway) | 🔒 Premium |

> Enterprise features (Monte-Carlo modeling, multi-entity consolidation, API/audit log) and B2B growth loops are on the [Roadmap](#-roadmap).

---

## 💰 Monetization

W-Spread uses **RevenueCat SDK** to manage subscriptions:

| Plan | Price | Features |
|---|---|---|
| Free | $0 | Runway calculator, Health Score, Streak |
| Premium Weekly | ~$1.90/week | + What-If Simulator |
| Premium Yearly | ~$19/year | + What-If Simulator, all premium features |

3-day free trial available on the yearly plan.

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Firebase / Supabase
- **OCR/Parsing:** [name of OCR API used]
- **Monetization:** RevenueCat SDK + RevenueCat Paywalls
- **Push Notifications:** [optional, if used]

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
# fill in your RevenueCat, Firebase/Supabase, and OCR API keys

# Run the app
npx expo start
```

### Environment Variables

```
REVENUECAT_API_KEY_IOS=
REVENUECAT_API_KEY_ANDROID=
FIREBASE_CONFIG=
OCR_API_KEY=
```

---

## 🎬 Demo

📹 Demo video: [YouTube/Vimeo link]
📱 Download: [App Store link] · [Play Store link]
🔑 Promo code for judges: `SHIPATON2026`

---

## 🗺️ Roadmap

- [ ] Full Business Tier: multi-variable What-If (payroll + vendor + new equipment combined)
- [ ] Enterprise Tier: AI-powered Scenario Modeling, multi-entity consolidation, API & audit log
- [ ] B2B acquisition loop (incubator/SME association partnerships)
- [ ] Investor/Partner Read-Only Link for warm lead acquisition
- [ ] Share-My-Runway card generator (Spotify Wrapped-style viral loop)

---

## 🏆 Hackathon Submission

Built for the **HAMM Award (Help Apps Make Money)** category — a laddered membership monetization strategy from free to enterprise, with a paywall integrated directly into the product's core value.

---
