# 00 — Mock Listing Data

## What This Builds
A high-fidelity, comprehensive mock dataset and TypeScript type system that serves as the "Source of Truth" for property listings on the RealHoms SaaS platform. It provides realistic property listings across four distinct property categories with rich details (Mapbox coordinates, lister profiles, amenities, utilities, and environmental risk factors) for use in the frontend UI discovery experience.

## Data Structures & Interfaces

The mock data is structured using a base interface and four extending discriminator interfaces:

### 1. Common Types
- **`ListerProfile`**: Agent or broker contact details (`name`, `avatar`, `phone`, `email`, `agencyName`).
- **`PropertyLocation`**: Geographic address details (`street`, `city`, `state`, `zip`) along with exact Mapbox-compatible coordinate structures (`lat`, `lng`).
- **`ParkingConfig`**: Parking options (`type`: garage/driveway/street/etc., `spaces` count).
- **`UtilitiesConfig`**: Active utility flags (`water`, `gas`, `internet`).
- **`RiskFactors`**: Environmental ratings (`climateZone`, `fireRisk`: low/medium/high, `floodZone` boolean).

### 2. Base Property Interface (`BaseProperty`)
Includes core fields common to all real estate listings:
- `id`, `title`, `description`, `price`, `transactionType` ("buy" | "rent")
- `location` (`PropertyLocation`), `yearBuilt`, `agentCommissionPercent`
- `listerProfile` (`ListerProfile`), `rooms` count, `washrooms` count, `balconies` count
- `parking` (`ParkingConfig`), `utilities` (`UtilitiesConfig`), `riskFactors` (`RiskFactors`)
- `images` (Unsplash array), `floorPlanUrl`

### 3. Discriminator Interfaces
- **`Apartment`**: Extends base with `floorNumber`, `hasElevator`, and `monthlyHOAFees`.
- **`House`**: Extends base with `lotSizeSqFt`, `hasBasement`, and `stories` count.
- **`RoomShare`**: Extends base with `roommateCount`, `isPrivateBath`, and `genderPreference` ("any" | "female" | "male").
- **`Commercial`**: Extends base with `zoningType` (Retail/Office/Industrial/Mixed-use), `hasLoadingDock`, and `businessLicenseRequired`.

## Acceptance Criteria
- [x] TypeScript: Define base and discriminator interfaces in [propertiesMock.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/src/mocks/propertiesMock.ts).
- [x] Data Volume: Export a `mockProperties` array containing at least 8 highly detailed objects.
- [x] Discriminator Coverage: The dataset must contain exactly:
  - 2 Apartments (1 buy, 1 rent)
  - 2 Houses (2 buy)
  - 2 RoomShares (2 rent)
  - 2 Commercial listings (1 buy, 1 rent)
- [x] Geographic Coordinates: All listings must have valid latitudes and longitudes mapping to real cities (New York, Malibu, London, Berlin, Tokyo, Toronto, Sydney, Chicago).
- [x] High-Quality Media: Each listing must feature responsive Unsplash images of real estate interiors/exteriors.
- [x] Build Safety: Ensure zero compilation or type-checking errors in the project after mock data creation.

## Out Of Scope
- Live API integrations or backend fetch operations (mock data is static in Phase 1).
- Live Mapbox map rendering (Mapbox UI is deferred to map component integration).
- Real agent CRM logins (lister profiles are statically embedded).

## Implementation Notes
- The mock data array must be named `mockProperties` and exported from [propertiesMock.ts](file:///Users/minhaz/Documents/projects/brand/brand-estate/src/mocks/propertiesMock.ts).
- Ensure image assets load from reliable Unsplash photo IDs using standard query formatting parameters (`?auto=format&fit=crop&w=1200&q=80`).
