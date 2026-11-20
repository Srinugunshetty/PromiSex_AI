import uvicorn
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    reload = os.environ.get("RELOAD", "false").lower() == "true"
    print(f"[PROMISEX AI] Starting production server on {host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
