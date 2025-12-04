# Multi-Language System - Visual Implementation Guide

## 🎨 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     React Application                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  App.tsx (with LanguageProvider wrapper)             │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         LanguageContext (Context API)                │   │
│  │  - Provides t() function to all components           │   │
│  │  - Provides translations object                      │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↙              ↓              ↘                      │
│   ┌─────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │Store    │  │Components   │  │All Pages    │            │
│   │(Zustand)│  │(Context)    │  │(Localized)  │            │
│   └─────────┘  └─────────────┘  └─────────────┘            │
│         ↓              ↓              ↓                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  translations.ts (1000+ keys across 6 languages)    │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↓              ↓              ↓                      │
│   ┌────────┐  ┌────────┐  ┌──────────────────┐            │
│   │English │  │Hindi   │  │+ 4 More Languages│            │
│   └────────┘  └────────┘  └──────────────────┘            │
│         ↓              ↓              ↓                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         localStorage (language-storage)              │   │
│  │         (Persists across sessions)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 User Journey with Sequence Diagram

```
User                  Auth Page              Language Selector      App
  │                      │                         │                │
  │──────Login────────→   │                         │                │
  │                       │────Verify──────────→   │                │
  │                       │────Create Session──→   │                │
  │                       │                         │                │
  │                       │◄────Show Modal─────────│                │
  │                       │    (6 Languages)       │                │
  │                       │                         │                │
  │◄────Display Modal─────│◄───────────────────────│                │
  │    (Beautiful UI)      │                         │                │
  │                       │                         │                │
  │──Select Language──→   │─────Save Choice───────│                │
  │                       │                         │                │
  │                       │────Get Translations─────────────→       │
  │                       │                         │    ┌─────────┐ │
  │                       │                         │    │Set Lang │ │
  │                       │                         │    │Render   │ │
  │                       │                         │    └─────────┘ │
  │◄────Redirect───────────────────────────────────────────────────│
  │                       │                         │                │
  │    Home Page (Translated Content)              │                │
```

## 📋 Component Flow Diagram

```
Auth Page
  │
  ├─→ handleLogin() 
  │    │
  │    ├─→ supabase.auth.signIn()
  │    │
  │    └─→ setShowLanguageSelector(true)
  │
  └─→ <LanguageSelector />
        │
        ├─ Props: isOpen, onClose, onSelectLanguage
        │
        ├─ Shows 6 Language Options
        │  ├─ English 🇬🇧
        │  ├─ Hindi 🇮🇳
        │  ├─ Spanish 🇪🇸
        │  ├─ French 🇫🇷
        │  ├─ German 🇩🇪
        │  └─ Chinese 🇨🇳
        │
        └─→ handleLanguageSelect()
             │
             ├─→ setLanguage(lang)  [Zustand Store]
             │
             ├─→ setFirstTimeUser(false)
             │
             └─→ navigate('/')
```

## 🏪 State Management Flow

```
┌─────────────────────────────────────┐
│   LanguageStore (Zustand)           │
├─────────────────────────────────────┤
│                                      │
│  State:                              │
│  ├─ language: Language               │
│  └─ isFirstTimeUser: boolean         │
│                                      │
│  Actions:                            │
│  ├─ setLanguage(lang)                │
│  └─ setFirstTimeUser(isFirst)        │
│                                      │
│  Persistence:                        │
│  └─ localStorage ("language-storage")│
│                                      │
└─────────────────────────────────────┘
        ↓         ↓         ↓
    ┌───────┐ ┌───────┐ ┌──────────┐
    │Auth   │ │Header │ │Settings  │
    │Page   │ │Nav    │ │Component │
    └───────┘ └───────┘ └──────────┘
```

## 📚 Translation Data Structure

```
translations.ts
│
├─→ en (English)
│   ├─ nav: { home: 'Home', cameras: 'Cameras', ... }
│   ├─ hero: { morningGreeting: '🌅 Good Morning', ... }
│   ├─ auth: { selectLanguage: 'Select Your Preferred Language', ... }
│   ├─ products: { editorsPicks: "Editor's Picks", ... }
│   ├─ orders: { myOrders: 'My Orders', ... }
│   └─ ... (500+ more keys)
│
├─→ hi (Hindi)
│   ├─ nav: { home: 'होम', cameras: 'कैमरे', ... }
│   ├─ hero: { morningGreeting: '🌅 सुप्रभात', ... }
│   ├─ auth: { selectLanguage: 'अपनी पसंदीदा भाषा चुनें', ... }
│   ├─ products: { editorsPicks: 'संपादक की पसंद', ... }
│   ├─ orders: { myOrders: 'मेरे ऑर्डर', ... }
│   └─ ... (500+ more keys)
│
├─→ es (Spanish) │
│   └─ (Similar structure)
│
├─→ fr (French) │
│   └─ (Similar structure)
│
├─→ de (German) │
│   └─ (Similar structure)
│
└─→ zh (Chinese)
    └─ (Similar structure)
```

