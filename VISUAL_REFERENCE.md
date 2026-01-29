# 🎨 Authentication System - Visual Reference Guide

## Screen Mockups & Component Layout

### 1. Registration Screen (First-Time User)
```
┌─────────────────────────────────────────────┐
│                                             │
│               [Blurred Background]          │
│                                             │
│        ┌──────────────────────────┐        │
│        │      Glass Card          │        │
│        │   (border-radius: 20px)  │        │
│        │                          │        │
│        │      ┌──────────┐        │        │
│        │      │          │        │        │
│        │      │ 👤 (100px)        │        │
│        │      │          │        │        │
│        │      └──────────┘        │        │
│        │   (accent-color border)  │        │
│        │                          │        │
│        │  Welcome to Samindu     │        │
│        │                          │        │
│        │  ┌────────────────────┐  │        │
│        │  │ 👤 Username        │  │        │
│        │  └────────────────────┘  │        │
│        │                          │        │
│        │  ┌────────────────────┐  │        │
│        │  │ 🔒 Password        │  │        │
│        │  └────────────────────┘  │        │
│        │                          │        │
│        │  ┌────────────────────┐  │        │
│        │  │ 🔒 Confirm Password│  │        │
│        │  └────────────────────┘  │        │
│        │                          │        │
│        │  ┌────────────────────┐  │        │
│        │  │ → Register →       │  │        │
│        │  └────────────────────┘  │        │
│        │  (pill-shaped, blue)     │        │
│        │                          │        │
│        │  Already have account?   │        │
│        │  [Sign In]               │        │
│        └──────────────────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. Login Screen (Returning User)
```
┌─────────────────────────────────────────────┐
│                                             │
│               [Blurred Background]          │
│                                             │
│        ┌──────────────────────────┐        │
│        │      Glass Card          │        │
│        │   (border-radius: 20px)  │        │
│        │                          │        │
│        │      ┌──────────┐        │        │
│        │      │          │        │        │
│        │      │ [PHOTO]  │        │        │
│        │      │ 100x100  │        │        │
│        │      │ (circle) │        │        │
│        │      └──────────┘        │        │
│        │   (accent-color border)  │        │
│        │                          │        │
│        │         admin            │        │
│        │     (displayed name)     │        │
│        │                          │        │
│        │  ┌────────────────────┐  │        │
│        │  │ 🔒 ••••••••        │  │        │
│        │  │ (focused input)     │  │        │
│        │  └────────────────────┘  │        │
│        │                          │        │
│        │  ┌────────────────────┐  │        │
│        │  │ → Sign In →        │  │        │
│        │  └────────────────────┘  │        │
│        │  (pill-shaped, blue)     │        │
│        │                          │        │
│        │  Sign in as different    │        │
│        │  user                    │        │
│        └──────────────────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. Settings - Security & Privacy Section
```
┌────────────────────────────────────────┐
│  System Settings                       │
├────────────────────────────────────────┤
│                                        │
│  🏢 Branding & Identity                │
│  ├─ Company Name         [admin       ]│
│  └─ Custom Logo          [Upload      ]│
│                                        │
│  🔒 Security & Privacy   ← NEW         │
│  └─ Always require       ┌─────┐      │
│     password on startup  │ ON  │      │
│                          └─────┘      │
│     (If OFF: auto-login)               │
│                                        │
│  ⬇️ Data Management                    │
│  ├─ Export Backup         [Export    ]│
│  └─ Cloud Sync            Inactive    │
│                                        │
│  🎨 Appearance                         │
│  ├─ Theme Mode            Active      │
│  └─ Compact Mode          [ ]         │
│                                        │
│  ⚠️ Danger Zone                        │
│  └─ Factory Reset         [Reset All ]│
│                                        │
└────────────────────────────────────────┘
```

---

## 🎨 Color & Styling Reference

### Glass-Morphism Effect
```css
/* Container */
background: var(--glass-bg);
backdrop-filter: blur(20px);
border: 1px solid var(--border-color);

/* Dark Mode */
--glass-bg: rgba(45, 45, 45, 0.6);
--border-color: rgba(255, 255, 255, 0.1);

/* Light Mode */
--glass-bg: rgba(255, 255, 255, 0.7);
--border-color: rgba(0, 0, 0, 0.08);
```

### Button Styling (Pill Shape)
```css
background: var(--accent-color);
border-radius: 50px;
padding: 12px 25px;
color: white;
border: none;
transition: all 0.3s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

/* Colors */
Light Mode: #0067c0 (Windows Blue)
Dark Mode:  #4cc2ff (Cyan)
```

### Input Field Styling
```css
background: rgba(0, 0, 0, 0.05);
border: 1px solid var(--border-color);
border-radius: 12px;
padding: 12px 15px;
color: var(--input-text);

/* Dark Mode Background */
background: rgba(255, 255, 255, 0.05);

/* Placeholder */
color: var(--placeholder-color);
--placeholder-color: rgba(255, 255, 255, 0.5); /* dark */
--placeholder-color: #707070; /* light */
```

### Toggle Switch Styling
```css
Width: 50px
Height: 28px
Border-radius: 14px
Background: #ccc (OFF) → accent-color (ON)
Toggle Knob: 24px circle with transition
Animation: left 0.3s ease

ON State:
- Background: var(--accent-color)
- Knob Position: left 24px

OFF State:
- Background: #ccc
- Knob Position: left 2px
```

---

## 📱 Component Hierarchy

