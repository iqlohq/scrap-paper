import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
  onWindowFocus(callback: (event: Electron.IpcRendererEvent) => void) {
    ipcRenderer.on("window-focus", callback);
  },
  onWindowBlur(callback: (event: Electron.IpcRendererEvent) => void) {
    ipcRenderer.on("window-blur", callback);
  },
  removeWindowFocus(callback: (event: Electron.IpcRendererEvent) => void) {
    ipcRenderer.removeListener("window-focus", callback);
  },
  removeWindowBlur(callback: (event: Electron.IpcRendererEvent) => void) {
    ipcRenderer.removeListener("window-blur", callback);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
