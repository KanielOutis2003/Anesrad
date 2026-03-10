# 🏨 Anesrad Inn — Hotel Management System

React + Vite frontend · Supabase backend · Netlify deployment

---

## 🚀 Quick Setup (3 Steps)

### Step 1 — Supabase Database

1. Go to https://supabase.com and create a free account
2. Click **New Project**, give it a name (e.g. `anesrad-inn`)
3. Go to **SQL Editor** → **New Query**
4. Copy and paste the SQL from `src/lib/supabase.js` (the big comment block)
5. Click **Run** — this creates your tables and seeds sample data
6. Go to **Project Settings** → **API**
7. Copy your **Project URL** and **anon public key**

### Step 2 — Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your Supabase values:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Step 3 — Run Locally

```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## ☁️ Deploy to Netlify

### Option A — Netlify UI (easiest)

1. Push this project to GitHub
2. Go to https://netlify.com → **Add new site** → **Import from Git**
3. Select your repo, set:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Go to **Site settings** → **Environment variables** → Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy site** ✅

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL https://your-project.supabase.co
netlify env:set VITE_SUPABASE_ANON_KEY your-anon-key
npm run build
netlify deploy --prod --dir=dist
```

---

## 📁 Project Structure

```
anesrad-inn/
├── src/
│   ├── components/
│   │   ├── Layout.jsx      ← Sidebar + topbar
│   │   └── Modal.jsx       ← Reusable modal
│   ├── pages/
│   │   ├── Dashboard.jsx   ← Stats, arrivals, room map
│   │   ├── CheckIn.jsx     ← New guest check-in form
│   │   ├── CheckOut.jsx    ← Process check-outs, view bills
│   │   ├── Rooms.jsx       ← Room grid, add/edit rooms
│   │   ├── Guests.jsx      ← Guest records + search
│   │   ├── Billing.jsx     ← Extra charges, mark paid
│   │   └── Housekeeping.jsx← Tasks, assign, mark done
│   ├── lib/
│   │   ├── supabase.js     ← Supabase client + SQL schema
│   │   └── utils.js        ← Date helpers, calculations
│   ├── App.jsx             ← Routes
│   ├── main.jsx            ← Entry point
│   └── index.css           ← All styles
├── index.html
├── vite.config.js
├── netlify.toml            ← SPA redirect rule
└── .env.example
```

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `rooms` | Room inventory (num, type, rate, status) |
| `guests` | Guest stays (check-in/out dates, payment) |
| `housekeeping` | Cleaning/maintenance tasks |

---

## 💡 Budget Summary

| Service | Cost |
|---------|------|
| Netlify (hosting) | **Free** (hobby tier) |
| Supabase (database) | **Free** (up to 500MB, 50k rows) |
| Domain (optional) | ~₱600/year |
| **Total** | **₱0 – ₱600/year** |
