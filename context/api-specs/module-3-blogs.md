# API Specification — Module 3: Blog-Related APIs

This document details the database models, API endpoints, request payloads, response payloads, and tracking statuses for the Blog CMS (Content Management System) and Articles Reader.

## Database Schema (MongoDB / Mongoose)

### `BlogPost` Model
```typescript
import mongoose, { Schema } from 'mongoose';

const BlogAuthorSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  role: { type: String, required: true }, // e.g. "Senior Market Analyst"
  bio: { type: String, default: '' }
}, { _id: false });

const BlogSEOSchema = new Schema({
  title: { type: String, required: true },
  metaDescription: { type: String, required: true },
  keywords: [{ type: String }],
  ogImage: { type: String, required: true },
  ogType: { type: String, enum: ['article', 'website'], default: 'article' },
  canonicalUrl: { type: String, default: '' },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  noIndex: { type: Boolean, default: false }
}, { _id: false });

const BlogPostSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  content: { type: String, required: true }, // Rich Markdown text
  excerpt: { type: String, required: true, maxlength: 200 },
  coverImage: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['market-trends', 'buying-guide', 'selling-guide', 'investment', 'lifestyle'], 
    required: true 
  },
  tags: [{ type: String }],
  author: { type: BlogAuthorSchema, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorRole: { 
    type: String, 
    enum: ['guest', 'auth_user', 'agent', 'admin', 'super_admin'],
    required: true 
  },
  isFeatured: { type: Boolean, default: false },
  readTimeMinutes: { type: Number, required: true, default: 5 },
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'published', 'rejected'], 
    default: 'pending' 
  },
  rejectionReason: { type: String, default: '' },
  reactions: {
    type: Map,
    of: Number,
    default: {
      like: 0,
      heart: 0,
      fire: 0,
      clap: 0
    }
  },
  seo: { type: BlogSEOSchema, required: true }
}, { timestamps: true });

export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
```

---

## API Endpoints & Statuses

| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **0. Database / Schema Design** | Define BlogPost Schema, slug indexes | `in progress` |
| **1. Read Blog Posts (Filtered)** | `GET /api/blogs` | `in progress` |
| **2. Read Single Blog Detail** | `GET /api/blogs/[slug]` | `in progress` |
| **3. Create Blog Draft / Post** | `POST /api/blogs` | `in progress` |
| **4. Edit Blog Post** | `PUT /api/blogs/[id]` | `in progress` |
| **5. Delete Blog Post** | `DELETE /api/blogs/[id]` | `in progress` |
| **6. Submit Blog Reaction** | `POST /api/blogs/[id]/react` | `in progress` |

---

## API Endpoint Specifications

### 1. Read Blog Posts (Filtered / Paginated)
Fetches blogs list matching category filtering, topic tags, and search keywords. Includes pagination metrics.

* **Method / Route**: `GET /api/blogs`
* **Auth Guard**: Public / None
* **Query Parameters**:
  * `category`: `market-trends` | `buying-guide` | `selling-guide` | `investment` | `lifestyle`
  * `tag`: Specific topic tag string
  * `search`: keyword string matching title, content, or tags
  * `page`: integer page offset (default `1`)
  * `limit`: records per page (default `10`)
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "60d5ec4934d52c1b9c9f22c0",
        "title": "Navigating Interest Rate Shifts in 2026",
        "slug": "navigating-interest-rate-shifts-2026",
        "excerpt": "A comprehensive analysis of mortgage rate forecasts and buyer tactics.",
        "coverImage": "https://cdn.brandestate.com/blogs/rates-cover.jpg",
        "category": "market-trends",
        "tags": ["mortgage", "rates", "buying"],
        "author": {
          "name": "Marcus Vance",
          "avatar": "https://cdn.brandestate.com/authors/marcus.jpg",
          "role": "Chief Economist"
        },
        "publishedAt": "2026-06-15T00:00:00.000Z",
        "readTimeMinutes": 5,
        "isFeatured": true,
        "reactions": {
          "like": 14,
          "heart": 8,
          "fire": 21,
          "clap": 4
        }
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "pages": 2,
      "limit": 10
    }
  }
  ```

---

### 2. Read Single Blog Detail
Fetches full blog content matching dynamic URL slug. Returns Schema.org JSON-LD generation variables.

* **Method / Route**: `GET /api/blogs/[slug]`
* **Auth Guard**: Public / None
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f22c0",
      "title": "Navigating Interest Rate Shifts in 2026",
      "slug": "navigating-interest-rate-shifts-2026",
      "content": "# Navigating Interest Rate Shifts\n\nInterest rates have shifted again. Here is what that means for your purchasing power...\n\n```math\nMonthlyPayment = P \\cdot \\frac{r(1+r)^n}{(1+r)^n - 1}\n```",
      "excerpt": "A comprehensive analysis of mortgage rate forecasts and buyer tactics.",
      "coverImage": "https://cdn.brandestate.com/blogs/rates-cover.jpg",
      "category": "market-trends",
      "tags": ["mortgage", "rates", "buying"],
      "author": {
        "name": "Marcus Vance",
        "avatar": "https://cdn.brandestate.com/authors/marcus.jpg",
        "role": "Chief Economist",
        "bio": "Marcus Vance has over 15 years analyzing global real estate movements."
      },
      "authorId": "60d5ec4934d52c1b9c9f22aa",
      "authorRole": "agent",
      "readTimeMinutes": 5,
      "isFeatured": true,
      "reactions": {
        "like": 14,
        "heart": 8,
        "fire": 21,
        "clap": 4
      },
      "seo": {
        "title": "Navigating Mortgage Interest Rates Forecasts | Brand Estate",
        "metaDescription": "Detailed analysis of interest rates and real estate purchasing decisions.",
        "keywords": ["mortgage rates", "market 2026", "house purchase"],
        "ogImage": "https://cdn.brandestate.com/blogs/rates-cover.jpg",
        "ogType": "article"
      },
      "publishedAt": "2026-06-15T00:00:00.000Z"
    }
  }
  ```

