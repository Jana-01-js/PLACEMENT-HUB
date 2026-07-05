# College Placement Hub

A full-stack placement management system for engineering colleges — built as
a portfolio project, feature by feature, with each increment type-checked and
build-verified before moving to the next.

```
placement-hub/
├─ backend/     Node.js + Express + TypeScript + MongoDB API
└─ frontend/    React 19 + Vite + TypeScript + Tailwind
```

## What's built so far

| # | Feature | Details |
|---|---------|---------|
| 1 | **Authentication** | JWT (access token in memory, refresh token in httpOnly cookie), role-based authorization, 4 roles (student, recruiter, placement_officer, admin) |
| 2 | **Job Posting + Recruiter flow** | Company profiles, job CRUD, approval workflow gated by the Placement Officer/Admin role |
| 3 | **Student Profile** | Academic details, skills, projects/certifications/internships/achievements, resume upload, eligibility checker against a specific job |
| — | **Frontend** | All of the above wired into a working UI with its own visual identity (see `frontend/README.md`) |

Each backend feature has its own section in `backend/README.md` with the
exact API surface and the reasoning behind specific decisions (e.g. why
`bcryptjs` instead of `bcrypt`, why jobs revert to `pending_approval` after
an edit).

## Running the whole thing locally

You need MongoDB running somewhere reachable (local install, Docker, or a
free Atlas cluster) — grab a connection string for the next step.

**1. Backend**

```bash
cd backend
cp .env.example .env      # paste your MONGO_URI, set the two JWT secrets
npm install
npm run dev                # http://localhost:5000
```

**2. Frontend** (separate terminal)

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173, proxies /api to :5000
```

Open `http://localhost:5173`, register an account (pick Student, Recruiter,
or Placement Officer), and you're in. A realistic first walkthrough:

1. Register as a **Recruiter** → create a company profile → post a job.
2. Register as a **Placement Officer** (separate browser/incognito, or log
   out and back in) → approve that job from the queue.
3. Register as a **Student** → fill in your profile, upload a resume →
   browse jobs → open the one you posted → check your eligibility.

## What's next

The natural next increment is **Applications** — the piece that actually
connects students applying to jobs recruiters review, which unlocks
Applicant Management on the recruiter side. After that: the Admin feature,
and the AI features (ATS scoring, mock interview, career roadmap) from the
original spec.

## A few honest notes

This was built incrementally in a single extended session, verifying
`tsc --noEmit` and a full production build after every feature. It's a solid
foundation for a final-year portfolio project, but before treating it as
production-ready, you'd still want: automated tests, a seeded admin account
flow, Cloudinary wired up for resume storage (currently local disk — flagged
in `backend/README.md`), and the Applications feature to close the loop
between students and recruiters.
