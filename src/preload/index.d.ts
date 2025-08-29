import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      onWindowFocus: (
        callback: (event: Electron.IpcRendererEvent) => void
      ) => void;
      onWindowBlur: (
        callback: (event: Electron.IpcRendererEvent) => void
      ) => void;
      removeWindowFocus: (
        callback: (event: Electron.IpcRendererEvent) => void
      ) => void;
      removeWindowBlur: (
        callback: (event: Electron.IpcRendererEvent) => void
      ) => void;
    };
  }
}
