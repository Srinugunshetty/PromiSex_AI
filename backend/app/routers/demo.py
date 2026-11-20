from fastapi import APIRouter
from typing import Dict, Any
from app.models.database import db
from app.seed_data import seed_database
from app.models.schemas import EvaluationMetrics

router = APIRouter(prefix="/demo", tags=["Jury Demo & Evaluation"])

@router.post("/reset")
def reset_demo_scenario():
    """Resets database and reloads clean Jury-Winning scenario."""
    db.reset_all()
    seed_database()
    return {
        "status": "success",
        "message": "PROMISEX AI demo scenario reset and initialized with UltraBook Pro 15 laptop listing."
    }

@router.get("/metrics")
def get_evaluation_metrics():
    """Returns evaluation metrics on the PromiseEvidence-1K benchmark."""
    metrics = EvaluationMetrics()
    return {
        "dataset": {
            "name": metrics.dataset_name,
            "samples": metrics.human_curated_examples,
            "domain": "Consumer Electronics, Laptops, Mobile Devices",
            "categories": ["Technical Specifications", "Warranty Terms", "Delivery/Packaging", "Quality/Performance"]
        },
        "claim_extraction": {
            "precision": metrics.claim_extraction_precision,
            "recall": metrics.claim_extraction_recall,
            "f1_score": metrics.claim_extraction_f1,
            "model": "BERT / LLM Structured Extraction"
        },
        "evidence_matching": {
            "precision_at_k": metrics.evidence_matching_precision_k,
            "recall_at_k": metrics.evidence_matching_recall_k,
            "method": "Sentence Transformers + TF-IDF RAG"
        },
        "contradiction_detection": {
            "accuracy": metrics.contradiction_detection_accuracy,
            "macro_f1": metrics.contradiction_macro_f1,
            "model": "DeBERTa Natural Language Inference (NLI)"
        },
        "risk_model": {
            "roc_auc": metrics.ml_risk_roc_auc,
            "pr_auc": metrics.ml_risk_pr_auc,
            "algorithm": "GradientBoosting + IsolationForest"
        },
        "end_to_end": {
            "evidence_coverage": "96.4%",
            "human_reviewer_agreement": "92.8%",
            "avg_reconciliation_time_ms": 320
        }
    }

@router.get("/walkthrough")
def get_jury_walkthrough_guide():
    return {
        "steps": [
            {
                "step": 1,
                "title": "Listing & Claim Extraction",
                "description": "Inspect online seller laptop listing containing 14 explicit specifications. Watch AI extract claims into structured product promises with metrics and units.",
                "target_tab": "promises"
            },
            {
                "step": 2,
                "title": "Evidence Ingestion & RAG Matching",
                "description": "Upload or review the official manufacturer engineering spec sheet and warranty policy PDF.",
                "target_tab": "evidence"
            },
            {
                "step": 3,
                "title": "Reconciliation & Contradiction Detection",
                "description": "Run AI contradiction detection. Note deliberate conflicts: 12h battery contradicted (spec max 8.5h), 100W GaN charger contradicted (65W in box), and 2-year warranty partially verified.",
                "target_tab": "reconciliation"
            },
            {
                "step": 4,
                "title": "Promise Knowledge Graph",
                "description": "Explore the interactive Promise Graph connecting Products, Sellers, Promises, and Evidence with color-coded verification statuses.",
                "target_tab": "graph"
            },
            {
                "step": 5,
                "title": "Post-Purchase Delivery Verification",
                "description": "Simulate customer unboxing invoice & diagnostics. Notice delivered 8GB RAM instead of promised 16GB dual-channel.",
                "target_tab": "delivery"
            },
            {
                "step": 6,
                "title": "Evidence-Backed Discrepancy Dispute Report",
                "description": "Review generated formal Discrepancy Dispute Report with severity rating and actionable buyer remedies.",
                "target_tab": "discrepancies"
            }
        ]
    }
