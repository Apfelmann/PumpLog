# PumpLog - Projektdokumentation

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Tech Stack](#2-tech-stack)
3. [Projektstruktur](#3-projektstruktur)
4. [Backend - ASP.NET Core API](#4-backend---aspnet-core-api)
   - [API Endpoints](#41-api-endpoints)
   - [Entitäten (Datenmodelle)](#42-entitäten-datenmodelle)
   - [Request/Response DTOs](#43-requestresponse-dtos)
   - [Business Logic](#44-business-logic)
   - [Datenbank](#45-datenbank)
   - [Authentication (Backend)](#46-authentication-backend)
5. [Frontend - React](#5-frontend---react)
   - [Routing](#51-routing)
   - [State Management (Redux)](#52-state-management-redux)
   - [API Services (RTK Query)](#53-api-services-rtk-query)
   - [OIDC Authentifizierung](#54-oidc-authentifizierung)
   - [TypeScript Modelle](#55-typescript-modelle)
6. [Authentifizierungsflow](#6-authentifizierungsflow)
7. [Datenfluss (Beispiel)](#7-datenfluss-beispiel)
8. [Docker & Deployment](#8-docker--deployment)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Konfiguration & Umgebungsvariablen](#10-konfiguration--umgebungsvariablen)
11. [Infrastruktur](#11-infrastruktur)

---

## 1. Projektübersicht

**PumpLog** ist eine Workout-Tracking-App im **Todo-Stil** (nicht kalenderbasiert). Nutzer erstellen Trainingssessions, die verschiedene Arten von Übungen enthalten können:

| Trainingstyp | Beschreibung |
|---|---|
| **Hypertrophie** | Sätze, Wiederholungen, Gewicht – mit automatischer Gewichtsprogression (+1 kg) |
| **CrossFit** | WODs mit Beschreibung, Zeit- und Wiederholungstracking |
| **Strongman** | Maximalgewicht, Distanz, Wiederholungen (geplant) |

**Live-URL:** [pumplog.onlychris.net](https://pumplog.onlychris.net)

---

## 2. Tech Stack

### Frontend
| Technologie | Version | Zweck |
|---|---|---|
| React | 19.2.0 | UI Framework |
| TypeScript | 5.8.3 | Typsicherheit |
| Vite | 7.0.4 | Build Tool / Dev Server |
| React Router | 7.9.1 | Client-seitiges Routing |
| Redux Toolkit | 2.10.1 | State Management |
| RTK Query | (in Redux Toolkit) | API-Calls / Caching |
| Material UI (MUI) | 7.3.6 | UI Komponenten |
| Tailwind CSS | 4.1.11 | Utility-first Styling |
| oidc-client-ts | 3.3.0 | OIDC Auth Client |
| react-oidc-context | 3.3.0 | React OIDC Integration |

### Backend
| Technologie | Version | Zweck |
|---|---|---|
| .NET | 9.0 | Runtime |
| ASP.NET Core | 9.0 | Web Framework |
| Entity Framework Core | 9.0.6 | ORM |
| Npgsql EF Provider | 9.0.4 | PostgreSQL Treiber |
| JWT Bearer Auth | 9.0.6 | Token-Validierung |
| Scalar.AspNetCore | 2.5.0 | API Dokumentation UI |

### DevOps
| Technologie | Zweck |
|---|---|
| Docker | Multi-stage Container Build |
| GitHub Actions | CI/CD Pipeline |
| GHCR | Container Registry |
| Coolify | Container Management / Deployment |
| PostgreSQL | Datenbank |
| Authentik | OIDC Identity Provider |

---

## 3. Projektstruktur

```
PumpLog/
├── PumpLogApi/                    # .NET 9 Backend
│   ├── Controllers/
│   │   └── PumpLogController.cs   # REST API Endpoints
│   ├── Entities/                  # Domain-Modelle (DB)
│   │   ├── Session.cs
│   │   ├── Section.cs             # Polymorphisch (Hypertrophy/Crossfit)
│   │   ├── Exercise.cs
│   │   └── BodyPart.cs
│   ├── Models/                    # DTOs & Services
│   │   ├── SessionRequest.cs
│   │   ├── SectionRequest.cs
│   │   └── CurrentUserService.cs
│   ├── Managers/
│   │   └── PumpLogManager.cs      # Business Logic
│   ├── Data/
│   │   └── PumpLogDbContext.cs    # EF Core DbContext
│   ├── DipendencyInjection/
│   │   ├── ServiceColletion.cs
│   │   └── ManagerCollection.cs
│   ├── Migrations/                # EF Core Migrationen
│   ├── Program.cs                 # App-Startup & DI
│   ├── appsettings.json
│   └── PumpLogApi.csproj
│
├── PumpLogUI/                     # React / Vite Frontend
│   ├── src/
│   │   ├── App.tsx                # Routen-Definitionen
│   │   ├── main.tsx               # Entry Point
│   │   ├── constants.ts           # API_BASE_URL
│   │   ├── store/
│   │   │   ├── store.ts           # Redux Store Konfiguration
│   │   │   ├── storehooks.ts      # Typisierte Custom Hooks
│   │   │   └── slice/
│   │   │       ├── userSlice.ts   # Auth/User State
│   │   │       └── sessionSlice.ts# Session/Workout State
│   │   ├── services/
│   │   │   ├── sessionApi.ts      # RTK Query – Sessions
│   │   │   ├── exerciseApi.ts     # RTK Query – Übungen
│   │   │   └── loginServices.ts   # OIDC Login/Logout
│   │   ├── routing/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── AuthCallBackPage.tsx
│   │   │   └── LogoutPage.tsx
│   │   ├── oidc/
│   │   │   └── oidc.ts            # Authentik Config & UserManager
│   │   ├── models/                # TypeScript Interfaces
│   │   │   ├── section.ts
│   │   │   ├── exercise.ts
│   │   │   └── saveSession.ts
│   │   └── features/              # React Komponenten
│   │       ├── loginPage/
│   │       ├── workouts/
│   │       ├── dashboard/
│   │       └── sideBar/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── Dockerfile                     # Multi-stage Docker Build
├── .github/
│   ├── workflows/
│   │   └── docker-build.yml       # CI/CD Pipeline
│   └── copilot-instructions.md
├── PumpLogApi.http                # HTTP Test-Requests
├── PumpLogApi.sln                 # Visual Studio Solution
└── DOCUMENTATION.md               # Diese Datei
```

---

## 4. Backend - ASP.NET Core API

### 4.1 API Endpoints

**Base Route:** `api/pumplog`  
**Authentifizierung:** Alle Endpoints erfordern einen gültigen JWT Bearer Token.

| Methode | Route | Request | Response | Beschreibung |
|---|---|---|---|---|
| `GET` | `/ActiveSessions` | – | `IEnumerable<Session>` | Alle aktiven Sessions des eingeloggten Nutzers |
| `POST` | `/` | `SessionRequest` | `{ message: string }` | Session erstellen oder aktualisieren |
| `POST` | `/SaveSection` | `SectionRequest` | `Section` | Sektion (Übung) erstellen oder aktualisieren |
| `DELETE` | `/DeleteSection/{sectionGuid}` | URL-Param `Guid` | `{ message: string }` | Sektion löschen |
| `GET` | `/Exercises` | – | `IEnumerable<Exercise>` | Alle Übungen abrufen |
| `POST` | `/Exercise` | `Exercise` | `Exercise` | Neue Übung erstellen |
| `GET` | `/BodyParts` | – | `IEnumerable<BodyPart>` | Alle Körperteile abrufen |
| `POST` | `/FinishWorkout/{sessionGuid}` | URL-Param `Guid` | `Session` | Session abschließen + neue Session mit Progression erstellen |

---

### 4.2 Entitäten (Datenmodelle)

#### Session

```csharp
public class Session
{
    [Key]
    public string? Title { get; set; }
    public required Guid SessionGuid { get; set; }
    public required int SessionNumber { get; set; }
    public bool? IsCompleted { get; set; }
    public required Guid UserGuid { get; set; }
    public bool? IsDeleted { get; set; }
    public string? FocusedBodyPart { get; set; }
    public IList<Section>? Sections { get; set; }
    public required DateTime CreationDate { get; set; }
}
```

#### Section (Polymorphisch)

```csharp
[JsonPolymorphic(TypeDiscriminatorPropertyName = "sectionType")]
[JsonDerivedType(typeof(HypertrophySection), "Hypertrophy")]
[JsonDerivedType(typeof(CrossfitSection), "Crossfit")]
public class Section
{
    public Guid SectionGuid { get; set; }
    public Guid SessionGuid { get; set; }
    public required Guid ExerciseGuid { get; set; }
    public int Order { get; set; }
    public bool SupersetWithNext { get; set; }
}

public class HypertrophySection : Section
{
    public required string ExerciseName { get; set; }
    public decimal Weight { get; set; }
    public int Reps { get; set; }
    public int Sets { get; set; }
    public string SetResults { get; set; } = string.Empty; // z.B. "8,8,7"
}

public class CrossfitSection : Section
{
    public required string WodName { get; set; }
    public required string Description { get; set; }
}
```

#### Exercise

```csharp
public class Exercise
{
    [Key]
    public Guid ExerciseGuid { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public Guid BodyPartGuid { get; set; }
    public BodyPart? BodyPart { get; set; }
}
```

#### BodyPart

```csharp
public class BodyPart
{
    [Key]
    public Guid BodyPartGuid { get; set; }
    public required string Name { get; set; }
}
```

**Vordefinierte Körperteile (Seed-Daten):**
Brust, Rücken, Schultern, Bizeps, Trizeps, Beine, Beine (Quadrizeps), Beine (Beuger), Waden, Gesäß, Bauch, Nacken

---

### 4.3 Request/Response DTOs

#### SessionRequest

```csharp
public class SessionRequest
{
    public string? Title { get; set; }
    public Guid? SessionGuid { get; set; }
    public int? SessionNumber { get; set; }
    public bool? IsCompleted { get; set; }
    public Guid? UserGuid { get; set; }
    public bool? IsDeleted { get; set; }
    public string? FocusedBodyPart { get; set; }
    public IList<SectionRequest>? Sections { get; set; }
    public DateTime? CreationDate { get; set; }
}
```

#### SectionRequest

```csharp
public class SectionRequest
{
    public Guid? SectionGuid { get; set; }
    public Guid? SessionGuid { get; set; }
    public int? Order { get; set; }
    public bool? SupersetWithNext { get; set; }
    public string? SectionType { get; set; }      // "Hypertrophy" oder "Crossfit"

    // Crossfit
    public string? WodName { get; set; }
    public string? Description { get; set; }

    // Hypertrophy
    public string? ExerciseName { get; set; }
    public Guid? ExerciseGuid { get; set; }
    public decimal? Weight { get; set; }
    public int? Reps { get; set; }
    public int? Sets { get; set; }
    public string? SetResults { get; set; }
}
```

---

### 4.4 Business Logic

**`PumpLogManager.cs`** enthält die zentrale Business-Logik:

#### Progressive Overload (FinishWorkout)

Beim Abschließen einer Session mit Hypertrophie-Sektionen:

1. `SetResults` wird geparst (kommagetrennte Wiederholungen pro Satz, z.B. `"8,8,8"`)
2. Wenn alle Sätze mit Zielwiederholungen abgeschlossen wurden → Gewicht **+1 kg**, `SetResults` wird zurückgesetzt auf `"0,0,0,..."`
3. Wenn nicht alle Sätze erfüllt → Gewicht bleibt gleich
4. CrossFit-Sektionen werden 1:1 in die neue Session kopiert
5. Eine neue Session wird mit `SessionNumber + 1` erstellt

#### Session-Verwaltung

- **Upsert-Logik**: Session wird erstellt wenn nicht vorhanden, sonst gepatcht
- **Patch-Semantik**: Nur übergebene Felder werden aktualisiert
- **Sektionen**: Sektionen die nicht im Request enthalten sind, werden entfernt

---

### 4.5 Datenbank

- **Datenbanksystem:** PostgreSQL
- **ORM:** Entity Framework Core 9 mit Code-First Migrationen
- **Migrationen:** Werden automatisch beim App-Start ausgeführt
- **Primary Keys:** UUIDs, von der Datenbank generiert
- **Vererbungsstrategie:** Table-Per-Hierarchy (TPH) für Sections via Discriminator-Spalte `SectionType`
- **Beziehungen:**
  - `Session` → `Section` (1:n, Cascade Delete)
  - `Exercise` → `BodyPart` (n:1)

---

### 4.6 Authentication (Backend)

```json
{
  "Authentication": {
    "Authority": "<OIDC Authority URL>",
    "Issuer": "<JWT Issuer>",
    "Audience": "<JWT Audience>"
  }
}
```

- JWT Bearer Token Validierung
- Token-Metadaten werden von `{Issuer}/.well-known/openid-configuration` geladen
- Clock Skew: 60 Sekunden
- Nutzer-ID wird aus dem `sub`-Claim extrahiert (via `CurrentUserService`)

---

## 5. Frontend - React

### 5.1 Routing

**Mobile-first:** Responsive Breakpoint bei 1200px. Unterhalb → Mobile App. Darüber → "Under Construction" Platzhalter.

| Route | Komponente | Geschützt | Beschreibung |
|---|---|---|---|
| `/` | – | – | Redirect zu `/app` |
| `/login` | `LoginPage` | Nein | OIDC Login Einstieg |
| `/auth/callback` | `AuthCallbackPage` | Nein | OIDC Callback → Redirect zu `/app/dashboard` |
| `/auth/logout` | `LogoutPage` | Nein | OIDC Logout → Redirect zu `/login` |
| `/app` | `MobileMainContainer` | Ja | Protected Layout Wrapper |
| `/app/dashboard` | `WorkoutsHome` | Ja | Hauptansicht – aktive Sessions |
| `/app/analytics` | Platzhalter | Ja | Analytics (TODO) |
| `/app/settings` | Platzhalter | Ja | Einstellungen (TODO) |

**ProtectedRoute:** Prüft `user.session.accessToken` im Redux Store. Leitet unauthentifizierte Nutzer zu `/login` weiter.

---

### 5.2 State Management (Redux)

#### Store Konfiguration

```typescript
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    session: sessionSlice.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [exerciseApi.reducerPath]: exerciseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionApi.middleware, exerciseApi.middleware),
});
```

#### userSlice

```typescript
interface UserSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  profile: Record<string, unknown>;
}

// Actions: setSession(UserSession), clearSession()
```

#### sessionSlice

```typescript
interface SessionState {
  sessions: Session[];
}

// Actions:
// setSessions(Session[])       – ersetzt alle Sessions
// removeSection(sectionGuid)   – entfernt eine Sektion aus allen Sessions
```

#### Custom Hooks

```typescript
// Typisierte Hooks für den Store
const dispatch = usePumpLogDispatch();
const value = usePumpLogSelector((state) => state.user.session);
```

---

### 5.3 API Services (RTK Query)

Alle API-Calls fügen automatisch den Bearer Token aus dem Redux Store hinzu.

#### sessionApi

| Hook | Methode | Route | Beschreibung |
|---|---|---|---|
| `useGetSessionsQuery()` | GET | `/ActiveSessions` | Aktive Sessions laden |
| `useSaveSessionMutation()` | POST | `/` | Session speichern |
| `useSaveSectionMutation()` | POST | `/SaveSection` | Sektion speichern |
| `useDeleteSectionMutation()` | DELETE | `/DeleteSection/{guid}` | Sektion löschen |
| `useFinishWorkoutMutation()` | POST | `/FinishWorkout/{guid}` | Workout abschließen |

#### exerciseApi

| Hook | Methode | Route | Beschreibung |
|---|---|---|---|
| `useGetExercisesQuery()` | GET | `/Exercises` | Alle Übungen laden |
| `useGetBodyPartsQuery()` | GET | `/BodyParts` | Alle Körperteile laden |
| `useCreateExerciseMutation()` | POST | `/Exercise` | Neue Übung erstellen |

---

### 5.4 OIDC Authentifizierung

**Identity Provider:** Authentik (`auth.onlychris.net`)

```typescript
export const oidcConfig = {
  authority: "https://auth.onlychris.net/application/o/pumplog/",
  client_id: "Se0ZrV0vLDMTrO2MTqS6iQk1Y7G1pvYaLpJMysRv",
  redirect_uri: `${baseUrl}/auth/callback`,
  post_logout_redirect_uri: `${baseUrl}/auth/logout`,
  response_type: "code",
  scope: "openid profile email offline_access",
  automaticSilentRenew: false,  // Authentik unterstützt kein iframe silent renew
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};
```

**Token Refresh:**
- Manuelles Refresh via Refresh Token beim Ablauf des Access Tokens
- Event-Listener auf `accessTokenExpiring`
- Beim Laden → Session in Redux speichern (`setSession`)
- Beim Logout → Session aus Redux löschen (`clearSession`)

---

### 5.5 TypeScript Modelle

#### Session & Section

```typescript
interface Session {
  sessionGuid: string;
  sessionNumber: number;
  isActive: boolean;
  sections?: Section[];
  userGuid: string;
}

interface Section {
  sectionGuid: string | undefined;
  sessionGuid: string;
  exerciseGuid: string;
  order?: number;
  supersetWithNext?: boolean;
  sectionType: "Strength" | "Crossfit" | "Hypertrophy";
}

interface HypertrophySection extends Section {
  exerciseName: string;
  weight: number;
  reps: number;
  sets: number;
  setResults: string;
}

interface CrossfitSection extends Section {
  wodName: string;
  description: string;
}
```

#### Exercise & BodyPart

```typescript
interface BodyPart {
  bodyPartGuid: string;
  name: string;
}

interface Exercise {
  exerciseGuid: string;
  name: string;
  description?: string;
  bodyPartGuid: string;
  bodyPart?: BodyPart;
}
```

---

## 6. Authentifizierungsflow

```
Frontend                     Authentik OIDC                  API
────────                     ──────────────                  ────
   │                               │                           │
   ├── startLogin() ──────────────>│                           │
   │   (Redirect zu Authentik)     │                           │
   │                               │                           │
   │<──────── Auth Code ───────────┤                           │
   │   (/auth/callback)            │                           │
   │                               │                           │
   ├── completeLogin() ───────────>│                           │
   │   (Code Exchange)             │                           │
   │                               │                           │
   │<── Access Token + Refresh ────┤                           │
   │                               │                           │
   ├── Redux: setSession() ──┐     │                           │
   │                         │     │                           │
   ├── Redirect /dashboard ──┘     │                           │
   │                               │                           │
   ├──── API Call + Bearer Token ──┼──────────────────────────>│
   │                               │                           │
   │                               │<─── JWT validieren ───────┤
   │                               │     (Authentik JWKS)      │
   │                               │                           │
   │<──── API Response ────────────┼───────────────────────────┤
```

---

## 7. Datenfluss (Beispiel)

**Session speichern:**

```
WorkoutsHome Komponente
  ↓
useSaveSessionMutation() [RTK Query]
  ↓
POST /api/pumplog + Bearer Token
  ├─ SessionRequest { sessionGuid, userGuid, sections, title, ... }
  ↓
PumpLogController.SaveSession()
  ↓
PumpLogManager.SaveSession()
  ├─ Session vorhanden? → Update : Create
  ├─ HypertrophySection / CrossfitSection Handling
  └─ await _context.SaveChangesAsync()
  ↓
PostgreSQL (TPH Tabelle)
  ↓
invalidatesTags: ["activesessions"]
  ↓
useGetSessionsQuery() – automatischer Refetch
  ↓
sessionSlice.setSessions(newSessions)
  ↓
UI re-render
```

---

## 8. Docker & Deployment

### Multi-Stage Dockerfile

```
Stage 1: node:22-alpine  (Frontend Build)
  ├── npm ci
  └── npm run build  →  /app/frontend/dist

Stage 2: dotnet/sdk:9.0  (Backend Build)
  ├── dotnet restore
  └── dotnet publish -c Release  →  /app/publish

Stage 3: dotnet/aspnet:9.0  (Runtime)
  ├── COPY frontend dist → /wwwroot
  ├── COPY backend binaries
  ├── EXPOSE 5000
  └── ENTRYPOINT dotnet PumpLogApi.dll
```

**Verhalten im Container:**
- ASP.NET Core horcht auf Port 5000
- API-Routen unter `/api/...`
- Alle anderen Requests → React SPA (`index.html`)

---

## 9. CI/CD Pipeline

**Datei:** `.github/workflows/docker-build.yml`  
**Trigger:** Push auf `main`, Pull Requests auf `main`

### Pipeline Steps

```
1. Checkout (actions/checkout@v4)
2. Login → ghcr.io (mit GITHUB_TOKEN)
3. Docker Metadata extrahieren
   ├── Tag: latest  (auf main)
   └── Tag: sha-<commit>
4. Docker Image bauen & pushen (docker/build-push-action@v5)
   └── Push nur auf main (nicht auf PRs)
5. Coolify Webhook triggern  (nur auf main)
   └── URL aus Secret: COOLIFY_WEBHOOK_URL
```

---

## 10. Konfiguration & Umgebungsvariablen

### Frontend (Vite)

| Variable | Development | Production | Beschreibung |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5290/api` | `/api` | Backend API URL |
| `VITE_OIDC_AUTHORITY` | – | – | OIDC Authority URL (optional, hat Default) |
| `VITE_OIDC_CLIENT_ID` | – | – | OIDC Client ID (optional, hat Default) |

### Backend (appsettings.json / Umgebung)

| Schlüssel | Beschreibung |
|---|---|
| `Authentication:Authority` | OIDC Authority URL |
| `Authentication:Issuer` | JWT Issuer |
| `Authentication:Audience` | JWT Audience |
| `ConnectionStrings:SqlConnection` | PostgreSQL Connection String |

---

## 11. Infrastruktur

| Komponente | Technologie / Service |
|---|---|
| **Server** | Strato (VPS) |
| **Container Management** | Portainer + Coolify |
| **Identity Provider** | Authentik |
| **Datenbank** | PostgreSQL (Container) |
| **Container Registry** | GitHub Container Registry (GHCR) |
| **Domain** | `pumplog.onlychris.net` |
| **Auth-Domain** | `auth.onlychris.net` |
| **Kontakt** | chris@onlychris.net |

---

*Zuletzt aktualisiert: April 2026*
