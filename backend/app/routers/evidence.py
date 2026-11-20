import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Dict, Any, Optional
from pathlib import Path
from app.config import settings
from app.models.database import db
from app.models.schemas import EvidenceDocument, Claim, PromiseStatus
from app.services.document_parser import doc_parser
from app.services.evidence_matcher import evidence_matcher
from app.services.contradiction_detector import contradiction_detector

router = APIRouter(prefix="/products", tags=["Evidence Reconciliation"])

@router.get("/{product_id}/evidence")
def get_product_evidence(product_id: str):
    return db.get_evidence_by_product(product_id)

@router.post("/{product_id}/upload-evidence")
async def upload_evidence_document(
    product_id: str,
    title: str = Form(...),
    doc_type: str = Form("manufacturer_spec"),
    text_content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    prod = db.get_product(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    content = text_content or ""
    filename = None

    if file:
        filename = file.filename
        save_path = settings.UPLOAD_DIR / f"{uuid.uuid4().hex[:6]}_{filename}"
        with open(save_path, "wb") as f:
            f.write(await file.read())
        extracted = doc_parser.extract_text_from_file(save_path)
        if extracted:
            content = extracted + ("\n" + content if content else "")

    if not content.strip():
        content = "Standard manufacturer specification sheet documentation provided for verification."

    doc_id = f"doc_{uuid.uuid4().hex[:8]}"
    doc_data = {
        "id": doc_id,
        "product_id": product_id,
        "title": title,
        "doc_type": doc_type,
        "filename": filename or f"{title.lower().replace(' ', '_')}.txt",
        "text_content": content,
        "created_at": datetime.utcnow().isoformat()
    }
    db.save_evidence_doc(doc_data)

    return {"message": "Evidence document registered", "document": doc_data}

@router.post("/{product_id}/reconcile")
def run_evidence_reconciliation(product_id: str):
    prod = db.get_product(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    claims_raw = db.get_claims_by_product(product_id)
    evidence_docs_raw = db.get_evidence_by_product(product_id)

    if not evidence_docs_raw:
        raise HTTPException(status_code=400, detail="No evidence documents uploaded. Please upload a manufacturer spec or warranty sheet first.")

    evidence_docs = [EvidenceDocument(**d) for d in evidence_docs_raw]

    reconciled_claims = []
    status_summary = {
        "Verified": 0,
        "Partially verified": 0,
        "Contradicted": 0,
        "Unverifiable": 0
    }

    for c_raw in claims_raw:
        claim_obj = Claim(**c_raw)
        # 1. Match relevant evidence snippets
        citations = evidence_matcher.find_matches_for_claim(claim_obj, evidence_docs, top_k=2)
        
        # 2. Contradiction & Entailment evaluation
        status, conf, ver_val, explanation = contradiction_detector.evaluate_claim(claim_obj, citations)

        claim_obj.status = status
        claim_obj.confidence = conf
        claim_obj.verified_value = ver_val
        claim_obj.explanation = explanation
        claim_obj.evidence_citations = citations

        db.save_claim(claim_obj.model_dump())
        reconciled_claims.append(claim_obj.model_dump())
        status_summary[status.value] = status_summary.get(status.value, 0) + 1

    return {
        "message": f"Evidence reconciliation completed for {len(reconciled_claims)} claims.",
        "summary": status_summary,
        "claims": reconciled_claims
    }
