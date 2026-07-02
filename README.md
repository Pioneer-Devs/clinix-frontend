# Clinix Frontend

> The Sovereign Clinical Agent — React Dashboard

[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Component Library](#component-library)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Clinix frontend is a clinical operating system dashboard built for Nigerian medical students and supervising physicians. It provides:

- Real-time AI-assisted encounter documentation
- Patient queue management with priority indicators
- MCP Action Skill visualization and approval workflows
- Supervisor review and one-click approval interfaces
- Student portfolio with competency radar charts
- Patient data wallet QR code generation and SMS confirmation
- Responsive design for desktop (primary) and tablet (secondary)

The UI is designed around a **fixed sidebar + scrollable content area** layout, with a teal-forward color system, card-based information architecture, and motion-rich interactions.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 18 | Component-based UI |
| Build Tool | Vite 5 | Fast dev server, optimized builds |
| Language | TypeScript 5 | Type safety, IntelliSense |
| Styling | Tailwind CSS 3.4 | Utility-first responsive design |
| State (Server) | TanStack Query (React Query) | Server state caching, background refetching, optimistic updates |
| State (Client) | Zustand | Lightweight global state (auth, UI, sidebar) |
| Routing | React Router v6 | SPA navigation, protected routes, lazy loading |
| Forms | React Hook Form + Zod | Type-safe form handling and validation |
| HTTP Client | Axios | API communication with interceptors |
| Charts | Chart.js + react-chartjs-2 | Competency radar, trend lines, stats |
| QR Codes | qrcode.react | Wallet QR generation |
| Icons | Lucide React | Consistent iconography |
| Animations | Framer Motion | Page transitions, modal animations, hover effects |
| Notifications | Sonner | Toast notifications |
| Dates | date-fns | Date formatting and manipulation |

---

## Prerequisites

- **Node.js** 18.17+ (LTS recommended)
- **npm** 9+ or **pnpm** 8+ or **yarn** 1.22+
- **Git**

Verify your Node version:

```bash
node -v  # Should print v18.17.0 or higher
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/clinix-frontend.git
cd clinix-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your local backend URL and other configs.

### 4. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
clinix-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component with routing
│   ├── index.css                # Global styles + Tailwind directives
│   │
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Primitive components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # Fixed 260px navigation sidebar
│   │   │   ├── TopBar.tsx       # Page title + action buttons
│   │   │   ├── Layout.tsx       # Sidebar + TopBar + Content wrapper
│   │   │   └── MobileNav.tsx    # Collapsible mobile navigation
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx     # Metric card with trend
│   │   │   ├── PatientQueue.tsx # Queue list with priority badges
│   │   │   ├── PatientItem.tsx  # Individual queue item
│   │   │   ├── AIPanel.tsx      # Dark AI suggestions panel
│   │   │   ├── AISuggestion.tsx # Individual suggestion card
│   │   │   ├── ActivityFeed.tsx # Timeline of recent events
│   │   │   └── PortfolioPreview.tsx # Mini radar chart + credits
│   │   ├── encounters/
│   │   │   ├── PatientSelector.tsx
│   │   │   ├── ChiefComplaintForm.tsx
│   │   │   ├── SymptomTags.tsx
│   │   │   ├── SeverityPicker.tsx
│   │   │   ├── AIDiagnosisCard.tsx
│   │   │   ├── MCPActionsList.tsx
│   │   │   ├── PhysicalExamForm.tsx
│   │   │   ├── VitalsGrid.tsx
│   │   │   ├── AssessmentPlanForm.tsx
│   │   │   └── EncounterTimeline.tsx
│   │   ├── supervisor/
│   │   │   ├── ReviewQueue.tsx
│   │   │   ├── ComparisonView.tsx
│   │   │   ├── StudentAssessment.tsx
│   │   │   ├── AIAssessment.tsx
│   │   │   └── SupervisorActions.tsx
│   │   ├── portfolio/
│   │   │   ├── PortfolioHeader.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   ├── CompetencyRadar.tsx
│   │   │   ├── VerifiedProcedures.tsx
│   │   │   └── ActivityList.tsx
│   │   └── wallet/
│   │       ├── WalletPushModal.tsx
│   │       ├── QRCodeDisplay.tsx
│   │       ├── SMSConfirmation.tsx
│   │       └── ExpiryTimer.tsx
│   │
│   ├── pages/                   # Route-level page components
│   │   ├── DashboardPage.tsx
│   │   ├── NewEncounterPage.tsx
│   │   ├── EncounterDetailPage.tsx
│   │   ├── PatientsPage.tsx
│   │   ├── PortfolioPage.tsx
│   │   ├── WalletsPage.tsx
│   │   ├── SkillsPage.tsx
│   │   ├── SupervisorPage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication state + login/logout
│   │   ├── usePatients.ts     # Patient data fetching
│   │   ├── useEncounters.ts     # Encounter CRUD operations
│   │   ├── useAIAnalysis.ts     # AI analysis trigger + polling
│   │   ├── usePortfolio.ts      # Portfolio data + export
│   │   ├── useWallet.ts       # Wallet push + QR generation
│   │   ├── useSupervisor.ts     # Review queue + approval
│   │   └── useDebounce.ts       # Generic debounce hook
│   │
│   ├── stores/                  # Zustand state stores
│   │   ├── authStore.ts         # Auth state (user, tokens, login/logout)
│   │   ├── uiStore.ts           # UI state (sidebar, modals, toasts)
│   │   └── encounterStore.ts    # Draft encounter state (auto-save)
│   │
│   ├── services/                # API service functions
│   │   ├── api.ts               # Axios instance with interceptors
│   │   ├── authService.ts
│   │   ├── patientService.ts
│   │   ├── encounterService.ts
│   │   ├── aiService.ts
│   │   ├── walletService.ts
│   │   ├── portfolioService.ts
│   │   └── supervisorService.ts
│   │
│   ├── lib/                     # Utilities and helpers
│   │   ├── utils.ts             # cn() helper (clsx + tailwind-merge)
│   │   ├── constants.ts         # App constants (routes, roles, severities)
│   │   ├── formatters.ts        # Date, number, phone formatters
│   │   └── validators.ts        # Zod schemas for forms
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── patient.ts
│   │   ├── encounter.ts
│   │   ├── ai.ts
│   │   ├── wallet.ts
│   │   ├── portfolio.ts
│   │   └── index.ts
│   │
│   └── assets/                  # Static assets
│       ├── logo.svg
│       └── illustrations/
│
├── .env.example
├── .env
├── .gitignore
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
└── README.md
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# API
VITE_API_BASE_URL=http://localhost:8000/api/v1

# App
VITE_APP_NAME=Clinix
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_MOCK_AI=false
VITE_ENABLE_VOICE_INPUT=false

# Chekk
VITE_CHEKK_WALLET_URL=https://wallet.chekk.io/access

# Analytics (future)
# VITE_ANALYTICS_ID=...
```

> ⚠️ **All Vite env vars must be prefixed with `VITE_` to be exposed to the client.**

---

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build with type checking |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across src/ |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run typecheck` | Run TypeScript compiler (no emit) |
| `npm run test` | Run Vitest test suite |
| `npm run test:ui` | Run tests with UI coverage report |
| `npm run format` | Format code with Prettier |

### Code Style

We use **ESLint** + **Prettier** + **TypeScript strict mode**.

Key rules:
- Functional components with explicit return types
- Props interfaces named `{ComponentName}Props`
- Custom hooks prefixed with `use`
- Zustand stores use selectors for performance
- API calls centralized in `services/`, never in components directly

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/encounter-auto-save

# Make changes, commit with conventional commits
git commit -m "feat: add auto-save every 30s to encounter draft"

# Push and open PR
git push origin feature/encounter-auto-save
```

---

## Component Library

### Design Tokens (Tailwind Config)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488',
          light: '#14b8a6',
          dark: '#0f766e',
        },
        accent: '#f43f5e',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: '#f8fafc',
        card: '#ffffff',
        text: {
          DEFAULT: '#0f172a',
          light: '#64748b',
        },
        border: '#e2e8f0',
      },
      borderRadius: {
        card: '16px',
        button: '10px',
        badge: '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### Key Components

#### StatCard
```tsx
<StatCard
  icon={<Users className="w-5 h-5" />}
  value={47}
  label="Total Encounters"
  trend={+12}
  trendDirection="up"
  color="primary"
/>
```

#### PatientItem
```tsx
<PatientItem
  patient={patient}
  selected={selectedId === patient.id}
  onClick={() => setSelectedId(patient.id)}
/>
```

#### AIPanel
```tsx
<AIPanel
  isAnalyzing={isAnalyzing}
  suggestions={aiSuggestions}
  mcpActions={mcpActions}
  onAccept={(id) => handleAccept(id)}
  onModify={(id) => handleModify(id)}
/>
```

---

## State Management

### Server State (TanStack Query)

```tsx
// hooks/usePatients.ts
import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/services/patientService';

export function usePatients(search?: string) {
  return useQuery({
    queryKey: ['patients', search],
    queryFn: () => patientService.list({ search }),
    staleTime: 30 * 1000, // 30s
  });
}
```

### Client State (Zustand)

```tsx
// stores/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  login: async (email, password) => {
    const { user, accessToken } = await authService.login(email, password);
    set({ user, accessToken });
  },
  logout: () => set({ user: null, accessToken: null }),
}));
```

### Draft Encounter State (Auto-save)

```tsx
// stores/encounterStore.ts
interface EncounterDraft {
  patientId: string;
  chiefComplaint: string;
  symptoms: string[];
  severity: Severity;
  vitals: Vitals;
  examNotes: string;
  workingDiagnosis: string;
  treatmentPlan: string;
  lastSaved: Date | null;
}

export const useEncounterStore = create<EncounterDraft>((set, get) => ({
  // ... state + auto-save logic with 30s debounce
}));
```

---

## API Integration

### Axios Setup

```tsx
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const newToken = await authService.refresh();
      useAuthStore.getState().setAccessToken(newToken);
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Pattern

```tsx
// services/encounterService.ts
import api from './api';
import type { Encounter, CreateEncounterDTO } from '@/types';

export const encounterService = {
  create: (data: CreateEncounterDTO) =>
    api.post<Encounter>('/encounters', data),

  analyze: (id: string) =>
    api.post(`/encounters/${id}/ai-analyze`),

  update: (id: string, data: Partial<Encounter>) =>
    api.patch(`/encounters/${id}`, data),

  finalize: (id: string) =>
    api.post(`/encounters/${id}/finalize`),

  getById: (id: string) =>
    api.get<Encounter>(`/encounters/${id}`),
};
```

---

## Testing

### Test Setup

We use **Vitest** + **React Testing Library** + **MSW** (Mock Service Worker).

```bash
npm run test        # Run tests
npm run test:ui     # Run with UI coverage
npm run test:watch  # Watch mode
```

### Example Test

```tsx
// tests/components/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/dashboard/StatCard';

describe('StatCard', () => {
  it('renders value and label', () => {
    render(<StatCard value={47} label="Encounters" trend={+12} trendDirection="up" />);
    expect(screen.getByText('47')).toBeInTheDocument();
    expect(screen.getByText('Encounters')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });
});
```

### E2E Testing (Future)

Playwright configuration will be added for critical user flows:
- Login → New Encounter → AI Analysis → Finalize
- Supervisor Review → Approve → Wallet Push

---

## Build & Deployment

### Production Build

```bash
npm run build
```

Output is generated in `dist/` directory.

### Environment-Specific Builds

| Environment | Command | Notes |
|-------------|---------|-------|
| Development | `npm run dev` | HMR, source maps, unminified |
| Staging | `npm run build -- --mode staging` | Minified, Chekk sandbox |
| Production | `npm run build` | Minified, optimized, Chekk production |

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```bash
docker build -t clinix-frontend:latest .
docker run -p 80:80 clinix-frontend:latest
```

### Static Hosting (Chekk.dev / Vercel / Netlify)

```bash
# Build for static hosting
npm run build

# Deploy dist/ folder to your platform
```

> For client-side routing on static hosts, ensure fallback to `index.html` is configured.

---

## Performance Targets

| Metric | Target | How We Achieve It |
|--------|--------|-------------------|
| First Contentful Paint | < 1.5s | Code splitting, lazy routes, preloaded critical CSS |
| Time to Interactive | < 3s | Tree-shaking, minimal JS bundles, React 18 concurrent features |
| Bundle Size | < 200KB (initial) | Route-based code splitting, dynamic imports for charts |
| API Response | < 500ms | React Query caching, stale-while-revalidate, optimistic updates |
| AI Analysis UI | < 3s | Skeleton loaders, streaming response display, debounced triggers |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Sidebar hidden (hamburger), cards stack, stats horizontal scroll |
| Tablet | 768–1024px | Sidebar collapsible, 2-column grids |
| Desktop | > 1024px | Full sidebar fixed 260px, 3-column grids, all features visible |

Primary development target is **Desktop (1280px+)**. Tablet is secondary. Mobile is readable but feature-limited.

---

## Accessibility

- All interactive elements have minimum 44px touch targets
- Color contrast ratios meet WCAG AA (4.5:1 for text)
- Focus indicators visible on all focusable elements
- Modal traps focus and closes on Escape key
- Form labels explicitly associated with inputs
- Charts have aria-labels and data tables for screen readers

---

## Contributing

### Branch Naming

- `feature/description` — New features
- `fix/description` — Bug fixes
- `ui/description` — Design/UX changes
- `perf/description` — Performance improvements

### Commit Convention

```
feat: add encounter auto-save with 30s debounce
fix: correct AI panel scroll on long differential list
ui: update stat card hover animation duration
perf: lazy load chart.js only on portfolio page
```

### PR Checklist

- [ ] Component renders without TypeScript errors (`npm run typecheck`)
- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] New components include Storybook story (if applicable)
- [ ] Responsive design tested at 1280px, 768px, and 375px
- [ ] Accessibility checked with keyboard navigation

---

## Troubleshooting

### Port already in use

```bash
# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or specify different port
npm run dev -- --port 3000
```

### TypeScript errors after pulling

```bash
# Regenerate TypeScript types from backend
npm run typecheck
# Clear Vite cache
rm -rf node_modules/.vite
```

### API CORS errors

Ensure the backend `CORS_ORIGINS` includes `http://localhost:5173` in development.

### Tailwind classes not applying

```bash
# Restart Tailwind JIT
npm run dev
# Or clear PostCSS cache
rm -rf node_modules/.cache
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Contact

- **Project Lead**: Ademilua Adeola — [adeola@clinix.ng](mailto:adeola@clinix.ng)
- **Frontend Team**: Clinix UI/UX Engineering
- **Repository**: [github.com/your-org/clinix-frontend](https://github.com/your-org/clinix-frontend)

---

> *Built by Nigerian builders, for Nigerian students and patients.*