## 🎯 File Dependencies

```
App.tsx
  │
  ├─→ imports LanguageProvider
  │    │
  │    └─→ LanguageContext.tsx
  │         │
  │         ├─→ useLanguageStore
  │         │    └─→ languageStore.ts
  │         │
  │         └─→ getTranslation, t functions
  │              └─→ translations.ts
  │
  └─→ Routes include Auth.tsx
       │
       ├─→ imports LanguageSelector
       │    │
       │    ├─→ useLanguageStore
       │    │    └─→ languageStore.ts
       │    │
       │    └─→ translations
       │         └─→ translations.ts
       │
       └─→ Account route includes Settings.tsx
            │
            └─→ imports LanguageSettings
                 │
                 ├─→ useLanguageStore
                 │    └─→ languageStore.ts
                 │
                 └─→ translations.ts
```

## 🎨 UI Component Hierarchy

```
<App>
  │
  ├─ <LanguageProvider>
  │   │
  │   ├─ <MainLayout>
  │   │   │
  │   │   ├─ <Header>
  │   │   │   └─ Uses: t('nav.home'), t('nav.cameras')...
  │   │   │
  │   │   ├─ <Routes>
  │   │   │   │
  │   │   │   ├─ <Home>
  │   │   │   │   └─ Uses: t('hero.morningGreeting')...
  │   │   │   │
  │   │   │   ├─ <Auth>
  │   │   │   │   │
  │   │   │   │   ├─ <LanguageSelector>
  │   │   │   │   │   └─ Shows 6 language options
  │   │   │   │   │
  │   │   │   │   └─ Uses: t('auth.email')...
  │   │   │   │
  │   │   │   ├─ <Account>
  │   │   │   │   │
  │   │   │   │   ├─ <Settings>
  │   │   │   │   │   │
  │   │   │   │   │   └─ <LanguageSettings>
  │   │   │   │   │       └─ 6 language selection cards
  │   │   │   │   │
  │   │   │   │   └─ Uses: t('account.profile')...
  │   │   │   │
  │   │   │   ├─ <Orders>
  │   │   │   │   └─ Uses: t('orders.myOrders')...
  │   │   │   │
  │   │   │   └─ <Cart>
  │   │   │       └─ Uses: t('cart.myCart')...
  │   │   │
  │   │   └─ <AdvancedChatBot>
  │   │       └─ Uses: t('chatbot.typeMessage')...
  │   │
  │   └─ <FeatureFlagsProvider>
  │
  └─ Global Components:
      ├─ Toast notifications
      └─ Other UI elements
```

## 🔑 Key Translation Path Examples

```
Translation Paths Used Throughout App:

UI Elements:
├─ nav.home                    → "Home" / "होम" / "Inicio"
├─ nav.cameras                 → "Cameras" / "कैमरे" / "Cámaras"
├─ nav.logout                  → "Logout" / "लॉगआउट" / "Cerrar sesión"
├─ common.loading              → "Loading..." / "लोड हो रहा है..."
└─ common.error                → "Error" / "त्रुटि" / "Error"

Authentication:
├─ auth.email                  → "Email" / "ईमेल" / "Correo electrónico"
├─ auth.selectLanguage         → "Select Your Preferred Language"
├─ auth.loggingIn              → "Logging in..." / "लॉगिन जारी है..."
└─ auth.loggedInSuccessfully   → "Logged in successfully!" / "सफलतापूर्वक लॉगिन हो गए!"

Hero Section:
├─ hero.morningGreeting        → "🌅 Good Morning" / "🌅 सुप्रभात"
├─ hero.afternoonGreeting      → "☀️ Good Afternoon" / "☀️ नमस्कार"
├─ hero.eveningGreeting        → "🌙 Good Evening" / "🌙 शुभ संध्या"
├─ hero.morningHeadline        → "Start Your Day Right"
└─ hero.morningCta             → "Shop Morning Deals"

Orders:
├─ orders.myOrders             → "My Orders" / "मेरे ऑर्डर"
├─ orders.trackOrder           → "Track Order" / "ऑर्डर ट्रैक करें"
├─ orders.orderConfirmed       → "Order Confirmed" / "ऑर्डर की पुष्टि"
└─ orders.orderNumber          → "Order Number" / "ऑर्डर नंबर"

Products:
├─ products.editorsPicks       → "Editor's Picks" / "संपादक की पसंद"
├─ products.viewAll            → "View All Products" / "सभी उत्पाद देखें"
└─ categories.shopByCategory   → "Shop by Category"

Cart & Checkout:
├─ cart.myCart                 → "My Cart" / "मेरी कार्ट"
├─ cart.proceedToCheckout      → "Proceed to Checkout"
├─ cart.total                  → "Total" / "कुल"
└─ cart.emptyCart              → "Your cart is empty"

Chatbot:
├─ chatbot.typeMessage         → "Type your message..." / "अपना संदेश टाइप करें..."
├─ chatbot.advancedAssistant   → "Advanced Shopping Assistant"
└─ chatbot.suggestions[0]      → "Recommend best cameras..."
```

