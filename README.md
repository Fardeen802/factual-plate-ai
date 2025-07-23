# Plate AI - Rich Text Editor with MongoDB Backend

A modern full-stack application built with React, Vite, and Express.js featuring a rich text editor powered by Plate.js with MongoDB for data persistence.

## 🚀 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Plate.js (Rich text editor)
- shadcn/ui components
- Tailwind CSS
- React Query

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## 📁 Project Structure

```
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Express.js backend
│   ├── server.js
│   └── package.json
├── render.yaml        # Render deployment config
├── build.sh          # Build script
└── package.json      # Root package.json
```

## 🏠 Local Development

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pagecontentdb
   PORT=3001
   ```

4. **Start MongoDB**
   - Local: Start your MongoDB service
   - Cloud: Use MongoDB Atlas connection string

5. **Run the application**
   
   **Option 1: Run both frontend and backend separately**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```
   
   **Option 2: Run frontend with backend proxy (recommended)**
   ```bash
   cd frontend
   npm run dev  # This will also start the backend via proxy
   ```

6. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001/api

## 🚀 Deployment on Render

### Step-by-Step Deployment Guide

#### 1. Prepare Your Repository
Ensure your code is pushed to GitHub/GitLab with all the changes including:
- `render.yaml` configuration
- `build.sh` script
- Root `package.json`
- Updated backend server configuration

#### 2. Create Render Account & Service
1. Go to [Render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub/GitLab repository

#### 3. Configure the Web Service
- **Name**: `plate-app` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (uses root)
- **Build Command**: `./build.sh`
- **Start Command**: `cd backend && npm start`

#### 4. Set Environment Variables
Add these environment variables in Render dashboard:

| Key | Value | Notes |
|-----|-------|--------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/pagecontentdb` | Your MongoDB connection string |
| `NODE_ENV` | `production` | Sets production environment |
| `PORT` | (Auto-set by Render) | Leave blank, Render sets this |

#### 5. Deploy
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Run the build script (`./build.sh`)
   - Install dependencies for both frontend and backend
   - Build the frontend Vite application
   - Start the backend server
3. Wait for deployment to complete (usually 2-5 minutes)

#### 6. Verify Deployment
- Check the logs for any errors
- Visit your app URL (provided by Render)
- Test the rich text editor functionality
- Verify API endpoints are working

### 🔧 Deployment Configuration Files

#### `render.yaml`
```yaml
services:
  - type: web
    name: plate-app
    env: node
    buildCommand: ./build.sh
    startCommand: cd backend && npm start
    envVars:
      - key: VITE_API_URL
        sync: false
      - key: MONGODB_URI
        sync: false
```

#### `build.sh`
```bash
#!/bin/bash
set -e

echo "🔧 Installing frontend dependencies..."
cd frontend && npm install

echo "🏗️ Building frontend..."
npm run build

echo "🔧 Installing backend dependencies..."
cd ../backend && npm install

echo "🚀 Build completed successfully!"
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user with read/write permissions
4. Whitelist Render IP addresses (or use 0.0.0.0/0 for simplicity)
5. Get connection string and add to Render environment variables

### Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# The app will connect to: mongodb://localhost:27017/pagecontentdb
```

## 🔍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pages/:id` | Get page content by ID |
| `PUT` | `/api/pages/:id` | Update page content |

## 🛠️ Troubleshooting

### Common Deployment Issues

1. **Build fails with "vite: not found"**
   - Ensure you're using the updated `build.sh` script
   - Check that `render.yaml` uses `./build.sh` as buildCommand

2. **Server doesn't start**
   - Verify `MONGODB_URI` environment variable is set
   - Check Render logs for specific error messages

3. **Frontend assets not loading**
   - Ensure Vite build completed successfully
   - Check that backend serves static files from `frontend/dist`

4. **API calls failing**
   - Verify backend is running on the correct port
   - Check CORS configuration in `server.js`

### Development Issues

1. **MongoDB connection error**
   ```bash
   # Check if MongoDB is running
   mongod --version
   
   # Or use MongoDB Atlas connection string
   ```

2. **Port conflicts**
   - Frontend: Change port in `vite.config.ts`
   - Backend: Change PORT in `.env` file

## 📝 Environment Variables

### Production (Render)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: `production`
- `PORT`: Automatically set by Render

### Development
- `MONGODB_URI`: `mongodb://localhost:27017/pagecontentdb`
- `PORT`: `3001`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Need Help?** 
- Check the [Render Documentation](https://render.com/docs)
- Review the troubleshooting section above
- Check the deployment logs in Render dashboard