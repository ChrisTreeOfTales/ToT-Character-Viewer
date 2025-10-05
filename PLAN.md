# ToT Character Viewer - Development Plan

## 🎯 Project Vision

A minimalistic, lightweight D&D character sheet application specifically designed for:
- **Homebrew classes** - Full customization support
- **Valdas Spire of Secrets content** - Investigator/Detective class
- **Local-first** - All data stored in SQLite, no internet required
- **Fast & responsive** - Built with modern web tech (React 19, Tailwind CSS 4)
- **Desktop native** - Tauri 2.0 for small bundle size and native performance

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
- **Simplicity** - Keep code simple and well-commented for non-developers

---

## 🔄 Data Flow

### Character Loading
1. App starts → `initDatabase()` creates/opens SQLite DB
2. `loadCharacters()` fetches all characters with associated data
3. Characters displayed in sidebar
4. UI updates via React state

### Character Updates
1. User edits character → Direct database update
2. SQLite updated via Tauri SQL plugin
3. Local state refreshed
4. UI auto-updates via React re-render

### Custom Content
- All custom skills/features/items marked with `isCustom: true`
- Can be edited/deleted unlike base D&D content
- Source field tracks origin (e.g., "Valdas Spire of Secrets", "Homebrew")

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

## 📖 Resources & References

### Documentation
- [Tauri 2.0 Docs](https://tauri.app/start/)
- [React 19 Docs](https://react.dev/)
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

**Last Updated:** October 5, 2025
**Current Version:** 0.0.1 (Development)
