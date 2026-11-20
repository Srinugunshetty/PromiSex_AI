import json
import logging
from typing import Optional, Dict, Any, List
import requests
from app.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5)

    def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Optional[Any]:
        if not self.is_configured():
            return None

        model = "gemini-1.5-flash"
        url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"

        payload: Dict[str, Any] = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json"
            }
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        try:
            resp = requests.post(url, json=payload, timeout=20)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
            else:
                logger.warning(f"Gemini API returned code {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
        return None

gemini_service = GeminiService()
