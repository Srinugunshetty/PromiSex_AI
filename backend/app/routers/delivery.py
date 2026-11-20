from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.schemas import DeliveryVerificationRequest
from app.services.delivery_verifier import delivery_verifier
from app.models.database import db

router = APIRouter(prefix="/delivery", tags=["Delivery Verification"])

@router.get("/orders")
def list_orders():
    return db.get_orders()

@router.get("/orders/{order_id}")
def get_order(order_id: str):
    order = db.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    report = None
    if order.get("report_id"):
        report = db.get_discrepancy_report(order["report_id"])
    return {"order": order, "report": report}

@router.post("/verify")
def verify_delivery_package(payload: DeliveryVerificationRequest):
    prod = db.get_product(payload.product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    order_record, report = delivery_verifier.verify_delivery(payload)
    return {
        "message": "Delivery verification completed.",
        "order": order_record,
        "discrepancy_report": report.model_dump()
    }
