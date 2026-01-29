# Quick Reference Card

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development
npm run dev:all

# 3. Verify database created
ls ~/.samindu-system/shop_system.db
```

## 📡 API Calls (In Any Component/Hook)

```javascript
// Items
const items = await window.api.items.getAll()
await window.api.items.add({ name, whQty, lorryQty, price })
await window.api.items.update(id, itemData)
await window.api.items.delete(id)

// Sales
const sales = await window.api.sales.getAll()
await window.api.sales.add({ date, shopName, itemsSold, totalBill, ... })
await window.api.sales.update(id, saleData)
await window.api.sales.delete(id)

// Expenses
const expenses = await window.api.expenses.getAll()
await window.api.expenses.add({ category, amount, date })
await window.api.expenses.delete(id)

// Statements
const statements = await window.api.statements.getAll()
await window.api.statements.add({ date, type, amount, ... })
await window.api.statements.delete(id)

// Routes
const routes = await window.api.routes.getAll()
await window.api.routes.add('Route Name')
await window.api.routes.delete('Route Name')

// Settings
await window.api.settings.set('company_name', 'My Company')
const name = await window.api.settings.get('company_name')

// Reset Everything
await window.api.database.reset()
```

## 📊 Database File Location

```
~/.samindu-system/shop_system.db
```

### Inspect with SQLite CLI
```bash
sqlite3 ~/.samindu-system/shop_system.db
sqlite> SELECT COUNT(*) FROM items;
sqlite> SELECT * FROM sales LIMIT 5;
sqlite> .quit
```

## 🗂️ File Changes

| File | Status | Purpose |
|------|--------|---------|
| `src/backend/database.cjs` | ✓ NEW | SQLite operations |
| `main.cjs` | ✓ UPDATED | IPC handlers |
| `preload.cjs` | ✓ UPDATED | window.api bridge |
| `src/App.jsx` | ✓ UPDATED | State management |
| All other files | ✓ UNCHANGED | UI & components |

## 🧪 Quick Test

```javascript
// Browser console (F12):

// Load all items
window.api.items.getAll().then(items => {
  console.log('Items:', items)
})

// Add test item
window.api.items.add({
  name: 'Test Item',
  whQty: 10,
  lorryQty: 5,
  buyingPrice: 100,
  sellingPrice: 150
}).then(item => {
  console.log('Added item:', item)
})

// Check database
window.api.database.reset().then(() => {
  console.log('Database reset complete')
})
```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| `window.api is undefined` | Use `npm run dev:all` not `npm run dev` |
| `better-sqlite3 error` | Run `npm rebuild better-sqlite3 --build-from-source` |
| Database file missing | Will auto-create in `~/.samindu-system/` on first run |
| Data not saving | Check browser console (F12) and Electron console for errors |

## 📝 Data Structures

### Item
```javascript
{
  id: 1,
  name: "Rice",
  whQty: 100,
  lorryQty: 50,
  buyingPrice: 50,
  sellingPrice: 75
}
```

### Sale
```javascript
{
  id: 1,
  date: "2024-01-25T10:30:00Z",
  shopName: "ABC Shop",
  routeName: "Route 1",
  isCredit: false,
  itemsSold: [
    { id: 1, name: "Rice", qty: 10, subtotal: 750 }
  ],
  totalBill: 750,
  paidAmount: 750,
  paymentHistory: [
    { date: "...", amount: 750 }
  ]
}
```

### Expense
```javascript
{
  id: 1,
  category: "Transport",
  amount: 500,
  date: "2024-01-25T10:30:00Z",
  description: "Fuel cost"
}
```

## 🎯 Migration Summary

```
BEFORE: Data → React State → localStorage → JSON file
        ❌ Lost on browser clear
        ❌ JSON parsing overhead
        ❌ No real database

AFTER:  Data → React State → window.api → IPC → SQLite DB
        ✅ Persists forever
        ✅ Fast queries
        ✅ Professional storage
        ✅ UI unchanged
```

## 📚 Documentation Files

Read in this order:

1. **This file** - Quick reference
2. **MIGRATION_COMPLETE.md** - Overview & what to do
3. **TESTING_CHECKLIST.md** - Step-by-step testing
4. **MIGRATION_GUIDE.md** - Technical details
5. **ARCHITECTURE.md** - System design
6. **IMPLEMENTATION_DETAILS.md** - Deep dive

## 🔍 Debug Tips

### Enable detailed logging
```javascript
// In main.cjs, add before handlers:
console.log('Database ready')

// In preload.cjs:
console.log('IPC bridge exposed')

// In App.jsx:
console.log('Data loaded:', items)
```

### Check database integrity
```bash
sqlite3 ~/.samindu-system/shop_system.db ".tables"
# Output: expenses items routes sales settings statements
```

### Verify IPC works
```javascript
// In browser console:
window.api.items.getAll()
  .then(items => console.log('IPC works!', items.length))
  .catch(err => console.error('IPC error:', err))
```

## 📦 Deployment Checklist

Before going live:

- [ ] Test all CRUD operations
- [ ] Test app restart (data persists)
- [ ] Test full reset
- [ ] Check database file exists
- [ ] Verify no console errors
- [ ] Test with 100+ items
- [ ] Test with 1000+ sales
- [ ] Backup old localStorage if needed
- [ ] Document any custom workflows
- [ ] Train users on new features

## 🆘 Emergency Operations

### Backup database
```bash
cp ~/.samindu-system/shop_system.db ~/backup.db
```

### Restore from backup
```bash
cp ~/backup.db ~/.samindu-system/shop_system.db
```

### Delete corrupted database (starts fresh)
```bash
rm ~/.samindu-system/shop_system.db
# Next app launch recreates it
```

### Reset everything
```javascript
await window.api.database.reset()
```

## 🎉 You're Ready!

- ✅ Database setup complete
- ✅ IPC handlers configured
- ✅ React integration done
- ✅ UI 100% unchanged
- ✅ Documentation provided

**Next step**: Run `npm run dev:all` and start testing!

---

**Saved you from localStorage hell! 🚀**
