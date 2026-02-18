#Comment System

Simple full-stack comment application built with React, Express, and PostgreSQL.

## Tech Stack

- Frontend: React, Axios
- Backend: Node.js, Express, pg
- Database: PostgreSQL

## Current Features

- Create comments with text and optional images
- Edit and delete comments
- Toggle like/unlike

## Project Structure

```text
bobyard/
  backend/
    config/
    controllers/
    routes/
    server.js
  frontend/
    src/
      components/
      services/
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- PostgreSQL running locally

## 1) Database Setup

Open PostgreSQL and create the database once:

```sql
CREATE DATABASE comments_db;
```

The backend will auto-create the `comments` table on startup (`CREATE TABLE IF NOT EXISTS ...` in `backend/server.js`).

## 2) Environment Variables

Create `backend/.env`:

```env
PORT=5001
DB_NAME=comments_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5001
```

## 3) Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## 4) Run the App

Start backend:

```bash
cd backend
npm run dev
```

Start frontend in another terminal:

```bash
cd frontend
npm start
```

Frontend default URL: `http://localhost:3000`  
Backend default URL: `http://localhost:5001`

## API Endpoints

Base: `/comments`

- `GET /comments?page=1&limit=10` - list comments with pagination
- `POST /comments` - create comment
- `PUT /comments/:id` - edit comment text
- `DELETE /comments/:id` - delete comment
- `PUT /comments/:id/like` - toggle like


### Example request bodies

Create comment:

```json
{
  "text": "Hello world",
  "author": "Admin",
  "images": [],
  "likes": 0
}
```

## Notes

- If `psql -U <user>` fails with `database "<user>" does not exist`, connect to a known database instead:
  - `psql -U <user> -d postgres`

