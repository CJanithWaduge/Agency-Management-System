const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Determine database path
// Priority:
// 1. Use SAMINDU_DB_PATH environment variable if set (from main.cjs)
// 2. Fall back to app user data directory (production)
// 3. Fall back to home directory (development)
let db;
let currentUsername = 'default';

// Initialize with a default database
function initializeDatabase(username = 'default') {
  currentUsername = username;

  const baseDbPath = process.env.SAMINDU_DB_PATH
    ? process.env.SAMINDU_DB_PATH
    : path.join(os.homedir(), '.samindu-system');

  const dbFileName = username === 'default' ? 'shop_system.db' : `shop_system_${username}.db`;
  const dbPath = path.join(baseDbPath, dbFileName);
  const dbDir = path.dirname(dbPath);

  // Ensure directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Initialize database
  if (db) {
    db.close();
  }

  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Run schema creation
  setupSchema();

  console.log(`✓ Database initialized for user: ${username}`);
}

function setupSchema() {
  try {
    // Items table - inventory
    db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        whQty INTEGER DEFAULT 0,
        lorryQty INTEGER DEFAULT 0,
        buyingPrice REAL DEFAULT 0,
        sellingPrice REAL DEFAULT 0,
        stock INTEGER DEFAULT 0,
        price REAL DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sales table - transaction history
    db.exec(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        shopName TEXT,
        routeName TEXT,
        isCredit INTEGER DEFAULT 0,
        itemsSold TEXT NOT NULL,
        totalBill REAL DEFAULT 0,
        paidAmount REAL DEFAULT 0,
        paymentHistory TEXT DEFAULT '[]',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Expenses table
    db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY,
        category TEXT NOT NULL,
        amount REAL DEFAULT 0,
        date TEXT NOT NULL,
        description TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Statements table - company statement entries
    db.exec(`
      CREATE TABLE IF NOT EXISTS statements (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        amount REAL DEFAULT 0,
        category TEXT,
        details TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table - company metadata
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Routes table - sales routes
    db.exec(`
      CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure default route exists
    try {
      const stmt = db.prepare('INSERT INTO routes (name) VALUES (?)');
      stmt.run('General Route');
    } catch (err) {
      // Route likely already exists, ignore
    }

    console.log('✓ Database schema verified');
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    throw error;
  }
}

/**
 * ITEMS OPERATIONS
 */
function getItems() {
  try {
    const stmt = db.prepare('SELECT * FROM items');
    return stmt.all();
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

function getItemById(id) {
  try {
    const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
    return stmt.get(id);
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

function addItem(item) {
  try {
    const stmt = db.prepare(`
      INSERT INTO items (name, whQty, lorryQty, buyingPrice, sellingPrice, stock, price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      item.name,
      item.whQty || 0,
      item.lorryQty || 0,
      item.buyingPrice || 0,
      item.sellingPrice || 0,
      item.stock || 0,
      item.price || 0
    );
    return { id: info.lastInsertRowid, ...item };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
}

function updateItem(id, item) {
  try {
    const stmt = db.prepare(`
      UPDATE items 
      SET name = ?, whQty = ?, lorryQty = ?, buyingPrice = ?, sellingPrice = ?, stock = ?, price = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(item.name, item.whQty || 0, item.lorryQty || 0, item.buyingPrice || 0, item.sellingPrice || 0, item.stock || 0, item.price || 0, id);
    return { id, ...item };
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

function deleteItem(id) {
  try {
    const stmt = db.prepare('DELETE FROM items WHERE id = ?');
    stmt.run(id);
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

/**
 * SALES OPERATIONS
 */
function getSales() {
  try {
    const stmt = db.prepare(`
      SELECT * FROM sales ORDER BY date DESC
    `);
    const sales = stmt.all();
    // Parse JSON fields
    return sales.map(sale => ({
      ...sale,
      itemsSold: JSON.parse(sale.itemsSold || '[]'),
      paymentHistory: JSON.parse(sale.paymentHistory || '[]'),
      isCredit: Boolean(sale.isCredit)
    }));
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
}

function getSaleById(id) {
  try {
    const stmt = db.prepare('SELECT * FROM sales WHERE id = ?');
    const sale = stmt.get(id);
    if (sale) {
      return {
        ...sale,
        itemsSold: JSON.parse(sale.itemsSold || '[]'),
        paymentHistory: JSON.parse(sale.paymentHistory || '[]'),
        isCredit: Boolean(sale.isCredit)
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching sale:', error);
    return null;
  }
}

function addSale(sale) {
  try {
    const stmt = db.prepare(`
      INSERT INTO sales (date, shopName, routeName, isCredit, itemsSold, totalBill, paidAmount, paymentHistory)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      sale.date,
      sale.shopName || '',
      sale.routeName || '',
      sale.isCredit ? 1 : 0,
      JSON.stringify(sale.itemsSold || []),
      sale.totalBill || 0,
      sale.paidAmount || 0,
      JSON.stringify(sale.paymentHistory || [])
    );
    return {
      id: info.lastInsertRowid,
      ...sale,
      isCredit: Boolean(sale.isCredit)
    };
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
}

function updateSale(id, sale) {
  try {
    const stmt = db.prepare(`
      UPDATE sales 
      SET date = ?, shopName = ?, routeName = ?, isCredit = ?, itemsSold = ?, totalBill = ?, paidAmount = ?, paymentHistory = ?
      WHERE id = ?
    `);
    stmt.run(
      sale.date,
      sale.shopName || '',
      sale.routeName || '',
      sale.isCredit ? 1 : 0,
      JSON.stringify(sale.itemsSold || []),
      sale.totalBill || 0,
      sale.paidAmount || 0,
      JSON.stringify(sale.paymentHistory || []),
      id
    );
    return { id, ...sale };
  } catch (error) {
    console.error('Error updating sale:', error);
    throw error;
  }
}

function deleteSale(id) {
  try {
    const stmt = db.prepare('DELETE FROM sales WHERE id = ?');
    stmt.run(id);
    return true;
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
}

/**
 * EXPENSES OPERATIONS
 */
function getExpenses() {
  try {
    const stmt = db.prepare('SELECT * FROM expenses ORDER BY date DESC');
    return stmt.all();
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

function addExpense(expense) {
  try {
    const stmt = db.prepare(`
      INSERT INTO expenses (category, amount, date, description)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      expense.category,
      expense.amount || 0,
      expense.date,
      expense.description || ''
    );
    return { id: info.lastInsertRowid, ...expense };
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

function deleteExpense(id) {
  try {
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    stmt.run(id);
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}

/**
 * STATEMENTS OPERATIONS
 */
function getStatements() {
  try {
    const stmt = db.prepare('SELECT * FROM statements ORDER BY date DESC');
    return stmt.all();
  } catch (error) {
    console.error('Error fetching statements:', error);
    return [];
  }
}

function addStatement(statement) {
  try {
    const stmt = db.prepare(`
      INSERT INTO statements (date, type, description, amount, category, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      statement.date,
      statement.type,
      statement.description || '',
      statement.amount || 0,
      statement.category || '',
      statement.details || ''
    );
    return { id: info.lastInsertRowid, ...statement };
  } catch (error) {
    console.error('Error adding statement:', error);
    throw error;
  }
}

function deleteStatement(id) {
  try {
    const stmt = db.prepare('DELETE FROM statements WHERE id = ?');
    stmt.run(id);
    return true;
  } catch (error) {
    console.error('Error deleting statement:', error);
    throw error;
  }
}

/**
 * ROUTES OPERATIONS
 */
function getRoutes() {
  try {
    const stmt = db.prepare('SELECT name FROM routes ORDER BY name');
    const routes = stmt.all();
    return routes.map(r => r.name);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return ["General Route"]; // Default route
  }
}

function addRoute(name) {
  try {
    const stmt = db.prepare('INSERT INTO routes (name) VALUES (?)');
    stmt.run(name);
    return name;
  } catch (error) {
    console.error('Error adding route:', error);
    throw error;
  }
}

function deleteRoute(name) {
  try {
    const stmt = db.prepare('DELETE FROM routes WHERE name = ?');
    stmt.run(name);
    return true;
  } catch (error) {
    console.error('Error deleting route:', error);
    throw error;
  }
}

/**
 * SETTINGS OPERATIONS
 */
function getSetting(key) {
  try {
    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
    const result = stmt.get(key);
    return result ? result.value : null;
  } catch (error) {
    console.error('Error fetching setting:', error);
    return null;
  }
}

function setSetting(key, value) {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO settings (key, value, updatedAt)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(key, value);
    return true;
  } catch (error) {
    console.error('Error setting value:', error);
    throw error;
  }
}

/**
 * RESET OPERATIONS
 */
function resetDatabase() {
  try {
    // Delete all data but keep schema
    db.exec(`
      DELETE FROM items;
      DELETE FROM sales;
      DELETE FROM expenses;
      DELETE FROM statements;
      DELETE FROM routes;
      DELETE FROM settings;
    `);
    console.log('✓ Database reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}

module.exports = {
  db,
  initializeDatabase,
  // Items
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  // Sales
  getSales,
  getSaleById,
  addSale,
  updateSale,
  deleteSale,
  // Expenses
  getExpenses,
  addExpense,
  deleteExpense,
  // Statements
  getStatements,
  addStatement,
  deleteStatement,
  // Routes
  getRoutes,
  addRoute,
  deleteRoute,
  // Settings
  getSetting,
  setSetting,
  // Reset
  resetDatabase,
};
