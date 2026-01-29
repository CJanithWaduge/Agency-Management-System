const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is loading...');

// Expose safe APIs to the renderer process via contextBridge
try {
  contextBridge.exposeInMainWorld('api', {
    // Machine ID and External Links
    getMachineId: () => ipcRenderer.invoke('get-machine-id'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),

    // PDF API
    pdf: {
      save: (buffer, filename) => ipcRenderer.invoke('pdf:save', buffer, filename),
    },

    // ITEMS API
    items: {
      getAll: () => ipcRenderer.invoke('db:items:getAll'),
      add: (item) => ipcRenderer.invoke('db:items:add', item),
      update: (id, item) => ipcRenderer.invoke('db:items:update', id, item),
      delete: (id) => ipcRenderer.invoke('db:items:delete', id),
    },

    // SALES API
    sales: {
      getAll: () => ipcRenderer.invoke('db:sales:getAll'),
      add: (sale) => ipcRenderer.invoke('db:sales:add', sale),
      update: (id, sale) => ipcRenderer.invoke('db:sales:update', id, sale),
      delete: (id) => ipcRenderer.invoke('db:sales:delete', id),
    },

    // EXPENSES API
    expenses: {
      getAll: () => ipcRenderer.invoke('db:expenses:getAll'),
      add: (expense) => ipcRenderer.invoke('db:expenses:add', expense),
      delete: (id) => ipcRenderer.invoke('db:expenses:delete', id),
    },

    // STATEMENTS API
    statements: {
      getAll: () => ipcRenderer.invoke('db:statements:getAll'),
      add: (statement) => ipcRenderer.invoke('db:statements:add', statement),
      delete: (id) => ipcRenderer.invoke('db:statements:delete', id),
    },

    // ROUTES API
    routes: {
      getAll: () => ipcRenderer.invoke('db:routes:getAll'),
      add: (name) => ipcRenderer.invoke('db:routes:add', name),
      delete: (name) => ipcRenderer.invoke('db:routes:delete', name),
    },

    // SETTINGS API
    settings: {
      get: (key) => ipcRenderer.invoke('db:settings:get', key),
      set: (key, value) => ipcRenderer.invoke('db:settings:set', key, value),
    },

    // DATABASE API
    database: {
      init: (username) => ipcRenderer.invoke('db:init', username),
      reset: () => ipcRenderer.invoke('db:reset'),
      deleteUser: (username) => ipcRenderer.invoke('db:delete-user', username),
    },
  });

  console.log('✓ Electron IPC bridge (window.api) exposed successfully');
} catch (error) {
  console.error('✗ Failed to expose electron IPC:', error);
}
