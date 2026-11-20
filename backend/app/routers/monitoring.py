import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.models.database import db

router = APIRouter(prefix="/monitoring", tags=["Promise Monitoring"])

class MonitoringItem(BaseModel):
    id: Optional[str] = None
    product_id: str
    order_id: Optional[str] = "PX-89421"
    claim_id: Optional[str] = None
    title: str
    category: str  # Warranty, Delivery SLA, Performance Drift
    start_date: str
    target_date: str
    status: str    # Active, Expiring Soon, Expired, Fulfilled, Breached
    days_remaining: int
    commitment_text: str
    verified_reality: str
    notes: Optional[str] = None

# Seed initial monitoring items if not present
def get_or_init_monitoring():
    if "monitoring_items" not in db.data:
        db.data["monitoring_items"] = {
            "mon_1": {
                "id": "mon_1",
                "product_id": "prod_ultrabook_15",
                "order_id": "PX-89421",
                "claim_id": "clm_warranty",
                "title": "Manufacturer Hardware Warranty (Year 1)",
                "category": "Warranty",
                "start_date": "2026-11-15",
                "target_date": "2027-11-15",
                "status": "Active",
                "days_remaining": 359,
                "commitment_text": "1-Year Official TechCorp Limited Hardware Warranty",
                "verified_reality": "Active in TechCorp Registry under SN UP15-99482",
                "notes": "Standard manufacturer parts & labor covered."
            },
            "mon_2": {
                "id": "mon_2",
                "product_id": "prod_ultrabook_15",
                "order_id": "PX-89421",
                "claim_id": "clm_warranty",
                "title": "Advertised Extended Warranty (Year 2)",
                "category": "Warranty",
                "start_date": "2027-11-15",
                "target_date": "2028-11-15",
                "status": "Breached / Unregistered",
                "days_remaining": 0,
                "commitment_text": "2nd-Year Comprehensive Merchant Warranty",
                "verified_reality": "No 3rd-party insurance certificate found in merchant portal",
                "notes": "Merchant has not registered warranty extension with Underwriter."
            },
            "mon_3": {
                "id": "mon_3",
                "product_id": "prod_ultrabook_15",
                "order_id": "PX-89421",
                "claim_id": "clm_battery",
                "title": "Battery Capacity & Runtime Benchmark",
                "category": "Performance Drift",
                "start_date": "2026-11-15",
                "target_date": "2027-05-15",
                "status": "Under Observation",
                "days_remaining": 175,
                "commitment_text": "12-Hour All-Day Operational Battery Runtime",
                "verified_reality": "Current cycle test records 7.8h - 8.2h MobileMark runtime",
                "notes": "Capacity degradation telemetry logging enabled."
            },
            "mon_4": {
                "id": "mon_4",
                "product_id": "prod_ultrabook_15",
                "order_id": "PX-89421",
                "claim_id": "clm_support",
                "title": "Customer Support Response SLA",
                "category": "Service SLA",
                "start_date": "2026-11-15",
                "target_date": "2027-11-15",
                "status": "Non-Compliant",
                "days_remaining": 359,
                "commitment_text": "24/7 Priority VIP Concierge Phone & Chat Support",
                "verified_reality": "Support hours restricted to Mon-Fri 9:00 AM - 5:00 PM EST",
                "notes": "Customer escalated after weekend ticket remained unanswered for 48 hours."
            }
        }
        db.save_internal()
    return list(db.data["monitoring_items"].values())

@router.get("")
def list_monitoring_items(product_id: Optional[str] = None):
    items = get_or_init_monitoring()
    if product_id:
        return [i for i in items if i.get("product_id") == product_id]
    return items

@router.post("")
def create_monitoring_item(item: MonitoringItem):
    item_id = item.id or f"mon_{uuid.uuid4().hex[:6]}"
    item_dict = item.model_dump()
    item_dict["id"] = item_id
    get_or_init_monitoring()
    db.data["monitoring_items"][item_id] = item_dict
    db.save_internal()
    return {"message": "Monitoring commitment registered", "item": item_dict}

@router.put("/{item_id}")
def update_monitoring_item(item_id: str, updates: Dict[str, Any]):
    get_or_init_monitoring()
    if item_id not in db.data["monitoring_items"]:
        raise HTTPException(status_code=404, detail="Monitoring item not found")
    db.data["monitoring_items"][item_id].update(updates)
    db.save_internal()
    return {"message": "Monitoring item updated", "item": db.data["monitoring_items"][item_id]}

@router.delete("/{item_id}")
def delete_monitoring_item(item_id: str):
    get_or_init_monitoring()
    if item_id in db.data["monitoring_items"]:
        del db.data["monitoring_items"][item_id]
        db.save_internal()
        return {"message": "Deleted"}
    raise HTTPException(status_code=404, detail="Item not found")
