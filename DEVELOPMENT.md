# Development Notes

## Electron Architecture

This application uses Electron's main/renderer process architecture:

### Main Process (`electron/main.js`)
- Creates and manages the BrowserWindow
- Runs an integrated Express server on port 3001
- Handles application lifecycle events
- Provides secure APIs to the renderer process

### Renderer Process (`src/` React app)
- Runs in a sandboxed environment
- Communicates with main process through `preload.js`
- Automatically detects Electron environment and uses appropriate backend URL

### Preload Script (`electron/preload.js`)
- Provides secure communication bridge
- Exposes limited APIs to the renderer process
- Follows Electron security best practices

## Adding Robot Communication

To connect to real robots:

1. Add robot communication logic to `electron/main.js`
2. Expose robot APIs through the preload script
3. Update React components to use real robot data instead of simulated data
4. Consider adding robot connection management UI

## Security Considerations

- Context isolation is enabled
- Node integration is disabled in renderer
- Remote module is disabled
- Only specific APIs are exposed through preload script

## Platform-Specific Notes

### Windows
- Uses NSIS installer by default
- Can create portable executables with additional configuration

### macOS
- Creates standard `.app` bundle
- Code signing and notarization needed for distribution

### Linux
- Creates AppImage by default
- Also supports .deb and .rpm with additional configuration