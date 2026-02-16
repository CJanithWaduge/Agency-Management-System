# Architecture Diagram & Flow Reference

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (React)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Dashboard │ Inventory │ Sales │ Creditors │ Expenses     │  │
│  │ Statement │ History   │ Settings                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            (Unchanged)                          │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    React Props + Event Handlers
                    items, setItems, recordSale, etc.
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    App.jsx (State Management)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ useState: items, salesHistory, expenses, etc.             │  │
│  │ useEffect: Load from database on mount                    │  │
│  │ Handlers: recordSale, updatePayment, etc.                 │  │
│  │ Wrappers: handleSetItems, handleSetExpenses, etc.         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    Async API Calls (await)
                    window.api.items.getAll()
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Preload.cjs (IPC Bridge)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ contextBridge.exposeInMainWorld('api', {                  │  │
│  │   items: { getAll, add, update, delete },                │  │
│  │   sales: { getAll, add, update, delete },                │  │
│  │   expenses: { getAll, add, delete },                     │  │
│  │   statements: { getAll, add, delete },                   │  │
│  │   routes: { getAll, add, delete },                       │  │
│  │   settings: { get, set },                                │  │
│  │   database: { reset }                                    │  │
│  │ })                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ipcRenderer.invoke() calls
                    'db:items:getAll', 'db:sales:add', etc.
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Main.cjs (Electron Main)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ipcMain.handle('db:items:getAll', () => {                │  │
│  │   return db.getItems()                                    │  │
│  │ })                                                        │  │
│  │ ipcMain.handle('db:sales:add', (event, sale) => {         │  │
│  │   return db.addSale(sale)                                 │  │
│  │ })                                                        │  │
│  │ ... 30+ handlers total                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    Direct function calls
                    db.getItems(), db.addSale(), etc.
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              Database.cjs (SQLite Operations Layer)              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ getItems() → db.prepare().all()                           │  │
│  │ addItem() → db.prepare().run() + return id                │  │
│  │ updateItem() → db.prepare().run()                         │  │
│  │ deleteItem() → db.prepare().run()                         │  │
│  │ getSales() → Parse JSON, convert booleans                 │  │
│  │ ... getExpenses, getStatements, getRoutes, etc.           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    better-sqlite3 library
                    Prepared statements + transactions
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SQLite Database File                            │
│         ~/.samindu-system/shop_system.db                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ items                                              │   │  │
│  │ │ id | name | whQty | lorryQty | price | ...        │   │  │
│  │ │ ──────────────────────────────────────────────    │   │  │
│  │ │ 1  │ Rice │  100  │   50    │ 50.00│ ...         │   │  │
│  │ │ 2  │ Salt │  200  │   75    │ 15.00│ ...         │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ sales                                              │   │  │
│  │ │ id | date | shopName | isCredit | totalBill | ...│   │  │
│  │ │ ──────────────────────────────────────────────    │   │  │
│  │ │ 1  │ ... │ ABC Shop │ 0       │ 5000.00  │ ...   │   │  │
│  │ │ 2  │ ... │ XYZ Co.  │ 1       │ 8500.50  │ ...   │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ expenses, statements, routes, settings            │   │  │
│  │ │ ... (4 more tables)                                │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Adding an Item (Example)

```
1. User clicks "Add Item" in Inventory component
   ↓
2. Inventory.addItem() called
   - Creates newItem object with UI field names
   - Calls setItems([...items, newItem])
   ↓
3. App.jsx handleSetItems() wrapper intercepts
   - Updates React state: setItems(newItems)
   - Returns immediately (non-blocking)
   ↓
4. React renders updated UI with new item
   ↓
5. Async sync to database (setTimeout 0)
   - Queries existing items from database
   - Compares with new items list
   - Detects new item (no existing id in DB)
   - Calls: await window.api.items.add(newItem)
   ↓
6. Preload.cjs routes to IPC
   - ipcRenderer.invoke('db:items:add', newItem)
   ↓
7. Main.cjs handles IPC
   - ipcMain.handle('db:items:add', async (event, item) => {
       return db.addItem(item)
     })
   ↓
8. Database.cjs executes
   - Prepares INSERT statement
   - Binds parameters from item object
   - Executes: db.prepare(...).run(...)
   - Returns: { id: lastInsertRowid, ...item }
   ↓
9. SQLite stores the record
   - INSERT INTO items (name, whQty, lorryQty, ...) 
     VALUES (...)
   ↓
10. Response travels back up the chain
    - IPC handler returns data
    - Frontend receives { id: 42, name: 'Rice', ... }
    ↓
11. User refreshes app
    - App.jsx useEffect loads data on mount
    - Calls: await window.api.items.getAll()
    - Database.cjs queries: db.prepare('SELECT * FROM items').all()
    - New item is in the result
    - React state is populated
    - Item appears in UI ✓
```

