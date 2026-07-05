export const JOB_STATUS = {
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  REJECTED: "rejected",
  CLOSED: "closed",
} as const;
export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
export const ALL_JOB_STATUSES: JobStatus[] = Object.values(JOB_STATUS);

export const JOB_TYPE = {
  FULL_TIME: "full_time",
  INTERNSHIP: "internship",
  PART_TIME: "part_time",
} as const;
export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];
export const ALL_JOB_TYPES: JobType[] = Object.values(JOB_TYPE);

export const WORK_MODE = {
  ONSITE: "onsite",
  REMOTE: "remote",
  HYBRID: "hybrid",
} as const;
export type WorkMode = (typeof WORK_MODE)[keyof typeof WORK_MODE];
export const ALL_WORK_MODES: WorkMode[] = Object.values(WORK_MODE);
