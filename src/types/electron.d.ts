export interface ElectronAPI {
  getVersion: () => string;
  getPlatform: () => string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}