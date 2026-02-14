# Universal Links Setup

Universal links allow shared invite URLs (e.g. `https://whatoftheyear.com/movies/2025/abc123`) to open directly in the app instead of the browser.

## 1. Update `app.json`

Add `associatedDomains` to the iOS config:

```jsonc
"ios": {
  "bundleIdentifier": "com.thirtysomethinggames.whatoftheyear",
  "associatedDomains": ["applinks:whatoftheyear.com"]
}
```

Add `intentFilters` to the Android config:

```jsonc
"android": {
  "intentFilters": [
    {
      "action": "VIEW",
      "autoVerify": true,
      "data": [
        {
          "scheme": "https",
          "host": "whatoftheyear.com",
          "pathPrefix": "/"
        }
      ],
      "category": ["BROWSABLE", "DEFAULT"]
    }
  ]
}
```

## 2. Host `apple-app-site-association` file

Create a file at `https://whatoftheyear.com/.well-known/apple-app-site-association` with this content:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["<TEAM_ID>.com.thirtysomethinggames.whatoftheyear"],
        "components": [
          {
            "/": "/*"
          }
        ]
      }
    ]
  }
}
```

Replace `<TEAM_ID>` with your Apple Developer Team ID (found at [developer.apple.com/account](https://developer.apple.com/account) → Membership Details).

Requirements:

- Served over HTTPS (no redirects)
- Content-Type: `application/json`
- No file extension in the URL
- Must be at the exact path `/.well-known/apple-app-site-association`

## 3. Host `assetlinks.json` for Android

Create a file at `https://whatoftheyear.com/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.thirtysomethinggames.whatoftheyear",
      "sha256_cert_fingerprints": ["<SHA256_FINGERPRINT>"]
    }
  }
]
```

Get the SHA256 fingerprint from your signing key:

```sh
eas credentials --platform android
```

## 4. Update the share URL

Once universal links are configured, update the share function in the lobby to use the web URL instead of the custom scheme:

```ts
const onShareInvite = async () => {
  const url = `https://whatoftheyear.com/${topic.key}/${year}/${sessionId}`;

  await Share.share({
    message: `Join my ${topic.label} of ${year} game!\n${url}`,
  });
};
```

## 5. Rebuild the app

Universal links require a native rebuild (they're baked into the app binary):

```sh
eas build --profile development
```

## Verification

- **iOS:** Paste the link in Notes and long-press it. You should see "Open in What of the Year" in the menu.
- **Android:** Paste the link in Messages and tap it. It should open the app directly.
- **Apple validator:** https://search.developer.apple.com/appsearch-validation-tool/
- **Google validator:**
  ```sh
  adb shell am start -a android.intent.action.VIEW -d "https://whatoftheyear.com/movies/2025/test123"
  ```
