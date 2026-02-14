# PostgreSQL Setup Guide for Bobyard Challenge

## Quick Steps

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Or download from:** https://www.postgresql.org/download/

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE comments_db;

# Create user (optional)
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE comments_db TO postgres;

# Exit
\q
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install express pg sequelize cors dotenv
npm install --save-dev nodemon
```

### 4. Update package.json scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 5. Create .env file

```bash
# In backend folder
touch .env
```

Add to `.env`:
```
PORT=5000
DB_NAME=comments_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### 6. File Structure

```
backend/
├── config/
│   └── database.js      # Sequelize connection
├── models/
│   └── Comment.js       # Comment model
├── routes/
│   └── comments.js      # API routes
├── scripts/
│   └── seed.js          # Seed data script
├── server.js
└── package.json
```

### 7. Key Differences from MongoDB

**Connection:**
- Use Sequelize instead of Mongoose
- Connect to PostgreSQL instead of MongoDB

**Model:**
- Use `sequelize.define()` instead of `mongoose.Schema`
- Use `DataTypes` from Sequelize
- Arrays: `DataTypes.ARRAY(DataTypes.STRING)`

**Queries:**
- `Comment.findAll()` instead of `Comment.find()`
- `Comment.findByPk(id)` instead of `Comment.findById(id)`
- `Comment.create()` instead of `new Comment().save()`
- `comment.save()` for updates
- `comment.destroy()` for deletes

### 8. Run Server

```bash
npm run dev
```

### 9. Seed Data (after downloading JSON)

```bash
# Place comments.json in scripts/ folder
node scripts/seed.js
```

### 10. Test API

```bash
# Get all comments
curl http://localhost:5000/api/comments

# Add comment
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -d '{"text": "Test comment"}'
```

## That's it! Your backend is ready with PostgreSQL.
