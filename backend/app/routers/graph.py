from fastapi import APIRouter, HTTPException
from app.services.promise_graph import promise_graph_service
from app.models.database import db

router = APIRouter(prefix="/products", tags=["Promise Graph"])

@router.get("/{product_id}/graph")
def get_promise_graph(product_id: str):
    prod = db.get_product(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    graph_data = promise_graph_service.build_graph(product_id)
    return graph_data

@router.get("/{product_id}/cypher")
def get_cypher_export(product_id: str):
    prod = db.get_product(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    cypher_queries = promise_graph_service.export_cypher_queries(product_id)
    return {"queries": cypher_queries, "count": len(cypher_queries)}
