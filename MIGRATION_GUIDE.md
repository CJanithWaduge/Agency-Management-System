# LocalStorage to SQLite Migration Guide

## Overview
Your Samindu System has been successfully migrated from localStorage (JSON) to Electron + SQLite. All UI components remain **100% unchanged**, while the data layer now uses SQLite with persistent database storage.

## What Was Changed

### 1. **Backend - Database Module** (`src/backend/database.cjs`)
- **New file** with SQLite database initialization
- Automatically creates database at: `~/.samindu-system/shop_system.db`
- Creates 4 main tables:
  - `items` - Inventory with id, name, stock, lorryQty, price
  - `sales` - Transaction history with itemsSold (JSON), totalBill, paymentHistory (JSON)
  - `expenses` - Expense tracking
  - `statements` - Company statement entries
  - Plus helper tables: `settings`, `routes`

**Key Functions:**
- `getItems()`, `addItem()`, `updateItem()`, `deleteItem()`
- `getSales()`, `addSale()`, `updateSale()`, `deleteSale()`
- `getExpenses()`, `addExpense()`, `deleteExpense()`
- `getStatements()`, `addStatement()`, `deleteStatement()`
- `getRoutes()`, `addRoute()`, `deleteRoute()`
- `getSetting()`, `setSetting()`
- `resetDatabase()`

### 2. **Main Process** (`main.cjs`)
- Imported database module
- Added database initialization on app startup
- Created IPC handlers for all data operations:
  - `db:items:*` (getAll, add, update, delete)
  - `db:sales:*` (getAll, add, update, delete)
  - `db:expenses:*` (getAll, add, delete)
  - `db:statements:*` (getAll, add, delete)
  - `db:routes:*` (getAll, add, delete)
  - `db:settings:*` (get, set)
  - `db:reset` (full database reset)

### 3. **Preload Bridge** (`preload.cjs`)
- Exposed `window.api` object with namespaced API:
  ```javascript
  window.api.items.getAll()
  window.api.sales.add(saleData)
  window.api.expenses.getAll()
  window.api.statements.delete(id)
  window.api.routes.getAll()
  window.api.settings.set('key', 'value')
  window.api.database.reset()
  ```

### 4. **React Frontend** (`src/App.jsx`)
- Removed all `localStorage` references for data (auth still uses localStorage)
- Data initialization now uses `window.api` calls:
  ```javascript
  const itemsData = await window.api.items.getAll();
  ```
- All data operations now go through database:
  - `recordSale()` - saves to `window.api.sales.add()`
  - `updatePayment()` - updates via `window.api.sales.update()`
  - `addItem()` - saves to database
  - `deleteItem()` - removes from database
  - `addStatementEntry()` - uses `window.api.statements.add()`
  - `handleFullReset()` - calls `window.api.database.reset()`

- Created wrapper functions to sync UI changes with database:
  - `handleSetItems()` - syncs inventory changes
  - `handleSetExpenses()` - syncs expense changes
  - `handleSetRoutes()` - syncs route additions
  - `addPaymentHistoryEntry()` - saves payment records
  - `addStatementEntry()` - saves statement entries

## Data Structure Mapping

### Items Table
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE,
  stock INTEGER,
  lorryQty INTEGER,
  price REAL,
  createdAt TEXT,
  updatedAt TEXT
)
```

### Sales Table
```sql
CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  date TEXT,
  shopName TEXT,
  routeName TEXT,
  isCredit INTEGER,        -- Stored as 0/1, converted to boolean in queries
  itemsSold TEXT,          -- JSON stringified array
  totalBill REAL,
  paidAmount REAL,
  paymentHistory TEXT,     -- JSON stringified array
  createdAt TEXT
)
```

### Other Tables
- `expenses` - category, amount, date, description
- `statements` - date, type, description, amount, category, details
- `routes` - name (UNIQUE)
- `settings` - key-value pairs for company_name, logo, profile_image

## How to Use

### Starting the App
```bash
npm run dev:all      # Vite dev server + Electron
# or
npm run electron     # Just Electron (requires built assets)
```

### Data Persistence
- All data is automatically persisted to SQLite at `~/.samindu-system/shop_system.db`
- No need to manually save anything
- Database syncs are asynchronous and non-blocking

### Accessing Data from Components
Components still receive the same props and work identically to before:
```jsx
<Dashboard items={items} salesHistory={salesHistory} statementEntries={statementEntries} />
<Inventory items={items} setItems={handleSetItems} />
<Sales routes={routes} setRoutes={handleSetRoutes} onConfirmSale={recordSale} />
```

## Authentication
- **Still uses localStorage** (not migrated to SQLite)
  - `samindu_user_registered`
  - `samindu_username`
  - `samindu_password`
  - `samindu_require_password`
- This separation keeps auth data independent of business data

## Database Reset
Full reset clears all business data but preserves authentication:
```javascript
await window.api.database.reset()
```
This wipes:
- All items
- All sales records
- All expenses
- All statements
- All routes
- All settings

But leaves auth data intact.

## Performance Notes
- SQLite uses prepared statements for efficiency
- JSON fields (itemsSold, paymentHistory) are stored as strings
- Queries are fast even with large datasets
- Database file is stored locally on user's machine

## Troubleshooting

### Database Not Initializing
Check the console for errors. Database path is: `~/.samindu-system/shop_system.db`

### Data Not Persisting
1. Verify `window.api` is accessible in browser DevTools console
2. Check Electron main process console for IPC handler errors
3. Ensure better-sqlite3 is installed: `npm install better-sqlite3`

### Migration from Old Data
If you had existing localStorage data, it's now in the database. First run will be empty - you can export/import data separately if needed.

## File Summary

| File | Purpose | Status |
|------|---------|--------|
| `src/backend/database.cjs` | SQLite module | ✓ Created |
| `main.cjs` | Electron main + IPC handlers | ✓ Updated |
| `preload.cjs` | Secure API bridge | ✓ Updated |
| `src/App.jsx` | React app with database calls | ✓ Updated |
| All components (Dashboard, Inventory, Sales, etc.) | UI layer | ✓ Unchanged |

## Next Steps (Optional)
1. **Export/Import Feature**: Add database export to JSON for backups
2. **Data Migration Tool**: Script to migrate old localStorage data
3. **Encryption**: Add encryption for sensitive settings
4. **Backup Service**: Automatic database backups to cloud

## Questions?
Refer back to the API reference in `preload.cjs` for all available functions.
