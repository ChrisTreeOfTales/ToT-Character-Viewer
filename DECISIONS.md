# ToT Character Viewer - Technical Decisions

> This file documents key technical decisions, why they were made, and their impact.

---

## 🎯 Core Technology Choices

### Decision: Tauri 2.0 vs Electron

**Chosen:** Tauri 2.0

**Rationale:**
- **Bundle Size:** ~5-10MB vs Electron's 85MB+
- **Memory Usage:** ~30-40MB vs Electron's 100MB+
- **Security:** Rust's compile-time safety guarantees
- **Performance:** Native OS rendering instead of Chromium
- **Developer Experience:** Modern, well-documented, active community

**Tradeoffs:**
- ❌ Requires Rust installation for development
- ❌ First build is slower (2-5 minutes)
- ✅ Better performance and smaller bundle
- ✅ Lower resource usage

---

### Decision: SQLite via tauri-plugin-sql

**Chosen:** SQLite with Tauri plugin

**Rationale:**
- **Local-first:** No internet dependency
- **Simple:** Single file database
- **Fast:** Excellent for desktop apps with <1M records
- **No server needed:** Perfect for single-user application
- **Type-safe:** Tauri plugin provides TypeScript bindings

**Alternatives Considered:**
- IndexedDB - Browser-based, but less robust for desktop apps
- JSON files - Simple but no relational queries, poor performance at scale

---

### Decision: Tailwind CSS 4 (not v3)

**Chosen:** Tailwind CSS 4

**Rationale:**
- **Modern Features:** Container queries, cascade layers
- **Smaller Bundle:** Better tree-shaking
- **No Config File:** CSS-based imports (simpler)
- **PostCSS Plugin:** `@tailwindcss/postcss` required

**Critical Fix Applied:**
- Created `postcss.config.js` with `@tailwindcss/postcss` plugin
- Without this, Tailwind styles don't load (white screen issue)

---

### Decision: Direct Database Access vs Zustand Store

**Chosen:** Direct database access with local React state

**Rationale:**
- **Simplicity:** Fewer layers, easier to debug
- **Less Crashes:** Complex state management was causing white screens
- **Performance:** Direct queries are fast enough for this use case
- **Code Clarity:** Easier for non-developers to understand

**What We Tried:**
1. ❌ Zustand with complex store - caused rendering crashes
2. ❌ Zustand with simplified store - still crashed
3. ✅ Direct DB access with `useState` - works reliably

**Tradeoff:**
- ❌ Some code duplication (loadCharacters called in multiple places)
- ✅ Much more stable and predictable behavior

---

## 🎨 UI/UX Decisions

### Decision: Prompt-based Input for HP Changes

**Chosen:** `prompt()` for damage/heal amounts

**Rationale:**
- **Quick to implement:** Native browser API
- **Simple UX:** Two clicks (button + enter)
- **No extra components:** Keeps codebase small

**Future Consideration:**
- Could replace with custom modal for better UX
- Current solution works well for MVP

---

### Decision: Window Reload for Character List Refresh

**Chosen:** `window.location.reload()` after character creation

**Rationale:**
- **Reliable:** Always ensures fresh data
- **Simple:** One line of code
- **No State Management:** Avoids complex state synchronization

**Tradeoff:**
- ❌ Not ideal UX (brief flash)
- ✅ Guaranteed consistency between DB and UI

**Future Improvement:**
- Could use state updates instead
- Current solution is acceptable for now

---

### Decision: Inline Form vs Modal for Character Creation

**Chosen:** Inline form in sidebar

**Rationale:**
- **Less Code:** No modal component needed
- **Simpler State:** No modal open/close state
- **Good UX:** Form appears where you expect it

**What We Tried:**
1. ❌ Complex modal with React Hook Form + Zod - crashed
2. ❌ Simplified modal - still had issues
3. ✅ Inline form - works perfectly

---

## 📦 Package Decisions

### Decision: Install React Hook Form + Zod but Not Use Yet

**Chosen:** Installed but using basic forms for now

**Rationale:**
- **Future-proofing:** Will need for complex forms (skills, inventory)
- **Current Simplicity:** Basic forms work fine for character creation
- **Gradual Enhancement:** Can integrate when needed

**When to Use:**
- Skills management (many fields, complex validation)
- Inventory items (custom properties, nested data)
- Character editing (multiple steps, conditional fields)

---

## 🏗️ Architecture Decisions

### Decision: 7-Table Normalized Schema

**Chosen:** Separate tables for characters, skills, features, inventory, etc.

**Rationale:**
- **Flexibility:** Easy to add/remove skills without touching character data
- **Performance:** Better queries for filtering/sorting
- **Data Integrity:** Foreign keys prevent orphaned records
- **Scalability:** Can handle hundreds of custom skills/items

**Tradeoff:**
- ❌ More complex queries (JOINs)
- ✅ Much cleaner data model

---

### Decision: Auto-Calculate vs Manual Entry for Derived Stats

**Chosen:** Auto-calculate proficiency bonus and initiative

**Rationale:**
- **Accuracy:** Prevents manual calculation errors
- **UX:** One less thing for users to track
- **D&D Rules:** Proficiency = `2 + floor((level - 1) / 4)`

**Manual Entry Still Allowed:**
- HP (varies by class, CON, level-up rolls)
- AC (depends on armor, DEX, class features)
- Speed (varies by race, features)

