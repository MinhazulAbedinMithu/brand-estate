# API Specification — Module 2: Properties & Search/Filter Engine

This document details the database models, API endpoints, request payloads, response payloads, and tracking statuses for Property Listings and the Property Discovery Search Engine.

## Database Schema (MongoDB / Mongoose)

To support multi-category property listings (Apartments, Houses, Room Shares, and Commercial properties) while maintaining clean type safety, we implement a **base Mongoose schema** with optional sub-document property blocks matching the categories.

### Property Schema (`Property` Model)
```typescript
import mongoose, { Schema } from 'mongoose';

const GeoPointSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const TaxHistorySchema = new Schema({
  year: { type: Number, required: true },
  taxValue: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' }
}, { _id: false });

const PriceHistorySchema = new Schema({
  date: { type: String, required: true }, // Format "YYYY-MM-DD"
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  event: { 
    type: String, 
    enum: ['listed', 'price_drop', 'price_increase', 'sold', 'rented', 'relisted', 'expired'],
    required: true 
  }
}, { _id: false });

const PropertySEOSchema = new Schema({
  seoTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  ogImageUrl: { type: String, required: true },
  keywords: [{ type: String }]
}, { _id: false });

const ListerProfileSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  agencyName: { type: String, required: true },
  licenseNumber: { type: String },
  agentSlug: { type: String }
}, { _id: false });

// Category Attributes Definitions
const ApartmentAttributesSchema = new Schema({
  floorNumber: { type: Number, required: true },
  totalBuildingFloors: { type: Number, required: true },
  monthlyMaintenanceFee: { type: Number, required: true },
  hasElevator: { type: Boolean, required: true },
  parkingSlotNumber: { type: String, default: null }
}, { _id: false });

const HouseAttributesSchema = new Schema({
  lotSizeAcres: { type: Number, required: true },
  lotSizeSqFt: { type: Number, required: true },
  garageSpacesCount: { type: Number, required: true },
  roofType: { type: String, required: true },
  foundationType: { type: String, required: true },
  heatingCoolingSystem: { type: String, required: true },
  backyardAreaSqFt: { type: Number, required: true }
}, { _id: false });

const RoomShareAttributesSchema = new Schema({
  roomType: { type: String, enum: ['private', 'shared'], required: true },
  bathroomType: { type: String, enum: ['attached', 'common'], required: true },
  currentOccupantsCount: { type: Number, required: true },
  preferredGender: { type: String, enum: ['any', 'male', 'female'], required: true },
  utilitiesIncluded: [{ type: String }],
  minimumLeasePeriodMonths: { type: Number, required: true }
}, { _id: false });

const CommercialAttributesSchema = new Schema({
  zoningCode: { type: String, enum: ['retail', 'office', 'industrial', 'warehouse'], required: true },
  loadingDocksCount: { type: Number, required: true },
  ceilingHeightFt: { type: Number, required: true },
  minimumLeaseTermYears: { type: Number, required: true },
  electricalCapacity: { type: String, required: true }
}, { _id: false });

// Base Property Schema
const PropertySchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  transactionType: { type: String, enum: ['buy', 'rent', 'roommate_share'], required: true },
  propertyCategory: { type: String, enum: ['apartment', 'house', 'room_share', 'commercial'], required: true },

  // Financials
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  taxHistory: [TaxHistorySchema],
  priceHistory: [PriceHistorySchema],

  // Location Metrics
  formattedAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  _geo: { type: GeoPointSchema, required: true },
  neighborhoodNotes: { type: String, default: '' },

  // Core Specs
  squareFeet: { type: Number, required: true },
  squareMeters: { type: Number, required: true }, // Derived dynamically or set at creation
  totalRooms: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  yearBuilt: { type: Number, required: true },

  // Media Assets
  images: [{ type: String, required: true }],
  videoTourUrl: { type: String, default: null },
  virtualTourUrl: { type: String, default: null },

  // Platform Controls
  status: { 
    type: String, 
    enum: ['draft', 'pending_approval', 'active', 'sold', 'rented'], 
    default: 'pending_approval' 
  },
  isFeatured: { type: Boolean, default: false },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Lister
  listerProfile: { type: ListerProfileSchema, required: true },

  // Dynamic SEO
  seo: { type: PropertySEOSchema, required: true },

  // Amenities
  amenities: [{ type: String }],

  // Category Specific Attribute Blocks (Discriminator data)
  apartment: ApartmentAttributesSchema,
  house: HouseAttributesSchema,
  roomShare: RoomShareAttributesSchema,
  commercial: CommercialAttributesSchema

}, { timestamps: true });

export const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
```

