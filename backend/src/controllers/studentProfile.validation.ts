import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  link: z.string().url().optional(),
  techStack: z.array(z.string()).optional(),
});

const certificationSchema = z.object({
  name: z.string().min(1).max(150),
  issuer: z.string().max(150).optional(),
  issueDate: z.string().optional(),
  credentialUrl: z.string().url().optional(),
});

const internshipSchema = z.object({
  company: z.string().min(1).max(150),
  role: z.string().min(1).max(150),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().max(1000).optional(),
});

const achievementSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(500).optional(),
  date: z.string().optional(),
});

export const updateStudentProfileSchema = z.object({
  body: z.object({
    phone: z.string().max(20).optional(),
    bio: z.string().max(1000).optional(),
    department: z.string().min(1).max(100).optional(),
    graduationYear: z.number().int().min(2000).max(2100).optional(),
    cgpa: z.number().min(0).max(10).optional(),
    activeBacklogs: z.number().int().min(0).optional(),
    skills: z.array(z.string().min(1)).optional(),
    projects: z.array(projectSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
    internships: z.array(internshipSchema).optional(),
    achievements: z.array(achievementSchema).optional(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
  }),
});

export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>["body"];
