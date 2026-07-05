import { Schema, model, Document, Types } from "mongoose";

export interface ICompany extends Document {
  _id: Types.ObjectId;
  recruiter: Types.ObjectId;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  logoUrl?: string;
  location?: string;
  size?: "1-50" | "51-200" | "201-500" | "501-1000" | "1000+";
  foundedYear?: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one company profile per recruiter account
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 150,
    },
    description: { type: String, maxlength: 3000 },
    website: { type: String, trim: true },
    industry: { type: String, trim: true },
    logoUrl: { type: String },
    location: { type: String, trim: true },
    size: {
      type: String,
      enum: ["1-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    foundedYear: { type: Number, min: 1800, max: new Date().getFullYear() },
    // Set by Admin/Placement Officer after verifying the company is legitimate.
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Company = model<ICompany>("Company", companySchema);
