# College Placement Hub — Backend

Built feature-by-feature. Each section below is one increment, in the order it was built.

## Feature 1: Authentication

- Project scaffolding: TypeScript + Express, enterprise-style folder structure, path aliases (`@config`, `@models`, ...)
- MongoDB connection layer with graceful failure handling
- `User` model shared by all 4 roles (`student`, `recruiter`, `placement_officer`, `admin`) with hashed passwords (bcryptjs)
- JWT auth: short-lived access token (returned in the response body, meant to be kept in memory/state on the frontend) + long-lived refresh token (httpOnly cookie, scoped to `/api/auth`)
- Role-based authorization middleware (`authenticate` + `authorize(...roles)`) ready to protect future routes
- Request validation with Zod
- Centralized error handling (`ApiError`, `errorHandler`, `notFoundHandler`)
- Security baseline: Helmet, CORS (credentialed, locked to `CLIENT_URL`), rate limiting (global + stricter on auth), cookie hardening, lightweight XSS sanitization
- `/api/health` check endpoint

## Feature 2: Job Posting + Recruiter Flow

- `Company` model — one profile per recruiter account (`recruiter` field is unique)
- `Job` model — full posting with `eligibility` (min CGPA, max backlogs, allowed departments, graduation year), salary range, skills, vacancies, deadline
- **Approval workflow**: every job is created as `pending_approval`. Only a Placement Officer or Admin can move it to `approved`/`rejected`. Editing an already-approved job automatically resets it to `pending_approval` — a recruiter can't silently change terms after approval.
- Recruiters can only read/edit/delete/close jobs they posted (ownership check in the controller, not just route-level).
- Public job listing only ever returns `approved` jobs with a future deadline, and supports filtering by `jobType`, `workMode`, `department`, and full-text `search`.
- `Job.close()` can be triggered by the owning recruiter or by staff, e.g. once vacancies are filled.

## Feature 3: Student Profile

