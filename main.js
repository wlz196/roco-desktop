const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

// Some Windows environments deny default GPU cache writes; use a stable writable session path.
app.setPath('sessionData', path.join(app.getPath('userData'), 'session-data'));
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
// Avoid renderer/GPU crashes on some Windows driver setups.
app.disableHardwareAcceleration();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    backgroundColor: '#1a1a2e',
    alwaysOnTop: true, // 置顶以便在游戏旁伴随运行
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('[renderer gone]', details);
  });

  mainWindow.webContents.on('did-fail-load', (_event, code, desc, url) => {
    console.error('[did-fail-load]', code, desc, url);
  });

  mainWindow.loadFile('index.html');
}

ipcMain.on('fit-window-to-content', (event, size = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed() || win.isMaximized() || win.isFullScreen()) return;

  const display = screen.getDisplayMatching(win.getBounds());
  const work = display.workArea;

  const requestedWidth = Math.ceil(Number(size.width) || 0);
  const requestedHeight = Math.ceil(Number(size.height) || 0);

  const minWidth = 860;
  const minHeight = 620;
  const maxWidth = Math.max(minWidth, work.width - 20);
  const maxHeight = Math.max(minHeight, work.height - 20);

  const nextWidth = Math.max(minWidth, Math.min(maxWidth, requestedWidth || win.getContentBounds().width));
  const nextHeight = Math.max(minHeight, Math.min(maxHeight, requestedHeight || win.getContentBounds().height));

  const current = win.getContentBounds();
  if (Math.abs(current.width - nextWidth) < 2 && Math.abs(current.height - nextHeight) < 2) return;

  win.setContentSize(nextWidth, nextHeight, true);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});