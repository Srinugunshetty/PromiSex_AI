from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.database import db
from app.services.ml_risk_engine import ml_risk_engine

router = APIRouter(prefix="/sellers", tags=["Seller Intelligence"])

@router.get("")
def list_sellers():
    sellers = db.get_sellers()
    return sellers

@router.get("/{seller_id}")
def get_seller_intelligence(seller_id: str):
    seller = db.get_seller(seller_id)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller profile not found")

    # Evaluate ML Risk prediction for this seller
    risk_assessment = ml_risk_engine.assess_risk({
        "claim_count": 14,
        "price_vs_category_median": 0.95,
        "seller_contradiction_rate": seller.get("contradiction_rate", 16.5) / 100.0,
        "warranty_years": 2.0,
        "battery_hours": 12.0,
        "has_unverifiable": True
    })

    return {
        "seller": seller,
        "ml_risk_assessment": risk_assessment,
        "recurring_issues": seller.get("recurring_issues", []),
        "disputes_count": seller.get("recent_discrepancies", 6)
    }
