# Backend API for Page Content

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up MongoDB**
   - Use a local MongoDB instance (default: `mongodb://localhost:27017/pagecontentdb`)
   - Or set the `MONGODB_URI` environment variable for MongoDB Atlas or remote DB

3. **Run the server**
   ```bash
   node server.js
   ```

The server will run on port 3001 by default.

## API Endpoints
- `POST   /api/pages`      — Create a new page (expects `{ content: { ... } }` in body)
- `GET    /api/pages/:id`  — Get a page by ID
- `PUT    /api/pages/:id`  — Update a page by ID (expects `{ content: { ... } }` in body)
- `DELETE /api/pages/:id`  — Delete a page by ID 