import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  getStudentById,
  listStudents,
  checkEligibility,
} from "@controllers/studentProfile.controller";
import { validate } from "@middleware/validate.middleware";
import { updateStudentProfileSchema } from "@controllers/studentProfile.validation";
import { authenticate, authorize } from "@middleware/auth.middleware";
import { resumeUpload } from "@middleware/upload.middleware";
import { ROLES } from "@constants/roles";

const router = Router();

const studentOnly = authorize(ROLES.STUDENT);
const staffOrRecruiter = authorize(
  ROLES.PLACEMENT_OFFICER,
  ROLES.ADMIN,
  ROLES.RECRUITER
);
const staffOnly = authorize(ROLES.PLACEMENT_OFFICER, ROLES.ADMIN);

// --- Self-service (student) — static routes first ---
router.get("/me", authenticate, studentOnly, getMyProfile);
router.patch(
  "/me",
  authenticate,
  studentOnly,
  validate(updateStudentProfileSchema),
  updateMyProfile
);
router.post("/me/resume", authenticate, studentOnly, resumeUpload, uploadResume);
router.get(
  "/me/eligibility/:jobId",
  authenticate,
  studentOnly,
  checkEligibility
);

// --- Staff / recruiter directory ---
router.get("/", authenticate, staffOnly, listStudents);
router.get("/:id", authenticate, staffOrRecruiter, getStudentById);

export default router;
