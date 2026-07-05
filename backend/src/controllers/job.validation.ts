import { z } from "zod";
import { ALL_JOB_TYPES, ALL_WORK_MODES } from "@constants/job";

const eligibilitySchema = z.object({
  minCGPA: z.number().min(0).max(10).optional(),
  maxBacklogs: z.number().int().min(0).optional(),
  allowedDepartments: z.array(z.string().min(1)).optional(),
  graduationYear: z.number().int().min(2000).max(2100).optional(),
});

export const createJobSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).max(150),
      description: z.string().min(20).max(5000),
      jobType: z.enum(ALL_JOB_TYPES as [string, ...string[]]),
      workMode: z.enum(ALL_WORK_MODES as [string, ...string[]]),
      location: z.string().max(150).optional(),
      salaryMin: z.number().min(0).optional(),
      salaryMax: z.number().min(0).optional(),
      currency: z.string().length(3).optional(),
      skillsRequired: z.array(z.string().min(1)).optional(),
      eligibility: eligibilitySchema.optional(),
      vacancies: z.number().int().min(1).optional(),
      applicationDeadline: z.string().refine(
        (val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(),
        { message: "applicationDeadline must be a valid future date" }
      ),
    })
    .refine(
      (data) =>
        data.salaryMin === undefined ||
        data.salaryMax === undefined ||
        data.salaryMin <= data.salaryMax,
      { message: "salaryMin cannot exceed salaryMax", path: ["salaryMin"] }
    ),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(150).optional(),
    description: z.string().min(20).max(5000).optional(),
    jobType: z.enum(ALL_JOB_TYPES as [string, ...string[]]).optional(),
    workMode: z.enum(ALL_WORK_MODES as [string, ...string[]]).optional(),
    location: z.string().max(150).optional(),
    salaryMin: z.number().min(0).optional(),
    salaryMax: z.number().min(0).optional(),
    currency: z.string().length(3).optional(),
    skillsRequired: z.array(z.string().min(1)).optional(),
    eligibility: eligibilitySchema.optional(),
    vacancies: z.number().int().min(1).optional(),
    applicationDeadline: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "applicationDeadline must be a valid date",
      })
      .optional(),
  }),
});

export const rejectJobSchema = z.object({
  body: z.object({
    reason: z.string().min(5).max(500),
  }),
});

export type CreateJobInput = z.infer<typeof createJobSchema>["body"];
export type UpdateJobInput = z.infer<typeof updateJobSchema>["body"];
