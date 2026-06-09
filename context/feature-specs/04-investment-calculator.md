# 04 — Property Investment & ROI Calculator

## What This Builds
A highly interactive, modern homepage section exactly matches the user's grid layout:
- Top Row (Full Width): Interactive Investment ROI Estimator with price, rent, and appreciation sliders, displaying yield and long-term profit outlook.
- Bottom Row - Left (Half Width): Commercial Zoning Guide showcasing key zones (MU-R, O-C, I-L, W-D) with clickable detailed specs.
- Bottom Row - Right (Half Width): Closing Cost & Tax Breakdown that dynamically scales based on the purchase price selected in the top ROI estimator.

## Inputs / Props
None (Internal state component).

## Acceptance Criteria
- [ ] Responsive grid layout matching the attached image: 1 full-width container on top, 2 equal-width containers on bottom. On mobile/tablet, stacks vertically.
- [ ] Theme Compatibility: Supports both Light Mode (`bg-bg-alt/45`, border-slate-300, slate/blue tones) and Dark Mode (`bg-accent-navy`, `--dark-bg-surface`, glowing border outlines, HSL glassmorphism) out of the box.
- [ ] Interactive ROI Calculations:
  - Sliders for Purchase Price ($100k to $5M), Expected Rent ($500 to $25k), and Appreciation (1% to 15%).
  - Real-time updates for Gross Rental Yield and 10-year Accumulated ROI projection.
- [ ] Connected Cost Breakdown:
  - The closing costs (Transfer Tax, Title Insurance, Legal fees) and annual property taxes dynamically recalculate based on the slider state of the Purchase Price in the top row.
- [ ] Dynamic Zoning Cards:
  - Interactive tabs or clickable list elements for MU-R, O-C, I-L, and W-D zoning codes that display height limits, FAR ratios, and allowed uses.
- [ ] Clean Design Aesthetics: Uses Playfair Display for headers, Montserrat for text, rounded corners (`rounded-3xl` for the grid sections), and micro-animations on interaction.
- [ ] TypeScript: No type errors.

## Out Of Scope
- Persisting calculation parameters to database or user profile (handled in later phases).
- Real zoning lookups or actual local tax verification APIs.

## Implementation Notes
- Use Lucide icons: `Calculator`, `TrendingUp`, `Coins`, `Building2`, `Receipt`, `Info`.
- Import the new section in `app/page.tsx` directly above `CtaSection`.
