# ScoutPro — Football Scouting Application
## Technical Architecture & Database Schema Specification
**Version:** 1.0 | **Date:** June 2026 | **Author:** ScoutPro Engineering

---

## 1. System Overview

ScoutPro is a client-side Progressive Web Application (PWA) built for FIFA-Licensed Football Agents. It enables professional player scouting, evaluation, report generation, and club outreach — all running in the browser with zero backend dependencies.

### 1.1 Architecture Pattern
```
┌────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  index.html  │  │   app.js     │  │      data.js         │ │
│  │  (UI Shell)  │  │  (Logic)     │  │  (DB + Seed Data)    │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
│         └─────────────────┴──────────────────────┘            │
│                           │                                    │
│                  ┌────────▼────────┐                           │
│                  │  localStorage   │  ← Persistent Storage     │
│                  │  (sp_ prefix)   │                           │
│                  └─────────────────┘                           │
└────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer       | Technology                | Version  | Purpose                          |
|-------------|---------------------------|----------|----------------------------------|
| Markup      | HTML5                     | Latest   | Application shell & UI structure |
| Styling     | TailwindCSS (CDN)         | 3.x      | Utility-first responsive design  |
| Logic       | Vanilla JavaScript ES6+   | Latest   | App logic, routing, CRUD         |
| Charts      | Chart.js (CDN)            | 4.x      | Radar, bar, doughnut charts      |
| Icons       | Font Awesome 6 (CDN)      | 6.x      | UI icons throughout              |
| Storage     | Browser localStorage      | Native   | Persistent client-side database  |
| Export      | window.print()            | Native   | PDF scouting report export       |

---

## 2. Database Schema (localStorage)

All collections are stored as JSON arrays in localStorage with the `sp_` prefix.

### 2.1 Users Collection (`sp_users`)
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "password": "hashed_password",
  "name": "Full Name",
  "role": "admin | scout | analyst | club_viewer",
  "createdAt": "ISO-8601-timestamp",
  "lastLogin": "ISO-8601-timestamp",
  "avatar": "url-or-base64"
}
```

**Role Permissions Matrix:**
| Feature              | Admin | Scout | Analyst | Club Viewer |
|----------------------|-------|-------|---------|-------------|
| Add Players          | ✅    | ✅    | ❌      | ❌          |
| Edit Players         | ✅    | ✅    | ❌      | ❌          |
| Delete Players       | ✅    | ❌    | ❌      | ❌          |
| Create Evaluations   | ✅    | ✅    | ✅      | ❌          |
| View Reports         | ✅    | ✅    | ✅      | ✅          |
| Club Outreach        | ✅    | ✅    | ❌      | ❌          |
| Manage Users         | ✅    | ❌    | ❌      | ❌          |

### 2.2 Players Collection (`sp_players`)
```json
{
  "id": "uuid-string",
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "nationality": "string",
  "position": "GK | CB | LB | RB | CDM | CM | CAM | LW | RW | ST | CF",
  "archetype": "Ball-playing Defender | Deep-lying Playmaker | Box-to-Box | ...",
  "currentClub": "string",
  "currentLeague": "string",
  "height": 183,
  "weight": 78,
  "preferredFoot": "Left | Right | Both",
  "contractExpiry": "YYYY-MM-DD",
  "marketValue": 500000,
  "profileImage": "url-string",
  "highlightVideo": "youtube-or-vimeo-url",
  "fullMatchVideo": "youtube-or-vimeo-url",
  "agentNotes": "string",
  "tags": ["tag1", "tag2"],
  "createdBy": "user-id",
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp",
  "isArchived": false
}
```

**Player Archetypes (16 total):**
1. Ball-playing Defender
2. Sweeper-Keeper
3. Deep-lying Playmaker
4. Box-to-Box Midfielder
5. Creative Midfielder (No. 10)
6. Pressing Forward
7. Target Man
8. Winger / Wide Forward
9. Inverted Winger
10. Complete Forward
11. Wing-back (Attacking)
12. Defensive Midfielder (Destroyer)
13. Regista
14. False 9
15. Trequartista
16. Shadow Striker

