# API Specification — Module 4: Analytics, Settings & Platform

This document details the database models, API endpoints, request payloads, response payloads, and tracking statuses for platform analytics, configuration settings, agent packages, buyer inquiries, document reviews, and super admin operations.

---

## Database Schemas (MongoDB / Mongoose)

### `Inquiry` Model
```typescript
import mongoose, { Schema } from 'mongoose';

const InquirySchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional (null for guest inquiries)
  guestName: { type: String, required: function() { return !this.userId; } },
  guestEmail: { type: String, required: function() { return !this.userId; } },
  guestPhone: { type: String },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied', 'closed'], 
    default: 'new' 
  },
  messages: [{
    senderId: { type: Schema.Types.ObjectId, ref: 'User' }, // Empty if guest
    senderName: { type: String, required: true },
    text: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
```

### `PricingPackage` Model
```typescript
import mongoose, { Schema } from 'mongoose';

const PricingPackageSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // in USD
  maxListings: { type: Number, required: true }, // e.g. 5, 50, or -1 for unlimited
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const PricingPackage = mongoose.models.PricingPackage || mongoose.model('PricingPackage', PricingPackageSchema);
```

### `AuditLog` Model
```typescript
import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  action: { type: String, required: true }, // e.g., "ROLE_UPGRADE", "USER_BAN", "CONFIG_CHANGED"
  ipAddress: { type: String },
  userAgent: { type: String },
  details: { type: String, required: true }
}, { timestamps: true });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
```

---

## API Endpoints & Statuses

### Analytics & System Metrics
| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **Track Listing View** | `POST /api/properties/[id]/view` | `in progress` |
| **Read Agent Dashboard Stats** | `GET /api/analytics/agent` | `in progress` |
| **Read Admin Dashboard Metrics**| `GET /api/analytics/admin` | `in progress` |

### Configuration & Settings
| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **Read Platform Configs** | `GET /api/settings` | `in progress` |
| **Update Global Settings** | `PATCH /api/settings` | `in progress` |
| **Add Region Directories** | `POST /api/settings/regions` | `in progress` |

### Client-Agent Inquiries (Messaging)
| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **Read Inquiries Inbox** | `GET /api/inquiries` | `in progress` |
| **Submit Property Inquiry** | `POST /api/inquiries` | `in progress` |
| **Reply to Inquiry Thread** | `POST /api/inquiries/[id]/reply` | `in progress` |
| **Close / Resolve Inquiry** | `PATCH /api/inquiries/[id]/resolve` | `in progress` |

### Saved Properties (Favorites)
| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **Read Saved Listings** | `GET /api/users/me/saved` | `in progress` |
| **Save Property Listing** | `POST /api/users/me/saved` | `in progress` |
| **Remove Saved Listing** | `DELETE /api/users/me/saved/[id]` | `in progress` |

### Pricing Packages & Stripe Webhooks
| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **Read Active Packages** | `GET /api/packages` | `in progress` |
| **Initiate Checkout Session** | `POST /api/agent/subscribe` | `in progress` |
| **Stripe Webhook Listener** | `POST /api/webhooks/stripe` | `in progress` |

### Verification & Moderation
| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **Submit Agent Credentials** | `POST /api/agent/submit-docs` | `in progress` |
| **Approve / Suspend User** | `PATCH /api/admin/users/[id]/status` | `in progress` |
| **Super Admin Security Audit** | `GET /api/super-admin/audit-logs` | `in progress` |

---

## Key API Specifications (Selected Examples)

### 1. Submit Property Inquiry
Inserts a message. If the user is logged in, binds the inquiry to their user ID. Otherwise, validation requires guest credentials. Sends a Resend notification to the agent.

* **Method / Route**: `POST /api/inquiries`
* **Auth Guard**: Public / None
* **Request Payload (Guest)**:
  ```json
  {
    "propertyId": "60d5ec4934d52c1b9c9f2270",
    "agentId": "60d5ec4934d52c1b9c9f225f",
    "guestName": "Jane R",
    "guestEmail": "jane@example.com",
    "guestPhone": "+1-555-9080",
    "message": "Hi, I would like to schedule a tour for this Sunday."
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f3301",
      "propertyId": "60d5ec4934d52c1b9c9f2270",
      "status": "new",
      "message": "Inquiry submitted successfully."
    }
  }
  ```

---

### 2. Read Agent Dashboard Stats
Provides aggregates of property listing performance metrics for Recharts visual plots.

* **Method / Route**: `GET /api/analytics/agent`
* **Auth Guard**: Authenticated session required (Role: `agent`, `admin`, `super_admin`)
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "stats": {
        "totalListings": 15,
        "activeListings": 12,
        "totalInquiries": 48,
        "newInquiries": 3,
        "totalViews": 2480,
        "totalSaves": 340
      },
      "viewsTimeline": [
        { "date": "2026-06-12", "views": 120, "saves": 8 },
        { "date": "2026-06-13", "views": 150, "saves": 14 }
      ]
    }
  }
  ```

---

### 3. Initiate Subscription Checkout Session
Creates a Stripe checkout link redirecting the agent to pay for premium packages upgrade.

* **Method / Route**: `POST /api/agent/subscribe`
* **Auth Guard**: Authenticated session required (Role: `agent`)
* **Request Payload**:
  ```json
  {
    "packageId": "60d5ec4934d52c1b9c9f44aa"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_mocksessionlink"
  }
  ```

---

### 4. Stripe Webhook Listener
Endpoint called by Stripe to update subscription status of agents upon successful card charging.

* **Method / Route**: `POST /api/webhooks/stripe`
* **Auth Guard**: Public / Stripe signature verification middleware required
* **Success Response (`200 OK`)**:
  ```json
  {
    "received": true
  }
  ```

---

### 5. Submit Agent Credentials
Allows agents to upload licenses/documents. Sets agent account status to `pending`.

* **Method / Route**: `POST /api/agent/submit-docs`
* **Auth Guard**: Authenticated session required (Role: `agent`)
* **Request Payload**:
  ```json
  {
    "licenseNumber": "RE-8890-NY",
    "agencyName": "Elite Properties Group",
    "documentUrl": "https://cdn.brandestate.com/licenses/cert-NY8890.pdf"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Credentials submitted. Account is now pending administrative approval."
  }
  ```
