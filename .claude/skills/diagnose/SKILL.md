---
name: diagnose
description: Auto-detect project issues from build/test logs, propose 3 fixes, auto-apply best one, and save the knowledge. Run /diagnose after any build or test failure.
---

# Project Diagnosis & Auto-Fix

Scans build output for known patterns, proposes ranked fixes, applies best one.

## Error Patterns

### E1: Non-ASCII Path (Critical)
**Detect**: ENOENT, "no such file", Write tool silent fail
**Fix**: `cp -r ~/幼儿识字 ~/literacy-kids && cd ~/literacy-kids`

### E2: npm ci Lock Mismatch (Critical)
**Detect**: `Missing: @xxx from lock file`
**Fix**: `npm install` (regenerate lock)

### E3: JDK Version (Critical)
**Detect**: `invalid source release: XX`
**Fix**: Use JDK 21 (`D:\Program Files\Android\Android Studio\jbr`)

### E4: Playwright Browsers (Medium)
**Detect**: `Executable doesn't exist at ... ms-playwright`
**Fix**: Use chromium-only config, `npx playwright install chromium`

### E5: Resource Busy (Medium)
**Detect**: `mv: Device or resource busy`
**Fix**: `cp -r` instead of `mv`

### E6: Bash Heredoc EOF (Medium)
**Detect**: `unexpected EOF` with emoji/Unicode content
**Fix**: Use Write tool or Node.js for file writes
