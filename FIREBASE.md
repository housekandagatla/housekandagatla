# Firebase setup — House Kandagatla

## Console checklist

1. Open [Firebase Console](https://console.firebase.google.com/) with `thehouseofkandagatla@gmail.com`.
2. Select (or create) the web project for this site.
3. **Authentication → Sign-in method → Google → Enable**.
4. **Authentication → Settings → Authorized domains**: add `localhost` and `thehouseofkandagatla.github.io`.
5. **Firestore Database → Create database** (production mode).
6. **Firestore → Rules**: paste contents of `firestore.rules` and Publish.
7. **Project settings → Your apps → Web app**: copy the config values.

## Local `.env`

Copy `.env.example` to `.env` and fill:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Run `npm run dev`, open the app, click **Sign in with Google** as `thehouseofkandagatla@gmail.com`. First admin sign-in seeds festivals, heritage, story, and admins meta docs.

## GitHub Pages secrets

In the GitHub repo → **Settings → Secrets and variables → Actions**, add the same six values as repository secrets:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

The deploy workflow injects them at build time.

## Data paths

| Path | Content |
|------|---------|
| `families/hok/members/{id}` | Family members |
| `families/hok/festivals/{id}` | Festivals |
| `families/hok/meta/heritage` | Heritage items + deity |
| `families/hok/meta/story` | Family story |
| `families/hok/meta/admins` | Admin emails (seeded) |

Public can read. Only `thehouseofkandagatla@gmail.com` can write.
