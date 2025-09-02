import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  Notification,
  shell,
  Tray,
} from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";

let isQuitting = false;
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isTrayToggleInProgress = false;
let currentOpacity = 1.0; // range [0.1, 1.0]

function createWindow(): void {
  // Create the browser window.
  const win = new BrowserWindow({
    alwaysOnTop: true,
    minWidth: 300,
    minHeight: 300,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: "#1F1F1F",
    titleBarStyle: "hiddenInset",
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      devTools: is.dev,
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });
  mainWindow = win;

  win.on("close", (e) => {
    if (process.platform === "darwin" && !isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });

  win.on("ready-to-show", () => {
    win.show();
  });

  win.on("focus", () => {
    // Notify renderer that the window gained focus
    win.webContents.send("window-focus");
  });

  win.on("blur", () => {
    // Notify renderer that the window lost focus
    win.webContents.send("window-blur");
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

function toggleMainWindow(): void {
  if (!mainWindow) return;
  if (isTrayToggleInProgress) return;
  isTrayToggleInProgress = true;

  if (mainWindow.isVisible()) {
    mainWindow.once("hide", () => {
      isTrayToggleInProgress = false;
    });
    mainWindow.hide();
  } else {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.once("show", () => {
      mainWindow?.focus();
      isTrayToggleInProgress = false;
    });
    mainWindow.show();
  }
}

function createTray(): void {
  const transparentPngDataUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAucB9WH0X0EAAAAASUVORK5CYII=";
  const transparentImage = nativeImage.createFromDataURL(transparentPngDataUrl);
  tray = new Tray(transparentImage);
  tray.setTitle("✏️");
  tray.setToolTip("Scrap Paper");
  tray.setIgnoreDoubleClickEvents(true);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  // Only show context menu on right-click
  tray.on("right-click", () => {
    tray?.popUpContextMenu(contextMenu);
  });

  tray.on("click", () => {
    toggleMainWindow();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  ipcMain.on("notify", (_, msg: string) => {
    new Notification({
      title: "Scrap Paper",
      body: msg,
    }).show();
    app.dock?.bounce();
    app.dock?.setBadge("•");
  });

  ipcMain.on("adjust-opacity", (_, delta: number) => {
    if (!mainWindow) return;
    // Each delta step adjusts by 0.1 (10%)
    const step = 0.05;
    const next = Math.max(
      0.05,
      Math.min(
        1.0,
        parseFloat((currentOpacity + Math.sign(delta) * step).toFixed(2))
      )
    );
    currentOpacity = next;
    mainWindow.setOpacity(currentOpacity);
  });

  app.on("before-quit", () => {
    isQuitting = true;
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.dock?.setBadge("");
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
      createWindow();
    } else {
      // Show the existing hidden window
      windows[0].show();
    }
  });

  createWindow();
  createTray();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
