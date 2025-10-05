# ToT Character Viewer - Task List

> **Note:** This file is updated frequently during development. Completed tasks are moved to the bottom.

---

## 🚧 In Progress

*Currently working on:* None - awaiting next feature selection

---

## 📝 Next Up (Immediate Priorities)

**Option 3: Skills & Features System**
- [ ] Add default D&D 5e skills to new characters (18 standard skills)
- [ ] Display skills in character sheet with proficiency indicators
- [ ] Create "Add Custom Skill" form for Valdas/homebrew content
- [ ] Add proficiency toggle for each skill
- [ ] Calculate skill bonuses (attribute modifier + proficiency if applicable)
- [ ] Add features/traits display section
- [ ] Create "Add Custom Feature" form

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

**Git & Documentation**
- [x] Initial commit with all foundation work
- [x] Create new branch for skills system feature
- [x] Split documentation into 4 separate files (PLAN.md, TODO.md, SYSTEM.md, DECISIONS.md)

---

**Last Updated:** October 5, 2025
