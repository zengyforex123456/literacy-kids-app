---
name: build-apk
description: Build Android APK from Capacitor project — local or CI. Detects environment, syncs web assets, runs Gradle, outputs APK.
---

# Build Android APK

Builds a debug APK from the Capacitor-wrapped React web app.

## Trigger

```
/build-apk [--ci] [--release]
```

| Flag | Effect |
|------|--------|
| (none) | Local build — uses Android Studio / SDK on this machine |
| `--ci` | Push to GitHub and trigger Actions workflow |
| `--release` | Build release (signed) APK instead of debug |

## Workflow

### Phase 1: DETECT

Check build environment:

```bash
node --version       # Need >= 18
npm --version
npx cap --version    # Capacitor CLI
```

Find Android SDK:
```bash
# Windows
echo %ANDROID_HOME%
dir "%LOCALAPPDATA%\Android\Sdk"

# macOS / Linux
echo $ANDROID_HOME
ls ~/Android/Sdk
```

Find Java:
```bash
java --version      # Need JDK 17 or 21
echo $JAVA_HOME
```

### Phase 2: BUILD WEB

```bash
npm install          # Install dependencies
npm run build        # Vite production build → dist/
```

Verify build output:
```bash
ls dist/index.html
ls dist/assets/
```

### Phase 3: SYNC CAPACITOR

```bash
npx cap sync android
```

This copies `dist/` assets into `android/app/src/main/assets/public/`.

### Phase 4: BUILD APK

**Local (with Android Studio):**
```bash
npx cap open android
# Android Studio → Build → Build Bundle(s)/APK → Build APK
```

**Local (command line):**
```bash
cd android

# Windows
gradlew.bat assembleDebug

# macOS/Linux
chmod +x gradlew
./gradlew assembleDebug
```

**CI (GitHub Actions):**
```bash
git add -A && git commit -m "build: trigger APK" && git push
# Monitor: gh run watch
# Download: gh run download <id> -n literacy-kids-app-debug
```

### Phase 5: VERIFY

Check APK output:
```bash
# Local
ls android/app/build/outputs/apk/debug/app-debug.apk

# CI
gh run list --limit 1
gh run download $(gh run list --limit 1 --json databaseId -q '.[0].databaseId') -n literacy-kids-app-debug
```

Expected: `app-debug.apk` ~4-5 MB

### Error Recovery

| Error | Fix |
|-------|-----|
| `npm ci` lock file mismatch | `npm install` to regenerate lock |
| `invalid source release: 21` | Set `java-version: '21'` in workflow |
| `ANDROID_HOME not set` | `export ANDROID_HOME=~/Android/Sdk` |
| Gradle permission denied | `chmod +x android/gradlew` |
| Capacitor not found | `npm install @capacitor/core @capacitor/cli @capacitor/android` |
