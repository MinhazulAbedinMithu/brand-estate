import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    action: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  (mongoose.models.AuditLog as Model<IAuditLog>) ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
