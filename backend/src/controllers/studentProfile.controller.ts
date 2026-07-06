import { Response } from "express";
import { FilterQuery } from "mongoose";
import { StudentProfile, IStudentProfile } from "@models/StudentProfile.model";
import { Job } from "@models/Job.model";
import { ApiError } from "@utils/ApiError";
import { asyncHandler } from "@utils/asyncHandler";
import { AuthRequest } from "../types";
import { UpdateStudentProfileInput } from "./studentProfile.validation";
import {
  createOrUpdateMockStudentProfile,
  findMockStudentProfileByUser,
  findMockStudentProfileById,
  listMockStudents,
  isMockMode,
  findMockJobById,
} from "@utils/mockStore";

// GET /api/students/me
export const getMyProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const profile = await StudentProfile.findOne({ user: req.user!.userId });
    if (!profile) {
      // Not an error — the frontend uses this to decide whether to show
      // an onboarding form or the profile view.
      return res.status(200).json({
        success: true,
        message: "No profile created yet",
        data: null,
      });
    }
    res.status(200).json({ success: true, message: "Your profile", data: profile });
  }
);

// PATCH /api/students/me  — creates the profile on first call, updates after
export const updateMyProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = req.body as UpdateStudentProfileInput;

    if (isMockMode()) {
      const profile = createOrUpdateMockStudentProfile(req.user!.userId, data as any);
      return res.status(200).json({ success: true, message: "Profile saved", data: profile });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user!.userId },
      { $set: data, $setOnInsert: { user: req.user!.userId } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile saved",
      data: profile,
    });
  }
);

// POST /api/students/me/resume  (multer populates req.file)
export const uploadResume = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const file = (req as unknown as { file?: Express.Multer.File }).file;
    if (!file) {
      throw ApiError.badRequest("No file uploaded");
    }

    const resumeUrl = `/uploads/resumes/${file.filename}`;

    if (isMockMode()) {
      const profile = createOrUpdateMockStudentProfile(req.user!.userId, {
        resumeUrl,
        resumeOriginalName: file.originalname,
      } as any);
      return res.status(200).json({ success: true, message: "Resume uploaded", data: { resumeUrl: profile.resumeUrl, resumeOriginalName: profile.resumeOriginalName } });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user!.userId },
      {
        $set: {
          resumeUrl,
          resumeOriginalName: file.originalname,
          resumeUpdatedAt: new Date(),
        },
        $setOnInsert: {
          user: req.user!.userId,
          department: "Unspecified",
          graduationYear: new Date().getFullYear(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Resume uploaded",
      data: { resumeUrl: profile.resumeUrl, resumeOriginalName: profile.resumeOriginalName },
    });
  }
);

// GET /api/students/:id  (placement_officer, admin, recruiter)
export const getStudentById = asyncHandler(async (req, res: Response) => {
  if (isMockMode()) {
    const profile = findMockStudentProfileById(req.params.id);
    if (!profile) throw ApiError.notFound("Student profile not found");
    return res.status(200).json({ success: true, message: "Student profile", data: profile });
  }

  const profile = await StudentProfile.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!profile) throw ApiError.notFound("Student profile not found");
  res.status(200).json({ success: true, message: "Student profile", data: profile });
});

