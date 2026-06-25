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
      sparse: true,
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
