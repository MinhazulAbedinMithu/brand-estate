import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IWalletTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  relatedUserId?: mongoose.Types.ObjectId;
  amount: number;
  fee: number;
  type: 'deposit' | 'withdraw' | 'transfer_send' | 'transfer_receive' | 'refund_send' | 'refund_receive';
  status: 'pending' | 'completed' | 'rejected';
  description: string;
  stripeSessionId?: string;
  stripePayoutId?: string;
  stripeAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true, default: 0 },
    type: {
      type: String,
      enum: ['deposit', 'withdraw', 'transfer_send', 'transfer_receive', 'refund_send', 'refund_receive'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'rejected'],
      required: true,
      default: 'pending',
    },
    description: { type: String, required: true },
    stripeSessionId: { type: String },
    stripePayoutId: { type: String },
    stripeAccountId: { type: String },
  },
  { timestamps: true }
);

WalletTransactionSchema.index({ userId: 1 });
WalletTransactionSchema.index({ stripeSessionId: 1 });
WalletTransactionSchema.index({ status: 1 });

export const WalletTransaction: Model<IWalletTransaction> =
  (mongoose.models.WalletTransaction as Model<IWalletTransaction>) ||
  mongoose.model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);
