import mongoose, { Schema, type Document, type Model } from 'mongoose';

// ─────────────────────────────────────────────
// TypeScript Interface for User Document
// ─────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // bcrypt-hashed
  role: 'auth_user' | 'agent' | 'admin' | 'super_admin';
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
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Schema Definition (matches module-1-auth.md spec exactly)
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
      enum: ['auth_user', 'agent', 'admin', 'super_admin'],
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
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Index on verificationToken and resetPasswordToken for fast lookups
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

// ─────────────────────────────────────────────
// Model (guard against recompilation in Next.js hot-reload)
// ─────────────────────────────────────────────
export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
