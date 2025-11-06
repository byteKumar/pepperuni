# Fixing "Not Found" Error on Page Refresh in Render

## Problem
When refreshing pages in production (e.g., `/resumeupload`), you get a "Not Found" error. This happens because the server tries to find a file at that path, but React Router handles routing client-side.

## Solution

### Option 1: Configure Redirects in Render Dashboard (Recommended)

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your **pepperuni-client** static site
3. Go to **Settings** → **Redirects and Rewrites**
4. Add a new redirect rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Type**: `Rewrite` (not Redirect)
   - **Status Code**: `200`

This tells Render to serve `index.html` for all routes, allowing React Router to handle the routing.

### Option 2: Verify `_redirects` File

The `_redirects` file in `client/public/` should be automatically copied to the build folder. Verify:

1. The file exists in `client/public/_redirects`
2. After building (`npm run build`), check that `client/build/_redirects` exists
3. The content should be:
   ```
   /*    /index.html   200
   ```

### Option 3: Use render.yaml (If using Blueprint)

If you're using Render Blueprint (render.yaml), the routes are already configured in the `render.yaml` file. Make sure:
1. The `render.yaml` file is in your repository root
2. You're using "Apply Render Blueprint" when creating the service

## Verification

After configuring redirects:
1. Deploy your site
2. Navigate to any route (e.g., `/resumeupload`)
3. Refresh the page - it should work without showing "Not Found"

## Current Setup

- ✅ `_redirects` file exists in `client/public/`
- ✅ File is copied to `client/build/` during build
- ✅ `render.yaml` includes routes configuration

If the issue persists after configuring in the dashboard, try:
1. Rebuilding and redeploying
2. Clearing browser cache
3. Checking Render build logs for any errors