### 2.3 Evaluations Collection (`sp_evaluations`)
```json
{
  "id": "uuid-string",
  "playerId": "player-uuid",
  "scoutId": "user-uuid",
  "evaluationDate": "YYYY-MM-DD",
  "matchObserved": "Club A vs Club B",
  "venue": "Stadium Name",
  "scores": {
    "technical": {
      "ballControl": 8.5,
      "passing": 7.0,
      "dribbling": 9.0,
      "shooting": 6.5,
      "heading": 5.0,
      "firstTouch": 8.0,
      "crossing": 7.5,
      "longPassing": 6.0,
      "setpieces": 7.0
    },
    "tactical": {
      "positioning": 8.0,
      "movement": 7.5,
      "pressing": 8.5,
      "transitionSpeed": 7.0,
      "buildupPlay": 8.0,
      "defensiveShape": 6.5,
      "spaceCreation": 7.5,
      "gameReading": 8.0
    },
    "physical": {
      "pace": 9.0,
      "acceleration": 8.5,
      "strength": 6.0,
      "stamina": 8.0,
      "agility": 8.5,
      "jumping": 5.5,
      "balance": 8.0,
      "workRate": 9.0
    },
    "psychological": {
      "composure": 8.0,
      "leadership": 7.0,
      "decisionMaking": 7.5,
      "coachability": 9.0,
      "aggression": 6.5,
      "determination": 8.5,
      "teamwork": 8.0
    },
    "archetype": {}
  },
  "calculatedScores": {
    "technical": 74.5,
    "tactical": 76.0,
    "physical": 79.0,
    "psychological": 78.5,
    "archetype": 80.0,
    "overall": 77.2,
    "tier": "High Prospect"
  },
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "riskScore": 3,
  "opportunityScore": 8,
  "recommendedLeague": "Eliteserien | Primeira Liga | ...",
  "recommendedClubs": ["Club 1", "Club 2", "Club 3"],
  "scoutRecommendation": "Sign | Monitor | Pass",
  "narrativeSummary": "long-text",
  "createdAt": "ISO-8601-timestamp"
}
```

### 2.4 Clubs Collection (`sp_clubs`)
```json
{
  "id": "integer",
  "name": "string",
  "country": "string",
  "league": "string",
  "style": "Attacking | Defensive | Possession | Counter-attack | Pressing | Technical",
  "foreign_openness": 1-10,
  "ideal_archetype": "string",
  "contact": "email@club.com",
  "notes": "string",
  "website": "url",
  "transferBudget": "Low | Medium | High",
  "avgPlayerAge": 23.5,
  "academyLink": true
}
```

### 2.5 KPI Definitions (`sp_kpi_definitions`)
```json
{
  "category": "technical | tactical | physical | psychological",
  "kpiKey": "ballControl",
  "label": "Ball Control",
  "weight": 0.12,
  "description": "Ability to receive and control the ball under pressure",
  "archetypeRelevance": ["Winger", "Creative Midfielder", "Complete Forward"]
}
```

### 2.6 Outreach Tracker (`sp_outreach`)
```json
{
  "id": "uuid-string",
  "playerId": "player-uuid",
  "clubId": "club-integer",
  "emailTemplate": "introduction | trial | followup | report",
  "emailSubject": "string",
  "emailBody": "string",
  "status": "Draft | Sent | Viewed | Interested | Not Interested | Trial Arranged",
  "sentAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp",
  "notes": "string"
}
```

---

## 3. Scoring Engine

### 3.1 Weighted Formula
```
Technical Score   = Σ(KPI_score × KPI_weight) for 9 Technical KPIs
Tactical Score    = Σ(KPI_score × KPI_weight) for 8 Tactical KPIs
Physical Score    = Σ(KPI_score × KPI_weight) for 8 Physical KPIs
Psychological Score = Σ(KPI_score × KPI_weight) for 7 Psychological KPIs

Overall Score = (Technical × 0.28) + (Tactical × 0.27) + (Physical × 0.25) + (Psychological × 0.20)
```

### 3.2 KPI Weights — Technical (28% of Overall)
| KPI             | Weight | Description                          |
|-----------------|--------|--------------------------------------|
| Ball Control    | 12%    | Receiving and controlling under pressure |
| Passing         | 13%    | Short and medium range passing accuracy |
| Dribbling       | 12%    | 1v1 dribbling ability                |
| Shooting        | 11%    | Shot accuracy and power              |
| Heading         | 8%     | Aerial duels (offensive/defensive)   |
| First Touch     | 13%    | Quality of first touch               |
| Crossing        | 10%    | Delivery from wide areas             |
| Long Passing    | 11%    | Range and accuracy of long balls     |
| Set Pieces      | 10%    | Free kicks, corners, throw-ins       |

### 3.3 KPI Weights — Tactical (27% of Overall)
| KPI               | Weight | Description                        |
|-------------------|--------|------------------------------------|
| Positioning       | 14%    | Intelligent use of space           |
| Movement          | 13%    | Off-ball movement quality          |
| Pressing          | 13%    | Intensity and efficiency of press  |
| Transition Speed  | 12%    | Speed of attack/defense transition |
| Buildup Play      | 13%    | Contribution to team buildup       |
| Defensive Shape   | 12%    | Maintaining defensive structure    |
| Space Creation    | 12%    | Creating space for teammates       |
| Game Reading      | 11%    | Anticipation and game intelligence |

