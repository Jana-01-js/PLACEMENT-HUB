import { Response } from "express";
import { Company } from "@models/Company.model";
import { ApiError } from "@utils/ApiError";
import { asyncHandler } from "@utils/asyncHandler";
import { AuthRequest } from "../types";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.validation";
import {
  createMockCompany,
  findMockCompanyByRecruiter,
  updateMockCompanyByRecruiter,
  findMockCompanyById,
  listMockCompanies,
  isMockMode,
} from "@utils/mockStore";

// POST /api/companies  (recruiter)
export const createCompany = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const recruiterId = req.user!.userId;

    if (isMockMode()) {
      const existing = findMockCompanyByRecruiter(recruiterId);
      if (existing) {
        throw ApiError.conflict(
          "You already have a company profile. Use the update endpoint instead."
        );
      }
      const data = req.body as CreateCompanyInput;
      const company = createMockCompany({ recruiter: recruiterId, ...data });
      res.status(201).json({ success: true, message: "Company profile created", data: company });
      return;
    }

    const existing = await Company.findOne({ recruiter: recruiterId });
    if (existing) {
      throw ApiError.conflict(
        "You already have a company profile. Use the update endpoint instead."
      );
    }

    const data = req.body as CreateCompanyInput;
    const company = await Company.create({ ...data, recruiter: recruiterId });

    res.status(201).json({
      success: true,
      message: "Company profile created",
      data: company,
    });
  }
);

// GET /api/companies/me  (recruiter)
export const getMyCompany = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (isMockMode()) {
      const company = findMockCompanyByRecruiter(req.user!.userId);
      if (!company) {
        throw ApiError.notFound("No company profile found. Create one first.");
      }
      res.status(200).json({ success: true, message: "Company profile", data: company });
      return;
    }

    const company = await Company.findOne({ recruiter: req.user!.userId });
    if (!company) {
      throw ApiError.notFound(
        "No company profile found. Create one first."
      );
    }
    res.status(200).json({ success: true, message: "Company profile", data: company });
  }
);

// PATCH /api/companies/me  (recruiter)
export const updateMyCompany = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = req.body as UpdateCompanyInput;

    if (isMockMode()) {
      const company = updateMockCompanyByRecruiter(req.user!.userId, data);
      if (!company) {
        throw ApiError.notFound("No company profile found. Create one first.");
      }
      res.status(200).json({ success: true, message: "Company profile updated", data: company });
      return;
    }

    const company = await Company.findOneAndUpdate(
      { recruiter: req.user!.userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!company) {
      throw ApiError.notFound(
        "No company profile found. Create one first."
      );
    }

    res.status(200).json({
      success: true,
      message: "Company profile updated",
      data: company,
    });
  }
);

// GET /api/companies/:id  (public / any authenticated user)
export const getCompanyById = asyncHandler(async (req, res: Response) => {
  if (isMockMode()) {
    const company = findMockCompanyById(req.params.id);
    if (!company) {
      throw ApiError.notFound("Company not found");
    }
    res.status(200).json({ success: true, message: "Company details", data: company });
    return;
  }

  const company = await Company.findById(req.params.id);
  if (!company) {
    throw ApiError.notFound("Company not found");
  }
  res.status(200).json({ success: true, message: "Company details", data: company });
});

// GET /api/companies  (public listing, e.g. for students browsing)
export const listCompanies = asyncHandler(async (req, res: Response) => {
  if (isMockMode()) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const search = (req.query.search as string) || "";
    const results = listMockCompanies(search);
    const total = results.length;
    const companies = results.slice((page - 1) * limit, page * limit);
    res.status(200).json({ success: true, message: "Companies fetched", data: { companies, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
    return;
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const search = (req.query.search as string) || "";

  const filter = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const [companies, total] = await Promise.all([
    Company.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Company.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Companies fetched",
    data: {
      companies,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});
