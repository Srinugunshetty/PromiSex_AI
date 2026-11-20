import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.schemas import Product, ProductCreate
from app.models.database import db
from app.services.ml_risk_engine import ml_risk_engine
from app.services.claim_extractor import claim_extractor

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[Dict[str, Any]])
def list_products():
    products = db.get_products()
    res = []
    for p in products:
        claims = db.get_claims_by_product(p["id"])
        verified = sum(1 for c in claims if c.get("status") == "Verified")
        contradicted = sum(1 for c in claims if c.get("status") == "Contradicted")
        partially = sum(1 for c in claims if c.get("status") == "Partially verified")
        pending = sum(1 for c in claims if c.get("status") == "Pending")
        unverifiable = sum(1 for c in claims if c.get("status") == "Unverifiable")
        
        p_copy = dict(p)
        p_copy["stats"] = {
            "total_claims": len(claims),
            "verified": verified,
            "contradicted": contradicted,
            "partially_verified": partially,
            "pending": pending,
            "unverifiable": unverifiable,
            "trust_score": round((verified / len(claims) * 100) if claims else 80.0, 1)
        }
        res.append(p_copy)
    return res

@router.get("/{product_id}")
def get_product_detail(product_id: str):
    product = db.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    claims = db.get_claims_by_product(product_id)
    evidence_docs = db.get_evidence_by_product(product_id)

    # Calculate live stats
    verified = sum(1 for c in claims if c.get("status") == "Verified")
    contradicted = sum(1 for c in claims if c.get("status") == "Contradicted")
    partially = sum(1 for c in claims if c.get("status") == "Partially verified")
    unverifiable = sum(1 for c in claims if c.get("status") == "Unverifiable")
    pending = sum(1 for c in claims if c.get("status") == "Pending")

    # Assess ML discrepancy risk
    risk_assessment = ml_risk_engine.assess_risk({
        "claim_count": len(claims),
        "price_vs_category_median": 0.95,
        "seller_contradiction_rate": 0.165,
        "warranty_years": 2.0,
        "battery_hours": 12.0,
        "has_unverifiable": bool(unverifiable > 0)
    })

    return {
        "product": product,
        "claims": claims,
        "evidence_docs": evidence_docs,
        "stats": {
            "total_claims": len(claims),
            "verified": verified,
            "contradicted": contradicted,
            "partially_verified": partially,
            "unverifiable": unverifiable,
            "pending": pending,
            "trust_score": round((verified / len(claims) * 100) if claims else 75.0, 1)
        },
        "risk_assessment": risk_assessment
    }

@router.post("", response_model=Dict[str, Any])
def create_product(payload: ProductCreate):
    p_id = f"prod_{uuid.uuid4().hex[:8]}"
    seller_id = f"seller_{uuid.uuid4().hex[:6]}"
    
    prod_data = {
        "id": p_id,
        "title": payload.title,
        "brand": payload.brand,
        "model": payload.model,
        "seller_id": seller_id,
        "seller_name": payload.seller_name,
        "price": payload.price,
        "currency": payload.currency,
        "category": payload.category,
        "raw_listing_text": payload.raw_listing_text,
        "image_url": payload.image_url,
        "created_at": datetime.utcnow().isoformat(),
        "stats": {
            "total_claims": 0,
            "verified": 0,
            "contradicted": 0,
            "partially_verified": 0,
            "pending": 0,
            "unverifiable": 0,
            "trust_score": 100.0
        }
    }
    db.save_product(prod_data)

    # Auto extract claims
    extracted = claim_extractor.extract_claims(p_id, payload.raw_listing_text)
    db.save_claims([c.model_dump() for c in extracted])

    return {"message": "Product created and claims extracted", "product_id": p_id, "claims_count": len(extracted)}
