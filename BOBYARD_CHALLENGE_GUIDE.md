# Bobyard Challenge Guide: Comment System

## Overview
Build a YouTube/Reddit-style comment system with full CRUD operations.

**Tech Stack:**
- Backend: Node.js + Express + PostgreSQL
- Frontend: React
- Database: PostgreSQL (local or cloud like AWS RDS, Heroku Postgres)

---

## Part 1: Backend Setup

### Step 1: Initialize Backend Project

```bash
mkdir backend
cd backend
npm init -y
npm install express pg sequelize cors dotenv
npm install --save-dev nodemon
```

### Step 2: Project Structure

```
backend/
├── server.js          # Main server file
├── config/
│   └── database.js    # Sequelize connection (includes pool config)
├── models/
│   └── Comment.js     # Sequelize model
├── routes/
│   └── comments.js    # API routes
└── package.json
```

### Step 3: PostgreSQL Connection Setup

**Instructions:**
1. Create a `config/database.js` file for Sequelize connection
2. Configure connection pool settings in the database config (NOT in server.js)
3. Pool settings should include: max, min, acquire, idle connections
4. Use environment variables for database credentials

**config/database.js:**
- Import Sequelize
- Create new Sequelize instance with database credentials from .env
- Configure pool settings (max: 5, min: 0, acquire: 30000, idle: 10000)
- Export the sequelize instance

**server.js:**
- Import sequelize from config/database.js
- Import Comment model
- Use `sequelize.authenticate()` to test connection
- Use `sequelize.sync({ alter: true })` to sync models (creates tables)
- Start server after database connection is established

**Note:** Connection pool is configured in `config/database.js`, not in `server.js`. The pool manages database connections efficiently.

### Step 4: Comment Model

**models/Comment.js:**
- Import `DataTypes` from 'sequelize'
- Import sequelize instance from '../config/database'
- Use `sequelize.define()` to create Comment model
- Define fields:
  - `id`: INTEGER, primaryKey, autoIncrement
  - `text`: TEXT, allowNull: false
  - `author`: STRING, allowNull: false, defaultValue: 'Admin'
  - `date`: DATE, allowNull: false, defaultValue: DataTypes.NOW
  - `likes`: INTEGER, allowNull: false, defaultValue: 0
  - `images`: ARRAY(STRING), allowNull: true, defaultValue: []
- Set `tableName: 'comments'`
- Set `timestamps: true` (adds createdAt, updatedAt)
- Export the model

### Step 5: API Routes

**routes/comments.js:**
- Import express Router and Comment model

**GET /api/comments** - List all comments:
- Use `Comment.findAll()` instead of `Comment.find()`
- Use `order: [['date', 'DESC']]` instead of `.sort()`
- Return JSON response

**POST /api/comments** - Add new comment:
- Use `Comment.create()` instead of `new Comment().save()`
- Pass object with: text, author: 'Admin', date: new Date(), likes: 0, images
- Return 201 status with created comment

**PUT /api/comments/:id** - Edit comment text:
- Use `Comment.findByPk(req.params.id)` to find comment
- Check if comment exists, return 404 if not
- Update `comment.text` property
- Use `comment.save()` to persist changes
- Return updated comment

**DELETE /api/comments/:id** - Delete comment:
- Use `Comment.findByPk(req.params.id)` to find comment
- Check if comment exists, return 404 if not
- Use `comment.destroy()` instead of `findByIdAndDelete()`
- Return success message

### Step 6: Connect Routes to Server

**server.js:**
- Import comment routes: `require('./routes/comments')`
- Add middleware: `app.use('/api/comments', commentRoutes)`
- Make sure routes are added before error handling middleware

### Step 7: Seed Data from JSON

**scripts/seed.js:**
- Import sequelize from '../config/database'
- Import Comment model
- Import fs and path modules
- Use `sequelize.authenticate()` to connect
- Use `sequelize.sync()` to ensure tables exist
- Read JSON file from scripts folder
- Use `Comment.destroy({ where: {}, truncate: true })` to clear data
- Use `Comment.bulkCreate(data)` instead of `insertMany()`
- Handle errors and exit process

**Run seed:**
```bash
node scripts/seed.js
```

**Note:** Place the downloaded comments.json file in the scripts/ folder

---

## Part 2: Frontend Setup

### Step 1: Initialize React App

```bash
cd ..  # Go back to root
npx create-react-app frontend
cd frontend
npm install axios  # For API calls
```

### Step 2: Project Structure

```
frontend/
├── src/
│   ├── App.js
│   ├── components/
│   │   ├── CommentList.js
│   │   ├── CommentItem.js
│   │   └── CommentForm.js
│   ├── services/
│   │   └── api.js
│   └── App.css
```

### Step 3: API Service

**src/services/api.js:**
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getComments = () => {
  return axios.get(`${API_URL}/comments`);
};

export const addComment = (text, images = []) => {
  return axios.post(`${API_URL}/comments`, { text, images });
};

export const editComment = (id, text) => {
  return axios.put(`${API_URL}/comments/${id}`, { text });
};

export const deleteComment = (id) => {
  return axios.delete(`${API_URL}/comments/${id}`);
};
```

### Step 4: Comment Display Component

**src/components/CommentItem.js:**
```javascript
import React from 'react';
import './CommentItem.css';

function CommentItem({ comment }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{formatDate(comment.date)}</span>
      </div>
      <p className="comment-text">{comment.text}</p>
      {comment.images && comment.images.length > 0 && (
        <div className="comment-images">
          {comment.images.map((img, idx) => (
            <img key={idx} src={img} alt={`Comment ${idx}`} />
          ))}
        </div>
      )}
      <div className="comment-likes">
        👍 {comment.likes}
      </div>
    </div>
  );
}

