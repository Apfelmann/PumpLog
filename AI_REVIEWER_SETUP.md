# PumpLog AI Reviewer Setup

## Branch Protection einrichten

Um PRs zu blockieren bis AI-Review-Kommentare resolved sind:

1. Gehe zu https://github.com/Apfelmann/PumpLog/settings/branches
2. Klicke auf "Add branch protection rule"
3. Branch name pattern: `main`
4. Aktiviere:
   - ✅ "Require a pull request before merging"
   - ✅ "Require approvals" (1)
   - ✅ "Require conversation resolution before merging" ⬅️ **WICHTIG!**
   - ✅ "Require status checks to pass before merging"
     - Suche nach "AI PR Review"

## Auto-Fix Feature

Der Auto-Fix Workflow ist vorbereitet. Um ihn zu nutzen:

1. AI Reviewer postet Kommentare mit Issues
2. Kommentiere im PR mit `/auto-fix`
3. Workflow wird in Zukunft automatisch einen Fix-Branch erstellen

**Hinweis:** Auto-Fix ist noch in Entwicklung. Aktuell wird nur ein Placeholder ausgeführt.

## Workflow-Übersicht

- `pr-review.yml` - AI analysiert Code bei jedem PR
- `auto-fix.yml` - Reagiert auf `/auto-fix` Kommentare

## Verwendete Permissions

- `contents: write` - Branch erstellen
- `pull-requests: write` - Kommentare posten
- `models: read` - GitHub Models API (Copilot)
