# ToT Character Viewer

A minimalistic D&D character sheet application built with modern web technologies. Designed for tracking homebrew classes and content from Valdas Spire of Secrets (Investigator/Detective).

## Features

- ✨ **Character Management**: Create, view, edit, and delete characters
- 📊 **Core Stats**: Track attributes, skills, HP, AC, initiative, and more
- 🎒 **Inventory System**: Manage equipment with categories, weight, and value
- ⚡ **Features & Traits**: Add custom abilities, class features, and racial traits
- 🎯 **Skills Management**: Create custom skills with proficiency and expertise
- 📈 **Level Progression**: Track experience and level advancement
- 💾 **Local Storage**: All data stored locally in SQLite database
- 🎨 **Minimalist UI**: Clean, dark-themed interface with Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation
- **Lucide React** - Icons

### Backend
- **Tauri 2.0** - Desktop application framework (Rust)
- **SQLite** - Local database via tauri-plugin-sql

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or later)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Rust** (Required for Tauri)
   - Install from [rustup.rs](https://rustup.rs/)
   - Run: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

3. **System Dependencies** (for Tauri)
   - **macOS**: Xcode Command Line Tools
     ```bash
     xcode-select --install
     ```
   - **Linux**:
     ```bash
     sudo apt update
     sudo apt install libwebkit2gtk-4.1-dev \
       build-essential \
       curl \
       wget \
       file \
       libxdo-dev \
       libssl-dev \
       libayatana-appindicator3-dev \
       librsvg2-dev
     ```
   - **Windows**: Microsoft C++ Build Tools
     - Download from [Visual Studio](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

## Installation

1. **Clone the repository**
   ```bash
   cd ToT-Character-Viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify Rust installation**
   ```bash
   rustc --version
   cargo --version
   ```

## Development

### Run in development mode

```bash
npm run tauri:dev
```

This will:
1. Start the Vite development server
2. Launch the Tauri application
3. Enable hot-reload for both frontend and backend

### Build for production

```bash
npm run tauri:build
```

The built application will be in `src-tauri/target/release/bundle/`

## Project Structure

```
ToT-Character-Viewer/
├── src/
│   ├── components/          # React components
│   │   ├── CharacterList.tsx
│   │   ├── CharacterSheet.tsx
│   │   ├── AttributeBlock.tsx
│   │   ├── SkillsList.tsx
│   │   ├── InventoryList.tsx
│   │   └── FeaturesList.tsx
│   ├── store/              # Zustand state management
│   │   └── characterStore.ts
│   ├── types/              # TypeScript types
│   │   └── character.ts
│   ├── lib/                # Utilities
│   │   └── database.ts
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── src-tauri/              # Tauri/Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
└── package.json
```

## Database Schema

The application uses SQLite with the following tables:

- **characters** - Core character data (name, class, level, attributes, etc.)
- **skills** - Character skills with proficiency tracking
- **saving_throws** - Saving throw proficiencies
- **features** - Class features and special abilities
- **traits** - Racial and other traits
- **inventory** - Equipment and items
- **actions** - Combat actions and abilities

## Next Steps / Roadmap

### Immediate
- [ ] Create character form with validation
- [ ] Edit character functionality
- [ ] Add/remove custom skills
- [ ] Add/remove inventory items
- [ ] Level up functionality

### Future Features
- [ ] Actions/Combat tracking
- [ ] Spellcasting support
- [ ] Character import/export (JSON)
- [ ] PDF character sheet export
- [ ] D&D 5e SRD API integration
- [ ] Dice roller
- [ ] Multiple character sheets/campaigns
- [ ] Character portraits/images

## Contributing

This is a personal project, but suggestions and ideas are welcome!

## License

MIT

## Acknowledgments

- Valdas Spire of Secrets by Mage Hand Press
- D&D 5e System Reference Document (SRD)
- Tauri Team for the amazing framework
- React and TypeScript communities

---

**Note**: This application requires Rust to be installed. If you encounter issues during development, ensure Rust is properly installed and up to date.
