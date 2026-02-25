# Deployment Guide: DriveFlow Fleet Dashboard

This guide describes how to deploy the DriveFlow application using Render for the backend and Vercel for the frontend.

## Prerequisites

- Account on [Render](https://render.com)
- Account on [Vercel](https://vercel.com)
- GitHub repository containing the project code

## Phase 1: Backend Deployment (Render)

### 1. Database Setup
1. Log in to the Render Dashboard.
2. Select New > PostgreSQL.
3. Configure the database name and region.
4. Once created, copy the External Database URL. You will need this for the DATABASE_URL environment variable.

### 2. Web Service Setup
1. Select New > Web Service.
2. Connect your GitHub repository.
3. Configuration:
   - Name: driveflow-backend
   - Environment: Node
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npx ts-node src/server.ts`
4. Advanced > Environment Variables:
   - DATABASE_URL: (Use the URL from step 1. Note: Render usually requires appending `?sslmode=require` if not already present)
   - JWT_SECRET: (A secure random string)
   - PORT: 3000
5. Click Create Web Service. Wait for the service to be live and copy the public URL (e.g., https://driveflow-backend.onrender.com).

## Phase 2: Frontend Deployment (Vercel)

1. Log in to Vercel and select Add New > Project.
2. Import your GitHub repository.
3. Framework Preset: Vite.
4. Root Directory: `frontend`.
5. Environment Variables:
   - VITE_API_URL: (The Render backend URL + /api/v1, e.g., https://driveflow-backend.onrender.com/api/v1)
6. Click Deploy.

## Phase 3: Database Synchronization

Once the backend is live, you must push the schema and seed the initial data to the remote database.

1. Update your local .env file with the remote DATABASE_URL from Render.
2. Push the schema to the remote database:
   ```bash
   npx prisma db push
   ```
3. Seed the lookup tables and initial test data:
   ```bash
   npx prisma db seed
   ```

## Infrastructure Notes

### Prisma 7 Configuration
The project uses Prisma 7, which requires a driver adapter for direct database connections. The configuration is managed in `prisma.config.ts`. Ensure that the `pg` and `@prisma/adapter-pg` dependencies are present in the environment.

### Security
The backend uses CORS middleware. For production, it is recommended to restrict the allowed origins to your Vercel domain in `src/app.ts`.
