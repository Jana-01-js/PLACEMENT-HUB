# College Placement Hub — Frontend

React 19 + Vite + TypeScript + Tailwind, wired up to all three backend features
(Auth, Job Posting/Recruiter flow, Student Profile). Build succeeds clean
(`tsc --noEmit` and `vite build` both pass with zero errors).

## Design

The subject is a placement **pipeline** — a job doesn't just exist, it climbs
through submitted → approved → closed (or falls off the ladder if rejected).
That became the visual signature: `StatusLadder`, a rung-based stepper used
everywhere a job's state is shown, instead of a generic progress bar.

- **Palette**: deep ink navy (`#12172B`) + brass/gold accent (`#C98A3E`) on a
  cool paper background (`#F3F5F7`) — deliberately not the cream+terracotta
  or black+neon combinations that AI-generated UIs default to. Brass reads as
  "achievement/seal," which fits a placement office.
- **Type**: Space Grotesk for display/headings (geometric, a little technical),
  Inter for body text, JetBrains Mono for numeric data (CGPA, salary, dates) —
  small touch that makes stats feel like data rather than prose.
- **Layout**: dark sidebar + light content area, role-aware navigation (a
  student never sees "Approval Queue," a recruiter never sees "Student
  Directory").

## What's wired up

| Area | Pages | Talks to |
|------|-------|----------|
| Auth | Landing, Login, Register (role picker) | `/api/auth/*` |
| Student | Dashboard, Profile editor (with resume upload), Job browser, Job detail + eligibility check | `/api/students/*`, `/api/jobs` |
| Recruiter | Dashboard, Company profile, Post a job, My jobs (with close action) | `/api/companies/*`, `/api/jobs/*` |
| Placement Officer | Dashboard, Approval queue (approve/reject), Student directory | `/api/jobs/pending`, `/api/students` |

## Auth handling

- The **access token lives in memory only** (a module-level variable in
  `src/api/client.ts`), never in `localStorage`. On page load, the app calls
  `/api/auth/refresh` (which reads the httpOnly cookie the backend already
  sets) to silently restore the session.
- An Axios response interceptor catches `401`s, refreshes once, and retries
  the original request — so an expired access token never surfaces as a
  logged-out flash for the user.

## Running it locally

This expects the backend running on `http://localhost:5000` (Vite proxies
`/api` and `/uploads` there — see `vite.config.ts`).

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

## Notes / what's simplified for this pass

- No React Query yet — data fetching is plain `useEffect` + `useState`. Fine
  at this scale; worth adding if caching/refetching gets more complex later.
- Recruiter "Applicant Management" isn't wired up because the Applications
  feature doesn't exist on the backend yet — `MyJobsPage` shows
  `applicantsCount` (currently always 0) as a placeholder for it.
- Dark mode, animations, and the AI features (ATS score, mock interview,
  career roadmap) from the original spec aren't in this pass — they're their
  own increments.
