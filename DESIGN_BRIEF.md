# Golden Line - Design Brief (Complete Technical Context)

**Status:** Working prototype with single public demo (April 25, 2026)  
**Tech Stack:** React 18 + Base44 SaaS backend + Vite  
**Public URL:** https://golden-line.base44.app (HOME + main LiveDemo only)  
**Base44 Project:** base44-app  
**Repository:** golden-line-w

⚠️ **CRITICAL:** Only the root path will be shown to users. No /LiveDemoTabit, /LiveDemoTaamApri paths.
- Users see: Home page (landing) + main LiveDemo flow
- Everything else: Internal development/scenario testing only

---

## What's Actually Built (Live Today)

### Current Implementation (Public Surfaces Only)
- **Full end-to-end prototype** with NO demo data (real API calls to Base44)
- **Single public demo scenario** (general use case):
  - Home page (Home.jsx) - landing + waitlist
  - Main demo flow (LiveDemo.jsx) - interactive complaint → analysis → order → injection
- **Authentication** via Base44 (OAuth)
- **Data persistence** in Base44 entities (OperationalDebts, WaitlistEntry)
- **Interactive demo** that shows the two-phase flow in action

*(Internal: 4 additional restaurant-specific scenarios exist for testing/development but won't be shown to users)*

### Tech Stack Details
```
Frontend:
- React 18.2
- Vite (build)
- TailwindCSS + Radix UI components
- Lucide React icons
- React Router for navigation
- React Query + Zod for data management

Backend:
- Base44 SDK (@base44/sdk v0.8.26)
- Base44 entities: OperationalDebts, WaitlistEntry
- Base44 authentication (requiresAuth: false on client, handled server-side)
```

---

## The Two-Phase Architecture (Currently Implemented)

### PHASE 1: Complaint → Analysis → Storage
**Flow shown in LiveDemo.jsx**

1. **Complaint Received** (`p1_ticket` state)
   - Customer support submits ticket to system
   - Shows raw complaint text (can be English or Hebrew)
   - Example: "Soup container was completely open and spilled all over the bag..."

2. **AI Analysis** (`p1_analyzing` state)
   - Progress bar animates (simulated 2.2s)
   - AI extracts:
     - `action_code`: Problem type (SPILL, EDAMAME_COLD_PACKING, etc.)
     - `golden_line_hebrew`: Hebrew packer instruction
     - `reasoning_logic`: Why this happened
     - `evidence_quote`: Direct quote from complaint
     - `confidence_score`: 0.0-1.0 confidence (0.94-0.97 typical)

3. **Store in Base44** (`p1_stored` state)
   - Creates `OperationalDebt` record with:
     ```javascript
     {
       customer_id: "CUST-7741",
       restaurant_id: "REST-202",
       action_code: "SPILL",
       golden_line_hebrew: "לאטום את המכסה של המרק עם מכסה כפול",
       reasoning_logic: "Soup container was not properly sealed...",
       evidence_quote: "The soup container was completely open...",
       confidence_score: 0.97,
       is_active: true,
       injected_count: 0,
       source_ticket_id: "ZD-48821"
     }
     ```
   - Record persists in Base44 database
   - Ready for Phase 2

### PHASE 2: Order Arrives → Trigger → Inject Alert
**Flow shown in LiveDemo.jsx (continued)**

1. **New Order Detected** (`p2_order` state)
   - System detects incoming order for same customer
   - Shows order ID + items
   - Example: Order #99312 (Burger, Soup, Fries)

2. **Golden Line Triggered** (`p2_triggering` state)
   - Matches customer in order against OperationalDebts
   - Filters for actionable alerts (packer can fix)
   - Prepares injection payload

3. **Alert Injected** (`p2_injected` state)
   - Alert appears on packer's screen/device
   - **On the bon** (order ticket)
   - Shows: customer name + previous mistake + action to fix
   - Example (in Hebrew): "לאטום את המכסה של המרק עם מכסה כפול" = "Seal soup container with double lid"

---

## Current Data Model (Base44 Entities)

### OperationalDebts (Primary entity)
Stores each complaint analyzed and ready for injection.

```javascript
{
  id: "generated-by-base44",
  customer_id: string,        // "CUST-7741"
  restaurant_id: string,      // "REST-202"
  action_code: string,        // "SPILL", "EDAMAME_COLD_PACKING", etc
  golden_line_hebrew: string, // "לאטום את המכסה..." (packer instruction)
  reasoning_logic: string,    // "Soup container was not properly sealed..."
  evidence_quote: string,     // Direct quote from complaint
  confidence_score: number,   // 0.0-1.0
  is_active: boolean,         // true = still relevant, false = resolved
  injected_count: number,     // How many times this alert was shown
  source_ticket_id: string,   // "ZD-48821" (original support ticket)
  created_at: timestamp,      // Base44 auto-generated
  updated_at: timestamp,      // Base44 auto-generated
}
```

### WaitlistEntry
Landing page signup data.

```javascript
{
  id: "generated-by-base44",
  email: string,              // "user@example.com"
  created_at: timestamp,
}
```

---

## Live Demo UX Pattern (Reference)

All demos follow the same interactive pattern. User clicks buttons to advance through phases:

**Controls:**
- Play button → starts analysis animation
- Reset button → restarts from beginning
- Phases advance with delays (realistic timing)

**Visual Design:**
- Restaurant-specific branding colors (Tabit = teal #3ec6c6)
- Icons show each phase: MessageSquare → Brain → CheckCircle2
- Progress bars for AI analysis step
- Phase 1/2 section layout with step indicators
- RTL support (demo supports Hebrew direction: `direction="rtl"`)
- Responsive mobile-first design

---

## What's Missing / Next Steps

### Not Yet Implemented
1. **Real AI analysis** - Currently using mock analysis data
2. **Real POS integration** - Tabit/mypips API calls not live
3. **Fraud detection layer** - Phase 2 feature (not in Phase 1 MVP)
4. **CSM dashboard** - For management to see all active debts
5. **Real complaint data** - Currently using hardcoded scenarios
6. **Authentication UI** - Base44 handles it, but no logout/user settings
7. **Multiple restaurant support** - Currently single-restaurant demos
8. **Order real-time sync** - Not yet pulling live orders from POS

### Critical Path to Demo-Ready
- [ ] Connect Phase 2 to real POS order stream (mypips/Tabit webhook)
- [ ] Test alert injection on actual packer device/screen
- [ ] Validate Hebrew text rendering on mobile
- [ ] Performance testing with real complaint database (1000+ records)
- [ ] Handle customer matching edge cases (partial names, phone number fallback)
- [ ] Add "Injection Events" dashboard (already has stub in navigation)

---

## Design Considerations for Claude Design

### Mobile-First Packer Interface
The actual packer sees alerts on:
- Personal phone (mypips app shows alerts)
- Shared packing station tablet
- Kitchen receipt printer (as additional text line)

**Constraint:** Alert must be **instantly understandable** - packer is under time pressure, won't read paragraphs.

**Design requirement:** Single-line Hebrew instruction that tells packer exactly what to do differently.

### Bilingual Support (Hebrew + English)
- System must support Hebrew text (RTL)
- Packer instructions MUST be in Hebrew
- Management dashboards could be English

### Restaurant Brand Integration
Each demo uses restaurant-specific colors:
- Tabit: Teal (#3ec6c6)
- Others: Can customize by restaurant_id

### Alert Filtering Logic
Not all complaints get alerts. Filter out:
- Cold food delivery → packer can't fix (chef or delivery delay issue)
- Late delivery → packer can't fix (courier issue)
- Only show: Wrong item, missing item, packaging issue, preparation error

---

## File Structure (Relevant)

```
src/
├── api/
│   └── base44Client.js          ← SDK initialization
├── pages/
│   ├── Home.jsx                 ← Landing page + waitlist
│   ├── LiveDemo.jsx             ← Main demo (soup scenario)
│   ├── LiveDemoTabit.jsx        ← Sushi restaurant example
│   ├── LiveDemoTaamApri.jsx     ← Another scenario
│   ├── LiveDemoAlAlim.jsx       ← Catering scenario
│   ├── LiveDemoSalMeHateva.jsx  ← Delivery scenario
│   ├── Dashboard.jsx            ← [Not yet used]
│   ├── InjectionEvents.jsx      ← [Stub for event log]
│   └── OperationalDebts.jsx     ← [Not yet used]
├── components/
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   ├── UserNotRegisteredError.jsx
│   └── ui/                      ← Radix UI components (50+ UI primitives)
├── lib/
│   ├── AuthContext.jsx          ← Base44 authentication
│   └── app-params.js            ← Base44 config (appId, token, etc)
└── App.jsx                      ← Router + query client setup
```

---

## The Public Experience: Home + Demo (Everything Matters)

**This is the entire first impression.** Users only see:
1. **Home.jsx** - Landing page + value prop + waitlist
2. **LiveDemo.jsx** - Interactive walkthrough of the product

**What the demo does:**
- Shows the complete two-phase flow (complaint → analysis → storage → order → injection)
- Proves the concept works end-to-end
- Base44 accelerator interview will be evaluated on this demo quality
- Vegetable Packaging House pilot will be sold using this demo

**Current demo UX:**
- Play/Reset buttons to control flow
- Phase 1/Phase 2 sections with step indicators
- Progress bar for analysis
- Real Base44 API calls (data persists)
- Soup container scenario (spill issue)

**Design freedom (complete):**
You can completely redesign:
- Landing page copy, layout, CTA
- Demo visual presentation, animations, colors
- Interaction model (Play/Reset vs. auto-play vs. click-through)
- How the complaint/analysis/order/alert are shown

**Must keep:**
1. Complaint text appears
2. AI analysis runs (with visual feedback showing it's working)
3. Data saves (demonstrates real backend)
4. New order arrives
5. Alert triggers and injects

**Key constraint:**
Mobile-first. Decision-makers browse on phones. Must work and look great at small screens.

---

## Design Questions for Claude Design (Public Surfaces Only)

### 🔴 HIGH PRIORITY (What users see)

1. **Landing Page (Home.jsx)** - First impression
   - Current: Dark hero section, value prop, waitlist CTA
   - Question: Does the headline "Stop Repeat Refunds" resonate?
   - Should we lead with problem, solution, or outcome?
   - Tagline "Close the Loop Between CS and Operations" - clear enough?
   - Should we show any screenshots/preview before the demo?

2. **Live Demo UX** ⭐ - Everything rides on this
   - Current: Play button → steps advance with delays → Reset
   - Question: How to make the 5-step flow emotionally compelling?
   - Should each phase auto-play or wait for user clicks?
   - Visual design: Current is minimal, should be more polished?
   - Should we show real data being saved to Base44? (Proof of concept)
   - Mobile layout: Horizontal vs vertical sections? Scrolling?
   - Waitlist CTA: Should it appear after demo? Different messaging?

3. **Demo Scenario Choice** - What story should we tell?
   - Current: Soup spill (restaurant scenario)
   - Question: Best use case for first impression?
   - Options:
     - Keep soup scenario (relatable, food-specific)
     - Switch to supplier scenario (higher stakes, more $ at risk)
     - Generic order scenario (less restaurant-specific)

### 🟡 MEDIUM PRIORITY (Future/hidden features)

4. **Management Dashboard** - For future: How should CSM see all active "operational debts"?
   - Table view? Kanban? Timeline?
   
5. **Packer Alert Design** - For future: How does alert appear on packer screen?
   - Inline on bon? Toast notification? Banner?

6. **Fraud Detection Layer** - For future: Visualize "systematic complaint filers"?
   - Risk scores? Pattern visualization?

---

## Summary for Design (Public Launch Focus)

**Problem Being Solved:** 
Restaurants lose customers to repeat packing mistakes because complaint info never reaches the packer.

**Current MVP:**
Complaint → AI analysis → store as "operational debt" → when same customer orders again, inject alert.

**Public Website Has:**
- Landing page (Home.jsx) with value prop + waitlist
- Interactive two-phase demo (LiveDemo.jsx) showing the concept end-to-end
- Real Base44 backend (data actually persists)
- Mobile-optimized responsive design

**Design Scope (What Users See):**
1. Home page headline + copy
2. Live demo flow and animations
3. Waitlist signup/CTAs
4. Mobile responsiveness

**NOT in public scope (yet):**
- Management dashboards
- Real POS integrations
- Multiple restaurant examples
- Fraud detection
- (These exist internally for testing but won't be shown)

**Design Input Needed:**
- How to make the demo emotionally compelling in 30 seconds?
- Best scenario to tell (soup, supplier, generic)?
- What demo UX makes the concept "click" for decision-makers?
- What's the landing page headline that resonates?

