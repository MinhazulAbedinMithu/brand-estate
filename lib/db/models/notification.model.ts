import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'application_schedule' | 'application_status' | 'wallet_deposit' | 'wallet_withdraw' | 'general';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['application_schedule', 'application_status', 'wallet_deposit', 'wallet_withdraw', 'general'],
      required: true,
      default: 'general',
    },
    read: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ read: 1 });

export const Notification: Model<INotification> =
  (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>('Notification', NotificationSchema);
