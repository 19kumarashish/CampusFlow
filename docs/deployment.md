# Deployment Guide 🚀

This document outlines the step-by-step procedures for running CampusFlow in a local development environment and deploying the client and server to cloud infrastructure.

---

## 1. Local Development Setup

To run CampusFlow locally, you need to spin up the database, backend server, and frontend client.

### Prerequisites
* **Node.js**: Version 18.x or 20.x+
* **Package Manager**: npm (installed by default with Node)
* **MongoDB**: A running local instance of MongoDB or a connection string to a MongoDB Atlas cluster.

### 1.1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment configuration file:
   Copy `.env.example` (or the workspace root `.env.example`) to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
4. Update the fields in `.env` (refer to Section 2 for key definitions).
5. Start the development server in hot-reload mode:
   ```bash
   npm run dev
   ```
   The backend API will start on: `http://localhost:5000`.

### 1.2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Initialize the local environment config:
   Create a file named `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend web application will start on: `http://localhost:3000`.

---

## 2. Environment Variables Configuration

### 2.1. Server `.env` Reference
Ensure these values are configured in the server environment before starting:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | The port Express will listen on. |
| `NODE_ENV` | `development` / `production` | Enables performance optimizations in production. |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/cf` | The MongoDB connection string. |
| `JWT_ACCESS_SECRET` | `long_random_string_access` | Key used to sign JWT Access Tokens. |
| `JWT_REFRESH_SECRET`| `long_random_string_refresh`| Key used to sign JWT Refresh Tokens. |
| `CLIENT_URL` | `http://localhost:3000` | CORS origin. In production, set to client URL. |
| `SMTP_HOST` | `smtp.mailtrap.io` | SMTP server host for system emails. |
| `SMTP_PORT` | `2525` | SMTP port (e.g. 587, 465, 2525). |
| `SMTP_USER` | `my-smtp-username` | Authentication user for SMTP. |
| `SMTP_PASS` | `my-smtp-password` | Authentication password for SMTP. |
| `CLOUDINARY_CLOUD_NAME` | `my-cloud-name` | Cloudinary name for image uploads. |
| `CLOUDINARY_API_KEY` | `1234567890` | Cloudinary credentials. |
| `CLOUDINARY_API_SECRET` | `abcdefg...` | Cloudinary credentials. |

---

## 3. Production Deployment

### 3.1. Database: MongoDB Atlas
1. Create a free or paid tier cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and whitelist the IP address of your hosting provider (or set `0.0.0.0/0` for dynamic hosting environments like Render).
3. Go to **Database Access**, create a user credentials set, and copy the connection string.
4. Set the `MONGODB_URI` env variable on your backend server to this connection string.

### 3.2. Server: Render / Heroku / Docker
The backend compiles from TypeScript (`src/`) to JavaScript (`dist/`) before execution.

* **Build Command**: `npm run build` (runs `tsc` compilation)
* **Start Command**: `npm run start` (runs the compiled JS: `node dist/server.js`)

#### Deploying on Render (Web Service)
1. Link your git repository to Render.
2. Select the `server` directory as the subfolder path.
3. Choose runtime **Node**.
4. Set the build command to `npm run build` and start command to `npm run start`.
5. Under Environment Variables, input all variables in the server `.env` section.

---

### 3.3. Frontend: Vercel / Netlify
Next.js applications deploy natively to Vercel.

1. Create a new project on [Vercel](https://vercel.com).
2. Import your repository, specifying `client` as the root directory of the application.
3. In the Environment Variables settings panel, add:
   * **Key**: `NEXT_PUBLIC_API_URL`
   * **Value**: `https://your-backend-service.onrender.com/api/v1` (replace with your live backend domain).
4. Click **Deploy**. Vercel will automatically build the static page files and bundle serverless functions.
