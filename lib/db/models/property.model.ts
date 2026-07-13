import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { 
  BaseProperty, 
  ApartmentAttributes, 
  HouseAttributes, 
  RoomShareAttributes, 
  CommercialAttributes
} from '@/src/mocks/propertyTypes';

// ─────────────────────────────────────────────
// TypeScript Interface for Property Document
// ─────────────────────────────────────────────
export interface IProperty extends Omit<BaseProperty, 'id' | 'ownerId'>, Document {
  ownerId: mongoose.Types.ObjectId;
  views?: number;
  createdAt: Date;
  updatedAt: Date;

  // Pending update overlay — stores proposed changes until admin approves
  hasPendingUpdate?: boolean;
  pendingUpdate?: Record<string, unknown> & { submittedAt?: Date };

  apartment?: ApartmentAttributes;
  house?: HouseAttributes;
  roomShare?: RoomShareAttributes;
  commercial?: CommercialAttributes;
}

// ─────────────────────────────────────────────
// Schema Definition
// ─────────────────────────────────────────────
const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    transactionType: { 
      type: String, 
      enum: ['buy', 'rent', 'roommate_share'], 
      required: true 
    },
    propertyCategory: { 
      type: String, 
      enum: ['apartment', 'house', 'room_share', 'commercial'], 
      required: true 
    },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    taxHistory: [
      {
        year: { type: Number, required: true },
        taxValue: { type: Number, required: true },
        currency: { type: String, required: true, default: 'USD' },
      }
    ],
    priceHistory: [
      {
        date: { type: String, required: true },
        price: { type: Number, required: true },
        currency: { type: String, required: true, default: 'USD' },
        event: {
          type: String,
          enum: ['listed', 'price_drop', 'price_increase', 'sold', 'rented', 'relisted', 'expired'],
          required: true
        }
      }
    ],
    formattedAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "United States" },
    zipCode: { type: String, required: true },
    _geo: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    neighborhoodNotes: { type: String, default: '' },
    squareFeet: { type: Number, required: true },
    squareMeters: { type: Number, required: true },
    totalRooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    yearBuilt: { type: Number, required: true },
    images: [{ type: String, required: true }],
    videoTourUrl: { type: String, default: null },
    virtualTourUrl: { type: String, default: null },
    status: { 
      type: String, 
      enum: ['draft', 'pending_approval', 'active', 'rejected', 'sold', 'rented'], 
      default: 'pending_approval' 
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    listerProfile: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      agencyName: { type: String, required: true },
      licenseNumber: { type: String },
      agentSlug: { type: String }
    },
    seo: {
      seoTitle: { type: String, required: true },
      metaDescription: { type: String, required: true },
      ogImageUrl: { type: String, required: true },
      keywords: [{ type: String }]
    },
    amenities: [{ type: String }],
    
    // Category specific
    apartment: {
      floorNumber: { type: Number },
      totalBuildingFloors: { type: Number },
      monthlyMaintenanceFee: { type: Number },
      hasElevator: { type: Boolean },
      parkingSlotNumber: { type: String, default: null }
    },
    house: {
      lotSizeAcres: { type: Number },
      lotSizeSqFt: { type: Number },
      garageSpacesCount: { type: Number },
      roofType: { type: String },
      foundationType: { type: String },
      heatingCoolingSystem: { type: String },
      backyardAreaSqFt: { type: Number }
    },
    roomShare: {
      roomType: { type: String, enum: ['private', 'shared'] },
      bathroomType: { type: String, enum: ['attached', 'common'] },
      currentOccupantsCount: { type: Number },
      preferredGender: { type: String, enum: ['any', 'male', 'female'] },
      utilitiesIncluded: [{ type: String }],
      minimumLeasePeriodMonths: { type: Number }
    },
    commercial: {
      zoningCode: { type: String, enum: ['retail', 'office', 'industrial', 'warehouse'] },
      loadingDocksCount: { type: Number },
      ceilingHeightFt: { type: Number },
      minimumLeaseTermYears: { type: Number },
      electricalCapacity: { type: String }
    },

    // ── Pending Update Overlay ──────────────────────────────
    hasPendingUpdate: { type: Boolean, default: false },
    pendingUpdate: { type: Schema.Types.Mixed, default: null },

    // ── Fees, Deposits & Policies ───────────────────────────
    applicationFeeRequired: { type: Boolean, default: false },
    applicationFee: { type: Number, default: 0 },
    depositRequired: { type: Boolean, default: false },
    depositAmount: { type: Number, default: 0 },
    petsAllowed: { type: Boolean, default: false },
    petAllowanceCharge: { type: Number, default: 0 },
    outdoorFacilities: [
      {
        facilityType: { type: String, required: true },
        distance: { type: String, required: true }
      }
    ],
  },
  {
    timestamps: true
  }
);

// ─────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────
PropertySchema.index({ slug: 1 }, { unique: true });
PropertySchema.index({ status: 1 });
PropertySchema.index({ ownerId: 1 });
PropertySchema.index({ city: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ bedrooms: 1 });
PropertySchema.index({ bathrooms: 1 });
PropertySchema.index({ transactionType: 1, propertyCategory: 1 });

// ─────────────────────────────────────────────
// Model (guard against recompilation in Next.js hot-reload)
// ─────────────────────────────────────────────
export const Property: Model<IProperty> =
  (mongoose.models.Property as Model<IProperty>) ||
  mongoose.model<IProperty>('Property', PropertySchema);
