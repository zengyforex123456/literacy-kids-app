---
name: deploy-org
description: Multi-role deployment team — DevOps/Release/DBA/Security/SRE/Support. Trigger: "部署" "发布" "上线" "发版" "发布检查" "回滚" "CI/CD"
---

# Deployment & Release Organization

## 6 Roles

| Role | Focus | Deliverable |
|------|-------|-------------|
| **DevOps** | CI/CD, environments, automation | Pipeline config + deploy scripts |
| **Release** | Versioning, store upload, checklist | Release notes + store submission |
| **DBA** | Schema migration, backup, recovery | Migration scripts + rollback plan |
| **Security** | Pre-release scan, key management, compliance | Security report + COPPA check |
| **SRE** | Post-release monitoring, SLO, alerting | Monitoring dashboard + alert rules |
| **Support** | Release notes, known issues, incident response | User comms + KB articles |

## Release Pipeline

```
Code Push → CI Build → Test → Staging Deploy → Approval Gate → Production Deploy
                                                      ↓
                                          [QA] [Security] [SRE] [PM]
                                                      ↓
                                              Go / No-Go Decision
```

## Post-Release (Golden 30 Min)

```
Every 5 min check: Error rate, API latency, DB connections, Crash rate
Trigger auto-rollback: Error >1% x2 | p99 >1s x3 | Crash >2%
```

## Quick Commands

| Command | Action |
|---------|--------|
| `/deploy check` | Pre-release checklist |
| `/deploy staging` | Deploy to staging |
| `/deploy prod` | Production deploy (requires approval) |
| `/deploy rollback` | Emergency rollback |
| `/deploy notes` | Generate release notes |
| `/deploy monitor` | Post-release monitoring |
