import mongoose, { Schema, type Document, type Model } from 'mongoose';

// ─────────────────────────────────────────────
// Sub-schemas for Author and SEO details
// ─────────────────────────────────────────────
const BlogAuthorSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: '' },
  },
  { _id: false }
);

const BlogSEOSchema = new Schema(
  {
    title: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keywords: [{ type: String }],
    ogImage: { type: String, required: true },
    ogType: { type: String, enum: ['article', 'website'], default: 'article' },
    canonicalUrl: { type: String, default: '' },
    ogTitle: { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// TypeScript Interface for Mongoose Document
// ─────────────────────────────────────────────
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: 'market-trends' | 'buying-guide' | 'selling-guide' | 'investment' | 'lifestyle';
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
    bio?: string;
  };
  authorId: mongoose.Types.ObjectId;
  authorRole: 'guest' | 'auth_user' | 'agent' | 'admin' | 'super_admin';
  isFeatured: boolean;
  readTimeMinutes: number;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  rejectionReason?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactions: any;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    ogType: 'article' | 'website';
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    noIndex: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// BlogPost Schema Definition
// ─────────────────────────────────────────────
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [200, 'Excerpt cannot exceed 200 characters'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    category: {
      type: String,
      enum: ['market-trends', 'buying-guide', 'selling-guide', 'investment', 'lifestyle'],
      required: [true, 'Category is required'],
    },
    tags: [{ type: String }],
    author: {
      type: BlogAuthorSchema,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorRole: {
      type: String,
      enum: ['guest', 'auth_user', 'agent', 'admin', 'super_admin'],
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    readTimeMinutes: {
      type: Number,
      required: true,
      default: 5,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    reactions: {
      type: Map,
      of: Number,
      default: {
        '🔥': 0,
        '❤️': 0,
        '👏': 0,
        '💡': 0,
        '😮': 0,
        '🚀': 0,
      },
    },
    seo: {
      type: BlogSEOSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ status: 1 });
BlogPostSchema.index({ authorId: 1 });

// ─────────────────────────────────────────────
// Export Model
// ─────────────────────────────────────────────
export const BlogPost: Model<IBlogPost> =
  (mongoose.models.BlogPost as Model<IBlogPost>) ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
