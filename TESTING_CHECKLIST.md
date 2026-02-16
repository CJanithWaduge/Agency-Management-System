# Migration Checklist & Testing Guide

## Pre-Launch Checklist ✓

- [x] Created `src/backend/database.cjs` with SQLite module
- [x] Updated `main.cjs` with database initialization and IPC handlers
- [x] Updated `preload.cjs` with secure `window.api` bridge
- [x] Updated `src/App.jsx` to use `window.api` instead of localStorage
- [x] Created wrapper functions for state management (handleSetItems, etc.)
- [x] All components remain 100% unchanged
- [x] No compile errors
- [x] Database schema supports all UI field names

## Installation & Setup

```bash
# 1. Install dependencies (if not done)
npm install
npm install better-sqlite3  # Should already be in package.json

# 2. Start the app
npm run dev:all

# 3. Verify database was created
ls ~/.samindu-system/shop_system.db
```

## Testing Workflow

### Test 1: Basic Data Persistence
```
[ ] Open the app
[ ] Add a new item in Inventory tab
    - Name: "Test Item"
    - Values: any numbers
[ ] Refresh the app (Ctrl+R in Electron)
[ ] Verify the item still exists
```

### Test 2: Sales Recording
```
[ ] Create a new sale in Sales tab
    - Select an item
    - Enter quantity
    - Mark as Cash or Credit
[ ] Click "Confirm Sale"
[ ] Check that:
    - Item quantity decreased
    - Sale appears in History
[ ] Refresh app
[ ] Verify sale is still there
```

### Test 3: Payment Updates
```
[ ] Go to Creditors tab
[ ] Find a credit sale
[ ] Add a payment
[ ] Verify payment history updates
[ ] Refresh app
[ ] Check payment is still recorded
```

### Test 4: Expenses
```
[ ] Add an expense in Expenses tab
    - Description: "Test Expense"
    - Value: 100
[ ] Verify it appears in the table
[ ] Delete it
[ ] Refresh app
[ ] Verify it's gone
```

### Test 5: Routes Management
```
[ ] Go to Sales tab
[ ] Add a new route: "Test Route"
[ ] Refresh app
[ ] Verify new route still appears in dropdown
```

### Test 6: Settings
```
[ ] Go to Settings
[ ] Change company name to "Test Company"
[ ] Upload a logo
[ ] Refresh app
[ ] Verify changes persisted
```

### Test 7: Full Reset
```
[ ] Add some test data
[ ] Go to Settings
[ ] Click "Full Reset"
[ ] Confirm the warning
[ ] Verify all data is cleared
[ ] Check company name reverted to default
```

## Database Inspection

To inspect the actual database:

### Using SQLite CLI
```bash
sqlite3 ~/.samindu-system/shop_system.db
sqlite> SELECT COUNT(*) FROM items;
sqlite> SELECT * FROM sales;
sqlite> .quit
```

### Using DBeaver (GUI)
1. Download: https://dbeaver.io/
2. New Database Connection → SQLite
3. Browse to: `~/.samindu-system/shop_system.db`
4. Explore tables and data

## Troubleshooting

### Problem: "window.api is undefined"
```
✓ Solution: Make sure you're using Electron, not just browser
          Run: npm run dev:all (not just npm run dev)
```

### Problem: "better-sqlite3 not found"
```
✓ Solution: npm install better-sqlite3
           OR
           npm rebuild better-sqlite3 --build-from-source
```

### Problem: Database file not found
```
✓ Solution: Folder created automatically
           Check: ~/.samindu-system/
           First app run creates the database
```

### Problem: Data not saving to database
```
✓ Solution: 
  1. Check browser console for errors (F12)
  2. Check Electron main console
  3. Verify IPC handler names match preload.cjs
  4. Check database.cjs for SQL errors
```

### Problem: Items fields missing (whQty, buyingPrice, etc.)
```
✓ Solution: Database schema now includes all UI fields
           Old database will still work
           New fields default to 0
```

## Expected Console Logs

When starting the app with `npm run dev:all`, you should see:

```
✓ Database initialized successfully
✓ Electron IPC bridge (window.api) exposed successfully
```

If you don't see these, there's an initialization issue to debug.

## Data Structure Verification

### Verify Items Are Saved
```javascript
// In browser console (F12):
window.api.items.getAll().then(items => console.log(items))
```

### Verify Sales Are Saved
```javascript
window.api.sales.getAll().then(sales => console.log(sales))
```

### Check Settings
```javascript
window.api.settings.get('company_name').then(name => console.log(name))
```

## Performance Checklist

- [ ] App starts within 3 seconds
- [ ] Adding items is instant
- [ ] Creating sales is instant
- [ ] Switching tabs is smooth
- [ ] No lag when app has 100+ items
- [ ] No lag when app has 1000+ sales

## Backup & Recovery

### Create a Backup
```bash
cp ~/.samindu-system/shop_system.db ~/shop_system.db.backup
```

### Restore from Backup
```bash
cp ~/shop_system.db.backup ~/.samindu-system/shop_system.db
```

### Reset to Fresh Database
```bash
rm ~/.samindu-system/shop_system.db
# Next app launch will recreate it empty
```

## Files Modified Summary

| File | Changes | Impact |
|------|---------|--------|
| `src/backend/database.cjs` | Created | ✓ New SQLite module |
| `main.cjs` | +50 lines | ✓ IPC handlers |
| `preload.cjs` | Replaced | ✓ window.api exposed |
| `src/App.jsx` | Updated | ✓ localStorage → window.api |
| All other components | None | ✓ 100% unchanged |

## Success Criteria

✓ All tests pass
✓ Data persists after refresh
✓ No console errors
✓ Database file exists at ~/.samindu-system/shop_system.db
✓ All features work (sales, inventory, expenses, routes, settings)
✓ Reset works and clears all data

## What's Next?

Once testing is complete and everything works:

1. **Commit changes**
   ```bash
   git add .
   git commit -m "chore: migrate from localStorage to SQLite"
   ```

2. **Build for production**
   ```bash
   npm run dist
   ```

3. **Consider future features**
   - Database backup/export
   - Cloud sync capability
   - Analytics & reporting
   - Data encryption

## Support

If you encounter issues:

1. Check this checklist
2. Review MIGRATION_GUIDE.md for technical details
3. Check browser console (F12) and Electron console for errors
4. Verify database file exists and is readable
5. Try clearing app cache and restarting

---

**Good luck! Your app is now using professional SQLite storage! 🚀**
