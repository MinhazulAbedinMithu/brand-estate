import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IPropertyApplication extends Document {
  propertyId: mongoose.Types.ObjectId;
  propertyTitle: string;
  propertyImage: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  agentOwnerId: mongoose.Types.ObjectId;
  applicationFeePaid: number;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  submittedAt: Date;
  processedAt?: Date;
  feedback?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  stripeRefundId?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  scheduleDate?: string;
  scheduleTime?: string;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyApplicationSchema = new Schema<IPropertyApplication>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    propertyTitle: { type: String, required: true },
    propertyImage: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    agentOwnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicationFeePaid: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'refunded'],
      default: 'pending',
    },
    submittedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    feedback: { type: String, default: '' },
    stripeSessionId: { type: String, unique: true, sparse: true },
    stripePaymentIntentId: { type: String },
    stripeRefundId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    scheduleDate: { type: String },
    scheduleTime: { type: String },
    scheduledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

PropertyApplicationSchema.index({ userId: 1 });
PropertyApplicationSchema.index({ agentOwnerId: 1 });
PropertyApplicationSchema.index({ propertyId: 1 });

export const PropertyApplication: Model<IPropertyApplication> =
  (mongoose.models.PropertyApplication as Model<IPropertyApplication>) ||
  mongoose.model<IPropertyApplication>('PropertyApplication', PropertyApplicationSchema);

