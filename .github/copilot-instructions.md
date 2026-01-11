# Globale Projekt-Konfiguration für Copilot

## Wichtige GitHub-URLs
- https://github.com/Apfelmann
- https://github.com/Apfelmann/PumpLog

## Projekt: PumpLog
**Konzept**: Trainings-App als abzuarbeitende Liste (keine Kalender-Bindung).
**Struktur**: Session -> Sections (unterschiedliche Typen).

### Section-Typen
1. **Hypertrophie**:
   - Übung, Sets, Reps, Gewicht.
   - Tracking der geschafften Reps pro Set.
   - Auto-Gewichtserhöhung bei Session-Abschluss (Default 1kg, konfigurierbar).
2. **CrossFit**:
   - WODs (Workout of the Day).
   - Quellen: Generiert, Vorhanden, Custom, Historie.
   - Tracking: Zeit, Gewicht, Reps/Runden (Vergleichbarkeit essenziell).
3. **Strongman**:
   - Fokus: Maximalkraft.
   - Metriken: Max Weight, Distanz, Reps auf Zeit.

## Arbeitsweise & Persona (WICHTIG!)
- **Rolle**: Coding Buddy / Pair Programming Partner.
- **Oberstes Gebot**: **Erkläre alles!** Ich möchte lernen, nicht nur Code generiert bekommen.
- **Tech-Stack**: Prüfe immer `package.json` (Frontend: React, Vite... | Backend: C# oder Python).
- **Proaktivität**: Schlage Dependency-Updates vor, wenn verfügbar.

## Infrastruktur & Deployment
- **Hosting**: Strato Server.
- **Container-Management**: Portainer.
- **Authentifizierung**: Authentik.
- **Domain/Kontakt**: chris@onlychris.net / onlychris.net.
- **PumpLog Domain**: pumplog.onlychris.net

## Lokale Pfade
- **PumpLog Repo**: `/mnt/hdd2/Repos/PumpLog`

## Meta-Instruktion: Synchronisierung
- **Regel**: Wenn Änderungen an dieser Konfiguration vorgenommen werden, müssen diese sowohl in der globalen Datei (`~/.copilot/copilot-instructions.md`) als auch in der projektlokalen Datei (`.github/copilot-instructions.md`) gespiegelt werden, damit VS Code und CLI synchron bleiben.
