# ToT Character Viewer - System Architecture

## 🏗️ Technical Stack

### Frontend Stack
- **React 19** - Latest React with improved performance
- **TypeScript** - Full type safety across the application
- **Vite 7** - Lightning-fast build tool with HMR
- **Tailwind CSS 4** - Modern utility-first CSS with new features
- **React Hook Form** - Performant form handling (installed, not yet used)
- **Zod** - Runtime validation (installed, not yet used)
- **Lucide React** - Beautiful, consistent icon library

### Backend Stack
- **Tauri 2.0** - Rust-based desktop framework
  - ~5-10MB bundle size vs Electron's 85MB+
  - ~30-40MB memory usage vs Electron's 100MB+
  - Better security model
  - Native OS integrations
- **tauri-plugin-sql** - SQLite database integration
- **Rust** - Safe, fast backend with compile-time guarantees

---

## 📁 Project Structure

```
ToT-Character-Viewer/
├── src/                          # Frontend React application
│   ├── components/               # React UI components
│   │   ├── CharacterListSimple.tsx    # Sidebar with character list & creation form
│   │   ├── AttributeBlock.tsx         # Ability score display blocks (not yet used)
│   │   └── [other components]         # Created but not currently active
│   ├── store/                    # State management
│   │   └── characterStore.ts          # Zustand store (created but simplified away)
│   ├── types/                    # TypeScript type definitions
│   │   └── character.ts               # All character-related interfaces
│   ├── lib/                      # Utility functions
│   │   ├── database.ts                # SQLite initialization & schema
│   │   └── validations.ts             # Zod schemas (created but not used)
│   ├── App.tsx                   # Main application - character display & management
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Tailwind CSS imports
├── src-tauri/                    # Tauri/Rust backend
│   ├── src/
│   │   ├── main.rs                    # Rust entry point
│   │   └── lib.rs                     # Tauri app configuration
│   ├── Cargo.toml                     # Rust dependencies
│   ├── tauri.conf.json                # Tauri app configuration
│   ├── capabilities/
│   │   └── default.json               # Security permissions (includes SQL permissions)
│   └── icons/                         # App icons
├── start-app.sh                  # Development launcher script
├── ToT Character Viewer Dev.app  # macOS desktop launcher
├── package.json                  # Node.js dependencies & scripts
├── postcss.config.js             # PostCSS configuration (required for Tailwind CSS 4)
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── PLAN.md                       # Project vision & design principles
├── TODO.md                       # Task tracking (updated frequently)
├── SYSTEM.md                     # This file - technical architecture
├── DECISIONS.md                  # Key technical decisions & rationale
└── README.md                     # User-facing documentation
```

---

## 💾 Database Schema

### Tables

**1. characters** - Core character data
```sql
CREATE TABLE characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    race TEXT NOT NULL,
    background TEXT,

    -- Ability Scores
    strength INTEGER NOT NULL DEFAULT 10,
    dexterity INTEGER NOT NULL DEFAULT 10,
    constitution INTEGER NOT NULL DEFAULT 10,
    intelligence INTEGER NOT NULL DEFAULT 10,
    wisdom INTEGER NOT NULL DEFAULT 10,
    charisma INTEGER NOT NULL DEFAULT 10,

    -- Derived Stats
    proficiency_bonus INTEGER NOT NULL DEFAULT 2,
    armor_class INTEGER NOT NULL DEFAULT 10,
    initiative INTEGER NOT NULL DEFAULT 0,
    speed INTEGER NOT NULL DEFAULT 30,
    hit_points_max INTEGER NOT NULL DEFAULT 10,
    hit_points_current INTEGER NOT NULL DEFAULT 10,
    hit_dice TEXT,

    -- Progression
    experience_points INTEGER DEFAULT 0,

    -- Metadata
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

**2. skills** - Character skills (D&D 5e + custom)
```sql
CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    attribute TEXT NOT NULL,  -- 'strength', 'dexterity', etc.
    proficiency INTEGER DEFAULT 0,  -- 0 = none, 1 = proficient, 2 = expertise
    custom_modifier INTEGER DEFAULT 0,
    is_custom INTEGER DEFAULT 0,  -- 1 for Valdas/homebrew skills
    description TEXT,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

