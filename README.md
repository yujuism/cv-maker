# CV Maker

A web app to create and manage multiple CVs with different templates, built with SvelteKit and Firebase.

## Features

- **Multiple CVs** — create as many CVs as you want, each with its own content and template
- **Two templates** — Blue Sidebar and Minimal Clean
- **Live preview** — see changes reflected instantly as you type
- **Print / PDF export** — clean output with no browser header/footer
- **Profile photo** — upload via Firebase Storage
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
| Storage | Firebase Storage |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
| Package manager | pnpm |

## Prerequisites

- Node.js 18+
- pnpm
- A Firebase project

## Firebase Setup

1. Go to https://console.firebase.google.com and create a new project
2. Enable **Authentication** → Sign-in methods: **Google**, **Email/Password**, **Phone**
3. Enable **Realtime Database** — start in locked mode
4. Enable **Storage**
5. Copy your project's Firebase config into `src/lib/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey: '...',
  authDomain: '...',
  databaseURL: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
  measurementId: '...'
};
```

### Realtime Database Rules

In Firebase Console → Realtime Database → Rules, set:

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

### Custom Email Verification Handler

In Firebase Console → Authentication → Templates → Email address verification → edit the template and set **Action URL** to:

```
https://<your-domain>/auth/action
```

This redirects users to your app after clicking the verification link instead of Firebase's default page.

## Running Locally

```bash
git clone https://github.com/yujuism/cv-maker.git
cd cv-maker
pnpm install
pnpm dev
```

## Building

```bash
pnpm build
```

## Deployment (Firebase Hosting + GitHub Actions)

The included GitHub Actions workflow deploys automatically on push to `main` and creates preview channels for pull requests.

### Setup

1. In Firebase Console → Project Settings → Service accounts → **Generate new private key**
2. Add the downloaded JSON as a GitHub Actions secret — name it `FIREBASE_SERVICE_ACCOUNT_<YOUR_PROJECT_ID>` (uppercase, hyphens replaced with underscores)
3. Update `.firebaserc` with your project ID and hosting site name
4. Update `.github/workflows/deploy.yml` — replace `projectId` and `channelId` target with your own
5. Push to `main`

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
        ├── +page.svelte     # CV editor with live preview
        └── preview/
            └── +page.svelte # Full-page preview + print/PDF export
```

## License

MIT
