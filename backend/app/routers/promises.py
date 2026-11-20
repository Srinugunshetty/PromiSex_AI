from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.database import db
from app.services.claim_extractor import claim_extractor

router = APIRouter(tags=["Promises"])

@router.get("/products/{product_id}/claims")
def get_product_claims(product_id: str):
    claims = db.get_claims_by_product(product_id)
    return claims

@router.post("/products/{product_id}/extract-claims")
def trigger_claim_extraction(product_id: str):
    product = db.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    extracted = claim_extractor.extract_claims(product_id, product.get("raw_listing_text", ""))
    claims_dump = [c.model_dump() for c in extracted]
    db.save_claims(claims_dump)

    return {
        "message": f"Successfully extracted {len(claims_dump)} product promises.",
        "claims": claims_dump
    }

@router.post("/claims/{claim_id}/status")
def update_claim_status(claim_id: str, payload: Dict[str, Any]):
    all_claims = db.data.get("claims", {})
    if claim_id not in all_claims:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim = all_claims[claim_id]
    if "status" in payload:
        claim["status"] = payload["status"]
    if "explanation" in payload:
        claim["explanation"] = payload["explanation"]
    if "verified_value" in payload:
        claim["verified_value"] = payload["verified_value"]

    db.save_claim(claim)
    return {"message": "Claim updated successfully", "claim": claim}
