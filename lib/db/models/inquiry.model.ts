import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IInquiryMessage {
  senderId?: mongoose.Types.ObjectId;
  senderName: string;
  text: string;
  sentAt: Date;
}

export interface IInquiry extends Document {
  propertyId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  messages: IInquiryMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional (null for guest inquiries)
    guestName: {
      type: String,
      required: function (this: IInquiry) {
        return !this.userId;
      },
    },
    guestEmail: {
      type: String,
      required: function (this: IInquiry) {
        return !this.userId;
      },
    },
    guestPhone: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new',
    },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User' }, // Empty if guest
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes
InquirySchema.index({ agentId: 1 });
InquirySchema.index({ propertyId: 1 });
InquirySchema.index({ userId: 1 });

export const Inquiry: Model<IInquiry> =
  (mongoose.models.Inquiry as Model<IInquiry>) ||
  mongoose.model<IInquiry>('Inquiry', InquirySchema);
