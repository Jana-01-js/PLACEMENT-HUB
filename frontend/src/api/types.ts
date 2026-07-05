export type Role = "student" | "recruiter" | "placement_officer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Company {
  _id: string;
  recruiter: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  logoUrl?: string;
  location?: string;
  size?: string;
  foundedYear?: number;
  isVerified: boolean;
  createdAt: string;
}

export type JobStatus = "pending_approval" | "approved" | "rejected" | "closed";
export type JobType = "full_time" | "internship" | "part_time";
export type WorkMode = "onsite" | "remote" | "hybrid";

export interface JobEligibility {
  minCGPA?: number;
  maxBacklogs?: number;
  allowedDepartments?: string[];
  graduationYear?: number;
}

export interface Job {
  _id: string;
  company: Company | string;
  postedBy: string | { _id: string; name: string; email: string };
  title: string;
  description: string;
  jobType: JobType;
  workMode: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skillsRequired: string[];
  eligibility: JobEligibility;
  vacancies: number;
  applicationDeadline: string;
  status: JobStatus;
  rejectionReason?: string;
  applicantsCount: number;
  createdAt: string;
}

export interface Project {
  title: string;
  description?: string;
  link?: string;
  techStack?: string[];
}

export interface Certification {
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface Internship {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Achievement {
  title: string;
  description?: string;
  date?: string;
}

export interface StudentProfile {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  phone?: string;
  bio?: string;
  department: string;
  graduationYear: number;
  cgpa?: number;
  activeBacklogs: number;
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  internships: Internship[];
  achievements: Achievement[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeOriginalName?: string;
  profileCompleted: boolean;
}

export interface Paginated<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: T[];
}