export default CommentItem;
```

### Step 5: Comment List Component

**src/components/CommentList.js:**
```javascript
import React, { useState, useEffect } from 'react';
import { getComments } from '../services/api';
import CommentItem from './CommentItem';
import './CommentList.css';

function CommentList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await getComments();
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="comment-list">
      <h2>Comments ({comments.length})</h2>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

export default CommentList;
```

### Step 6: Main App Component

**src/App.js:**
```javascript
import React from 'react';
import CommentList from './components/CommentList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Comment System</h1>
      </header>
      <main>
        <CommentList />
      </main>
    </div>
  );
}

export default App;
```

### Step 7: Basic Styling

**src/App.css:**
```css
.App {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.comment-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: white;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
  color: #333;
}

.comment-date {
  color: #666;
  font-size: 0.9em;
}

.comment-text {
  margin: 10px 0;
  line-height: 1.5;
}

.comment-images img {
  max-width: 200px;
  margin: 5px;
  border-radius: 4px;
}

.comment-likes {
  margin-top: 10px;
  color: #666;
}
```

---

## Part 3: Add Edit, Add, Delete Functionality

### Step 1: Update CommentItem with Edit/Delete

**src/components/CommentItem.js (updated):**
```javascript
import React, { useState } from 'react';
import { editComment, deleteComment } from '../services/api';
import './CommentItem.css';

function CommentItem({ comment, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleSave = async () => {
    try {
      await editComment(comment.id, editText);
      setIsEditing(false);
      onUpdate(); // Refresh list
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment.id);
        onDelete(); // Refresh list
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{new Date(comment.date).toLocaleString()}</span>
      </div>
      
      {isEditing ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-textarea"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <p className="comment-text">{comment.text}</p>
      )}
      
      {comment.images && comment.images.length > 0 && (
        <div className="comment-images">
          {comment.images.map((img, idx) => (
            <img key={idx} src={img} alt={`Comment ${idx}`} />
          ))}
        </div>
      )}
      
      <div className="comment-footer">
        <span className="comment-likes">👍 {comment.likes}</span>
        <div className="comment-actions">
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
```

### Step 2: Add Comment Form Component

**src/components/CommentForm.js:**
```javascript
import React, { useState } from 'react';
import { addComment } from '../services/api';
import './CommentForm.css';

function CommentForm({ onAdd }) {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addComment(text, images);
      setText('');
      setImages([]);
      setImageUrl('');
      onAdd(); // Refresh list
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>Add New Comment</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows="4"
        required
      />
      <div className="image-input">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
        />
        <button type="button" onClick={addImage}>Add Image</button>
      </div>
      {images.length > 0 && (
        <div className="preview-images">
          {images.map((img, idx) => (
            <span key={idx} className="image-preview">
              {img}
              <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}>×</button>
            </span>
          ))}
        </div>
      )}
      <button type="submit">Post Comment</button>
    </form>
  );
}

export default CommentForm;
```

### Step 3: Update CommentList

**src/components/CommentList.js (updated):**
```javascript
import React, { useState, useEffect } from 'react';
import { getComments } from '../services/api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import './CommentList.css';

function CommentList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await getComments();
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="comment-list">
      <h2>Comments ({comments.length})</h2>
      <CommentForm onAdd={fetchComments} />
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onUpdate={fetchComments}
          onDelete={fetchComments}
        />
      ))}
    </div>
  );
}

export default CommentList;
```

---

## Setup Instructions

### Backend Setup:
```bash
cd backend
npm install
# Create .env file with PostgreSQL credentials
npm run dev  # or node server.js
```

### Frontend Setup:
```bash
cd frontend
npm install
npm start
```

### PostgreSQL Setup Options:

**Option 1: Local PostgreSQL**
```bash
# Install PostgreSQL
brew install postgresql@14  # macOS
# or download from postgresql.org

# Start PostgreSQL
brew services start postgresql@14

# Create database
psql postgres
CREATE DATABASE comments_db;
\q

# Add to .env:
DB_NAME=comments_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

**Option 2: Cloud PostgreSQL (Heroku, AWS RDS, etc.)**
1. Create PostgreSQL database on cloud provider
2. Get connection credentials
3. Add to `.env`:
   - `DB_NAME=your_db_name`
   - `DB_USER=your_username`
   - `DB_PASSWORD=your_password`
   - `DB_HOST=your_host`
   - `DB_PORT=5432`

---

## Testing Your API

Use Postman or curl to test:

```bash
# Get all comments
curl http://localhost:5000/api/comments

# Add comment
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"text": "Test comment"}'

# Edit comment
curl -X PUT http://localhost:5000/api/comments/COMMENT_ID \
  -H "Content-Type: application/json" \
  -d '{"text": "Updated text"}'

# Delete comment
curl -X DELETE http://localhost:5000/api/comments/COMMENT_ID
```

---

## Key Points for Interview

1. **Clean Code**: Well-organized, readable code
2. **Error Handling**: Try-catch blocks, user feedback
3. **User Experience**: Loading states, confirmations for delete
4. **Design**: Clean, modern UI
5. **RESTful API**: Proper HTTP methods and status codes

---

## If Time Runs Out

Document what you would add:
- Authentication/authorization
- Nested replies (threading)
- Like/unlike functionality
- Image upload (not just URLs)
- Pagination for large comment lists
- Real-time updates (WebSocket)
- Input validation and sanitization

Good luck! 🚀
