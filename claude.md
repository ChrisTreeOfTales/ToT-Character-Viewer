# ToT Character Viewer - Development Plan & Progress

## 📋 Living Todo List

### ✅ Completed
- [x] Initialize Tauri + React + TypeScript project
- [x] Set up Tailwind CSS 4 and configure Vite + PostCSS
- [x] Set up SQLite integration via tauri-plugin-sql with permissions
- [x] Install React Hook Form, Zod, and Lucide icons
- [x] Create database schema for character, skills, inventory, features
- [x] Set up project structure and core components
- [x] Create README with setup instructions
- [x] Install Rust and verify Tauri functionality
- [x] Create desktop launcher app
- [x] **Character creation working** - Simple form with name, class, race
- [x] **Character list display** - Shows all characters from database
- [x] **Character selection** - Click to view full character sheet
- [x] **Character sheet display** - Shows stats, attributes, HP, AC, etc.
- [x] Fix Tailwind CSS configuration (PostCSS plugin)
- [x] Configure Tauri SQL permissions (allow-load, allow-execute, allow-select)

### 🚧 In Progress
- [ ] None currently

### 📝 Next Up (Immediate Priorities)
**Option 1: Enhance Character Creation**
- [ ] Add full character form with all attributes (background, ability scores, HP, AC, speed)
- [ ] Use React Hook Form + Zod validation for better UX
- [ ] Point-buy calculator for ability scores

**Option 2: Character Management**
- [ ] Edit character functionality (inline editing for HP, notes, etc.)
- [ ] Delete character with confirmation dialog
- [ ] Duplicate character feature

**Option 3: Skills & Features**
- [ ] Add default D&D 5e skills to characters
- [ ] Create "Add Custom Skill" form
- [ ] Add custom features/traits forms
- [ ] Skills proficiency toggle

**Option 4: Inventory System**
- [ ] Create "Add Inventory Item" form
- [ ] Equipment management (equip/unequip)
- [ ] Weight/encumbrance tracking
- [ ] Currency management

### 🔮 Future Features
- [ ] Level up system with XP tracking and automatic proficiency bonus calculation
- [ ] Add/edit/delete features and traits
- [ ] Combat actions tracking
- [ ] Spellcasting support (spell slots, prepared spells, spell lists)
- [ ] Character import/export (JSON format)
- [ ] PDF character sheet export
- [ ] Integrate D&D 5e SRD API for spell/item lookups
- [ ] Built-in dice roller with history
- [ ] Multiple campaigns/character organization
- [ ] Character portraits/avatar images
- [ ] Dark/light theme toggle
- [ ] Backup/restore functionality
- [ ] Print character sheet

---

## 🎯 Project Vision

A minimalistic, lightweight D&D character sheet application specifically designed for:
- **Homebrew classes** - Full customization support
- **Valdas Spire of Secrets content** - Investigator/Detective class
- **Local-first** - All data stored in SQLite, no internet required
- **Fast & responsive** - Built with modern web tech (React 19, Tailwind CSS 4)
- **Desktop native** - Tauri 2.0 for small bundle size and native performance

---

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** - Latest React with improved performance
- **TypeScript** - Full type safety across the application
- **Vite 7** - Lightning-fast build tool with HMR
- **Tailwind CSS 4** - Modern utility-first CSS with new features
- **Zustand** - Lightweight state management (simpler than Redux)
- **React Hook Form** - Performant form handling with minimal re-renders
- **Zod** - Runtime validation + TypeScript type generation
- **Lucide React** - Beautiful, consistent icon library

### Backend Stack
- **Tauri 2.0** - Rust-based desktop framework (vs Electron)
  - ~5-10MB bundle size vs Electron's 85MB+
  - ~30-40MB memory usage vs Electron's 100MB+
  - Better security model
  - Native OS integrations
- **tauri-plugin-sql** - SQLite database integration
- **Rust** - Safe, fast backend with compile-time guarantees

### Database Schema

**Tables:**
1. **characters** - Core character data
   - id, name, class, level, race, background
   - Attributes (STR, DEX, CON, INT, WIS, CHA)
   - Calculated values (AC, HP, initiative, speed, proficiency bonus)
   - Experience points, notes, timestamps

2. **skills** - Character skills
   - Links to character
   - Name, attribute, proficiency, expertise
   - Custom modifier, custom flag, description

3. **saving_throws** - Saving throw proficiencies
   - Links to character
   - Attribute, proficiency status, bonus

4. **features** - Class features and abilities
   - Links to character
   - Name, description, source, level
   - Uses per rest (max, current, rest type)
   - Custom flag

5. **traits** - Racial and other traits
   - Links to character
   - Name, description, source, custom flag

6. **inventory** - Equipment and items
   - Links to character
   - Name, quantity, weight, value (amount + currency)
   - Description, equipped status, category
   - Properties (JSON array), custom flag

7. **actions** - Combat actions (future)
   - Links to character
   - Name, type, description
   - Attack stats (to hit, damage, damage type, range)
   - Save DC info, source, custom flag

---

## 📁 Project Structure

