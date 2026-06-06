# Development Workflow — Spec-Driven

## Approach

Brand Estate is built using a spec-driven, incremental workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

Every implementation unit starts from a feature spec in `context/feature-specs/`. No code is written without a corresponding spec being defined first.

## Spec-Driven Cycle

```
1. Define the feature spec in context/feature-specs/
2. Review the spec with the user if scope is unclear
3. Implement the spec incrementally
4. Verify the implementation (visual check, lint, type check)
5. Update progress-tracker.md
6. Move to the next spec
```

## Scoping Rules

- Work on **one feature spec file at a time**.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.
- One spec = one PR or one logical commit group.

## When To Split Work

Split an implementation step if it combines:

- A page shell and an interactive feature on the same page
- Multiple unrelated components from different domain families
- Backend-layer concerns and frontend UI concerns
- Behavior that is not clearly defined in the context files

If a change cannot be verified visually in the browser within a few minutes of completion, the scope is too broad — split it.

## Feature Spec Format

Each spec file in `context/feature-specs/` follows this structure:

```markdown
# [NN] — Feature Name

## What This Builds
Short description of the page, component, or system being built.

## Inputs / Props
What data the component or page receives (mock data shape or typed interface).

## Acceptance Criteria
- [ ] Specific, verifiable behavior that must be true when done.
- [ ] Visual check: what it should look like.
- [ ] TypeScript: no type errors.
- [ ] Responsive: works at 375px and 1280px.

## Out Of Scope
What this spec does NOT cover (important to avoid scope creep).

## Implementation Notes
Any specific instructions, token names, or library calls to use.
```

## Spec Numbering Convention

| Range      | Domain                             |
| ---------- | ---------------------------------- |
| 01–09      | Design system and foundations      |
| 10–19      | Public pages (homepage, search, detail) |
| 20–29      | Auth pages (login, register, reset)|
| 30–39      | User dashboard                     |
| 40–49      | Agent workspace                    |
| 50–59      | Admin panel                        |
| 60–69      | Super admin panel                  |
| 70–79      | Shared components and utilities    |
| 80–99      | Backend phase (API, DB, auth)      |

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, ask the user and then update the relevant spec before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed.

This includes:
- `components/ui/*` (shadcn/ui components)
- Third-party library internals

Project-specific styling, layout changes, and feature logic must be implemented in app-level or domain-level components. Only modify `components/ui/*` files when a spec explicitly requires it.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries → `architecture-context.md`
- Storage model decisions → `architecture-context.md`
- New color tokens or typography → `ui-context.md`
- New code conventions → `code-standards.md`
- Feature scope changes → `project-overview.md`
- Progress state → `progress-tracker.md`

Progress state must reflect the actual state of the implementation, not the intended state.

## Before Moving To The Next Spec

1. All acceptance criteria in the current spec are checked off.
2. No TypeScript or lint errors exist in modified files.
3. The page/component renders correctly at mobile (375px) and desktop (1280px).
4. No invariant defined in `architecture-context.md` was violated.
5. `progress-tracker.md` reflects the completed spec.

## Phase Separation

**Phase 1 — Frontend UI**: All specs numbered 01–79. No backend code.

**Phase 2 — Backend**: Specs 80–99. Adds MongoDB, API routes, NextAuth. Connects the frontend to real data.

Do not write Phase 2 code during Phase 1. If a Phase 1 component needs data, use typed mock data from `lib/mock-data.ts`.
