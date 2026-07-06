import { z } from "zod";

const sizeEnum = z.enum(["1-50", "51-200", "201-500", "501-1000", "1000+", "100-500"]);

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    description: z.string().max(3000).optional(),
    website: z.string().url().optional(),
    industry: z.string().max(100).optional(),
    logoUrl: z.string().url().optional(),
    location: z.string().max(150).optional(),
    size: sizeEnum.optional(),
    foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: createCompanySchema.shape.body.partial(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>["body"];
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>["body"];