```
ToT-Character-Viewer/
├── src/
│   ├── components/          # React UI components
│   │   ├── CharacterList.tsx       # Sidebar with character selector
│   │   ├── CharacterSheet.tsx      # Main character display
│   │   ├── AttributeBlock.tsx      # STR, DEX, CON display blocks
│   │   ├── SkillsList.tsx          # Skills with proficiency icons
│   │   ├── InventoryList.tsx       # Equipment list with categories
│   │   └── FeaturesList.tsx        # Features & traits display
│   ├── store/              # Zustand state management
│   │   └── characterStore.ts       # Character CRUD operations
│   ├── types/              # TypeScript type definitions
│   │   └── character.ts            # All character-related types
│   ├── lib/                # Utility functions
│   │   └── database.ts             # SQLite initialization & schema
│   ├── hooks/              # Custom React hooks (future)
│   ├── App.tsx             # Main application layout
│   ├── main.tsx            # React entry point
│   └── index.css           # Tailwind CSS imports
├── src-tauri/              # Tauri/Rust backend
│   ├── src/
│   │   ├── main.rs                 # Rust entry point
│   │   └── lib.rs                  # Tauri app configuration
│   ├── Cargo.toml                  # Rust dependencies
│   ├── tauri.conf.json             # Tauri app configuration
│   └── icons/                      # App icons
├── start-app.sh            # Development launcher script
├── ToT Character Viewer Dev.app    # macOS desktop launcher
├── package.json            # Node.js dependencies & scripts
├── tailwind.config.js      # Tailwind configuration (if added)
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # User-facing documentation
```

---

## 🎨 UI/UX Design Principles

### Color Scheme
- **Dark theme** - Slate 900/800/700 backgrounds
- **Accent colors** - Blue for primary actions, Red for HP, Yellow/Purple for features
- **Minimalist** - Clean, distraction-free interface

### Layout
- **Sidebar** (left) - Character list with quick switching
- **Main area** (right) - Character sheet with all details
- **Responsive grid** - Flexbox/Grid for adaptive layouts

### Components Philosophy
- **Atomic design** - Small, reusable components
- **Accessibility** - Proper ARIA labels, keyboard navigation
- **Performance** - Lazy loading, memoization where needed

---

## 🔄 Data Flow

### Character Loading
1. App starts → `initDatabase()` creates/opens SQLite DB
2. `loadCharacters()` fetches all characters with associated data
3. Characters stored in Zustand store
4. UI subscribes to store updates via hooks

### Character Updates
1. User edits character → Form validation (Zod)
2. `updateCharacter()` called with new data
3. SQLite updated via Tauri SQL plugin
4. Zustand store refreshed
5. UI auto-updates via React re-render

### Custom Content
- All custom skills/features/items marked with `isCustom: true`
- Can be edited/deleted unlike base D&D content
- Source field tracks origin (e.g., "Valdas Spire of Secrets", "Homebrew")

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

## 📚 Key Technologies & Why We Chose Them

### Tauri vs Electron
- **35% smaller bundle** - 5-10MB vs 85MB+
- **Lower memory usage** - ~30-40MB vs 100MB+
- **Better security** - Rust's safety guarantees
- **Faster startup** - Native OS rendering

### Zustand vs Redux
- **Simpler API** - Less boilerplate
- **Smaller bundle** - ~1KB vs 10KB+
- **No providers** - Direct hook usage
- **Built-in persistence** - Easy SQLite integration

### React Hook Form + Zod
- **Performance** - Uncontrolled components, minimal re-renders
- **Type safety** - Zod generates TypeScript types from schemas
- **Validation** - Runtime + compile-time validation
- **DX** - Great developer experience

### Tailwind CSS 4
- **No config needed** - CSS imports, no JS config
- **Smaller bundle** - Tree-shaking unused styles
- **Modern features** - Container queries, cascade layers
- **Utility-first** - Fast prototyping, consistent design

---

## 🎲 D&D 5e Integration Plans

### Current
- Manual entry of all character data
- Support for homebrew classes (Investigator/Detective)
- Custom skills, features, traits, items

### Future (D&D 5e SRD API)
- Auto-populate standard skills (Acrobatics, Athletics, etc.)
- Spell lookups and descriptions
- Equipment database
- Class feature templates
- Race trait templates

**API:** https://5e-bits.github.io/docs/
- REST and GraphQL endpoints
- Official SRD content (free, legal)
- Community maintained

---

## 🐛 Known Issues / Tech Debt

### Current
- None yet - fresh project! 🎉

### To Watch
- First Rust build is slow (normal, caching helps)
- Database migrations not implemented (will need for schema changes)
- No error boundaries in React components yet
- No loading states for async operations

---

## 📖 Resources & References

### Documentation
- [Tauri 2.0 Docs](https://tauri.app/start/)
- [React 19 Docs](https://react.dev/)
- [Zustand Docs](https://zustand.docs.pmnd.rs/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### D&D Resources
- [D&D 5e SRD API](https://5e-bits.github.io/docs/)
- [Valdas Spire of Secrets](https://store.magehandpress.com/products/valdas-spire-of-secrets) by Mage Hand Press

### Inspiration
- D&D Beyond (feature-rich but bloated)
- Roll20 character sheets (good UI patterns)
- Avrae (Discord bot with great character tracking)

---

## 🚀 Next Session Plan

**Focus:** Character Creation & Editing

1. **Create Character Form Component**
   - Modal dialog with form fields
   - Name, class, level, race, background
   - Attribute point buy or manual entry
   - Zod validation schema
   - Submit → creates character in DB

2. **Add "New Character" Button**
   - In CharacterList sidebar
   - Opens modal with empty form
   - Success → loads new character in main view

3. **Inline Editing**
   - Click to edit HP, AC, attributes
   - Auto-save on blur
   - Optimistic UI updates

4. **Default Skills**
   - Seed database with standard D&D 5e skills
   - On first character creation or app first run
   - Use D&D 5e SRD data

---

**Last Updated:** October 5, 2025
**Current Version:** 0.0.1 (Development)
