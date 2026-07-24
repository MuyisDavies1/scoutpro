# ScoutPro – FIFA-Licensed Football Scouting Platform

A complete, fully client-side Football Scouting Web Application built with HTML5, TailwindCSS, and Vanilla JavaScript.

---

## 🚀 Quick Start

No build step required. Just open `index.html` in any modern browser, or serve with any static file server:

```bash
# Option 1 – Python (built-in)
python3 -m http.server 3000
# Then open http://localhost:3000

# Option 2 – Node.js (npx serve)
npx serve .
```

**Demo Login:**
- Email: `admin@scoutpro.com`
- Password: `admin123`
- Role: `Admin (Agent)`

---

## 📁 File Structure

```
football-scouting-app/
├── index.html   – Full application shell, all pages & modals
├── data.js      – Seed data (60+ clubs, sample players, KPI definitions, localStorage DB layer)
├── app.js       – All application logic (auth, navigation, CRUD, charts, reports, outreach)
└── README.md    – This file
```

---

## ✅ Modules Included

| Module | Description |
|---|---|
| **Login / Auth** | Email + password login with 4 roles: Admin, Scout, Analyst, Club Viewer |
| **Dashboard** | Stats, tier distribution chart, top prospects, nationality breakdown |
| **Player Management** | Add / edit / delete players with bio, position, archetype, media links |
| **Scouting Evaluation** | Score players on Technical, Tactical, Physical, Psychological KPIs |
| **Scoring Sheets** | 8-tab spreadsheet engine: Dashboard, 4× KPI sheets, Archetype, Percentile, Final Model |
| **Scouting Reports** | PDF-style report with radar chart, KPI table, strengths/weaknesses, risk, league fit |
| **Club Channel** | Searchable directory of 64 clubs (Scandinavia, Portugal, Belgium, Czech, Slovakia, Africa, USA) |
| **Club Outreach** | Auto-generated professional emails (4 templates) + outreach tracker |
| **Player Profile** | Full player profile page with radar chart, score breakdown, and recommendations |

---

## 🗃️ Data Persistence

All data is stored in **localStorage** (no backend required). Data persists across page refreshes in the same browser.

To reset all data: open browser DevTools → Application → Local Storage → Clear All.

---

## 📊 Scoring Formula

```
Overall Score = (Technical × 28%) + (Tactical × 27%) + (Physical × 25%) + (Psychological × 20%)

Tiers:
  Elite         ≥ 85
  High Prospect  75 – 84
  Development    65 – 74
  Monitor        < 65
```

---

## 🌐 Live Demo

https://bzu6wxst.scispace.co

---

## 🛠️ Tech Stack

- HTML5 (semantic)
- TailwindCSS (CDN)
- Vanilla JavaScript (ES6+)
- Chart.js (radar + bar + doughnut charts)
- Font Awesome 6 (icons)
- localStorage (data persistence)
