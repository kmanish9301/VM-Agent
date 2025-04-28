import { app, BrowserWindow, ipcMain, Menu, screen } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow;
let agentWindow: BrowserWindow | null = null;
let guidelines: string[] = [];

function createMainWindow(width = 650, height = 650) {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  const x = Math.floor((screenW - width) / 2);
  const y = Math.floor((screenH - height) / 2);

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    frame: false,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: '#FFFFFF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);

  const isDev = !app.isPackaged;

  let startURL: string;
  if (isDev) {
    startURL = process.env['ELECTRON_RENDERER_URL'] || 'http://localhost:3000';
  } else {
    startURL = `file://${path.join(__dirname, '../renderer/main_window/index.html')}`;
  }

  mainWindow.loadURL(startURL).catch(console.error);

  if (isDev) {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    });
  }
}

function createAgentWindow(collapsed = true) {
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = collapsed ? 100 : 540;
  const windowHeight = collapsed ? 100 : 640;

  agentWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: screenW - windowWidth - 20,
    y: screenH - windowHeight - 20,
    frame: false,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);

  const isDev = !app.isPackaged;

  let startURL: string;
  if (isDev) {
    startURL = `${process.env['ELECTRON_RENDERER_URL'] || 'http://localhost:3000'}?agent=true`;
  } else {
    startURL = `file://${path.join(__dirname, '../renderer/main_window/index.html')}?agent=true`;
  }

  agentWindow.loadURL(startURL).catch(console.error);

  agentWindow.webContents.on('did-finish-load', () => {
    if (agentWindow) {
      agentWindow.webContents.send('set-guidelines', guidelines);
    }
  });

  // Open DevTools for agent window as well if needed
  if (isDev) {
    agentWindow.webContents.once('dom-ready', () => {
      agentWindow.webContents.openDevTools({ mode: "detach" });
    });
  }
}

// Handle OTP verification
ipcMain.on("verify-otp", (event, data) => {
  // If we received an object with guidelines, extract them
  if (typeof data === 'object' && data.guidelines) {
    // Store the guidelines
    guidelines = data.guidelines;

    // Create agent window with the received guidelines
    createAgentWindow(true);

    // Hide the main window
    mainWindow.hide();

    // Notify the renderer that OTP was verified
    event.sender.send("otp-verified");
  } else {
    // If no guidelines were received, send an error
    event.sender.send("otp-error", "Invalid or incomplete data received. Please try again.");
  }
});

// Expand agent window
ipcMain.on("expand-agent", () => {
  if (!agentWindow) return;

  setTimeout(() => {
    const width = 540;
    const height = 650;
    const screenSize = screen.getPrimaryDisplay().workAreaSize;

    agentWindow.setBounds({
      width,
      height,
      x: screenSize.width - width - 20,
      y: screenSize.height - height - 20,
    });
  }, 50);
});

// Collapse agent window
ipcMain.on("collapse-agent", () => {
  if (!agentWindow) return;

  const width = 100;
  const height = 100;
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  agentWindow.setOpacity(0);

  setTimeout(() => {
    agentWindow.setBounds({
      width,
      height,
      x: screenSize.width - width - 20,
      y: screenSize.height - height - 20,
    });

    agentWindow.setOpacity(1);
  }, 200);
});

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();
  // Quit the app if display configuration changes
  screen.on('display-added', () => {
    app.quit();
  });

  screen.on('display-removed', () => {
    app.quit();
  });

  screen.on('display-metrics-changed', () => {
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});