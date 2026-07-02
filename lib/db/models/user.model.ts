import mongoose, { Schema, type Document, type Model } from 'mongoose';

// ─────────────────────────────────────────────
// Sub-schemas for Agent Details
// ─────────────────────────────────────────────
const AgentReviewSchema = new Schema(
  {
    id: { type: String, required: true },
    reviewerName: { type: String, required: true },
    reviewerAvatar: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true },
    propertyType: { type: String, required: true },
  },
  { _id: false }
);

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// TypeScript Interface for User Document
// ─────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // bcrypt-hashed
  role: 'auth_user' | 'agent' | 'owner' | 'admin' | 'super_admin';
  avatar: string;
  phone?: string;
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended' | 'unsubmitted';
  suspendedReason?: string;
  legalDocs?: {
    licenseNumber: string;
    agencyName: string;
    documentUrl: string;
    submittedAt: Date;
  };
  nidStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  nidCardNumber?: string;
  nidDocumentUrl?: string;
  nidSubmittedAt?: Date;
  nidRejectionReason?: string;

  // Rejection limit tracking counters
  kycRejectionsCount?: number;
  backgroundRejectionsCount?: number;
  creditRejectionsCount?: number;

  // KYC 3-photo fields
  kycStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  kycDocType?: 'nid' | 'passport' | 'driving_license';
  kycDocNumber?: string;
  kycFrontUrl?: string;
  kycBackUrl?: string;
  kycSelfieUrl?: string;
  kycSubmittedAt?: Date;
  kycRejectionReason?: string;

  // Phone verification
  phoneVerified?: boolean;
  phoneVerificationCode?: string;

  // Background and credit reports
  backgroundReportStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  backgroundReportUrl?: string;
  backgroundReportSubmittedAt?: Date;
  creditReportStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  creditReportUrl?: string;
  creditScore?: number;
  creditReportSubmittedAt?: Date;

  // Address
  addressLine?: string;
  addressCity?: string;
  addressCountry?: string;

  // Wallet
  walletBalance?: number;

  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  savedProperties: mongoose.Types.ObjectId[];
  
  // Agent profile fields
  slug?: string;
  coverImage?: string;
  title?: string;
  bio?: string;
  location?: { city: string; state: string; country: string };
  specializations?: string[];
  languages?: string[];
  yearsExperience?: number;
  activeListings?: number;
  totalSales?: number;
  totalVolume?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Array<{
    id: string;
    reviewerName: string;
    reviewerAvatar: string;
    rating: number;
    comment: string;
    date: string;
    propertyType: string;
  }>;
  socialLinks?: Array<{ platform: string; url: string }>;
  certifications?: string[];

  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Schema Definition
// ─────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['auth_user', 'agent', 'owner', 'admin', 'super_admin'],
      default: 'auth_user',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended', 'unsubmitted'],
      default: 'active',
    },
    suspendedReason: {
      type: String,
    },
    legalDocs: {
      licenseNumber: { type: String },
      agencyName: { type: String },
      documentUrl: { type: String },
      submittedAt: { type: Date },
    },
    nidStatus: {
      type: String,
      enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
      default: 'unsubmitted',
    },
    nidCardNumber: { type: String },
    nidDocumentUrl: { type: String },
    nidSubmittedAt: { type: Date },
    nidRejectionReason: { type: String },

    // KYC 3-photo fields
    kycStatus: {
      type: String,
      enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
      default: 'unsubmitted',
    },
    kycDocType: { type: String, enum: ['nid', 'passport', 'driving_license'] },
    kycDocNumber: { type: String },
    kycFrontUrl: { type: String },
    kycBackUrl: { type: String },
    kycSelfieUrl: { type: String },
    kycSubmittedAt: { type: Date },
    kycRejectionReason: { type: String },

    // Phone verification
    phoneVerified: { type: Boolean, default: false },
    phoneVerificationCode: { type: String },

    // Background and credit reports
    backgroundReportStatus: {
      type: String,
      enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
      default: 'unsubmitted',
    },
    backgroundReportUrl: { type: String },
    backgroundReportSubmittedAt: { type: Date },
    creditReportStatus: {
      type: String,
      enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
      default: 'unsubmitted',
    },
    creditReportUrl: { type: String },
    creditScore: { type: Number },
    creditReportSubmittedAt: { type: Date },

    // Rejection counters
    kycRejectionsCount: { type: Number, default: 0 },
    backgroundRejectionsCount: { type: Number, default: 0 },
    creditRejectionsCount: { type: Number, default: 0 },

    // Address
    addressLine: { type: String, default: '' },
    addressCity: { type: String, default: '' },
    addressCountry: { type: String, default: '' },

    // Wallet
    walletBalance: { type: Number, default: 1000 },

    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    savedProperties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],

    // Agent profile fields
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    specializations: [{ type: String }],
    languages: [{ type: String }],
    yearsExperience: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalVolume: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [AgentReviewSchema],
    socialLinks: [SocialLinkSchema],
    certifications: [{ type: String }],
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Index for fast lookups
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ slug: 1 }, { unique: true, sparse: true });

// ─────────────────────────────────────────────
// Model (guard against recompilation in Next.js hot-reload)
// ─────────────────────────────────────────────
export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