### 3.4 Tier Classification
```javascript
function getTier(overallScore) {
  if (overallScore >= 85) return { tier: "Elite",          color: "#FFD700", badge: "🏆" };
  if (overallScore >= 75) return { tier: "High Prospect",  color: "#00D4AA", badge: "⭐" };
  if (overallScore >= 65) return { tier: "Development",    color: "#4A9EFF", badge: "📈" };
  return                         { tier: "Monitor",        color: "#FF6B35", badge: "👁️" };
}
```

### 3.5 League Fit Algorithm
```javascript
function getLeagueFit(overallScore) {
  if (score >= 85) return ["Bundesliga", "Ligue 1", "Serie A", "La Liga", "Premier League"];
  if (score >= 78) return ["Eredivisie", "Primeira Liga", "Belgian Pro League", "Scottish Premiership"];
  if (score >= 70) return ["Eliteserien", "Allsvenskan", "Danish Superliga", "Czech First League"];
  if (score >= 62) return ["Liga Portugal 2", "Superettan", "Slovak Super Liga", "USL Championship"];
  return                  ["Academy Football", "NCAA D1", "Lower League Development"];
}
```

---

## 4. Application Modules

### 4.1 Module Map
```
ScoutPro Application
├── Auth Module          (login, session, role-based routing)
├── Dashboard Module     (stats, charts, top prospects)
├── Player Module        (CRUD, search, filter, profile)
├── Evaluation Module    (4-category KPI scoring, tier calc)
├── Spreadsheet Module   (8-tab engine, formulas, export)
├── Report Module        (PDF-style, radar chart, print)
├── Club Module          (64-club directory, search, filter)
├── Outreach Module      (email gen, 4 templates, tracker)
└── Profile Module       (player hero page, video links)
```

### 4.2 Navigation Structure
```
/ (Login)
└── /dashboard          Admin | Scout | Analyst | Club Viewer
└── /players            Admin | Scout | Analyst
    └── /players/:id    All roles
└── /evaluations        Admin | Scout | Analyst
└── /spreadsheet        Admin | Scout | Analyst
└── /reports            All roles
└── /clubs              All roles
└── /outreach           Admin | Scout
└── /settings           Admin only
```

---

## 5. Email Templates

### Template 1 — Introduction & Player Presentation
**Subject:** `Player Presentation – [Player Name] | [Position] | [Nationality]`
**Body:** Professional introduction of player with stats, tier, recommended league fit, and video links.

### Template 2 — Trial Request
**Subject:** `Trial Request – [Player Name] | [Position] | Available [Date]`
**Body:** Formal trial request with player profile summary, availability window, and contact details.

### Template 3 — Follow-Up
**Subject:** `Follow-Up: [Player Name] | Scouting Update`
**Body:** Polite follow-up referencing previous contact, updated evaluation scores, and renewed interest.

### Template 4 — Scouting Report Submission
**Subject:** `Scouting Report – [Player Name] | [Overall Score]/100 | [Tier]`
**Body:** Formal report submission with full evaluation summary, radar chart description, and recommendation.

---

## 6. File Structure

```
scoutpro_app/
├── frontend/
│   ├── index.html          # Application shell (29.9 KB)
│   ├── app.js              # Application logic (60.1 KB)
│   └── data.js             # Database layer + seed data (33.0 KB)
├── backend/
│   └── (future: Node.js/Express API if backend needed)
├── database/
│   └── clubs_directory.json  # 64 clubs seed data
└── docs/
    ├── README.md             # Quick start guide
    ├── architecture-spec.md  # This document
    └── deployment-guide.html # Web & mobile deployment guide
```

---

## 7. Performance Characteristics

| Metric                   | Value           | Notes                              |
|--------------------------|-----------------|------------------------------------|
| Initial Load Time        | < 2 seconds     | CDN resources cached after first load |
| localStorage Capacity    | ~5-10 MB        | Supports ~500 players + evaluations |
| Chart Render Time        | < 100ms         | Chart.js canvas rendering          |
| Report Generation        | < 500ms         | DOM-based PDF print                |
| Search/Filter Response   | < 50ms          | Client-side array filtering        |

---

## 8. Security Considerations

- **Authentication:** Email/password stored in localStorage (client-side only)
- **Role Enforcement:** Client-side role checks (suitable for single-user or trusted team use)
- **Data Privacy:** All data stays in the user's browser — no server transmission
- **Export Security:** PDF exports contain only what's visible on screen
- **Upgrade Path:** For multi-user enterprise use, migrate to Node.js + PostgreSQL backend with JWT authentication

---

*ScoutPro Technical Specification — FIFA-Licensed Football Agent Platform*
