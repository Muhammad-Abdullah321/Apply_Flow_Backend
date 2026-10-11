
import { z } from "zod";

const jobTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "TEMPORARY",
] as const;

const applicationStatuses = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
  "WITHDRAWN",
] as const;

const fields = {
  company: z.string().trim().min(1).max(150),
  jobTitle: z.string().trim().min(1).max(150),
  jobURL: z.string().url().nullable().optional(),
  location: z.string().trim().max(150).nullable().optional(),
  jobType: z.enum(jobTypes),
  applicationDate: z.coerce.date(),
  minSalary: z.coerce.number().nonnegative().nullable().optional(),
  maxSalary: z.coerce.number().nonnegative().nullable().optional(),
  currency: z.string().trim().length(3).nullable().optional(),
  jobDescription: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  resumeId: z.string().uuid().nullable().optional(),
};

export const createApplicationSchema = z
  .object({
    ...fields,
    status: z.enum(applicationStatuses),
  })
  .refine(
    (data) =>
      data.minSalary == null ||
      data.maxSalary == null ||
      data.maxSalary >= data.minSalary,
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    }
  );

export const updateApplicationSchema = z
  .object({
    company: fields.company.optional(),
    jobTitle: fields.jobTitle.optional(),
    jobURL: fields.jobURL,
    location: fields.location,
    jobType: fields.jobType.optional(),
    applicationDate: fields.applicationDate.optional(),
    minSalary: fields.minSalary,
    maxSalary: fields.maxSalary,
    currency: fields.currency,
    jobDescription: fields.jobDescription,
    notes: fields.notes,
    resumeId: fields.resumeId,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  })
  .refine(
    (data) =>
      data.minSalary == null ||
      data.maxSalary == null ||
      data.maxSalary >= data.minSalary,
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"],
    }
  );

export const updateApplicationStatusSchema = z.object({
  status: z.enum(applicationStatuses),
});

export const applicationFiltersSchema = z.object({
  search: z.string().trim().optional(),
  company: z.string().trim().optional(),
  location: z.string().trim().optional(),
  jobType: z.enum(jobTypes).optional(),
  status: z.enum(applicationStatuses).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// application.schema.ts
export const applicationIdParamsSchema = z.object({
  id: z.string().uuid(),
});
export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>;
export type UpdateApplicationInput = z.infer<
  typeof updateApplicationSchema
>;
export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