- `StudentProfile` model — one per student account: department, graduation year, CGPA, active backlogs, skills, and repeatable sections for projects, certifications, internships, and achievements, plus GitHub/LinkedIn/portfolio links.
- **Upsert-on-save**: `PATCH /api/students/me` creates the profile on first call and updates it after — no separate "create" endpoint for the student to remember.
- **Resume upload**: `multer` handles the file (PDF/DOC/DOCX, 5MB limit), currently saved to local disk under `backend/uploads/resumes` and served at `/uploads/resumes/<file>`. Swapping to Cloudinary later only touches `upload.middleware.ts` — the route, validation, and response shape don't change (see the note left in that file).
- **`profileCompleted` flag**: recomputed on every save (department + graduation year + CGPA + at least one skill + a resume all present). Lets the frontend show onboarding progress without recalculating client-side.
- **Eligibility Checker**: `GET /api/students/me/eligibility/:jobId` compares the logged-in student's profile against a specific job's `eligibility` rules (min CGPA, max backlogs, allowed departments, graduation year) and returns `{ eligible, reasons[] }`. Verified against 5 representative cases.
- **Staff/recruiter directory**: Placement Officers and Admins can list/filter all student profiles (`department`, `graduationYear`, `minCgpa`, `skill`); recruiters can look up a specific student by ID (e.g. once they've applied to a job) but can't browse the full directory.
- ATS resume scoring and AI suggestions are intentionally **not** in this increment — they belong with the other "AI Features" (career roadmap, mock interview, skill-gap analysis) as a dedicated feature.



```
backend/
├─ src/
│  ├─ config/         # env loading, DB connection
│  ├─ constants/       # roles, job status/type enums
│  ├─ controllers/     # request handlers + per-feature validation schemas
│  ├─ middleware/      # auth, error handling, validation, sanitization
│  ├─ models/          # Mongoose schemas (User, Company, Job, StudentProfile)
│  ├─ routes/          # Express routers
│  ├─ types/           # shared TS types (AuthRequest, JwtPayload, ...)
│  ├─ utils/           # ApiError, asyncHandler, token helpers
│  ├─ app.ts           # Express app assembly (middleware + route mounting)
│  └─ server.ts        # entry point — connects DB, starts HTTP server
├─ uploads/resumes/    # local resume storage (dev only — see Feature 3 notes)
├─ .env.example
├─ tsconfig.json
└─ package.json
```

Everything is intentionally decoupled: routes never talk to the database directly,
controllers never build JWTs by hand, and validation/authorization always run as
middleware before a controller executes.

## API surface

### Auth

| Method | Route              | Auth required | Description                          |
|--------|--------------------|----------------|---------------------------------------|
| POST   | `/api/auth/register` | No           | Create an account (role defaults to `student`; `admin` cannot self-register) |
| POST   | `/api/auth/login`    | No           | Log in, returns access token + sets refresh cookie |
| POST   | `/api/auth/refresh`  | Refresh cookie | Issue a new access/refresh token pair |
| POST   | `/api/auth/logout`   | No           | Invalidate the stored refresh token |
| GET    | `/api/auth/me`       | Bearer token | Return the logged-in user's profile |
| GET    | `/api/health`        | No           | Liveness check |

### Companies

| Method | Route                     | Auth required           | Description |
|--------|---------------------------|--------------------------|--------------|
| GET    | `/api/companies`          | No                       | Browse/search companies (paginated) |
| GET    | `/api/companies/:id`      | No                       | Company details |
| POST   | `/api/companies`          | Recruiter                | Create your company profile (one per recruiter) |
| GET    | `/api/companies/me/profile` | Recruiter              | Get your own company profile |
| PATCH  | `/api/companies/me/profile` | Recruiter              | Update your own company profile |

### Jobs

| Method | Route                | Auth required                | Description |
|--------|-----------------------|-------------------------------|--------------|
| GET    | `/api/jobs`           | No                            | Browse approved, non-expired jobs; filters: `jobType`, `workMode`, `department`, `search`, `page`, `limit` |
| GET    | `/api/jobs/:id`       | No (owner/staff see any status) | Job details |
| POST   | `/api/jobs`           | Recruiter                    | Create a job (requires a company profile first) |
| GET    | `/api/jobs/mine`      | Recruiter                    | Jobs you've posted; optional `?status=` filter |
| PATCH  | `/api/jobs/:id`       | Recruiter (owner)             | Update a job — resets to `pending_approval` if it was already approved |
| DELETE | `/api/jobs/:id`       | Recruiter (owner)             | Delete a job |
| PATCH  | `/api/jobs/:id/close` | Recruiter (owner) or staff    | Stop accepting applications |
| GET    | `/api/jobs/pending`   | Placement Officer, Admin      | Approval queue |
| PATCH  | `/api/jobs/:id/approve` | Placement Officer, Admin    | Approve a job |
| PATCH  | `/api/jobs/:id/reject`  | Placement Officer, Admin    | Reject a job (requires `{ reason }` in body) |

### Students

| Method | Route                              | Auth required                        | Description |
|--------|--------------------------------------|----------------------------------------|--------------|
| GET    | `/api/students/me`                 | Student                               | Your profile (`null` if not created yet) |
| PATCH  | `/api/students/me`                 | Student                               | Create or update your profile |
| POST   | `/api/students/me/resume`          | Student                               | Upload resume (`multipart/form-data`, field name `resume`) |
| GET    | `/api/students/me/eligibility/:jobId` | Student                            | Check your eligibility against a job |
| GET    | `/api/students`                    | Placement Officer, Admin              | Directory with filters: `department`, `graduationYear`, `minCgpa`, `skill` |
| GET    | `/api/students/:id`                | Placement Officer, Admin, Recruiter   | A specific student's profile |

## Running it locally

```bash
cd backend
cp .env.example .env      # fill in MONGO_URI and JWT secrets
npm install
npm run dev                # ts-node + nodemon, hot reload
```

Production build:

```bash
npm run build
npm start
```

## Notes on decisions made

- **bcryptjs instead of bcrypt**: pure JS, no native compilation step — one less thing to break across environments/CI. Functionally equivalent.
- **Refresh token in an httpOnly cookie, access token in the JSON body**: the standard split so the long-lived credential is never reachable from JS (mitigates XSS token theft), while the short-lived token can live in frontend memory/state.
- **Admin accounts can't self-register** through the public endpoint — admin users should be seeded/created by an existing admin (a "Manage Users" endpoint will handle that when we build the Admin feature).
- **One company per recruiter** for now. If you need multiple recruiters managing one shared company later, that's a small schema change (company gets a `recruiters: ObjectId[]` array instead) — flag it if you want that now instead.
- **Applicant Management is deferred** to the Student/Application feature, since "applicants" only exist once students can apply. `applicantsCount` is already on the `Job` model as a denormalized counter, ready to be incremented from that feature.

## What's next

Once you say **"Continue"**, the next logical feature is **Applications** — this is what finally connects Students and Jobs: students apply to approved jobs, recruiters get Applicant Management (viewing/downloading resumes, shortlisting, scheduling interviews), and `Job.applicantsCount` starts getting incremented for real.

After that: Frontend scaffolding, or the Admin feature (manage users, verify companies, approve recruiters).

