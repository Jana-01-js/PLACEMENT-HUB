import { useEffect, useState } from "react";
import { listStudents, StudentFilters } from "@/api/students";
import { StudentProfile } from "@/api/types";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/Badge";

export const StudentDirectoryPage = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StudentFilters>({});

  useEffect(() => {
    setLoading(true);
    listStudents(filters)
      .then((res) => setStudents(res.students))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Student directory</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Department"
          onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value || undefined }))}
        />
        <input
          className="input max-w-[10rem]"
          type="number"
          step="0.1"
          placeholder="Min CGPA"
          onChange={(e) =>
            setFilters((f) => ({ ...f, minCgpa: e.target.value ? Number(e.target.value) : undefined }))
          }
        />
        <input
          className="input max-w-xs"
          placeholder="Skill"
          onChange={(e) => setFilters((f) => ({ ...f, skill: e.target.value || undefined }))}
        />
      </div>

      <div className="mt-6 space-y-3">
        {loading && <Spinner label="Loading students" />}
        {!loading && students.length === 0 && (
          <div className="card text-center text-sm text-slate-muted">No matches.</div>
        )}
        {students.map((s) => {
          const user = typeof s.user === "object" ? s.user : null;
          return (
            <div key={s._id} className="card flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-ink">{user?.name ?? "Student"}</p>
                <p className="text-sm text-slate-muted">
                  {s.department} · Class of {s.graduationYear} · CGPA {s.cgpa ?? "—"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.skills.slice(0, 6).map((skill) => (
                    <Badge key={skill} tone="neutral">{skill}</Badge>
                  ))}
                </div>
              </div>
              {s.profileCompleted ? (
                <Badge tone="success">Profile complete</Badge>
              ) : (
                <Badge tone="brass">Incomplete</Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
