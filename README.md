# RoboScope - Robot Telemetry Dashboard

A standalone cross-platform desktop application for monitoring robot telemetry data with customizable, draggable windows.

> [!NOTE]  
> This is a work in progress. Currently, it uses simulated data and does not connect to real robots.

## Features

- **Cross-platform**: Runs on Windows, macOS, and Linux
- **Standalone**: No need for separate server setup
- **Draggable Windows**: Customize the layout by dragging and resizing data windows
- **Real-time Data**: Live updates of motor positions, battery level, step count, and error logs
- **Persistent Layout**: Window configurations are automatically saved
- **Multiple Data Views**: Motor positions (chart), battery level, step counter, and error log

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run electron-dev
   ```
   This starts both the Vite dev server and Electron app.

3. **Build for production:**
   ```bash
   npm run dist
   ```
   Creates distributables for your current platform in the `build/` directory.

## Building for Distribution

### Build for Current Platform
```bash
npm run dist
```

### Build for Specific Platforms
```bash
# For Windows
npm run build && npx electron-builder --win

# For macOS  
npm run build && npx electron-builder --mac

# For Linux
npm run build && npx electron-builder --linux
```

The built applications will be available in the `build/` directory.

## Development Scripts

- `npm run electron` - Start Electron app (requires built frontend)
- `npm run electron-dev` - Start both Vite and Electron in development mode
- `npm run build` - Build the frontend for production
- `npm run build-electron` - Build and package Electron app
- `npm run dist` - Build and create distributables
- `npm run lint` - Run ESLint

## Usage

1. **Adding Windows**: Use the dropdown at the bottom to select a data type and click "Add Window"
2. **Moving Windows**: Click and drag the top bar of any window
3. **Resizing Windows**: Click and drag the resize handle at the bottom-right corner
4. **Removing Windows**: Click the button in the top-right corner of any window
5. **Saving Layout**: Click "Save Config" to persist your window arrangement

## Project Structure

```dir
RoboScope/
├── src/                 # React frontend source code
├── electron/            # Electron main process and preload scripts
├── public/              # Static assets and configuration files
├── dist/                # Built frontend files
├── build/               # Electron app distributables
└── server.js            # Legacy Express server (for web version)
```

## Technical Details

- **Frontend**: React 19 with TypeScript and TailwindCSS
- **Backend**: Express server integrated into Electron main process
- **Desktop App**: Electron with secure preload scripts
- **Build Tool**: Vite for fast development and optimized builds
- **Packaging**: electron-builder for cross-platform distribution

## Architecture

The application runs as a standalone Electron app with:

- **Main Process**: Manages the application window and runs an integrated Express server
- **Renderer Process**: Runs the React application in a secure context
- **Preload Script**: Provides secure communication between main and renderer processes
