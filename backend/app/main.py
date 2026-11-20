import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from app.config import settings
from app.seed_data import seed_database
from app.routers import products, promises, evidence, graph, delivery, discrepancy, seller, demo, monitoring

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Seed database if needed
    print("[PROMISEX AI] Starting backend server...")
    seed_database()
    yield
    print("[PROMISEX AI] Shutting down backend server...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Product Promise Verification & Accountability Platform",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(products.router, prefix="/api")
app.include_router(promises.router, prefix="/api")
app.include_router(evidence.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(delivery.router, prefix="/api")
app.include_router(discrepancy.router, prefix="/api")
app.include_router(seller.router, prefix="/api")
app.include_router(demo.router, prefix="/api")
app.include_router(monitoring.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "endpoint": "PromiSex Verification Service",
        "version": settings.APP_VERSION,
        "gemini_api_configured": bool(settings.GEMINI_API_KEY)
    }

# Mount Frontend SPA static build
dist_dir = settings.BASE_DIR / "frontend" / "dist"
if dist_dir.exists():
    assets_dir = dist_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/promisex")
    async def serve_promisex_alias():
        return FileResponse(dist_dir / "index.html")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Do not catch /api calls
        if full_path.startswith("api/"):
            return None
        file_path = dist_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist_dir / "index.html")

if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host=host, port=port, reload=False)
