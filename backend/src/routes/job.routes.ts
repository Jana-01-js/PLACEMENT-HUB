import { Router } from "express";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobById,
  listJobs,
  listPendingJobs,
  approveJob,
  rejectJob,
  closeJob,
} from "@controllers/job.controller";
import { validate } from "@middleware/validate.middleware";
import {
  createJobSchema,
  updateJobSchema,
  rejectJobSchema,
} from "@controllers/job.validation";
import { authenticate, authorize } from "@middleware/auth.middleware";
import { ROLES } from "@constants/roles";

const router = Router();

const staff = authorize(ROLES.PLACEMENT_OFFICER, ROLES.ADMIN);
const recruiterOnly = authorize(ROLES.RECRUITER);

// --- Static routes must come before "/:id" ---

// Recruiter: jobs they've posted
router.get("/mine", authenticate, recruiterOnly, getMyJobs);

// Placement Officer / Admin: approval queue
router.get("/pending", authenticate, staff, listPendingJobs);

// Public: browse approved jobs
router.get("/", listJobs);

router.post(
  "/",
  authenticate,
  recruiterOnly,
  validate(createJobSchema),
  createJob
);

// --- Dynamic "/:id" routes ---

router.get("/:id", getJobById); // authenticate is optional here; req.user may be undefined
router.patch(
  "/:id",
  authenticate,
  recruiterOnly,
  validate(updateJobSchema),
  updateJob
);
router.delete("/:id", authenticate, recruiterOnly, deleteJob);
router.patch("/:id/close", authenticate, closeJob); // ownership/staff check happens in controller
router.patch("/:id/approve", authenticate, staff, approveJob);
router.patch(
  "/:id/reject",
  authenticate,
  staff,
  validate(rejectJobSchema),
  rejectJob
);

export default router;
