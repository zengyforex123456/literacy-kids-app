---
name: build-apk
description: Build Android APK from Capacitor project — local or CI. Detects environment, syncs web assets, runs Gradle, outputs APK.
---

# Build Android APK

## Pre-check: Path Safety

**CRITICAL**: Before any build action, verify the project path contains no non-ASCII characters.

```bash
PROJECT_DIR=$(pwd)
if echo "$PROJECT_DIR" | grep -qP '[^\x00-\x7F]'; then
  echo "WARNING: Project path contains non-ASCII characters!"
  echo "Path: $PROJECT_DIR"
  echo "This WILL cause UNC path failures, tool errors, and silent write failures."
  echo "Fix: mv project to a path with ASCII-only characters (e.g. ~/literacy-kids)"
  exit 1
fi
```

**If the path check fails, abort immediately. Do not attempt to write files or build.**

### Known Symptoms of Path Issues

| Symptom | Root Cause |
|---------|-----------|
| Write tool "success" but no file | UNC path with CJK chars silently fails |
| `npm` "ENOENT: no such file" | CMD doesn't support UNC + CJK |
| `cat > file << EOF` hangs | Bash glob/regex misinterprets multi-byte chars |
| `git` shows clean after write | File was written to wrong location |
| `Copy-Item` fails | PowerShell UNC + CJK resolution fails |
| Playwright "executable not found" | Path resolution in child processes fails |

## Workflow

### 0. PATH CHECK (mandatory)

```bash
pwd | grep -qP '[^\x00-\x7F]' && echo "FAIL: CJK in path" || echo "OK"
```

If FAIL: **stop everything**, move project, restart.

### 1. DETECT

Find Android toolchain:

```bash
# Windows
ls "D:\Program Files\Android\Android Studio\jbr"  # JDK 21
cmd.exe /c "where studio64.exe"

# Linux/WSL  
ls /mnt/d/Program\ Files/Android/Android\ Studio/
```

### 2. BUILD WEB

```bash
npm install && npm run build
```

### 3. CI BUILD (recommended — bypasses local path issues)

```bash
git add -A && git commit -m "build: trigger APK" && git push
# Monitor in browser: https://github.com/<user>/<repo>/actions
# OR: gh run watch && gh run download <id> -n literacy-kids-app-debug
```

### 4. LOCAL BUILD (only if path is safe)

```bash
export JAVA_HOME="D:\Program Files\Android\Android Studio\jbr"
export ANDROID_HOME="$HOME/Android/Sdk"
cd android && ./gradlew assembleDebug   # Linux
# OR: cd android && gradlew.bat assembleDebug   # Windows
```

### 5. VERIFY

```bash
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```
