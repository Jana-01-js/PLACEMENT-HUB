import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper text-center">
    <p className="font-mono text-sm font-semibold text-brass-deep">404</p>
    <h1 className="font-display text-2xl font-semibold text-ink">
      This page fell off the ladder.
    </h1>
    <p className="max-w-sm text-sm text-slate-muted">
      The page you're looking for doesn't exist, or you don't have access to it.
    </p>
    <Link to="/" className="btn-accent">
      Back to safety
    </Link>
  </div>
);
