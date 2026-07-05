export const ROLES = {
  STUDENT: "student",
  RECRUITER: "recruiter",
  PLACEMENT_OFFICER: "placement_officer",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: Role[] = Object.values(ROLES);
