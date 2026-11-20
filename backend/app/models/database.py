import json
import os
import threading
from pathlib import Path
from typing import Dict, List, Optional, Any
from app.config import settings

class Database:
    def __init__(self, db_path: Path = settings.DB_PATH):
        self.db_path = db_path
        self.lock = threading.Lock()
        self.data: Dict[str, Any] = {
            "products": {},
            "claims": {},
            "evidence_documents": {},
            "delivery_orders": {},
            "discrepancy_reports": {},
            "sellers": {},
        }
        self.load()

    def load(self):
        with self.lock:
            if self.db_path.exists():
                try:
                    with open(self.db_path, "r", encoding="utf-8") as f:
                        loaded = json.load(f)
                        self.data.update(loaded)
                except Exception as e:
                    print(f"[Database] Error loading db: {e}")
            else:
                self.save_internal()

    def save_internal(self):
        try:
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[Database] Error saving db: {e}")

    def save(self):
        with self.lock:
            self.save_internal()

    # --- Product CRUD ---
    def get_products(self) -> List[Dict[str, Any]]:
        with self.lock:
            return list(self.data["products"].values())

    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            prod = self.data["products"].get(product_id)
            if not prod:
                return None
            # Attach claims
            prod_copy = dict(prod)
            prod_copy["claims"] = [
                c for c in self.data["claims"].values() if c.get("product_id") == product_id
            ]
            return prod_copy

    def save_product(self, product_data: Dict[str, Any]):
        with self.lock:
            self.data["products"][product_data["id"]] = product_data
            self.save_internal()

    # --- Claims CRUD ---
    def get_claims_by_product(self, product_id: str) -> List[Dict[str, Any]]:
        with self.lock:
            return [c for c in self.data["claims"].values() if c.get("product_id") == product_id]

    def save_claim(self, claim_data: Dict[str, Any]):
        with self.lock:
            self.data["claims"][claim_data["id"]] = claim_data
            self.save_internal()

    def save_claims(self, claims_list: List[Dict[str, Any]]):
        with self.lock:
            for c in claims_list:
                self.data["claims"][c["id"]] = c
            self.save_internal()

    # --- Evidence Documents ---
    def get_evidence_by_product(self, product_id: str) -> List[Dict[str, Any]]:
        with self.lock:
            return [d for d in self.data["evidence_documents"].values() if d.get("product_id") == product_id]

    def save_evidence_doc(self, doc_data: Dict[str, Any]):
        with self.lock:
            self.data["evidence_documents"][doc_data["id"]] = doc_data
            self.save_internal()

    # --- Delivery & Orders ---
    def get_orders(self) -> List[Dict[str, Any]]:
        with self.lock:
            return list(self.data["delivery_orders"].values())

    def get_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            return self.data["delivery_orders"].get(order_id)

    def save_order(self, order_data: Dict[str, Any]):
        with self.lock:
            self.data["delivery_orders"][order_data["order_id"]] = order_data
            self.save_internal()

    # --- Discrepancy Reports ---
    def get_discrepancy_reports(self) -> List[Dict[str, Any]]:
        with self.lock:
            return list(self.data["discrepancy_reports"].values())

    def get_discrepancy_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            return self.data["discrepancy_reports"].get(report_id)

    def save_discrepancy_report(self, report_data: Dict[str, Any]):
        with self.lock:
            self.data["discrepancy_reports"][report_data["id"]] = report_data
            self.save_internal()

    # --- Sellers ---
    def get_sellers(self) -> List[Dict[str, Any]]:
        with self.lock:
            return list(self.data["sellers"].values())

    def get_seller(self, seller_id: str) -> Optional[Dict[str, Any]]:
        with self.lock:
            return self.data["sellers"].get(seller_id)

    def save_seller(self, seller_data: Dict[str, Any]):
        with self.lock:
            self.data["sellers"][seller_data["id"]] = seller_data
            self.save_internal()

    def reset_all(self):
        with self.lock:
            self.data = {
                "products": {},
                "claims": {},
                "evidence_documents": {},
                "delivery_orders": {},
                "discrepancy_reports": {},
                "sellers": {},
            }
            self.save_internal()

db = Database()
