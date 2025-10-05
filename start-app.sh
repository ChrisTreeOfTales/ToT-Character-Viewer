#!/bin/bash

# ToT Character Viewer Launcher
# This script starts the development server for the D&D Character Viewer

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the project directory
cd "$SCRIPT_DIR"

# Add Rust to PATH if not already there
export PATH="$HOME/.cargo/bin:$PATH"

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed or not in PATH"
    echo "Please install Rust from https://rustup.rs"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the Tauri development server
echo "🚀 Starting ToT Character Viewer..."
echo "📂 Project: $SCRIPT_DIR"
echo ""

npm run tauri:dev
