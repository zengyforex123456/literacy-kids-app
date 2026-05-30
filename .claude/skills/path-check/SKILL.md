---
name: path-check
description: Detect and fix non-ASCII project path issues. CJK characters in paths cause UNC/WSL/Windows tool failures. Run this first when file operations fail silently.
---

# Path Safety Check

## When to Run

Run before ANY file operation if you see:
- Write tool says "created" but file doesn't exist
- `npm` can't find package.json
- `git` shows clean after writing
- `Copy-Item` / `cp` fails silently
- Bash heredocs end unexpectedly

## Check

```bash
# Detect non-ASCII in current path
pwd | grep -qP '[^\x00-\x7F]' && echo "UNSAFE: CJK characters in path" || echo "SAFE"

# Detect non-ASCII in project name
ls ~/ | grep -P '[^\x00-\x7F]'
```

## Fix

### Option A: Rename (recommended)
```bash
mv ~/幼儿识字 ~/literacy-kids
cd ~/literacy-kids
```

### Option B: Symlink
```bash
ln -s ~/幼儿识字 ~/literacy-kids
cd ~/literacy-kids
```

### Option C: Work from ASCII path only
```bash
# Copy to safe location, work there, copy back
cp -r ~/幼儿识字 /tmp/literacy-kids
cd /tmp/literacy-kids
# ... do work ...
cp -r /tmp/literacy-kids ~/幼儿识字/
```

## Prevention

```bash
# When creating new projects, use ASCII names
npm create vite@latest literacy-kids    # ✅
npm create vite@latest 幼儿识字          # ❌ Will cause issues
```

## Affected Tools

| Tool | Symptom | Severity |
|------|---------|----------|
| Write (Claude Code) | Silent failure | 🔴 Critical |
| npm / npx | ENOENT errors | 🔴 Critical |
| Bash heredoc | Unexpected EOF | 🔴 Critical |
| PowerShell Copy-Item | ItemNotFoundException | 🔴 Critical |
| Node.js require() | MODULE_NOT_FOUND | 🟡 Medium |
| Playwright | browserType.launch fails | 🟡 Medium |
| Gradle | Can't find project | 🔴 Critical |
