import { Router } from "express";
import {
  createCompany,
  getMyCompany,
  updateMyCompany,
  getCompanyById,
  listCompanies,
} from "@controllers/company.controller";
import { validate } from "@middleware/validate.middleware";
import {
  createCompanySchema,
  updateCompanySchema,
} from "@controllers/company.validation";
import { authenticate, authorize } from "@middleware/auth.middleware";
import { ROLES } from "@constants/roles";

const router = Router();

// Public
router.get("/", listCompanies);
router.get("/:id", getCompanyById);

// Recruiter only
router.post(
  "/",
  authenticate,
  authorize(ROLES.RECRUITER),
  validate(createCompanySchema),
  createCompany
);
router.get("/me/profile", authenticate, authorize(ROLES.RECRUITER), getMyCompany);
router.patch(
  "/me/profile",
  authenticate,
  authorize(ROLES.RECRUITER),
  validate(updateCompanySchema),
  updateMyCompany
);

export default router;
