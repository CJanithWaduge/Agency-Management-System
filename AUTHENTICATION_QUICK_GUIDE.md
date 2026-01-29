# Authentication System - Quick Reference Guide

## 🔐 How to Test the Authentication System

### Test Scenario 1: First-Time User (Registration)
1. Clear browser storage (DevTools → Application → Clear Site Data)
2. Refresh the app
3. **Expected**: Registration form appears with "Username" and "Password" fields
4. Enter any username (e.g., "admin")
5. Enter password (min 4 characters, e.g., "admin123")
6. Enter same password in confirmation field
7. Click "Register" button
8. **Expected**: Dashboard loads

### Test Scenario 2: Returning User with Password Required
1. Refresh app (without clearing storage)
2. **Expected**: Login screen shows with profile picture and username ("admin")
3. Click on username or profile picture area
4. **Expected**: Password input field is focused
5. Enter password "admin123"
6. Click "Sign In" button
7. **Expected**: Dashboard loads

### Test Scenario 3: Sign In as Different User
1. From login screen, click "Sign in as different user" link
2. **Expected**: Full registration/login form appears
3. Enter different username and password
4. Click "Register" to create new account
5. **Expected**: Dashboard loads with new user

### Test Scenario 4: Auto-Login (Bypass Password)
1. Go to **Settings** tab → **Security & Privacy** section
2. Toggle "Always require password on startup" to **OFF**
3. Go to any page in the dashboard
4. Press F5 to refresh
5. **Expected**: Dashboard loads immediately WITHOUT showing auth screen
6. Toggle back to **ON** and refresh
7. **Expected**: Auth screen appears again

### Test Scenario 5: Profile Picture on Login
1. In Dashboard, click the profile avatar (bottom of sidebar)
2. Click "Edit" overlay
3. Upload an image
4. Refresh the page
5. **Expected**: Profile picture appears in circular badge on login screen

---

## 📁 Component Structure

```
src/
├── App.jsx                    (Main app - now with auth state)
├── App.css                    (Styles including .auth-* classes)
├── pages/
│   ├── Auth.jsx              (NEW - Authentication component)
│   ├── Settings.jsx           (Modified - Security & Privacy section)
│   ├── Dashboard.jsx
│   ├── Inventory.jsx
│   ├── Sales.jsx
│   ├── Creditors.jsx
│   ├── Statement.jsx
│   ├── History.jsx
│   └── ...
```

---

## 🎨 CSS Classes Reference

### Main Container
- `.auth-container` - Full-screen overlay (fixed, z-index: 9999)
- `.auth-background` - Blurred background with gradient
- `.auth-card` - Centered card (max-width: 420px)

### Profile
- `.auth-profile-picture` - 100px circular avatar
- `.auth-profile-img` - Image inside avatar
- `.auth-profile-placeholder` - Emoji fallback

### Text
- `.auth-title` - "Welcome to Samindu" heading
- `.auth-username` - Username display for returning users

### Form
- `.auth-form` - Form container (flex column)
- `.auth-input-group` - Input wrapper with icon
- `.auth-input-icon` - Lucide icon color (accent-color)
- `.auth-input` - Input field (transparent background)

### Buttons
- `.auth-button` - Primary pill button (accent-color background)
- `.auth-toggle-link` - Secondary text link
- `.auth-switch-user-link` - Underlined link

### Feedback
- `.auth-error` - Error message box

### Toggle Switch
- `.toggle-switch` - Container
- `.toggle-checkbox` - Hidden input
- `.toggle-label` - Visible toggle button
- `.toggle-on`, `.toggle-off` - Status labels

---

## 🔌 Props & Functions

### Auth Component Props
```jsx
<Auth 
  onAuthenticated={handleAuthenticated}  // Called when login succeeds
  profileImage={profileImage}            // Base64 image from settings
/>
```

### App Component State
```jsx
const [isAuthenticated, setIsAuthenticated] = useState(false);

// Called by Auth component
const handleAuthenticated = () => {
  setIsAuthenticated(true);
};
```

---

## 💾 localStorage Data Structure

### Registration Data
```javascript
localStorage.setItem('samindu_user_registered', 'true');
localStorage.setItem('samindu_username', 'admin');
localStorage.setItem('samindu_password', 'admin123');  // ⚠️ Not hashed in demo
```

### Session Data
```javascript
localStorage.setItem('samindu_current_user', 'admin');
```

### Settings Data
```javascript
localStorage.setItem('samindu_require_password', 'true');  // 'true' or 'false'
```

---

## 🎯 Key Features at a Glance

| Feature | Implementation |
|---------|-----------------|
| **Lock Screen Design** | Glass-morphism with backdrop blur |
| **Profile Picture** | Circular badge at top of card |
| **Username Display** | Shows below picture for returning users |
| **Password Validation** | Minimum 4 characters |
| **Sign In as Different User** | Clears session, returns to full form |
| **Auto-Login Toggle** | Settings → Security & Privacy section |
| **Theme Support** | Dark/Light mode compatible |
| **Error Messages** | Clear validation feedback |
| **Pill Button** | Rounded blue accent color button |

---

## 🐛 Troubleshooting

### Auth screen not appearing
- Check if `samindu_user_registered` is in localStorage
- Check if `samindu_require_password` is set to 'true'
- Clear all site data and refresh

### Profile picture not showing
- Verify image was uploaded in Settings
- Check if `samindu_profile_image` exists in localStorage
- Try uploading a different image format

### Password toggle not working
- Clear browser cache
- Check localStorage for `samindu_require_password` key
- Refresh page after toggling

### Auto-login not working
- Ensure `samindu_require_password` is set to 'false'
- Ensure `samindu_user_registered` is set to 'true'
- Both conditions must be true for auto-login

---

## 📝 Notes

- Passwords are stored in plain text in this demo (not production-ready)
- For production, implement proper password hashing
- Consider adding password reset/recovery flow
- Consider adding session timeout security feature
- Consider implementing proper user role management

---

## ✅ Implementation Complete

All requirements have been successfully implemented:
- ✅ Auth.jsx component with Windows 11 design
- ✅ Registration and login flows
- ✅ Profile picture integration
- ✅ Sign in as different user functionality
- ✅ Security & Privacy settings section
- ✅ Toggle for password requirement on startup
- ✅ Auto-login bypass functionality
- ✅ Full CSS styling with glass effect
- ✅ State management with conditional rendering
- ✅ localStorage persistence
