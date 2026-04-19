# Deployment Guide: DriveFlow Fleet Dashboard

This guide explains how to host the backend on **Render** and the frontend on **Vercel**.

## Phase 1: Backend Deployment (Render)

### 1. Create a PostgreSQL Database
1. Log in to [Render](https://dashboard.render.com/).
2. Click **New** > **PostgreSQL**.
3. **Name**: `driveflow-db`
4. **Plan**: Free (Note: Expires after 30 days of inactivity).
5. Click **Create Database**.
6. **Copy the "External Database URL"** for later.

### 2. Create a Web Service
1. Click **New** > **Web Service**.
2. Connect your GitHub repository.
3. **Name**: `driveflow-backend`
4. **Environment**: `Node`
5. **Build Command**: `npm install && npx prisma generate`
6. **Start Command**: `npx ts-node src/server.ts`
7. Click **Advanced** and add these **Environment Variables**:
   - `DATABASE_URL`: (Paste your External Database URL from step 1)
   - `JWT_SECRET`: (Any long random string)
   - `PORT`: `3000`
8. Click **Create Web Service**.
9. **Wait for deployment** and copy the resulting URL (e.g., `https://driveflow-backend.onrender.com`).

---

## Phase 2: Frontend Deployment (Vercel)

### 1. Create a New Project
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Framework Preset**: Vite
5. **Root Directory**: `frontend`
6. Click **Environment Variables** and add:
   - `VITE_API_URL`: (Paste your Render Backend URL + `/api/v1`, e.g., `https://driveflow-backend.onrender.com/api/v1`)
7. Click **Deploy**.

---

## Phase 3: Final Identity & Database Push

1. Update your local `.env` file's `DATABASE_URL` with the **External Database URL** from Render.
2. Run database migration to create tables in the Render DB:
   ```bash
   npx prisma db push
   ```
3. Once the push is successful, your Vercel frontend should be able to communicate with the Render backend.

> [!IMPORTANT]
> **CORS**: The backend is currently configured with `app.use(cors())`, which allows all origins. This is fine for initial deployment but should be restricted to your Vercel domain later for security.