---

## API Endpoints & Statuses

| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **0. Database / Schema Design** | Define Mongoose Property schema, add indexes for filters | `in progress` |
| **1. Read Properties (Filtered)** | `GET /api/properties` | `in progress` |
| **2. Read Single Property Details**| `GET /api/properties/[slug]` | `in progress` |
| **3. Create Property Listing** | `POST /api/properties` | `in progress` |
| **4. Update Property Listing** | `PATCH /api/properties/[id]` | `in progress` |
| **5. Delete Property Listing** | `DELETE /api/properties/[id]` | `in progress` |
| **6. Archive / Sell Listing** | `PATCH /api/properties/[id]/archive` | `in progress` |
| **7. Map BBox Geo Search** | `GET /api/properties/map` | `in progress` |

---

## API Endpoint Specifications

### 1. Read Properties (Filtered / Paginated)
Fetches properties list matching dynamic search filters, keyword criteria, sorting options, and pagination offsets. 

* **Method / Route**: `GET /api/properties`
* **Auth Guard**: Public / None
* **Query Parameters**:
  * `category`: `apartment` | `house` | `room_share` | `commercial`
  * `type`: `buy` | `rent` | `roommate_share`
  * `city`: City name filter (e.g. `New York`)
  * `minPrice` / `maxPrice`: Numerical range filter
  * `bedrooms`: Minimum bed count toggle
  * `bathrooms`: Minimum bath count toggle
  * `minSqFt` / `maxSqFt`: Size range filters
  * `search`: text string matching title/description/city (Atlas Search/MongoDB regex)
  * `sortBy`: `price-asc` | `price-desc` | `date-desc` | `default`
  * `page`: integer page offset (default `1`)
  * `limit`: records per page (default `12`)
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "60d5ec4934d52c1b9c9f2270",
        "title": "Hamptons Oceanfront Estate",
        "slug": "hamptons-oceanfront-estate",
        "description": "Luxurious beachfront property with private access...",
        "transactionType": "buy",
        "propertyCategory": "house",
        "price": 4500000,
        "currency": "USD",
        "formattedAddress": "50 Dune Road, East Hampton, NY 11937",
        "city": "East Hampton",
        "state": "NY",
        "zipCode": "11937",
        "squareFeet": 6500,
        "squareMeters": 603.85,
        "bedrooms": 6,
        "bathrooms": 7,
        "images": ["https://cdn.realhoms.com/listings/hamptons-1.jpg"],
        "status": "active",
        "isFeatured": true
      }
    ],
    "pagination": {
      "total": 85,
      "page": 1,
      "pages": 8,
      "limit": 12
    }
  }
  ```

---

### 2. Read Single Property Details
Fetches full property record, lister profile, price/tax timelines, and category spec blocks by its unique URL slug.

* **Method / Route**: `GET /api/properties/[slug]`
* **Auth Guard**: Public / None
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f2270",
      "title": "Hamptons Oceanfront Estate",
      "slug": "hamptons-oceanfront-estate",
      "description": "Luxurious beachfront property...",
      "transactionType": "buy",
      "propertyCategory": "house",
      "price": 4500000,
      "currency": "USD",
      "formattedAddress": "50 Dune Road, East Hampton, NY 11937",
      "city": "East Hampton",
      "_geo": { "lat": 40.942, "lng": -72.195 },
      "taxHistory": [{ "year": 2025, "taxValue": 35000, "currency": "USD" }],
      "priceHistory": [
        { "date": "2026-06-01", "price": 4500000, "currency": "USD", "event": "listed" }
      ],
      "squareFeet": 6500,
      "bedrooms": 6,
      "bathrooms": 7,
      "yearBuilt": 2018,
      "images": ["https://cdn.realhoms.com/listings/hamptons-1.jpg"],
      "videoTourUrl": "https://youtube.com/watch?v=mock",
      "virtualTourUrl": "https://matterport.com/discover/mock",
      "status": "active",
      "isFeatured": true,
      "ownerId": "60d5ec4934d52c1b9c9f225f",
      "listerProfile": {
        "name": "Sarah Connor",
        "avatar": "https://cdn.realhoms.com/agents/sarah.jpg",
        "phone": "+1-555-0199",
        "email": "sarah@realhoms.com",
        "agencyName": "Elite Properties Group",
        "agentSlug": "sarah-connor"
      },
      "seo": {
        "seoTitle": "Luxury Oceanfront Estate for Sale in East Hampton | RealHoms",
        "metaDescription": "Explore this stunning 6-bed oceanfront retreat on Dune Road...",
        "ogImageUrl": "https://cdn.realhoms.com/listings/hamptons-1.jpg",
        "keywords": ["beachfront", "hamptons", "luxury home"]
      },
      "amenities": ["Pool", "Private Beach", "Smart Home", "Hot Tub"],
      "house": {
        "lotSizeAcres": 1.5,
        "lotSizeSqFt": 65340,
        "garageSpacesCount": 3,
        "roofType": "slate",
        "foundationType": "concrete_slab",
        "heatingCoolingSystem": "Carrier Central HVAC",
        "backyardAreaSqFt": 15000
      }
    }
  }
  ```

