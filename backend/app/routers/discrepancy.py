from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.database import db

router = APIRouter(prefix="/discrepancies", tags=["Discrepancy Management"])

@router.get("")
def list_discrepancy_reports():
    return db.get_discrepancy_reports()

@router.get("/{report_id}")
def get_discrepancy_report(report_id: str):
    report = db.get_discrepancy_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Discrepancy report not found")
    return report

@router.post("/{report_id}/status")
def update_discrepancy_status(report_id: str, payload: Dict[str, Any]):
    report = db.get_discrepancy_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Discrepancy report not found")

    new_status = payload.get("status", "Under Seller Dispute Review")
    seller_notes = payload.get("seller_notes")

    report["status"] = new_status
    if seller_notes:
        report["seller_notes"] = seller_notes

    db.save_discrepancy_report(report)

    # Synchronize corresponding delivery order status if exists
    order_id = report.get("order_id")
    if order_id:
        order = db.get_order(order_id)
        if order:
            if "Resolved" in new_status:
                order["status"] = "Dispute Resolved"
            elif "Arbitration" in new_status:
                order["status"] = "Under Arbitration"
            else:
                order["status"] = new_status
            db.save_order(order)

    return {"message": "Status updated successfully", "report": report}
