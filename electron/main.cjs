const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let server;

// Integrated Express server
function createServer() {
  const expressApp = express();
  const port = 3001; // Use different port to avoid conflicts

  expressApp.use(cors());
  expressApp.use(express.json());
  
  // Serve static files from the public directory
  const publicPath = isDev 
    ? path.join(__dirname, '..', 'public')
    : path.join(process.resourcesPath, 'public');
  expressApp.use(express.static(publicPath));

  // API endpoint to save window configuration
  expressApp.post('/save-window-config', async (req, res) => {
    try {
      const config = req.body;
      const configPath = path.join(publicPath, 'window-config.json');
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      console.log('Window configuration saved successfully');
      res.send('Window configuration saved successfully');
    } catch (err) {
      console.error('Error saving window configuration:', err);
      res.status(500).send('Error saving window configuration');
    }
  });

  server = expressApp.listen(port, () => {
    console.log(`Electron backend server running on port ${port}`);
  });

  return server;
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '..', 'public', 'vite.svg'),
    show: false, // Don't show until ready
    titleBarStyle: 'default'
  });

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event listeners
app.whenReady().then(() => {
  // Start the integrated server
  createServer();
  
  // Create the main window
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // Close the server
  if (server) {
    server.close();
  }
  
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'http://localhost:3001') {
      event.preventDefault();
    }
  });
});