import { Schema, model, Document, Types } from "mongoose";

interface IProject {
  title: string;
  description?: string;
  link?: string;
  techStack?: string[];
}

interface ICertification {
  name: string;
  issuer?: string;
  issueDate?: Date;
  credentialUrl?: string;
}

interface IInternship {
  company: string;
  role: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

interface IAchievement {
  title: string;
  description?: string;
  date?: Date;
}

export interface IStudentProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  phone?: string;
  bio?: string;
  department: string;
  graduationYear: number;
  cgpa?: number;
  activeBacklogs: number;
  skills: string[];
  projects: IProject[];
  certifications: ICertification[];
  internships: IInternship[];
  achievements: IAchievement[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeOriginalName?: string;
  resumeUpdatedAt?: Date;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, maxlength: 1000 },
    link: { type: String },
    techStack: [{ type: String }],
  },
  { _id: false }
);

const certificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true, maxlength: 150 },
    issuer: { type: String, maxlength: 150 },
    issueDate: { type: Date },
    credentialUrl: { type: String },
  },
  { _id: false }
);

const internshipSchema = new Schema<IInternship>(
  {
    company: { type: String, required: true, maxlength: 150 },
    role: { type: String, required: true, maxlength: 150 },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, maxlength: 1000 },
  },
  { _id: false }
);

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, maxlength: 500 },
    date: { type: Date },
  },
  { _id: false }
);

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String, trim: true },
    bio: { type: String, maxlength: 1000 },
    department: { type: String, required: true, trim: true },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, min: 0, max: 10 },
    activeBacklogs: { type: Number, min: 0, default: 0 },
    skills: [{ type: String, trim: true }],
    projects: [projectSchema],
    certifications: [certificationSchema],
    internships: [internshipSchema],
    achievements: [achievementSchema],
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    resumeUrl: { type: String },
    resumeOriginalName: { type: String },
    resumeUpdatedAt: { type: Date },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

studentProfileSchema.index({ department: 1, graduationYear: 1 });
studentProfileSchema.index({ skills: 1 });

// A profile is "complete" once the fields recruiters/placement officers care
// most about are filled in. Recomputed on every save so it never drifts.
studentProfileSchema.pre("save", function (next) {
  this.profileCompleted = Boolean(
    this.department &&
      this.graduationYear &&
      this.cgpa !== undefined &&
      this.skills.length > 0 &&
      this.resumeUrl
  );
  next();
});

export const StudentProfile = model<IStudentProfile>(
  "StudentProfile",
  studentProfileSchema
);