---

### 3. Create Property Listing
Publishes a new property. Restricts category structure inputs to match the declared `propertyCategory`.

* **Method / Route**: `POST /api/properties`
* **Auth Guard**: Authenticated session required (Role must be `agent`, `admin`, or `super_admin`)
* **Request Payload**:
  ```json
  {
    "title": "Modern Skyline Apartment",
    "description": "Stunning loft apartment in the heart of downtown.",
    "transactionType": "rent",
    "propertyCategory": "apartment",
    "price": 4500,
    "currency": "USD",
    "formattedAddress": "123 Main St, New York, NY 10001",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "squareFeet": 1200,
    "totalRooms": 4,
    "bedrooms": 2,
    "bathrooms": 2,
    "yearBuilt": 2021,
    "images": ["https://cdn.realhoms.com/listings/nyc-loft.jpg"],
    "videoTourUrl": null,
    "virtualTourUrl": null,
    "amenities": ["Elevator", "Gym", "Concierge"],
    "seo": {
      "seoTitle": "Modern Skyline Loft Apartment For Rent in NYC",
      "metaDescription": "View details for this premium 2-bed loft in downtown Manhattan.",
      "ogImageUrl": "https://cdn.realhoms.com/listings/nyc-loft.jpg",
      "keywords": ["rent", "nyc loft", "luxury apartment"]
    },
    "apartment": {
      "floorNumber": 24,
      "totalBuildingFloors": 50,
      "monthlyMaintenanceFee": 250,
      "hasElevator": true,
      "parkingSlotNumber": "P-24A"
    }
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f2299",
      "title": "Modern Skyline Apartment",
      "slug": "modern-skyline-apartment",
      "status": "pending_approval",
      "createdAt": "2026-06-18T00:00:00.000Z"
    }
  }
  ```

---

### 4. Update Property Listing
Updates parameters of an existing listing. Verified users can only modify properties they own.

