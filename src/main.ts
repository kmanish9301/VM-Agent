import { app, BrowserWindow, ipcMain, Menu, screen } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow;

function createWindow(width = 650, height = 650) {
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
    startURL = process.env['ELECTRON_RENDERER_URL'] || 'http://localhost:5173';
  } else {
    startURL = `file://${path.join(__dirname, '../renderer/main_window/index.html')}`;
  }

  mainWindow.loadURL(startURL).catch(console.error);
}

// Handle OTP verification
ipcMain.on("verify-otp", (event, otpValue) => {
  if (otpValue === "1234567890") {
    event.sender.send("otp-verified");
  } else {
    event.sender.send("otp-error", "Invalid OTP. Please try again.");
  }
});

// Shrink and move to bottom-right
ipcMain.on("otp-verified", () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const newWidth = 100;
  const newHeight = 100;

  mainWindow.setBackgroundColor('#000000');

  mainWindow.setBounds({
    x: width - newWidth - 20,
    y: height - newHeight - 20,
    width: newWidth,
    height: newHeight,
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
});

// Expand agent window
ipcMain.on("expand-agent", () => {
  const width = 450;
  const height = 700;
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  mainWindow.setBackgroundColor('#00000000');

  mainWindow.setBounds({
    width,
    height,
    x: screenSize.width - width - 20,
    y: screenSize.height - height - 20,
  });

  mainWindow.show();
});

// Collapse agent window
ipcMain.on("collapse-agent", () => {
  const width = 100;
  const height = 100;
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  mainWindow.setBackgroundColor('#00000000');

  mainWindow.setBounds({
    width,
    height,
    x: screenSize.width - width - 20,
    y: screenSize.height - height - 20,
  });

  mainWindow.show();
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

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
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});