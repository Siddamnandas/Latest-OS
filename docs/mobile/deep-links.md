# Mobile Deep Links

This project supports custom URL schemes so the mobile app can open
specific screens directly. The scheme used is `latestos://`.

## Configuration

The Expo configuration (`app.json`) declares the custom scheme and intent
filters for Android and iOS:

```json
{
  "expo": {
    "name": "Latest OS",
    "slug": "latest-os",
    "scheme": "latestos",
    "android": {
      "package": "com.latest.os",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "latestos" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "ios": {
      "bundleIdentifier": "com.latest.os"
    }
  }
}
```

## Handling Links

The navigation layer exposes helpers for working with incoming links:

```ts
import { handleDeepLink } from '@/lib/navigation'

// Example: when a deep link is received
handleDeepLink('latestos://profile', router)
```

`handleDeepLink` converts the incoming URL into an internal path and uses
the provided `router` (any object with a `push` method) to navigate.

## Testing

On a device or emulator run:

```bash
npx uri-scheme open latestos://profile --android
```

Replace `profile` with the path you want to test. The app should open to
that screen.