* **Method / Route**: `PATCH /api/properties/[id]`
* **Auth Guard**: Authenticated session required (Must be Owner or Admin)
* **Request Payload (Partial updates allowed)**:
  ```json
  {
    "price": 4200,
    "description": "Updated description: Beautiful high floor loft...",
    "amenities": ["Elevator", "Gym", "Concierge", "Rooftop Deck"]
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f2299",
      "price": 4200,
      "status": "pending_approval",
      "updatedAt": "2026-06-18T00:05:00.000Z"
    }
  }
  ```

---

### 5. Delete Property Listing
Permanently purges a listing.

* **Method / Route**: `DELETE /api/properties/[id]`
* **Auth Guard**: Authenticated session required (Must be Owner or Admin)
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Property listing deleted successfully."
  }
  ```

---

### 6. Archive / Sell Listing
Instantly transitions the status state of a listing to sold, rented, or archived.

* **Method / Route**: `PATCH /api/properties/[id]/archive`
* **Auth Guard**: Authenticated session required (Must be Owner or Admin)
* **Request Payload**:
  ```json
  {
    "status": "sold"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f2299",
      "status": "sold"
    }
  }
  ```

---

### 7. Map BBox Geo Search
Performs bounding box checks using coordinate vertices to display properties on interactive map zones.

* **Method / Route**: `GET /api/properties/map`
* **Auth Guard**: Public / None
* **Query Parameters**:
  * `neLat`, `neLng`: North-East vertex latitudes/longitudes
  * `swLat`, `swLng`: South-West vertex latitudes/longitudes
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "count": 1,
    "data": [
      {
        "id": "60d5ec4934d52c1b9c9f2299",
        "title": "Modern Skyline Apartment",
        "_geo": { "lat": 40.7128, "lng": -74.0060 },
        "price": 4200,
        "transactionType": "rent",
        "propertyCategory": "apartment"
      }
    ]
  }
  ```

---

## Form UI Updates: Category-Specific Attributes

To align the wizard form UI with the database schema definitions, we update the Specs and Details panel (Step 3) in both the Listing Creation Wizard and Listing Edit forms to capture these fields:

### 1. Apartment Attributes
* `floorNumber` (Integer, required)
* `totalBuildingFloors` (Integer, required)
* `monthlyMaintenanceFee` (Integer, required, defaults to 0)
* `hasElevator` (Boolean toggle)
* `parkingSlotNumber` (String, optional, null if none)

### 2. House Attributes
* `lotSizeAcres` (Float, required)
* `lotSizeSqFt` (Integer, required)
* `garageSpacesCount` (Integer, required, defaults to 0)
* `roofType` (Select: `asphalt_shingle`, `metal`, `clay_tile`, `flat`, `slate`, `wood_shake`)
* `foundationType` (Select: `concrete_slab`, `crawl_space`, `full_basement`, `pier_and_beam`, `stem_wall`)
* `heatingCoolingSystem` (String, required)
* `backyardAreaSqFt` (Integer, required, defaults to 0)

### 3. Room Share Attributes
* `roomType` (Select: `private`, `shared`)
* `bathroomType` (Select: `attached`, `common`)
* `currentOccupantsCount` (Integer, required, defaults to 0)
* `preferredGender` (Select: `any`, `male`, `female`)
* `utilitiesIncluded` (Checkboxes: `wifi`, `gas`, `water`, `electricity`, `cable`, `trash`)
* `minimumLeasePeriodMonths` (Integer, required, defaults to 1)

### 4. Commercial Attributes
* `zoningCode` (Select: `retail`, `office`, `industrial`, `warehouse`)
* `loadingDocksCount` (Integer, required, defaults to 0)
* `ceilingHeightFt` (Integer, required)
* `minimumLeaseTermYears` (Integer, required, defaults to 1)
* `electricalCapacity` (String, required)