---

### 3. Create Blog Draft / Post
Creates a new blog entry. Post starts as `pending` or `draft` status depending on author role.

* **Method / Route**: `POST /api/blogs`
* **Auth Guard**: Authenticated session required (Role must be `agent`, `admin`, or `super_admin`)
* **Request Payload**:
  ```json
  {
    "title": "5 Tips For Selling Your House Quickly",
    "content": "Selling your house can be stressful, but these 5 tips will help you speed up the process...",
    "excerpt": "Get your house ready for sale with these five easy-to-follow staging and pricing tips.",
    "coverImage": "https://cdn.brandestate.com/blogs/selling-tips.jpg",
    "category": "selling-guide",
    "tags": ["selling", "home design", "staging"],
    "readTimeMinutes": 4,
    "status": "pending",
    "seo": {
      "title": "5 Tips For Staging & Selling Your House Quickly | Brand Estate",
      "metaDescription": "Learn how to stage your home, set the right price, and attract cash buyers quickly.",
      "keywords": ["home staging", "sell fast", "real estate tips"],
      "ogImage": "https://cdn.brandestate.com/blogs/selling-tips.jpg"
    }
  }
  ```
* **Success Response (`21 Created`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f22d9",
      "title": "5 Tips For Selling Your House Quickly",
      "slug": "5-tips-for-selling-your-house-quickly",
      "status": "pending"
    }
  }
  ```

---

### 4. Edit Blog Post
Modifies a blog entry. Verified authors can only modify their own posts.

* **Method / Route**: `PUT /api/blogs/[id]`
* **Auth Guard**: Authenticated session required (Must be Author or Admin)
* **Request Payload**:
  ```json
  {
    "title": "5 Advanced Tips For Selling Your House Quickly",
    "content": "Staging is only step one. Let's look at advanced digital marketing campaigns...",
    "status": "pending"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f22d9",
      "title": "5 Advanced Tips For Selling Your House Quickly",
      "status": "pending",
      "updatedAt": "2026-06-18T01:00:00.000Z"
    }
  }
  ```

---

### 5. Delete Blog Post
Deletes a blog post document.

* **Method / Route**: `DELETE /api/blogs/[id]`
* **Auth Guard**: Authenticated session required (Must be Author or Admin)
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Blog post deleted successfully."
  }
  ```

---

### 6. Submit Blog Reaction
Registers likes, claps, or other audience emoji reactions. Increments the sub-field map key.

* **Method / Route**: `POST /api/blogs/[id]/react`
* **Auth Guard**: Public / None
* **Request Payload**:
  ```json
  {
    "reactionType": "fire"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "reactions": {
        "like": 14,
        "heart": 8,
        "fire": 22,
        "clap": 4
      }
    }
  }
  ```
* **Error Response (`400 Bad Request` / Invalid Reaction Key)**:
  ```json
  {
    "status": "error",
    "error": "InvalidReactionType",
    "message": "The requested reaction type is not supported. Supported: like, heart, fire, clap."
  }
  ```
