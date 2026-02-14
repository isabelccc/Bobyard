# Practice Feature Requests - 45 Minute Challenge

## 🟢 Easy Features (15-25 minutes)

### Feature 1: Character Counter
**Request:** "Add a character counter to the comment form showing remaining characters (max 500)"

**What to implement:**
- Add maxLength={500} to textarea
- Display "X characters remaining" below textarea
- Update in real-time as user types
- Show red when < 50 characters left

**Files to modify:**
- `frontend/src/components/CommentForm.js`
- `frontend/src/components/CommentForm.css`

**Time breakdown:**
- Planning: 2 min
- Implementation: 10 min
- Testing: 3 min

---

### Feature 2: Sort Comments
**Request:** "Add a dropdown to sort comments by 'Newest', 'Oldest', or 'Most Liked'"

**What to implement:**
- Add dropdown in CommentList
- Backend: Add query parameter `?sort=newest|oldest|likes`
- Frontend: Add state for sort option, pass to API
- Update GET endpoint to handle ORDER BY

**Files to modify:**
- `backend/routes/comment.js` (GET endpoint)
- `frontend/src/services/api.js` (getComments function)
- `frontend/src/components/CommentList.js`

**Time breakdown:**
- Planning: 3 min
- Backend: 8 min
- Frontend: 10 min
- Testing: 4 min

---

### Feature 3: Comment Timestamp Format
**Request:** "Show relative time (e.g., '2 hours ago') instead of full date"

**What to implement:**
- Create utility function to calculate relative time
- Update CommentItem to use relative time
- Show full date on hover (tooltip)

**Files to modify:**
- `frontend/src/components/CommentItem.js`
- Create `frontend/src/utils/dateUtils.js` (optional)

**Time breakdown:**
- Planning: 2 min
- Implementation: 12 min
- Testing: 3 min

---

## 🟡 Medium Features (25-35 minutes)

### Feature 4: Search Comments
**Request:** "Add a search bar to filter comments by text content"

**What to implement:**
- Add search input in CommentList
- Filter comments in frontend OR add backend endpoint
- Highlight matching text (optional)
- Show "No results" message

**Files to modify:**
- `frontend/src/components/CommentList.js`
- Optional: `backend/routes/comment.js` (if backend filtering)

**Time breakdown:**
- Planning: 3 min
- Implementation: 20 min
- Testing: 5 min

---

### Feature 5: Edit Comment History
**Request:** "Show 'edited' badge if comment was modified, with edit timestamp"

**What to implement:**
- Backend already has `updated_at` field
- Compare `created_at` vs `updated_at`
- Show "Edited X minutes ago" badge
- Style the badge

**Files to modify:**
- `frontend/src/components/CommentItem.js`
- `frontend/src/components/CommentItem.css`

**Time breakdown:**
- Planning: 2 min
- Implementation: 18 min
- Testing: 5 min

---

### Feature 6: Pagination
**Request:** "Add pagination - show 10 comments per page with Next/Previous buttons"

**What to implement:**
- Backend: Add `limit` and `offset` query parameters
- Frontend: Add pagination state (currentPage, totalPages)
- Add Next/Previous buttons
- Update API call with pagination params

**Files to modify:**
- `backend/routes/comment.js` (GET endpoint)
- `frontend/src/services/api.js`
- `frontend/src/components/CommentList.js`

**Time breakdown:**
- Planning: 4 min
- Backend: 10 min
- Frontend: 15 min
- Testing: 6 min

---

## 🔴 Hard Features (35-45 minutes)

### Feature 7: Nested Replies (Basic)
**Request:** "Allow users to reply to comments. Show replies nested under parent comments"

**What to implement:**
- Backend: Add `parent_id` column to comments table
 1. psql -U linl -d comments_db login database
 2. \d comments, check current table structure
 3 . ALTER TABLE COMMENTS
 ADD COLUMN parent_id INTEGER NOT NULL DEFAULT O
- Backend: Update POST endpoint to accept `parent_id`
// file; routes/ comment.js
- Backend: Update GET to return nested structure OR filter by parent_id
// routes/ comment.js, update get
- Frontend: Add "Reply" button to CommentItem

- Frontend: Create ReplyForm component (or reuse CommentForm)
- Frontend: Display replies nested (recursive rendering)

**Files to modify:**
- `backend/server.js` (update CREATE TABLE)
- `backend/routes/comment.js` (POST and GET endpoints)
- `frontend/src/components/CommentItem.js`
- `frontend/src/components/CommentList.js`
- Create `frontend/src/components/ReplyForm.js` (optional)

