# ToT Character Viewer - Task List

> **Note:** This file is updated frequently during development. Completed tasks are moved to the bottom.

---

## 🚧 In Progress

*Currently working on:* Spells System (feature/spells branch)

---

## 📝 Next Up (Immediate Priorities)

**Phase 7: Spells System** *(Starting October 6, 2025)*
- [ ] Add spell modifiers section under Spells tab
- [ ] Add toggleable Rushed Incantation charges section
- [ ] Create searchable spell cards list component
- [ ] Add iconography to spell cards (spell type, category, VSM components, material costs)

**Phase 8: Money/Gold System**
- [ ] Add total gold display to main header (next to core stats)
- [ ] Create Money/Gold tab in sub-menu navigation
- [ ] Create transaction tracker with add/subtract functionality
- [ ] Transaction history with description, amount, and timestamp
- [ ] Support for multiple currency types (GP, SP, CP, etc.)
- [ ] Auto-calculate total value in gold pieces

**Option 3B: Features & Traits System**
- [ ] Add features/traits display section
- [ ] Create "Add Custom Feature" form for class features
- [ ] Create "Add Custom Trait" form for personality/racial traits
- [ ] Display features with uses per rest tracking

**Option 4: Inventory System**
- [ ] Create "Add Inventory Item" form
- [ ] Display inventory list with categories (weapons, armor, gear, etc.)
- [ ] Equipment management (equip/unequip)
- [ ] Weight/encumbrance tracking
- [ ] Currency management (GP, SP, CP, etc.)

**Option 5: Character Editing**
- [ ] Add "Edit Character" button to character sheet header
- [ ] Modal form to edit name, class, race, background, level
- [ ] Inline editing for ability scores
- [ ] Inline editing for HP, AC, speed

---

## 🔮 Future Features

- [ ] Level up system with XP tracking and automatic proficiency bonus calculation
- [ ] Combat actions tracking (attacks, special abilities)
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

## ✅ Completed Tasks

**Phase 1: Project Setup & Foundation**
- [x] Initialize Tauri + React + TypeScript project
- [x] Set up Tailwind CSS 4 and configure Vite + PostCSS
- [x] Set up SQLite integration via tauri-plugin-sql with permissions
- [x] Install React Hook Form, Zod, and Lucide icons
- [x] Create database schema for character, skills, inventory, features
- [x] Set up project structure and core components
- [x] Create README with setup instructions
- [x] Install Rust and verify Tauri functionality
- [x] Create desktop launcher app
- [x] Fix Tailwind CSS configuration (PostCSS plugin)
- [x] Configure Tauri SQL permissions (allow-load, allow-execute, allow-select)

**Phase 2: Basic Character Creation & Display**
- [x] **Character creation working** - Simple form with name, class, race
- [x] **Character list display** - Shows all characters from database in sidebar
- [x] **Character selection** - Click to view full character sheet
- [x] **Character sheet display** - Shows stats, attributes, HP, AC, etc.

**Phase 3: Enhanced Character Creation**
- [x] Add all 6 ability scores to creation form (STR, DEX, CON, INT, WIS, CHA)
- [x] Add Level input (1-20)
- [x] Add HP, AC, Speed inputs
- [x] Auto-calculate proficiency bonus based on level
- [x] Auto-calculate initiative from DEX modifier
- [x] Organize form into sections: Basic Info, Ability Scores, Core Stats

**Phase 4: Character Management**
- [x] HP management - Damage/Heal buttons with prompt input
- [x] Delete character functionality with confirmation dialog
- [x] Delete button in character sheet header

**Phase 5: Skills System** *(October 5, 2025)*
- [x] Add default D&D 5e skills to database initialization (18 standard skills)
- [x] Create SkillsDisplay component with proficiency/expertise indicators
- [x] Add skills section to character sheet
- [x] Implement proficiency toggle (cycles: none → proficient → expertise)
- [x] Calculate skill bonuses automatically (ability modifier + proficiency)
- [x] Create "Add Custom Skill" form for Valdas/homebrew content
- [x] Visual indicators: empty circle (none), filled circle (proficient), double circle (expertise)
- [x] Color-code custom skills in purple
- [x] Color-code skill bonuses to match proficiency level (gray/blue/yellow)
- [x] Add helper button to populate skills for existing characters

**Phase 6: UI Improvements** *(October 5, 2025)*
- [x] Reorganize layout - move attributes to top
- [x] Make attributes row more compact (smaller padding, gaps, font sizes)
- [x] Add icons to core stats (Shield, Zap, Footprints, Award)
- [x] Dramatically compact top three rows for more content space
- [x] Create tabbed navigation (Skills, Actions, Spells, Features)
- [x] Implement tab switching with active state highlighting

**Git & Documentation**
- [x] Initial commit with all foundation work
- [x] Create new branch for skills system feature
- [x] Split documentation into 4 separate files (PLAN.md, TODO.md, SYSTEM.md, DECISIONS.md)
- [x] Push feature/skills-system branch to GitHub

---

**Last Updated:** October 5, 2025