// GET /api/students  (placement_officer, admin) — filterable directory
export const listStudents = asyncHandler(async (req, res: Response) => {
  if (isMockMode()) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const department = typeof req.query.department === "string" ? req.query.department : undefined;
    const minCgpa = req.query.minCgpa ? Number(req.query.minCgpa) : undefined;
    const skill = typeof req.query.skill === "string" ? req.query.skill : undefined;
    const students = listMockStudents({ department, minCgpa, skill });
    const total = students.length;
    const paged = students.slice((page - 1) * limit, page * limit);
    return res.status(200).json({ success: true, message: "Students fetched", data: { students: paged, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const filter: FilterQuery<IStudentProfile> = {};
  if (req.query.department) filter.department = req.query.department as string;
  if (req.query.graduationYear)
    filter.graduationYear = Number(req.query.graduationYear);
  if (req.query.minCgpa)
    filter.cgpa = { $gte: Number(req.query.minCgpa) };
  if (req.query.skill) filter.skills = req.query.skill as string;

  const [students, total] = await Promise.all([
    StudentProfile.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    StudentProfile.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Students fetched",
    data: {
      students,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});

// GET /api/students/me/eligibility/:jobId  — checks the logged-in student
// against a specific job's eligibility rules.
export const checkEligibility = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (isMockMode()) {
      const profile = findMockStudentProfileByUser(req.user!.userId);
      const job = findMockJobById(req.params.jobId);
      if (!profile) {
        throw ApiError.badRequest("Complete your profile before checking eligibility");
      }
      if (!job) {
        throw ApiError.notFound("Job not found");
      }
      const reasons: string[] = [];
      const { eligibility } = job;
      if (eligibility.minCGPA !== undefined && (profile.cgpa === undefined || profile.cgpa < eligibility.minCGPA)) {
        reasons.push(`Requires a minimum CGPA of ${eligibility.minCGPA} (yours: ${profile.cgpa ?? "not set"})`);
      }
      if (eligibility.maxBacklogs !== undefined && profile.activeBacklogs > eligibility.maxBacklogs) {
        reasons.push(`Allows a maximum of ${eligibility.maxBacklogs} active backlog(s) (yours: ${profile.activeBacklogs})`);
      }
      if (eligibility.allowedDepartments?.length && !eligibility.allowedDepartments.includes(profile.department)) {
        reasons.push(`Open only to: ${eligibility.allowedDepartments.join(", ")} (yours: ${profile.department})`);
      }
      if (eligibility.graduationYear !== undefined && profile.graduationYear !== eligibility.graduationYear) {
        reasons.push(`Requires graduation year ${eligibility.graduationYear} (yours: ${profile.graduationYear})`);
      }
      return res.status(200).json({ success: true, message: reasons.length ? "Not eligible" : "Eligible", data: { eligible: reasons.length === 0, reasons } });
    }

    const [profile, job] = await Promise.all([
      StudentProfile.findOne({ user: req.user!.userId }),
      Job.findById(req.params.jobId),
    ]);

    if (!profile) {
      throw ApiError.badRequest("Complete your profile before checking eligibility");
    }
    if (!job) {
      throw ApiError.notFound("Job not found");
    }

    const reasons: string[] = [];
    const { eligibility } = job;

    if (
      eligibility.minCGPA !== undefined &&
      (profile.cgpa === undefined || profile.cgpa < eligibility.minCGPA)
    ) {
      reasons.push(
        `Requires a minimum CGPA of ${eligibility.minCGPA} (yours: ${
          profile.cgpa ?? "not set"
        })`
      );
    }

    if (
      eligibility.maxBacklogs !== undefined &&
      profile.activeBacklogs > eligibility.maxBacklogs
    ) {
      reasons.push(
        `Allows a maximum of ${eligibility.maxBacklogs} active backlog(s) (yours: ${profile.activeBacklogs})`
      );
    }

    if (
      eligibility.allowedDepartments?.length &&
      !eligibility.allowedDepartments.includes(profile.department)
    ) {
      reasons.push(
        `Open only to: ${eligibility.allowedDepartments.join(", ")} (yours: ${profile.department})`
      );
    }

    if (
      eligibility.graduationYear !== undefined &&
      profile.graduationYear !== eligibility.graduationYear
    ) {
      reasons.push(
        `Requires graduation year ${eligibility.graduationYear} (yours: ${profile.graduationYear})`
      );
    }

    res.status(200).json({
      success: true,
      message: reasons.length ? "Not eligible" : "Eligible",
      data: { eligible: reasons.length === 0, reasons },
    });
  }
);