## 🚦 Language Selection Flow (State Diagram)

```
                    ┌─────────────┐
                    │  Start App  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────────┐
                    │ Check Language  │
                    │ in localStorage │
                    └──────┬──────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
         Found ▼                      ▼ Not Found
        ┌─────────────┐        ┌──────────────┐
        │ Use Stored  │        │ Use Default  │
        │ Language    │        │ (English)    │
        └──────┬──────┘        └──────┬───────┘
               │                      │
               │         ┌────────────┘
               │         │
               │         ▼
               │    ┌──────────────┐
               │    │ First Login? │
               │    └──────┬───────┘
               │           │
               │      ┌────┴─────┐
               │      │           │
               │   Yes▼           ▼No
               │  ┌─────────────┐ │
               │  │Show Language│ │
               │  │ Selector    │ │
               │  │ Modal       │ │
               │  └──────┬──────┘ │
               │         │        │
               │         │   ┌────┘
               │         │   │
               │    Select▼   ▼
               │    ┌──────────────────┐
               │    │ Set Language &   │
               │    │ isFirstTimeUser  │
               │    │ to false         │
               │    └────────┬─────────┘
               │             │
               └─────────┬───┘
                         │
                         ▼
                  ┌─────────────────┐
                  │ Save to         │
                  │ localStorage    │
                  └────────┬────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ Render App in Selected │
              │ Language (All Content  │
              │ Translated)            │
              └────────────────────────┘
```

## 💾 localStorage Structure

```
Browser DevTools → Application → Storage → Local Storage

Key: language-storage
Value: {
  "state": {
    "language": "hi",        // Current language (en|hi|es|fr|de|zh)
    "isFirstTimeUser": false // First time flag
  },
  "version": 0
}

Example values:
├─ {"state":{"language":"en","isFirstTimeUser":false},"version":0}
├─ {"state":{"language":"hi","isFirstTimeUser":false},"version":0}
├─ {"state":{"language":"es","isFirstTimeUser":false},"version":0}
├─ {"state":{"language":"fr","isFirstTimeUser":false},"version":0}
├─ {"state":{"language":"de","isFirstTimeUser":false},"version":0}
└─ {"state":{"language":"zh","isFirstTimeUser":false},"version":0}
```

## 🎯 Integration Points

```
Throughout the App, translation is accessed via:

1. useTranslation() Hook (Recommended)
   import { useTranslation } from '@/contexts/LanguageContext';
   const { t } = useTranslation();
   const text = t('nav.home');  // Returns "Home" or localized version

2. Direct Translation Function
   import { t } from '@/lib/translations';
   const language = useLanguageStore(s => s.language);
   const text = t(language, 'nav.home');

3. Full Translations Object
   import { useTranslation } from '@/contexts/LanguageContext';
   const { translations } = useTranslation();
   const text = translations.nav.home;
```

## 🔄 Change Language Flow

```
User in Settings
       │
       ▼
Clicks LanguageSettings Card
       │
       ▼
Selects Different Language
       │
       ├─→ setLanguage(newLang)  [Store]
       │   │
       │   └─→ Updates localStorage
       │
       ├─→ Context re-renders
       │   │
       │   └─→ All components get new translations
       │
       └─→ Toast notification
           "Language changed to..."
           
       ▼
App instantly displays new language
(No page reload needed!)
```

---

This visual guide provides a complete overview of the multi-language system architecture, data flow, and integration points. 🎉