**Time breakdown:**
- Planning: 5 min
- Backend: 15 min
- Frontend: 20 min
- Testing: 5 min

**Hints:**
- Start with flat replies (all at same level)
- Add nesting later if time allows
- Use `parent_id = null` for top-level comments

---

### Feature 8: Bulk Delete
**Request:** "Add checkboxes to select multiple comments and delete them all at once"

**What to implement:**
- Add checkbox to each CommentItem
- Add "Select All" checkbox in CommentList
- Add "Delete Selected" button
- Backend: Add DELETE endpoint for multiple IDs: `DELETE /comments?ids=1,2,3`
- Frontend: Collect selected IDs and call API

**Files to modify:**
- `backend/routes/comment.js` (DELETE endpoint)
- `frontend/src/services/api.js`
- `frontend/src/components/CommentList.js`
- `frontend/src/components/CommentItem.js`

**Time breakdown:**
- Planning: 4 min
- Backend: 12 min
- Frontend: 22 min
- Testing: 7 min

---

### Feature 9: Comment Validation & Moderation
**Request:** "Add validation: block comments with profanity, limit to 1000 chars, require minimum 10 chars"

**What to implement:**
- Backend: Add validation middleware/function
- Check for profanity (simple word list)
- Check length (min 10, max 1000)
- Return appropriate error messages
- Frontend: Show validation errors

**Files to modify:**
- `backend/routes/comment.js` (POST endpoint)
- `frontend/src/components/CommentForm.js`

**Time breakdown:**
- Planning: 3 min
- Backend: 18 min
- Frontend: 15 min
- Testing: 9 min

---

## 🎯 Practice Strategy

### Before Starting:
1. **Read the requirement carefully** (2 min)
2. **Ask 1 clarifying question** if needed
3. **Plan your approach** (3-5 min)
   - What needs to change in backend?
   - What needs to change in frontend?
   - What's the simplest working version?

### During Implementation:
1. **Start with backend** (if needed)
   - Test with curl/Postman first
   - Verify it works before moving to frontend

2. **Then frontend**
   - Follow existing patterns
   - Test incrementally

3. **Keep it simple**
   - Get basic version working first
   - Add polish if time allows

### Time Management:
- **0-10 min:** Backend changes + testing
- **10-30 min:** Frontend changes
- **30-40 min:** Integration + testing
- **40-45 min:** Polish + edge cases

---

## 📝 Practice Exercises

### Exercise 1: Character Counter (Start Here)
**Time yourself:** Try to complete in 20 minutes
- Add maxLength={500} to textarea
- Show character count
- Change color when < 50 left

### Exercise 2: Sort Comments
**Time yourself:** Try to complete in 30 minutes
- Add dropdown with 3 options
- Update backend to handle sort
- Update frontend to use sort

### Exercise 3: Search (Frontend Only)
**Time yourself:** Try to complete in 25 minutes
- Add search input
- Filter comments array
- Show "No results" message

---

## 💡 Tips for Success

1. **Don't overthink** - Simple solution > Perfect solution
2. **Test as you go** - Don't wait until the end
3. **Use existing patterns** - Copy structure from working code
4. **Explain your approach** - Talk through what you're doing
5. **Handle errors** - At least basic error handling
6. **Time box yourself** - If stuck, move on, come back later

---

## 🚀 Quick Reference: Common Patterns

### Adding Backend Route:
```javascript
router.get('/new-endpoint', async(req, res) => {
  // Your code here
});
```

### Adding Frontend API Call:
```javascript
export const newFunction = (param) => {
  return axios.get(`${API_URL}/new-endpoint?param=${param}`);
};
```

### Updating State:
```javascript
setComments(prev => [...prev, newComment]); // Add
setComments(prev => prev.filter(c => c.id !== id)); // Remove
setComments(prev => prev.map(c => c.id === id ? {...c, field: value} : c)); // Update
```

---

## ✅ Success Criteria

A feature is "complete" if:
- ✅ Backend endpoint works (tested with curl/Postman)
- ✅ Frontend can call the API
- ✅ UI updates correctly
- ✅ Basic error handling
- ✅ No console errors

**Nice to have (if time):**
- Loading states
- Better error messages
- Styling polish
- Edge case handling

---

Good luck! Practice these features and you'll be ready for anything they throw at you! 🎯
