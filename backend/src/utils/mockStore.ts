import bcrypt from "bcryptjs";
import { JOB_STATUS } from "@constants/job";
import { Role } from "@constants/roles";

interface MockUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  refreshToken?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

interface MockCompany {
  _id: string;
  recruiter: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  size?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MockJob {
  _id: string;
  company: string | { _id: string; name: string; logoUrl?: string; location?: string };
  postedBy: string | { _id: string; name: string; email: string };
  title: string;
  description: string;
  jobType: string;
  workMode: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skillsRequired: string[];
  eligibility: {
    minCGPA?: number;
    maxBacklogs?: number;
    allowedDepartments?: string[];
    graduationYear?: number;
  };
  vacancies: number;
  applicationDeadline: string;
  status: string;
  rejectionReason?: string;
  approvedBy?: string;
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MockStudentProfile {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  phone?: string;
  bio?: string;
  department: string;
  graduationYear: number;
  cgpa?: number;
  activeBacklogs: number;
  skills: string[];
  projects: Array<{ title: string; description?: string; link?: string; techStack?: string[] }>;
  certifications: Array<{ name: string; issuer?: string; issueDate?: string; credentialUrl?: string }>;
  internships: Array<{ company: string; role: string; startDate?: string; endDate?: string; description?: string }>;
  achievements: Array<{ title: string; description?: string; date?: string }>;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeOriginalName?: string;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

let userCounter = 0;
let companyCounter = 0;
let jobCounter = 0;
let profileCounter = 0;

const users: MockUser[] = [];
const companies: MockCompany[] = [];
const jobs: MockJob[] = [];
const studentProfiles: MockStudentProfile[] = [];

export const isMockMode = () => !process.env.MONGO_URI;

const withHash = async (password: string) => bcrypt.hash(password, 12);

const createUserRecord = async (user: Omit<MockUser, "_id" | "comparePassword" | "createdAt" | "updatedAt">) => {
  const hashed = await withHash(user.password);
  const record: MockUser = {
    ...user,
    _id: `mock-user-${++userCounter}`,
    password: hashed,
    createdAt: new Date(),
    updatedAt: new Date(),
    comparePassword: async function (candidate: string) {
      return bcrypt.compare(candidate, this.password);
    },
  };
  users.push(record);
  return record;
};

export const createMockUser = async (payload: { name: string; email: string; password: string; role: Role }) => {
  return createUserRecord({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: payload.password,
    role: payload.role,
    isActive: true,
    isVerified: false,
  });
};

export const findMockUserByEmail = async (email: string) => {
  return users.find((user) => user.email === email.toLowerCase());
};

export const findMockUserById = (id: string) => {
  return users.find((user) => user._id === id);
};

export const setMockRefreshToken = async (id: string, token?: string) => {
  const user = users.find((entry) => entry._id === id);
  if (!user) return null;
  user.refreshToken = token;
  user.updatedAt = new Date();
  return user;
};

export const clearMockRefreshToken = async (id: string) => {
  const user = users.find((entry) => entry._id === id);
  if (!user) return null;
  user.refreshToken = undefined;
  user.updatedAt = new Date();
  return user;
};

export const createMockCompany = (payload: {
  recruiter: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  size?: string;
}) => {
  const company: MockCompany = {
    _id: `mock-company-${++companyCounter}`,
    recruiter: payload.recruiter,
    name: payload.name,
    description: payload.description,
    website: payload.website,
    industry: payload.industry,
    location: payload.location,
    size: payload.size,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  companies.push(company);
  return company;
};

export const findMockCompanyByRecruiter = (recruiterId: string) => {
  return companies.find((company) => company.recruiter === recruiterId);
};

export const updateMockCompanyByRecruiter = (recruiterId: string, data: Partial<MockCompany>) => {
  const company = companies.find((entry) => entry.recruiter === recruiterId);
  if (!company) return null;
  Object.assign(company, { ...data, updatedAt: new Date() });
  return company;
};

export const findMockCompanyById = (id: string) => {
  return companies.find((company) => company._id === id);
};

export const listMockCompanies = (search = "") => {
  const keyword = search.toLowerCase();
  return companies.filter((company) => !keyword || company.name.toLowerCase().includes(keyword));
};

export const createMockJob = (payload: {
  companyId: string;
  recruiterId: string;
  title: string;
  description: string;
  jobType: string;
  workMode: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skillsRequired: string[];
  eligibility: MockJob["eligibility"];
  vacancies: number;
  applicationDeadline: string;
}) => {
  const company = findMockCompanyById(payload.companyId);
  const recruiter = company ? findMockUserById(payload.recruiterId) : null;
  const job: MockJob = {
    _id: `mock-job-${++jobCounter}`,
    company: company
      ? { _id: company._id, name: company.name, logoUrl: undefined, location: company.location }
      : payload.companyId,
    postedBy: recruiter
      ? { _id: recruiter._id, name: recruiter.name, email: recruiter.email }
      : payload.recruiterId,
    title: payload.title,
    description: payload.description,
    jobType: payload.jobType,
    workMode: payload.workMode,
    location: payload.location,
    salaryMin: payload.salaryMin,
    salaryMax: payload.salaryMax,
    currency: payload.currency,
    skillsRequired: payload.skillsRequired,
    eligibility: payload.eligibility,
    vacancies: payload.vacancies,
    applicationDeadline: payload.applicationDeadline,
    status: JOB_STATUS.PENDING_APPROVAL,
    applicantsCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  jobs.push(job);
  return job;
};

export const findMockJobById = (id: string) => jobs.find((job) => job._id === id);

export const listMockJobs = (filters: { status?: string; recruiterId?: string; search?: string; jobType?: string; workMode?: string } = {}) => {
  return jobs.filter((job) => {
    if (filters.status && job.status !== filters.status) return false;
    if (filters.recruiterId && String(job.postedBy) !== filters.recruiterId) return false;
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    if (filters.workMode && job.workMode !== filters.workMode) return false;
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      return `${job.title} ${job.description}`.toLowerCase().includes(keyword);
    }
    return true;
  });
};

export const updateMockJob = (id: string, data: Partial<MockJob>) => {
  const job = jobs.find((entry) => entry._id === id);
  if (!job) return null;
  Object.assign(job, { ...data, updatedAt: new Date() });
  return job;
};

export const deleteMockJob = (id: string) => {
  const index = jobs.findIndex((job) => job._id === id);
  if (index === -1) return false;
  jobs.splice(index, 1);
  return true;
};

export const listPendingMockJobs = () => jobs.filter((job) => job.status === JOB_STATUS.PENDING_APPROVAL);

export const createOrUpdateMockStudentProfile = (userId: string, data: Partial<MockStudentProfile>) => {
  const existing = studentProfiles.find((profile) => String(profile.user) === userId);
  const user = userId ? findMockUserById(userId) : null;
  if (existing) {
    Object.assign(existing, { ...data, updatedAt: new Date() });
    if (!existing.profileCompleted) {
      existing.profileCompleted = Boolean(existing.department && existing.graduationYear && (existing.skills?.length || existing.cgpa));
    }
    return existing;
  }

  const profile: MockStudentProfile = {
    _id: `mock-profile-${++profileCounter}`,
    user: user ? { _id: user._id, name: user.name, email: user.email } : userId,
    department: data.department ?? "Unspecified",
    graduationYear: data.graduationYear ?? new Date().getFullYear() + 1,
    cgpa: data.cgpa,
    activeBacklogs: data.activeBacklogs ?? 0,
    skills: data.skills ?? [],
    projects: data.projects ?? [],
    certifications: data.certifications ?? [],
    internships: data.internships ?? [],
    achievements: data.achievements ?? [],
    githubUrl: data.githubUrl,
    linkedinUrl: data.linkedinUrl,
    portfolioUrl: data.portfolioUrl,
    resumeUrl: data.resumeUrl,
    resumeOriginalName: data.resumeOriginalName,
    profileCompleted: Boolean(data.department && data.graduationYear && (data.skills?.length || data.cgpa)),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  studentProfiles.push(profile);
  return profile;
};

export const findMockStudentProfileByUser = (userId: string) => {
  return studentProfiles.find((profile) => String(profile.user) === userId || (typeof profile.user === "object" && profile.user._id === userId));
};

export const findMockStudentProfileById = (id: string) => studentProfiles.find((profile) => profile._id === id);

export const listMockStudents = (filters: { department?: string; minCgpa?: number; skill?: string } = {}) => {
  return studentProfiles.filter((profile) => {
    if (filters.department && profile.department !== filters.department) return false;
    if (filters.minCgpa !== undefined && (profile.cgpa === undefined || profile.cgpa < filters.minCgpa)) return false;
    if (filters.skill && !profile.skills.some((skill) => skill.toLowerCase().includes(filters.skill!.toLowerCase()))) return false;
    return true;
  });
};
