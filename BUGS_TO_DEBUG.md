# Bugs To Debug

Use this as a hands-on debug checklist. Items are grouped by severity.

## Critical

- [ ] **Reply images never render in `CommentItem`**
  - File: `frontend/src/components/CommentItem.js`
  - Current condition checks `comment.image && comment.images.length > 0`.
  - DB rows use `images` (array), not `image` (string), so the first check fails and images do not show.

- [ ] **Like/Unlike UX is wrong for seeded counts**
  - File: `frontend/src/components/CommentItem.js`
  - `isLiked` is derived from `comment.likes > 0`, so comments seeded with likes like 100 always show `Unlike`.
  - This does not represent "liked by current user"; it only represents count.

- [ ] **Like endpoint destroys original like counts**
  - File: `backend/routes/comment.js`
  - `PUT /comments/:id/like` toggles likes between `0` and `1` only.
  - Seeded values like 100 become 0/1 behavior after one click.

- [ ] **Controller layer is empty, route layer owns everything**
  - File: `backend/controllers/commentController.js` (empty), `backend/routes/comment.js` (all logic)
  - This is an architecture bug/regression and makes maintenance/testing harder.

## High

- [ ] **Create comment validation rejects image-only comments**
  - File: `backend/routes/comment.js`
  - Validation currently requires `text`.
  - Frontend supports image attachments conceptually, so API contract is inconsistent.

- [ ] **Whitespace-only edits/comments can slip through**
  - File: `backend/routes/comment.js`
  - `if (!text)` does not trim, so `"   "` is treated as valid input.

- [ ] **Reply query behavior does not match comments in code**
  - File: `backend/routes/comment.js`
  - Comments state "without `parent_id` returns top-level only", but query returns all comments.
  - Reply nesting currently works only because frontend does additional filtering.

- [ ] **`parent_id` has no relational constraint**
  - File: `backend/server.js`
  - Table defines `parent_id INTEGER` without FK reference to `comments(id)`.
  - Invalid parent IDs can be inserted.

## Medium

- [ ] **Response status for create is non-standard**
  - File: `backend/routes/comment.js`
  - `POST /comments` returns `200` instead of `201 Created`.
  - Not fatal now, but easy source of frontend mismatch later.

- [ ] **Error response shape is inconsistent**
  - File: `backend/routes/comment.js`
  - Some handlers return `{ error: ... }`, others `{ err: ... }`, and message keys vary.
  - Frontend cannot rely on one error contract.

- [ ] **`CommentForm` has dead image state/UI path**
  - File: `frontend/src/components/CommentForm.js`
  - `imageInput` state exists and is passed to API, but there is no upload input/handler in this file now.

- [ ] **Unused import in `CommentItem`**
  - File: `frontend/src/components/CommentItem.js`
  - `addComment` is imported but not used.

- [ ] **Schema drift risk on existing DBs**
  - File: `backend/server.js`
  - `CREATE TABLE IF NOT EXISTS` does not migrate existing schema.
  - If DB was created earlier without `parent_id`, reply features fail without explicit `ALTER TABLE`.

## Low / Cleanup

- [ ] **`sequelize` dependency appears unused**
  - File: `backend/package.json`
  - Can be removed if not used anywhere.

- [ ] **Seed script success message can be misleading**
  - File: `backend/scripts/seed.js`
  - Logs total source count, not actual inserted count (rows with empty text are skipped).

- [ ] **Reply CSS exists even if reply feature is unstable**
  - File: `frontend/src/components/CommentList.css`
  - `.nested-reply` style remains but UX/contracts are still inconsistent.

## Suggested Debug Order

1. Fix image rendering in `CommentItem`.
2. Fix like model (count behavior + user-like state).
3. Normalize create/update validation (`trim`, image-only handling).
4. Move route logic into controller (or remove empty controller).
5. Clean API contract (`201`, consistent error JSON).
