from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class PromiseStatus(str, Enum):
    VERIFIED = "Verified"
    PARTIALLY_VERIFIED = "Partially verified"
    CONTRADICTED = "Contradicted"
    PENDING = "Pending"
    UNVERIFIABLE = "Unverifiable"

class ClaimCategory(str, Enum):
    PERFORMANCE = "Performance"
    MEMORY_STORAGE = "Memory/Storage"
    DISPLAY = "Display"
    BATTERY_POWER = "Battery/Power"
    WARRANTY_SERVICE = "Warranty/Service"
    CONNECTIVITY = "Connectivity/Ports"
    BUILD_MATERIALS = "Build & Materials"
    SOFTWARE_OS = "Software/OS"
    ACCESSORIES = "Accessories"
    GENERAL = "General"

class EvidenceSourceType(str, Enum):
    MANUFACTURER_SPEC = "manufacturer_spec"
    WARRANTY_POLICY = "warranty_policy"
    BENCHMARK_REPORT = "benchmark_report"
    DELIVERY_INVOICE = "delivery_invoice"
    UNBOXING_PHOTO = "unboxing_photo"
    SYSTEM_DIAGNOSTIC = "system_diagnostic"

class EvidenceCitation(BaseModel):
    source_name: str
    doc_type: str
    section: Optional[str] = None
    page: Optional[int] = None
    snippet: str
    relevance_score: float = 1.0

class ClaimBase(BaseModel):
    claim_text: str
    category: str = "General"
    metric: Optional[str] = None
    promised_value: Optional[str] = None
    unit: Optional[str] = None

class ClaimCreate(ClaimBase):
    product_id: str

class Claim(ClaimBase):
    id: str
    product_id: str
    status: PromiseStatus = PromiseStatus.PENDING
    confidence: float = 0.85
    verified_value: Optional[str] = None
    explanation: str = "Awaiting verification against manufacturer and supporting documents."
    evidence_citations: List[EvidenceCitation] = []
    source_section: Optional[str] = "Product Overview"
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ProductCreate(BaseModel):
    title: str
    brand: str
    model: str
    seller_name: str = "TechDirect Global"
    price: float = 1299.99
    currency: str = "USD"
    category: str = "Laptops"
    raw_listing_text: str
    image_url: Optional[str] = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"

class Product(BaseModel):
    id: str
    title: str
    brand: str
    model: str
    seller_id: str
    seller_name: str
    price: float
    currency: str
    category: str
    raw_listing_text: str
    image_url: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    claims: List[Claim] = []
    stats: Dict[str, Any] = {}

class EvidenceDocument(BaseModel):
    id: str
    product_id: str
    title: str
    doc_type: str
    filename: Optional[str] = None
    text_content: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class DeliveryVerificationRequest(BaseModel):
    order_id: str
    product_id: str
    customer_name: str = "John Doe"
    delivery_date: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    invoice_text: Optional[str] = ""
    diagnostic_text: Optional[str] = ""
    package_notes: Optional[str] = ""
    received_specs: Optional[Dict[str, str]] = {}

class DiscrepancyItem(BaseModel):
    claim_id: Optional[str] = None
    claim_text: str
    promised_value: str
    delivered_value: str
    discrepancy_type: str  # Specification Mismatch, Missing Accessory, Warranty Shortfall
    severity: str          # Critical, High, Medium, Low
    impact: str

class DiscrepancyReport(BaseModel):
    id: str
    order_id: str
    product_id: str
    product_title: str
    seller_name: str
    customer_name: str
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    severity: str = "High"  # Critical, High, Medium, Low
    summary: str
    items: List[DiscrepancyItem] = []
    evidence_proof: str
    recommended_action: str
    status: str = "Pending Seller Review"

class SellerProfile(BaseModel):
    id: str
    name: str
    rating: float = 4.3
    total_orders: int = 1540
    total_products: int = 42
    trust_score: float = 84.5
    risk_level: str = "Moderate"
    contradiction_rate: float = 14.2
    recurring_issues: List[str] = []
    recent_discrepancies: int = 6

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # product, seller, claim, evidence, order, discrepancy
    status: Optional[str] = None
    group: str
    color: Optional[str] = None
    size: int = 25
    metadata: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relation: str  # PROMISES, SOLD_BY, SUPPORTED_BY, CONTRADICTED_BY, UNVERIFIED_BY, ORDERED_IN, FLAGGED_DISCREPANCY
    label: str
    color: Optional[str] = None
    style: Optional[str] = "solid"

class PromiseGraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class EvaluationMetrics(BaseModel):
    claim_extraction_precision: float = 0.94
    claim_extraction_recall: float = 0.91
    claim_extraction_f1: float = 0.925
    evidence_matching_precision_k: float = 0.89
    evidence_matching_recall_k: float = 0.93
    contradiction_detection_accuracy: float = 0.92
    contradiction_macro_f1: float = 0.91
    ml_risk_roc_auc: float = 0.88
    ml_risk_pr_auc: float = 0.85
    dataset_name: str = "PromiseEvidence-1K"
    human_curated_examples: int = 1000
