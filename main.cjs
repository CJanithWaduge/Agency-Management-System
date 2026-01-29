const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell, dialog, systemPreferences } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const { machineIdSync } = require('node-machine-id');

// Disable hardware acceleration to prevent potential driver-related white screens
app.disableHardwareAcceleration();

const isDev = !app.isPackaged;

// Set database path before requiring database module
// In production (packaged), use app.getPath('userData')
// In development, use current directory
const dbDirPath = isDev
  ? path.join(process.cwd(), '.samindu-system')
  : path.join(app.getPath('userData'), '.samindu-system');

// Set environment variable for database module
process.env.SAMINDU_DB_PATH = dbDirPath;

// Load database module with correct path handling
const db = (() => {
  if (isDev) {
    return require('./src/backend/database.cjs');
  } else {
    // In production, database.cjs is within app.asar
    // Use app.getAppPath() to get the asar location
    const dbModulePath = path.join(app.getAppPath(), 'src/backend/database.cjs');
    delete require.cache[require.resolve('./src/backend/database.cjs')];
    return require(dbModulePath);
  }
})();

// ===== ELECTRON IPC: Provide Machine ID =====
ipcMain.handle('get-machine-id', async () => {
  try {
    const id = machineIdSync();
    console.log('Machine ID retrieved via node-machine-id:', id);
    return { success: true, machineId: id };
  } catch (error) {
    console.error('Failed to get machine ID via node-machine-id:', error);
    try {
      const fallbackId = os.hostname();
      console.log('Using fallback Machine ID (hostname):', fallbackId);
      return { success: true, machineId: fallbackId };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return { success: false, error: fallbackError.message };
    }
  }
});

// ===== ELECTRON IPC: Open External URLs =====
ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});


// ===== DATABASE IPC HANDLERS =====

// ITEMS HANDLERS
ipcMain.handle('db:items:getAll', async () => {
  return db.getItems();
});

ipcMain.handle('db:items:add', async (event, item) => {
  return db.addItem(item);
});

ipcMain.handle('db:items:update', async (event, id, item) => {
  return db.updateItem(id, item);
});

ipcMain.handle('db:items:delete', async (event, id) => {
  return db.deleteItem(id);
});

// SALES HANDLERS
ipcMain.handle('db:sales:getAll', async () => {
  return db.getSales();
});

ipcMain.handle('db:sales:add', async (event, sale) => {
  return db.addSale(sale);
});

ipcMain.handle('db:sales:update', async (event, id, sale) => {
  return db.updateSale(id, sale);
});

ipcMain.handle('db:sales:delete', async (event, id) => {
  return db.deleteSale(id);
});

// EXPENSES HANDLERS
ipcMain.handle('db:expenses:getAll', async () => {
  return db.getExpenses();
});

ipcMain.handle('db:expenses:add', async (event, expense) => {
  return db.addExpense(expense);
});

ipcMain.handle('db:expenses:delete', async (event, id) => {
  return db.deleteExpense(id);
});

// STATEMENTS HANDLERS
ipcMain.handle('db:statements:getAll', async () => {
  return db.getStatements();
});

ipcMain.handle('db:statements:add', async (event, statement) => {
  return db.addStatement(statement);
});

ipcMain.handle('db:statements:delete', async (event, id) => {
  return db.deleteStatement(id);
});

// ROUTES HANDLERS
ipcMain.handle('db:routes:getAll', async () => {
  return db.getRoutes();
});

ipcMain.handle('db:routes:add', async (event, name) => {
  return db.addRoute(name);
});

ipcMain.handle('db:routes:delete', async (event, name) => {
  return db.deleteRoute(name);
});

// SETTINGS HANDLERS
ipcMain.handle('db:settings:get', async (event, key) => {
  return db.getSetting(key);
});

ipcMain.handle('db:settings:set', async (event, key, value) => {
  return db.setSetting(key, value);
});

// DATABASE INITIALIZATION HANDLER
ipcMain.handle('db:init', async (event, username) => {
  return db.initializeDatabase(username);
});

// RESET HANDLER
ipcMain.handle('db:reset', async () => {
  return db.resetDatabase();
});

ipcMain.handle('db:delete-user', async (event, username) => {
  try {
    const dbFile = path.join(dbDirPath, `shop_system_${username}.db`);
    await fs.unlink(dbFile);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user database:', error);
    return { success: false, error: error.message };
  }
});

// ===== PDF SAVE HANDLER =====
ipcMain.handle('pdf:save', async (event, buffer, filename) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: filename || 'Monthly_Report.pdf',
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  });

  if (filePath) {
    await fs.writeFile(filePath, Buffer.from(buffer));
    return { success: true, filePath };
  }
  return { success: false, error: 'Cancelled' };
});

function createWindow() {
  console.log('Creating window...');
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Agency Management System',
    show: true, // Show immediately to prevent black screen
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true, // Enable DevTools to debug issues
      sandbox: false, // Sometimes necessary when using native modules like machine-id
    },
  });

  // Optimize window showing - removed ready-to-show to show immediately
  // win.once('ready-to-show', () => {
  //   console.log('Window ready to show');
  //   win.show();
  // });

  // Disable developer tools in production
  if (!isDev) {
    win.webContents.on('before-input-event', (event, input) => {
      if ((input.control && input.shift && input.key.toLowerCase() === 'i') ||
        input.key === 'F12' ||
        (input.meta && input.alt && input.key === 'i')) {
        event.preventDefault();
      }
    });
  }

  // This tells Electron to show our React app
  if (isDev) {
    const startUrl = process.env.VITE_PORT
      ? `http://localhost:${process.env.VITE_PORT}`
      : 'http://localhost:5173';
    console.log('Dev mode: loading URL:', startUrl);
    win.loadURL(startUrl);
    // Open dev tools in development
    if (isDev) {
      win.webContents.openDevTools();
    }
  } else {
    // Load the index.html from the packaged app
    const filePath = path.join(process.resourcesPath, 'app', 'dist', 'index.html');
    console.log('Production mode: Loading file from:', filePath);
    win.loadFile(filePath).catch((err) => {
      console.error("Failed to load file:", err);
      // Fallback: try __dirname
      const altPath = path.join(__dirname, 'dist', 'index.html');
      console.log('Trying alternative path:', altPath);
      win.loadFile(altPath).catch((altErr) => {
        console.error("Failed to load from alternative path:", altErr);
      });
    });
  }

  // Log any errors during loading
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  win.webContents.on('crashed', () => {
    console.error('Renderer process crashed');
  });
}

// ===== APP EVENT HANDLERS =====
app.whenReady().then(() => {
  console.log('App is ready, initializing database...');
  // Initialize database
  db.initializeDatabase();

  // Remove default menu bar
  Menu.setApplicationMenu(null);

  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});