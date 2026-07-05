import { Response } from "express";
import { FilterQuery } from "mongoose";
import { Job, IJob } from "@models/Job.model";
import { Company } from "@models/Company.model";
import { ApiError } from "@utils/ApiError";
import { asyncHandler } from "@utils/asyncHandler";
import { AuthRequest } from "../types";
import { JOB_STATUS } from "@constants/job";
import { ROLES } from "@constants/roles";
import { CreateJobInput, UpdateJobInput } from "./job.validation";

// POST /api/jobs  (recruiter)
export const createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const company = await Company.findOne({ recruiter: req.user!.userId });
  if (!company) {
    throw ApiError.badRequest(
      "Create your company profile before posting a job"
    );
  }

  const data = req.body as CreateJobInput;
  const job = await Job.create({
    ...data,
    company: company._id,
    postedBy: req.user!.userId,
    status: JOB_STATUS.PENDING_APPROVAL,
  });

  res.status(201).json({
    success: true,
    message: "Job submitted for approval",
    data: job,
  });
});

// GET /api/jobs/mine  (recruiter) — jobs posted by the logged-in recruiter
export const getMyJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filter: FilterQuery<IJob> = { postedBy: req.user!.userId };
  if (req.query.status) filter.status = req.query.status as string;

  const jobs = await Job.find(filter)
    .populate("company", "name logoUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, message: "Your jobs", data: jobs });
});

// Shared helper: fetch a job and verify the requester owns it (or is staff)
const findOwnedJob = async (jobId: string, userId: string) => {
  const job = await Job.findById(jobId);
  if (!job) throw ApiError.notFound("Job not found");
  if (job.postedBy.toString() !== userId) {
    throw ApiError.forbidden("You do not own this job posting");
  }
  return job;
};

// PATCH /api/jobs/:id  (recruiter, owner only)
export const updateJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const job = await findOwnedJob(req.params.id, req.user!.userId);
  const data = req.body as UpdateJobInput;

  Object.assign(job, data);

  // Any edit after approval requires re-approval to prevent bait-and-switch postings.
  if (job.status === JOB_STATUS.APPROVED) {
    job.status = JOB_STATUS.PENDING_APPROVAL;
    job.approvedBy = undefined;
  }

  await job.save();

  res.status(200).json({
    success: true,
    message: "Job updated" + (job.status === JOB_STATUS.PENDING_APPROVAL
      ? " and resubmitted for approval"
      : ""),
    data: job,
  });
});

// DELETE /api/jobs/:id  (recruiter, owner only)
export const deleteJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const job = await findOwnedJob(req.params.id, req.user!.userId);
  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted" });
});

// GET /api/jobs/:id  (public for approved jobs; owner/staff can view any status)
export const getJobById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id).populate(
    "company",
    "name logoUrl website industry location"
  );
  if (!job) throw ApiError.notFound("Job not found");

  const isOwner = req.user && job.postedBy.toString() === req.user.userId;
  const isStaff =
    req.user &&
    [ROLES.PLACEMENT_OFFICER, ROLES.ADMIN].includes(req.user.role as any);

  if (job.status !== JOB_STATUS.APPROVED && !isOwner && !isStaff) {
    throw ApiError.notFound("Job not found");
  }

  res.status(200).json({ success: true, message: "Job details", data: job });
});

// GET /api/jobs  (public) — approved jobs only, with filters
export const listJobs = asyncHandler(async (req, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const filter: FilterQuery<IJob> = {
    status: JOB_STATUS.APPROVED,
    applicationDeadline: { $gte: new Date() },
  };

  if (req.query.jobType) filter.jobType = req.query.jobType as string;
  if (req.query.workMode) filter.workMode = req.query.workMode as string;
  if (req.query.department) {
    filter["eligibility.allowedDepartments"] = req.query.department as string;
  }
  if (req.query.search) {
    filter.$text = { $search: req.query.search as string };
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("company", "name logoUrl location")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Jobs fetched",
    data: {
      jobs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});

// --- Placement Officer / Admin approval workflow ---

// GET /api/jobs/pending  (placement_officer, admin)
export const listPendingJobs = asyncHandler(async (_req, res: Response) => {
  const jobs = await Job.find({ status: JOB_STATUS.PENDING_APPROVAL })
    .populate("company", "name industry isVerified")
    .populate("postedBy", "name email")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    message: "Jobs awaiting approval",
    data: jobs,
  });
});

// PATCH /api/jobs/:id/approve  (placement_officer, admin)
export const approveJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound("Job not found");

  job.status = JOB_STATUS.APPROVED;
  job.approvedBy = req.user!.userId as any;
  job.rejectionReason = undefined;
  await job.save();

  res.status(200).json({ success: true, message: "Job approved", data: job });
});

// PATCH /api/jobs/:id/reject  (placement_officer, admin)
export const rejectJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound("Job not found");

  job.status = JOB_STATUS.REJECTED;
  job.rejectionReason = req.body.reason;
  job.approvedBy = undefined;
  await job.save();

  res.status(200).json({ success: true, message: "Job rejected", data: job });
});

// PATCH /api/jobs/:id/close  (recruiter owner, or staff) — stop accepting applications
export const closeJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound("Job not found");

  const isOwner = job.postedBy.toString() === req.user!.userId;
  const isStaff = [ROLES.PLACEMENT_OFFICER, ROLES.ADMIN].includes(
    req.user!.role as any
  );
  if (!isOwner && !isStaff) {
    throw ApiError.forbidden("You do not have permission to close this job");
  }

  job.status = JOB_STATUS.CLOSED;
  await job.save();

  res.status(200).json({ success: true, message: "Job closed", data: job });
});