---

## State Management Flow

### Initial Mount (App.jsx)

```javascript
// 1. State declared with empty defaults
const [items, setItems] = useState([])
const [salesHistory, setSalesHistory] = useState([])
// ... etc

// 2. useEffect on mount
useEffect(() => {
  const loadData = async () => {
    // 3. Parallel load from database
    const [itemsData, salesData, expensesData, ...] = 
      await Promise.all([
        window.api.items.getAll(),      // Query DB
        window.api.sales.getAll(),
        window.api.expenses.getAll(),
        // ... etc
      ])
    
    // 4. Update React state
    setItems(itemsData || [])
    setSalesHistory(salesData || [])
    // ... etc
  }
  
  loadData()
}, [])  // Only on mount

// 5. Component renders with loaded data
return (
  <Inventory 
    items={items}           // ← Database data
    setItems={handleSetItems}  // ← Wrapper function
  />
)
```

### Data Updates (Wrapper Functions)

```javascript
// Wrapper intercepts state updates
const handleSetItems = async (newItemsOrUpdater) => {
  // A. Update state immediately (optimistic)
  let newItems = typeof newItemsOrUpdater === 'function' 
    ? newItemsOrUpdater(items)
    : newItemsOrUpdater
  
  setItems(newItems)  // ← UI updates instantly
  
  // B. Sync to database asynchronously
  setTimeout(async () => {
    const existingItems = await window.api.items.getAll()
    
    for (const item of newItems) {
      if (existingItemMap.has(item.id)) {
        // Update existing
        await window.api.items.update(item.id, item)
      } else {
        // Add new
        await window.api.items.add(item)
      }
    }
    
    // Delete removed items
    for (const existing of existingItems) {
      if (!newItems.find(i => i.id === existing.id)) {
        await window.api.items.delete(existing.id)
      }
    }
  }, 0)  // ← DB sync happens after UI renders
}
```

---

## IPC Communication Protocol

### Request-Response Pattern

```
Renderer (React)          Main (Electron)           Database
─────────────────         ───────────────           ────────

window.api.items.getAll()
    │
    ├─ipcRenderer.invoke('db:items:getAll')────────────>
    │
    │                    [IPC Handler]
    │                    await db.getItems()
    │                           │
    │                           ├──> getItems()
    │                           │    └─> db.prepare().all()
    │                           │        └─> SELECT * FROM items
    │                           │            └─> [items...]
    │                           │
    │                    return [items...]
    │                           │
    <────────────────────────────┤
    │
    return Promise<items>
```

### Handler Structure

```javascript
// Main.cjs pattern
ipcMain.handle('db:items:getAll', async (event) => {
  try {
    return db.getItems()  // Returns [items] or []
  } catch (error) {
    console.error(error)
    throw error  // IPC will reject promise
  }
})

ipcMain.handle('db:items:add', async (event, item) => {
  try {
    return db.addItem(item)  // Returns { id, ...item }
  } catch (error) {
    console.error(error)
    throw error
  }
})
```

---

## Field Mapping & Type Conversions

### Items

```
Component sends:        Database stores:         Query returns:
─────────────────       ────────────────         ──────────────
{                       id INTEGER               {
  id: 1,       ──┐      name TEXT                  id: 1,
  name: "Rice",─┤      whQty INTEGER               name: "Rice",
  whQty: 100,  ├───>   lorryQty INTEGER ──────>   whQty: 100,
  lorryQty: 50,│      buyingPrice REAL             lorryQty: 50,
  buyingPrice: 50,    sellingPrice REAL           buyingPrice: 50,
  ...          │       ...                         ...
}              └─      (UNIQUE constraint)      }
               (No ID on first insert,
                DB generates)
```