**3. saving_throws** - Saving throw proficiencies
```sql
CREATE TABLE saving_throws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    attribute TEXT NOT NULL,  -- 'strength', 'dexterity', etc.
    proficiency INTEGER DEFAULT 0,
    bonus INTEGER DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

**4. features** - Class features, racial abilities, etc.
```sql
CREATE TABLE features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    source TEXT,  -- 'Class', 'Race', 'Valdas Spire of Secrets', 'Homebrew'
    level_acquired INTEGER,
    uses_max INTEGER,
    uses_current INTEGER,
    rest_type TEXT,  -- 'short', 'long', 'none'
    is_custom INTEGER DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

**5. traits** - Personality traits, ideals, bonds, flaws
```sql
CREATE TABLE traits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    source TEXT,
    is_custom INTEGER DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

**6. inventory** - Equipment and items
```sql
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    weight REAL DEFAULT 0,
    value_amount REAL DEFAULT 0,
    value_currency TEXT DEFAULT 'gp',  -- 'cp', 'sp', 'gp', 'pp'
    description TEXT,
    equipped INTEGER DEFAULT 0,
    category TEXT,  -- 'weapon', 'armor', 'gear', 'treasure', etc.
    properties TEXT,  -- JSON array for special properties
    is_custom INTEGER DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

**7. actions** - Combat actions (attacks, spells, etc.)
```sql
CREATE TABLE actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- 'attack', 'spell', 'ability'
    description TEXT,
    attack_bonus INTEGER,
    damage_dice TEXT,  -- e.g., '1d8+3'
    damage_type TEXT,  -- 'slashing', 'fire', etc.
    range_value TEXT,  -- '5 ft.', '60/120 ft.', etc.
    save_dc INTEGER,
    save_attribute TEXT,  -- 'strength', 'dexterity', etc.
    source TEXT,
    is_custom INTEGER DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
```

---

## 🔧 Key Files & Their Purpose

### Frontend Components

**src/App.tsx**
- Main application component
- Manages character selection state
- Displays selected character sheet
- Contains HP management (damage/heal) functions
- Contains delete character function
- **Key Functions:**
  - `initDatabase()` - Initializes SQLite database
  - `loadCharacters()` - Fetches all characters from DB
  - `updateHP(newHP)` - Updates character's current HP
  - `deleteCharacter()` - Deletes character with confirmation

**src/components/CharacterListSimple.tsx**
- Sidebar component showing all characters
- Character creation form with all ability scores
- **Key Features:**
  - Character list with click-to-select
  - "New Character" button opens inline form
  - Auto-calculates proficiency bonus from level
  - Auto-calculates initiative from DEX modifier
  - Form validation (required fields)
  - Database insertion on form submit

### Type Definitions

**src/types/character.ts**
- TypeScript interfaces for all data structures
- **Key Interfaces:**
  - `Character` - Main character data structure
  - `Attributes` - Ability scores (STR, DEX, etc.)
  - `Skill`, `Feature`, `Trait`, `InventoryItem`, `Action`

### Database & Utilities

**src/lib/database.ts**
- SQLite database initialization
- Table schema definitions
- **Key Function:** `initDatabase()` - Creates tables if they don't exist

**src/lib/validations.ts**
- Zod validation schemas (created but not yet used)
- Will be used when React Hook Form is integrated

---

## 🛠️ Development Workflow

### Commands
```bash
# Start development server (with hot reload)
npm run tauri:dev

# Build for production
npm run tauri:build

# Run just the web UI (without Tauri)
npm run dev

# Lint code
npm run lint

# Type check
tsc --noEmit
```

### Desktop Launcher
- Double-click "ToT Character Viewer Dev.app" on desktop
- Opens Terminal and runs `start-app.sh`
- First build takes 2-5 minutes (Rust compilation)
- Subsequent builds are much faster (<30 seconds)

---

## 🔒 Security & Permissions

### Tauri Capabilities
File: `src-tauri/capabilities/default.json`

**Required SQL Permissions:**
- `sql:allow-load` - Load database file
- `sql:allow-execute` - Execute SQL commands
- `sql:allow-select` - Select/query data
- `sql:allow-close` - Close database connections

**Why This Matters:**
Tauri's security model requires explicit permission for all system operations. Without these permissions, the app cannot access the SQLite database.

---

## 🐛 Known Issues / Tech Debt

### Current Issues
- Database migrations not implemented (will need for schema changes)
- No error boundaries in React components yet
- No loading states for async operations
- Window reload used for list refresh (could use state updates instead)

### To Watch
- First Rust build is slow (normal, caching helps)
- Prompt-based input for HP changes (could use better modal UI)

---

**Last Updated:** October 5, 2025
