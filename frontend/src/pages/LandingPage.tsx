import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Unified student profiles",
    description: "Keep resumes, skills, CGPA, projects, and certifications in one polished profile.",
  },
  {
    title: "Trusted recruiter workflows",
    description: "Post openings, review applicants, and coordinate interviews from a single dashboard.",
  },
  {
    title: "Faster placement approvals",
    description: "Placement officers can review, approve, and track every opportunity with clarity.",
  },
];

const STEPS = [
  { step: "01", title: "Create your account", detail: "Choose your role and set up your workspace in minutes." },
  { step: "02", title: "Share opportunities", detail: "Students discover approved jobs while recruiters manage applications." },
  { step: "03", title: "Track progress", detail: "Every stage stays visible, organized, and easy to follow." },
];

const STATS = [
  { value: "3", label: "role-based experiences" },
  { value: "24/7", label: "accessible placement operations" },
  { value: "100%", label: "transparent applicant visibility" },
];

export const LandingPage = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(201,138,62,0.12),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#f3f5f7_100%)] text-slate-text">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink font-display text-sm font-bold text-white">
          PH
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink">Placement Hub</p>
          <p className="text-sm text-slate-muted">Professional placement management</p>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-ghost hidden text-slate-muted sm:inline-flex">
          Sign in
        </Link>
        <Link to="/register" className="btn-accent">
          Get started
        </Link>
      </div>
    </header>

    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-12">
        <div>
          <div className="inline-flex items-center rounded-full border border-brass/20 bg-brass/10 px-3 py-1 text-sm font-semibold text-brass-deep">
            Trusted by modern engineering colleges
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Bring every placement step into one polished experience.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-muted">
            Placement Hub unifies student profiles, recruiter postings, and officer approvals in a calm, professional workspace designed for growth and clarity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-accent px-6 py-3 text-base">
              Create your account
            </Link>
            <Link to="/login" className="btn-ghost px-6 py-3 text-base">
              I already have one
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-card backdrop-blur">
                <p className="font-display text-2xl font-semibold text-ink">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card">
          <div className="rounded-[1.5rem] bg-ink p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brass-light">Live placement pipeline</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">Everything in motion</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">Updated now</span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Approved job openings</p>
                  <p className="text-sm text-brass-light">18 active</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-3/4 rounded-full bg-brass" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Student applications</p>
                  <p className="text-sm text-brass-light">126 pending</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-4/5 rounded-full bg-brass" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Officer review queue</p>
                  <p className="text-sm text-brass-light">9 tasks</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-2/3 rounded-full bg-brass" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-card">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brass/10 text-xl text-brass-deep">
                •
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-card backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brass-deep">How it works</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">A seamless flow from signup to success.</h2>
            </div>
            <Link to="/register" className="btn-accent">
              Join the platform
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="rounded-2xl border border-slate-200 bg-paper p-5">
                <p className="font-mono text-sm font-semibold text-brass-deep">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-4 lg:px-8">
        <div className="rounded-[2rem] border border-brass/20 bg-ink px-8 py-10 text-white shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brass-light">Ready to modernize placements?</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Elevate your college placement experience.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-accent">
                Start now
              </Link>
              <Link to="/login" className="btn-ghost !text-white/80 hover:!bg-white/10 hover:!text-white">
                Existing user
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-slate-200/70 px-6 py-6 text-center text-sm text-slate-muted lg:px-8">
      Built as a polished portfolio project for role-based placement management.
    </footer>
  </div>
);