### Sales (with JSON & Boolean conversion)

```
Component:              Database:                 Query Result:
──────────             ─────────                 ─────────────
{                      id INTEGER                {
  date: "2024...",     date TEXT                   date: "2024...",
  shopName: "ABC",  ──>shopName TEXT ──────────>  shopName: "ABC",
  isCredit: true,  ──>isCredit INTEGER (0/1)      isCredit: true, ✓
  itemsSold: [      ──>itemsSold TEXT (JSON) ──>  itemsSold: [
    { id, qty, ... }        JSON.stringify()       { id, qty, ... },
  ],                                               ...
  paymentHistory: [  ──>paymentHistory TEXT   ──> ],
    {...}                  (JSON)                  paymentHistory: [
  ]                                                  {...}
}                                                 ]
                                                }
```

---

## Database Schema Diagram

```
┌─────────────────────────────────────────────────────┐
│                      items                          │
├─────────────────────────────────────────────────────┤
│ PK id INTEGER                                       │
│    name TEXT UNIQUE                                 │
│    whQty INTEGER                                    │
│    lorryQty INTEGER                                 │
│    buyingPrice REAL                                 │
│    sellingPrice REAL                                │
│    stock INTEGER                                    │
│    price REAL                                       │
│    createdAt TEXT                                   │
│    updatedAt TEXT                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                     sales                           │
├─────────────────────────────────────────────────────┤
│ PK id INTEGER                                       │
│    date TEXT                                        │
│    shopName TEXT                                    │
│    routeName TEXT                                   │
│    isCredit INTEGER (0 or 1)                        │
│    itemsSold TEXT (JSON array)                      │
│    totalBill REAL                                   │
│    paidAmount REAL                                  │
│    paymentHistory TEXT (JSON array)                 │
│    createdAt TEXT                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   expenses                          │
├─────────────────────────────────────────────────────┤
│ PK id INTEGER                                       │
│    category TEXT                                    │
│    amount REAL                                      │
│    date TEXT                                        │
│    description TEXT                                 │
│    createdAt TEXT                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  statements                         │
├─────────────────────────────────────────────────────┤
│ PK id INTEGER                                       │
│    date TEXT                                        │
│    type TEXT                                        │
│    description TEXT                                 │
│    amount REAL                                      │
│    category TEXT                                    │
│    details TEXT                                     │
│    createdAt TEXT                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    routes                           │
├─────────────────────────────────────────────────────┤
│ PK id INTEGER                                       │
│    name TEXT UNIQUE                                 │
│    createdAt TEXT                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   settings                          │
├─────────────────────────────────────────────────────┤
│ PK key TEXT                                         │
│    value TEXT                                       │
│    updatedAt TEXT                                   │
└─────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Try to add item with duplicate name
    │
    ▼
handleSetItems() called
    │
    ▼
Optimistically update UI state
    │
    ▼
Sync to database (async)
    │
    ▼
window.api.items.add(item)
    │
    ▼
ipcRenderer.invoke('db:items:add')
    │
    ▼
ipcMain.handle catches it
    │
    ▼
db.addItem() throws error
    │
    ├──> console.error('Error adding item')
    │
    ├──> throw error  (re-throw)
    │
    ▼
IPC rejects promise
    │
    ▼
Frontend catch block
    └──> console.error('Error syncing items with database')
```

Since DB sync is async and non-blocking:
- User still sees the item in UI (even if DB insert fails)
- Error is logged but doesn't crash the app
- User can retry if needed

---

## Summary

The architecture uses a **three-layer pattern**:

1. **Presentation Layer** (React Components)
   - 100% unchanged
   - Receives data as props
   - Calls event handlers

2. **State Management Layer** (App.jsx)
   - Manages React state
   - Provides data to components
   - Syncs changes to database asynchronously

3. **Data Layer** (Database.cjs)
   - Executes SQL operations
   - Handles type conversions
   - Returns consistent data format

Connected via:
- **IPC Bridge** (Preload.cjs) - Secure context isolation
- **IPC Handler** (Main.cjs) - Routes async requests
- **Better-sqlite3** - Executes SQL efficiently

Result: Transparent database upgrade with **zero UI impact**.
