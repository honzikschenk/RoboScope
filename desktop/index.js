const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fetchTelemetryData, sampleData } = require('../telemetry');
const { createGraph, updateGraph } = require('../telemetry/graphs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  // Periodically fetch telemetry data and update the UI
  setInterval(() => {
    fetchTelemetryData().then(data => {
      mainWindow.webContents.send('update-data', data);
    });
  }, 5000);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
