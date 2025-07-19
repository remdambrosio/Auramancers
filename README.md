# Auramancers

A Phaser project which will one day become a thing.

## Setup

### Prerequisites
- Node.js

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Start a local server at `http://localhost:8080` and open browser

   ```bash
   npm start
   ```
   Start a server without opening browser

### VSCode Development

#### Recommended Extensions
Extension recommendations which will be made when you open workspace in VSCode:
- **Live Server** - Alternative local development server with live reload
- **Prettier** - Code formatting
- **JSON** - Better JSON file support

#### Running Development Server
Can use VS Code's built-in task runner:
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select "Start Development Server"

### Structure
```
├── index.html          # Main HTML file
├── phaser.js          # Phaser 3 library
├── assets/            # Game assets (images, sounds, etc.)
├── src/               # Source code
│   ├── main.js        # Game configuration and startup
│   ├── scenes/        # Game scenes
│   └── gameObjects/   # Game object classes
```

### Notes
- Game uses ES6 modules, so it needs to be served from an HTTP server (not opened directly as a file)
- Development server disables caching with `-c-1` for easier development
- Game runs at 1280x720 resolution with responsive scaling