---

## 🔧 Development Workflow Decisions

### Decision: Desktop Launcher App (macOS .app)

**Chosen:** Custom launcher that runs `start-app.sh`

**Rationale:**
- **User-Friendly:** Double-click to start development
- **No Terminal Knowledge:** Non-developers can run app
- **Consistent:** Same experience every launch

**How It Works:**
```bash
# ToT Character Viewer Dev.app/Contents/MacOS/launcher
#!/bin/bash
cd "/Users/treeoftales/Documents/ToT Code/ToT Character Viewer/ToT-Character-Viewer"
./start-app.sh
```

---

### Decision: Four Separate Documentation Files

**Chosen:** PLAN.md, TODO.md, SYSTEM.md, DECISIONS.md

**Rationale:**
- **Clarity:** Each file has a specific purpose
- **Maintainability:** Easier to update specific sections
- **Reference:** Quick lookup for developers
- **Non-Developer Friendly:** Clear structure with comments

**File Purposes:**
- **PLAN.md** - Vision, design principles, resources
- **TODO.md** - Task tracking (updated frequently)
- **SYSTEM.md** - Technical architecture, file structure
- **DECISIONS.md** - This file - why we made specific choices

---

## 🐛 Critical Fixes & Lessons Learned

### Lesson: Tailwind CSS 4 Requires PostCSS Plugin

**Problem:** White screen, no styles applied

**Root Cause:** Tailwind CSS 4 changed from config file to CSS imports

**Solution:**
1. Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```
2. Install `@tailwindcss/postcss` package
3. Update `src/index.css` to use `@import "tailwindcss"`

**Lesson Learned:** Always check migration guides for major version updates

---

### Lesson: Tauri Requires Explicit SQL Permissions

**Problem:** "sql.load not allowed" error

**Root Cause:** Tauri's security model blocks all system operations by default

**Solution:**
Update `src-tauri/capabilities/default.json`:
```json
{
  "permissions": [
    "core:default",
    "sql:allow-load",
    "sql:allow-execute",
    "sql:allow-select",
    "sql:allow-close"
  ]
}
```

**Lesson Learned:** Security-first design requires explicit permission grants

---

### Lesson: Simpler is Better (Component Crashes)

**Problem:** Complex components with Zustand kept crashing (white screen)

**Root Cause:** Too many dependencies, complex state management

**Solution:** Simplified to direct database access with local state

**Lesson Learned:**
- Start simple, add complexity only when needed
- Complex state management isn't always better
- Direct database queries work great for small-scale apps

---

## 🎨 UI/UX Decisions (October 5, 2025)

### Decision: Tabbed Navigation for Character Content

**Chosen:** Tab system with Skills, Actions, Spells, Features

**Rationale:**
- Keeps interface clean and organized
- Allows focus on one content area at a time
- Reduces scrolling and visual clutter
- Easy to expand with new tabs in future
- Common pattern users understand

**Implementation:**
- Tabs below HP row for logical flow
- Icons for quick recognition (Award, Swords, Sparkles, Star)
- Active tab highlighted with blue color and underline
- State managed with simple `activeTab` useState

---

### Decision: Compact Top Rows for More Content Space

**Chosen:** Dramatically reduced padding, gaps, and font sizes in top 3 rows

**Rationale:**
- Ability scores are reference info, don't need large display
- Core stats (AC, Initiative, etc.) are frequently viewed but don't need huge space
- HP is important but compact horizontal layout works better
- Frees up vertical space for skills and features (the main content)
- Better information density without sacrificing readability

**Changes Made:**
- Attributes: `p-3→p-2`, `gap-3→gap-2`, `text-2xl→text-xl`
- Core Stats: `p-4→p-2`, `gap-4→gap-2`, `text-3xl→text-xl`, labels shortened
- HP: `p-4→p-3`, horizontal layout, smaller buttons

---

### Decision: Color-Coded Skill Bonuses

**Chosen:** Match skill bonus colors to proficiency indicators

**Rationale:**
- Visual consistency - icons and numbers match
- Easier to scan for proficient skills at a glance
- No need to look at icon, the number color tells you proficiency level
- Professional D&D apps use similar visual patterns

**Color Scheme:**
- Gray (slate-400): Not proficient
- Blue (blue-400): Proficient
- Yellow (yellow-400): Expertise

---

### Decision: Icons for Core Stats

**Chosen:** Shield, Zap, Footprints, Award icons

**Rationale:**
- Makes stats instantly recognizable
- Reduces cognitive load
- Fits D&D theme (shield for AC, lightning for initiative, etc.)
- Professional polish with minimal effort

---

## 📋 Development Rules (Established October 5, 2025)

### Rule 1: Always Update TODO.md
- Move completed tasks to bottom
- Keep in-progress and upcoming tasks at top
- Update frequently during development

### Rule 2: Comment Everything
- All functions get JSDoc comments
- Complex logic gets inline comments
- Assume reader is not a developer

### Rule 3: Four Documentation Files
- **PLAN.md** - Vision and design
- **TODO.md** - Task tracking
- **SYSTEM.md** - Architecture
- **DECISIONS.md** - Why we made choices

### Rule 4: Keep It Simple
- Prefer simple solutions over complex ones
- Only add complexity when clearly needed
- Favor readability over cleverness

---

**Last Updated:** October 5, 2025
