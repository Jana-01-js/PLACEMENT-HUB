import { Link } from "react-router-dom";

const RUNGS = [
  { n: "01", label: "Build your profile", detail: "Skills, CGPA, projects, resume — one place, always current." },
  { n: "02", label: "Get matched to roles", detail: "See only the jobs your college has actually approved." },
  { n: "03", label: "Climb, don't chase", detail: "Track every application's status without a single spreadsheet." },
];

export const LandingPage = () => (
  <div className="min-h-screen bg-ink text-white">
    <header className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass font-display text-sm font-bold text-ink900">
          PH
        </span>
        <span className="font-display text-lg font-semibold">Placement Hub</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-ghost !text-white/80 hover:!bg-white/10 hover:!text-white">
          Sign in
        </Link>
        <Link to="/register" className="btn-accent">
          Get started
        </Link>
      </div>
    </header>

    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-8 pb-24 pt-12 md:grid-cols-2 md:pt-20">
      <div>
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-brass-light">
          For SNS College of Technology &amp; beyond
        </p>
        <h1 className="font-display text-5xl font-semibold leading-[1.1] tracking-tight">
          Every rung of placement,
          <br />
          <span className="text-brass-light">in one ladder.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-white/70">
          Students, recruiters, and placement officers working off the same
          record — job approvals, eligibility, and applications tracked
          rung by rung instead of scattered across email threads.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/register" className="btn-accent px-6 py-3 text-base">
            Create your account
          </Link>
          <Link to="/login" className="btn-ghost px-6 py-3 text-base !text-white/80 hover:!bg-white/10 hover:!text-white">
            I already have one
          </Link>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="w-full max-w-sm rounded-xl2 bg-ink-light p-2 shadow-2xl">
          <div className="rounded-[1rem] bg-white/[0.03] p-6">
            {RUNGS.map((rung, i) => (
              <div key={rung.n} className="relative flex gap-4 pb-8 last:pb-0">
                {i < RUNGS.length - 1 && (
                  <span className="absolute left-[15px] top-8 h-full w-px bg-white/10" />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-ink font-mono text-xs font-semibold text-brass-light">
                  {rung.n}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-white">
                    {rung.label}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{rung.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <footer className="border-t border-white/10 px-8 py-6 text-center text-xs text-white/40">
      Built as a final-year portfolio project — role-based placement management for engineering colleges.
    </footer>
  </div>
);
