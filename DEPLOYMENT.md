# PROMISEX AI — Production Deployment Guide

This guide covers how to deploy the **PROMISEX AI Product Promise Verification Platform** from your GitHub repository ([`https://github.com/Srinugunshetty/PromiSex_AI.git`](https://github.com/Srinugunshetty/PromiSex_AI.git)) to free or production cloud hosting with a custom domain or live HTTPS URL.

---

## Architecture Overview

PROMISEX AI is packaged as a **unified full-stack application**:
- **Backend**: FastAPI (Python 3.11) with RAG evidence reconciliation, contradiction detection, and delivery verification engines.
- **Frontend**: React + Vite + Tailwind CSS v4 built into `frontend/dist`.
- **Serving**: FastAPI serves the React SPA statically at `/` and handles API requests under `/api/`.

Because it is unified, **you can deploy the entire platform in a single web service on Render, Railway, Fly.io, or Docker**.

---

## Method 1: 1-Click Free Deployment on Render (Recommended)

Render provides free hosting for web services with automatic HTTPS and continuous deployment directly from your GitHub repository.

### Steps:
1. **Sign in to Render**:
   - Go to [render.com](https://render.com) and sign in with your GitHub account (`Srinugunshetty`).

2. **Create a New Web Service**:
   - In your Render dashboard, click **New +** → **Web Service**.
   - Select **Build and deploy from a Git repository**.
   - Connect and select your repository: **`Srinugunshetty/PromiSex_AI`**.

3. **Configure the Service Settings**:
   - **Name**: `promisex-ai` (or your chosen name)
   - **Region**: Choose the closest region (e.g., *Oregon*, *Frankfurt*, or *Singapore*)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Environment**: **Python**
   - **Build Command**:
     ```bash
     pip install -r backend/requirements.txt && cd frontend && npm install && npm run build && cd ..
     ```
   - **Start Command**:
     ```bash
     python backend/run.py
     ```
   - **Plan**: Select **Free**

4. **Environment Variables** (Under *Advanced*):
   - `HOST` = `0.0.0.0`
   - `PORT` = `10000` (Render default)
   - `PYTHON_VERSION` = `3.11.8`
   - `NODE_VERSION` = `20.11.0`
   - *(Optional)* `GEMINI_API_KEY` = your Gemini API key (if using live Gemini LLM extraction)

5. **Deploy**:
   - Click **Create Web Service**.
   - Render will build your frontend, install backend requirements, and start your unified service.
   - Once deployed, your app will be live at:
     ```
     https://promisex-ai.onrender.com
     ```

---

## Method 2: Universal Docker Deployment (Railway, Fly.io, AWS, DigitalOcean)

The repository includes a production multi-stage [`Dockerfile`](./Dockerfile) that builds the React bundle and runs the FastAPI server.

### Local or VPS Docker Run:
```bash
# 1. Clone repo
git clone https://github.com/Srinugunshetty/PromiSex_AI.git
cd PromiSex_AI

# 2. Build and launch with Docker Compose
docker compose up -d --build
```
Your application will be live at `http://localhost:8000` (or your server's public IP).

### Deploying Docker on Railway:
1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select `Srinugunshetty/PromiSex_AI`.
4. Railway detects the `Dockerfile` automatically and builds the image.
5. In **Settings** → **Networking**, click **Generate Domain** to get your public HTTPS URL (e.g., `https://promisex-production.up.railway.app`).

---

## Method 3: Split Deployment (Vercel Frontend + Render Backend)

If you prefer hosting the React frontend on **Vercel** and the Python FastAPI backend on **Render**:

### Step 1: Deploy Backend to Render or Railway
- Deploy using Method 1 or 2.
- Note your backend URL: e.g., `https://promisex-backend.onrender.com`.

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and import the repository `Srinugunshetty/PromiSex_AI`.
2. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://promisex-backend.onrender.com/api`
4. Click **Deploy**. Vercel will give you a domain like `https://promisex.vercel.app`.

---

## Setting Up a Custom Domain (e.g. `promisex.ai` or `app.yourdomain.com`)

To point your custom domain name to your deployed app:

1. **On Render or Railway**:
   - Go to your service **Settings** → **Custom Domains**.
   - Click **Add Custom Domain** and enter your domain (e.g. `app.promisex.com` or `promisex.ai`).
2. **In your DNS Provider (GoDaddy, Namecheap, Cloudflare, Route53)**:
   - For subdomains (e.g. `app.promisex.com`): Add a **CNAME** record pointing to the Render/Railway host (e.g., `promisex-ai.onrender.com`).
   - For apex domain (`promisex.ai`): Add an **ALIAS** or **ANAME** or **A** record as directed by Render/Railway.
3. SSL certificates (HTTPS) are provisioned automatically for free via Let's Encrypt.

---

## Testing Your Deployed Platform

Once deployed, verify the installation:
- **Web App**: Visit `https://<your-deployed-domain>/`
- **Health Check**: Visit `https://<your-deployed-domain>/api/health`
- **Interactive Swagger Docs**: Visit `https://<your-deployed-domain>/docs`
