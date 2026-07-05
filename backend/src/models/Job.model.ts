import { Schema, model, Document, Types } from "mongoose";
import {
  ALL_JOB_STATUSES,
  ALL_JOB_TYPES,
  ALL_WORK_MODES,
  JOB_STATUS,
  JobStatus,
  JobType,
  WorkMode,
} from "@constants/job";

interface IEligibility {
  minCGPA?: number;
  maxBacklogs?: number;
  allowedDepartments?: string[];
  graduationYear?: number;
}

export interface IJob extends Document {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  postedBy: Types.ObjectId;
  title: string;
  description: string;
  jobType: JobType;
  workMode: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skillsRequired: string[];
  eligibility: IEligibility;
  vacancies: number;
  applicationDeadline: Date;
  status: JobStatus;
  approvedBy?: Types.ObjectId;
  rejectionReason?: string;
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const eligibilitySchema = new Schema<IEligibility>(
  {
    minCGPA: { type: Number, min: 0, max: 10 },
    maxBacklogs: { type: Number, min: 0, default: 0 },
    allowedDepartments: [{ type: String, trim: true }],
    graduationYear: { type: Number },
  },
  { _id: false }
);

const jobSchema = new Schema<IJob>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: 5000,
    },
    jobType: { type: String, enum: ALL_JOB_TYPES, required: true },
    workMode: { type: String, enum: ALL_WORK_MODES, required: true },
    location: { type: String, trim: true },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    currency: { type: String, default: "INR" },
    skillsRequired: [{ type: String, trim: true }],
    eligibility: { type: eligibilitySchema, default: {} },
    vacancies: { type: Number, min: 1, default: 1 },
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    status: {
      type: String,
      enum: ALL_JOB_STATUSES,
      default: JOB_STATUS.PENDING_APPROVAL,
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectionReason: { type: String, maxlength: 500 },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ status: 1, applicationDeadline: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ title: "text", description: "text" });

jobSchema.pre("validate", function (next) {
  if (
    this.salaryMin !== undefined &&
    this.salaryMax !== undefined &&
    this.salaryMin > this.salaryMax
  ) {
    return next(new Error("salaryMin cannot be greater than salaryMax"));
  }
  next();
});

export const Job = model<IJob>("Job", jobSchema);
