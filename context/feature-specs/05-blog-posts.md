# 05 — Blog Post Schema, Mock Data & UI Components

## What This Builds
A high-fidelity TypeScript schema, a rich mock dataset, and the complete blog UI section for the Brand Estate SaaS platform. This includes:
1. **Blog Card Component**: Reusable card displaying post summary, category badge, and metadata.
2. **Homepage Blogs Section**: Beautiful 3-column row displaying featured articles with a link to the main blog page.
3. **Blog List Page (`/blogs`)**: An index page with search capabilities, category-based tabs, and a responsive article grid.
4. **Blog Details Page (`/blogs/[slug]`)**: A premium article reader template with structured JSON-LD SEO metadata injection, a detailed sidebar, sharing widgets, and recommended related reads.

## Data Structures & Interfaces

The mock data is structured using the following schemas:

### 1. `BlogAuthor`
- `name`: string (Full name of author)
- `avatar`: string (Unsplash avatar URL)
- `role`: string (e.g., "Senior Real Estate Editor", "Investment Strategist")
- `bio`: string (Optional brief biography)

### 2. `BlogSEO`
- `title`: string (Custom title tag)
- `metaDescription`: string (Meta description optimized for CTR)
- `keywords`: string[] (Target keywords for the article)
- `ogImage`: string (Open Graph card image URL)
- `canonicalUrl`: string (Canonical URL)

### 3. `BlogPost`
- `id`: string (Unique post ID)
- `title`: string (Catchy, SEO-optimized title)
- `slug`: string (URL-friendly string)
- `content`: string (Rich text / markdown content of the article)
- `excerpt`: string (Short summary, 150-160 characters)
- `coverImage`: string (Featured image URL)
- `category`: 'market-trends' | 'buying-guide' | 'selling-guide' | 'investment' | 'lifestyle'
- `tags`: string[] (Relevant taxonomy tags)
- `author`: `BlogAuthor` (Embedded author profile)
- `publishedAt`: string (ISO 8601 date string)
- `updatedAt`: string (Optional ISO 8601 date string)
- `readTimeMinutes`: number (Estimated reading time)
- `isFeatured`: boolean (Feature on homepage/insights page)
- `seo`: `BlogSEO` (SEO-specific metadata fields)

## SEO JSON-LD Helpers

To satisfy search engines (Google, Bing, Yahoo), a structured schema helper is required:
- `generateBlogPostJsonLd(post: BlogPost)`: Generates `BlogPosting` Schema.org compliant structured data objects for inclusion in Next.js metadata schemas.

## Acceptance Criteria
- [x] **TypeScript Schema**: Define all blog types in `src/mocks/blogTypes.ts` (or `lib/types.ts`) and export them.
- [x] **Mock Articles**: Export `mockBlogPosts` array with at least 5 highly detailed and realistic articles focusing on real estate topics.
- [x] **JSON-LD Schema Helper**: Implement a utility function to generate Schema.org `BlogPosting` JSON-LD payload.
- [ ] **Blog Card Component**:
  - Image hover zoom animation and glassmorphic overlay details.
  - Category tag with distinctive theme color.
  - Hover micro-interactions (e.g. read arrow shift).
- [ ] **Homepage Blog Section**:
  - Displays a grid of the 3 latest or featured articles.
  - High-impact visual headers with a primary "Explore All Articles" button.
- [ ] **Blog List Page (`/blogs`)**:
  - Text search filter to query titles, excerpts, and keywords.
  - Category tabs to filter posts dynamically.
  - Responsive layout (grid scales from 1 column on mobile to 3 columns on desktop).
  - Handles `/blogs` page as a redirect to `/blogs` or supports both to resolve navigation inconsistencies.
- [ ] **Blog Details Page (`/blogs/[slug]`)**:
  - Automatically loads dynamic metadata (SEO title, description, keywords).
  - Inject the structured `BlogPosting` JSON-LD tag in the page markup.
  - Premium article presentation: readable text layout, callout block styling, blockquotes, and ordered/unordered lists.
  - Two-column layout on desktop: sidebar featuring author bio, social sharing triggers, and subscription card.
  - "Related Articles" section at the bottom displaying 3 recommended posts.
- [ ] **Build Stability**: Zero compilation errors or TypeScript/eslint warnings.

## Out Of Scope
- Actual database storage or dynamic CMS integrations (mock data is static in Phase 1).
- Live newsletter API integrations (form handles client-side success simulation only).

## Implementation Notes
- The mock data array must be named `mockBlogPosts` and exported from `src/mocks/blogPostsMock.ts`.
- Ensure all target keywords are highly relevant to high-intent real estate transactions.
- Use Unsplash images optimized for high-performance loading.

