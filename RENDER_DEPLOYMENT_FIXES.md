# Render Deployment Fixes

## Issue Identified

Your application is deployed but serving **development files** instead of the production build. The deployed app shows:

```html
<script type="module">import { injectIntoGlobalHook } from "/@react-refresh"
<script type="module" src="/@vite/client"></script>
```

These are Vite development server scripts that should NOT appear in production.

## Root Cause

The application is not properly building for production on Render, likely due to:

1. **Missing environment variables** for production mode
2. **Incorrect build configuration** for Render environment  
3. **Build script not setting proper production flags**

## Fixes Required

### 1. Update render.yaml

Replace your current `render.yaml` with this corrected version:

```yaml
services:
  - type: web
    name: plate-app
    env: node
    region: oregon
    buildCommand: chmod +x ./build-production.sh && ./build-production.sh
    startCommand: npm start
    envVars:
      - key: VITE_API_URL
        value: ""
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
```

### 2. Use the Production Build Script

Use the `build-production.sh` script which:
- Explicitly sets `NODE_ENV=production`
- Sets `VITE_API_URL=""` for relative API paths
- Installs dependencies correctly for production
- Verifies the build output

### 3. Verify Vite Configuration

Ensure your `frontend/vite.config.ts` is production-ready:

```typescript
export default defineConfig(({ mode }) => ({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: true, // Ensure minification in production
  },
  // ... rest of config
}));
```

### 4. Environment Variables on Render

In your Render dashboard, ensure these environment variables are set:

- `NODE_ENV`: `production`
- `VITE_API_URL`: (empty string)
- `MONGODB_URI`: (your MongoDB connection string)

## Deployment Steps

1. **Update your repository** with the fixes above
2. **Trigger a new deployment** on Render
3. **Monitor the build logs** to ensure:
   - Frontend builds successfully
   - No development scripts in the final HTML
   - Backend starts correctly

## Verification

After deployment, check:

1. **View source** of https://factual-plate-ai.onrender.com/
2. **Ensure NO development scripts** like:
   - `/@vite/client`
   - `/@react-refresh`
3. **Check for production assets** like:
   - `/assets/index-[hash].js`
   - `/assets/index-[hash].css`

## Common Render Issues Fixed

- ✅ Server binds to `0.0.0.0` (not `127.0.0.1`)
- ✅ Uses correct PORT environment variable
- ✅ Sets NODE_ENV=production
- ✅ Proper environment variable configuration
- ✅ Production build process

## If Still Not Working

1. **Check Render build logs** for errors
2. **Verify all environment variables** are set
3. **Test the production build locally**:
   ```bash
   chmod +x ./build-production.sh
   ./build-production.sh
   npm start
   ```
4. **Access http://localhost:3001** and verify it shows production files

## Quick Test

Run this locally to verify the fix:

```bash
# Clean build
rm -rf frontend/dist
export NODE_ENV=production
export VITE_API_URL=""

# Build and test
cd frontend && npm run build && cd ..
npm start
```

Then check http://localhost:3001 source - it should NOT contain `/@vite/client`.

## Alternative Render Configuration

If the above doesn't work, try this simplified approach:

```yaml
services:
  - type: web
    name: plate-app
    env: node
    region: oregon
    buildCommand: cd frontend && npm install && npm run build && cd ../backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
```

This uses a more explicit build command instead of a shell script.