# CV Maker

A web app to create and manage multiple CVs with different templates, built with SvelteKit and Firebase.

**Live:** https://cv-maker-sanyan.web.app

---

## Features

- **Multiple CVs** — create as many CVs as you want, each with its own content and template
- **Two templates** — Blue Sidebar and Minimal Clean
- **Live preview** — see changes reflected instantly as you type
- **Print / PDF export** — clean output with no browser header/footer
- **Profile photo** — upload a photo stored in Firebase Storage
- **Authentication** — Google OAuth, Email/Password, and Phone OTP (SMS)
- **Email verification** — email/password accounts must verify before access
- **Per-user data** — each user's CVs are private and isolated

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Styling | TailwindCSS v4 |
| Auth | Firebase Authentication (Google, Email, Phone OTP) |
| Database | Firebase Realtime Database |
| Storage | Firebase Storage (profile photos) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
| Package manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Firebase project with Realtime Database, Storage, and Authentication enabled

### Installation

```bash
git clone https://github.com/yujuism/cv-maker.git
cd cv-maker
pnpm install
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** → Sign-in methods: Google, Email/Password, Phone
3. Enable **Realtime Database** (Asia Southeast region recommended)
4. Enable **Storage**
5. Copy your Firebase config into `src/lib/firebase.ts`

Set Realtime Database rules:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid === $userId",
        ".write": "auth != null && auth.uid === $userId"
      }
    }
  }
}
```

Set the custom email action handler URL in Firebase Console:
**Authentication → Templates → Email address verification → Action URL:**
```
https://cv-maker-sanyan.web.app/auth/action
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## Deployment

Deployed automatically via GitHub Actions on push to `main`.

### Setup

1. Generate a Firebase service account key (Project Settings → Service accounts → Generate new private key)
2. Add it as a GitHub secret named `FIREBASE_SERVICE_ACCOUNT_CV_MAKER_6E43F`
3. Push to `main` — the workflow handles the rest

The workflow also creates **preview channels** for pull requests.

## Project Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase app init
│   ├── authStore.svelte.ts  # Auth state + functions
│   ├── cvStore.ts           # CV CRUD (Realtime Database)
│   ├── types.ts             # TypeScript types
│   ├── defaultCV.ts         # Blank CV data
│   └── templates/
│       ├── BlueSidebar.svelte
│       └── MinimalClean.svelte
└── routes/
    ├── +layout.svelte       # Navbar + email verification banner
    ├── +page.svelte         # CV list / dashboard
    ├── auth/
    │   ├── +page.svelte     # Login / Register / Phone OTP
    │   └── action/
    │       └── +page.svelte # Email verification handler
    └── cv/[id]/
        ├── +page.svelte     # CV editor (live preview)
        └── preview/
            └── +page.svelte # Full-page preview + print/PDF
```

## Authentication Flow

- **Google** — sign in with popup, redirected to dashboard immediately
- **Email/Password** — register → verify email → login → dashboard
- **Phone OTP** — enter phone → receive SMS → enter code → dashboard
- Unverified email accounts are blocked with a banner and cannot access any content

## License

MIT
