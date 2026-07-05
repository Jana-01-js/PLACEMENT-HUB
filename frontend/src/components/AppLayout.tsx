import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const NAV_BY_ROLE: Record<string, { to: string; label: string }[]> = {
  student: [
    { to: "/student", label: "Dashboard" },
    { to: "/student/profile", label: "My Profile" },
    { to: "/student/jobs", label: "Browse Jobs" },
  ],
  recruiter: [
    { to: "/recruiter", label: "Dashboard" },
    { to: "/recruiter/company", label: "Company Profile" },
    { to: "/recruiter/jobs/new", label: "Post a Job" },
    { to: "/recruiter/jobs", label: "My Jobs" },
  ],
  placement_officer: [
    { to: "/officer", label: "Dashboard" },
    { to: "/officer/pending", label: "Approval Queue" },
    { to: "/officer/students", label: "Student Directory" },
  ],
  admin: [{ to: "/officer", label: "Dashboard" }],
};

const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  recruiter: "Recruiter",
  placement_officer: "Placement Officer",
  admin: "Admin",
};

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const links = NAV_BY_ROLE[user.role] ?? [];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-64 flex-col justify-between bg-ink px-5 py-7 text-white">
        <div>
          <div className="mb-10 flex items-center gap-2 px-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass font-display text-sm font-bold text-ink900">
              PH
            </span>
            <span className="font-display text-lg font-semibold">
              Placement Hub
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/student" || link.to === "/recruiter" || link.to === "/officer"}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-brass-light"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="mb-3 text-xs text-white/50">{ROLE_LABEL[user.role]}</p>
          <button onClick={handleLogout} className="btn-ghost w-full !justify-start !text-white/70 hover:!bg-white/5 hover:!text-white">
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