```
App
├── [isAuthenticated === false]
│   └── Auth
│       ├── .auth-container (full-screen)
│       ├── .auth-background (blur overlay)
│       └── .auth-card (centered)
│           ├── .auth-profile-picture
│           │   └── img.auth-profile-img
│           ├── .auth-title / .auth-username
│           ├── .auth-form
│           │   ├── .auth-input-group (username)
│           │   ├── .auth-input-group (password)
│           │   ├── .auth-input-group (confirm)
│           │   ├── button.auth-button
│           │   └── .auth-error
│           └── .auth-toggle-link
│
└── [isAuthenticated === true]
    └── MainLayout
        ├── nav.sidebar
        │   ├── .brand
        │   ├── .nav-items-container
        │   └── .sidebar-footer
        │       ├── .profile-section
        │       └── Settings link
        │
        └── main.main-content
            ├── .header-title
            └── [Active Page Component]
                ├── Dashboard
                ├── Inventory
                ├── Sales
                ├── Settings (with Security section)
                └── ...
```

---

## 🔄 State Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ App Component                                   │
│                                                 │
│  const [isAuthenticated, setIsAuthenticated]   │
│         ↓                                       │
│  useEffect(() => {                             │
│    Check 'samindu_require_password'            │
│    If 'false' → setIsAuthenticated(true)       │
│  }, [])                                        │
└─────────────────────────────────────────────────┘
           ↓
    ┌──────────────────┐
    │ Render Logic     │
    └──────────────────┘
           ↓
    ┌─────────────────────────────────────┐
    │ isAuthenticated ?                    │
    │ <MainLayout /> : <Auth />            │
    └─────────────────────────────────────┘
           ↙            ↘
    ┌─────────┐      ┌──────────┐
    │ Auth    │      │MainLayout│
    │         │      │          │
    │Render:  │      │Render:   │
    │- Form   │      │- Sidebar │
    │- Input  │      │- Content │
    │- Button │      │- Pages   │
    │         │      │          │
    │onAuth:  │      │          │
    │handleAu-│      │          │
    │thenticate       │          │
    │→isAuth=true     │          │
    └─────────┘      └──────────┘
        ↓                ↑
        └────────────────┘
         (triggers re-render)
```

---

## 🔐 Authentication Flow

```
START (App loads)
  ↓
Check localStorage:
  ├─ 'samindu_user_registered' exists?
  │  ├─ NO → Show Registration Form
  │  └─ YES → Continue
  │
  └─ 'samindu_require_password' === 'false'?
     ├─ YES → Auto-Login → Go to Dashboard
     └─ NO → Show Password Login
         ↓
      User enters password
         ↓
      Verify against 'samindu_password'
         ├─ CORRECT → Call handleAuthenticated()
         │             → setIsAuthenticated(true)
         │             → Re-render MainLayout
         │             → Dashboard displayed
         └─ INCORRECT → Show error message
                        → User re-enters password
```

---

## 🎯 CSS Variables Used

### Colors (Theme-Based)
```css
Light Theme:
  --accent-color: #0067c0 (Windows Blue)
  --bg-gradient: #f3f3f3
  --glass-bg: rgba(255, 255, 255, 0.7)
  --text-main: #1b1b1b
  --text-light: #5d5d5d
  --border-color: rgba(0, 0, 0, 0.08)

Dark Theme:
  --accent-color: #4cc2ff (Cyan)
  --bg-gradient: #121212
  --glass-bg: rgba(45, 45, 45, 0.6)
  --text-main: #ffffff
  --text-light: #a1a1a1
  --border-color: rgba(255, 255, 255, 0.1)
```

### Sizing & Spacing
```css
Auth Card:
  max-width: 420px
  padding: 50px 40px
  border-radius: 20px
  gap: 15px (form fields)

Profile Picture:
  width/height: 100px
  border-radius: 50%
  border: 3px

Input Groups:
  border-radius: 12px
  padding: 12px 15px
  gap: 10px

Button:
  border-radius: 50px
  padding: 12px 25px
```

---

## ✨ Special Effects

### Backdrop Blur
```css
.auth-background {
  backdrop-filter: blur(10px);
}

.auth-card {
  backdrop-filter: blur(20px);
}
```

### Hover Animations
```css
.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.toggle-label::after {
  transition: left 0.3s ease;
}

.toggle-checkbox:checked + .toggle-label::after {
  left: 24px;
}
```

### Smooth Transitions
```css
All elements have:
- transition: background 0.3s ease;
- transition: all 0.3s ease;
- transition: left 0.3s ease;
```

---

## 📐 Dimensions Reference

| Element | Width | Height | Border-radius |
|---------|-------|--------|---------------|
| Auth Container | 100% | 100% | - |
| Auth Card | 100% (max 420px) | auto | 20px |
| Profile Picture | 100px | 100px | 50% |
| Input Groups | 100% | auto | 12px |
| Button | 100% | auto | 50px |
| Toggle Switch | 50px | 28px | 14px |
| Toggle Knob | 24px | 24px | 50% |

---

## 🎬 Animation Timings

| Animation | Duration | Easing | Property |
|-----------|----------|--------|----------|
| Button Hover | 0.3s | ease | transform, box-shadow |
| Button Active | instant | - | transform |
| Toggle Switch | 0.3s | ease | left, background |
| Theme Transition | 0.3s | ease | background |
| Input Focus | instant | - | outline |
| Label Fade | 0.3s | ease | opacity |

---

## 🌙 Theme-Specific Notes

### Dark Mode
- More prominent glass effect with higher opacity
- Subtle border for definition
- Higher contrast text
- Cyan accent color (#4cc2ff) for visibility

### Light Mode
- Lower opacity glass effect (more transparent)
- Lighter borders for subtlety
- Dark text for readability
- Blue accent color (#0067c0) for Windows consistency

---

**Design System**: Windows 11 / Fluent Design  
**Color Palette**: Windows 11 Light & Dark Themes  
**Typography**: Segoe UI Variable, sans-serif  
**Component Library**: lucide-react (icons)  
**Animation Framework**: CSS transitions
