import networkx as nx
from typing import Dict, Any, List
from app.models.schemas import PromiseGraphData, GraphNode, GraphEdge, PromiseStatus
from app.models.database import db

STATUS_COLORS = {
    PromiseStatus.VERIFIED.value: "#10b981",       # Emerald green
    PromiseStatus.CONTRADICTED.value: "#ef4444",   # Crimson red
    PromiseStatus.PARTIALLY_VERIFIED.value: "#f59e0b", # Amber
    PromiseStatus.UNVERIFIABLE.value: "#8b5cf6",   # Purple
    PromiseStatus.PENDING.value: "#64748b"         # Slate gray
}

class PromiseGraphService:
    def __init__(self):
        pass

    def build_graph(self, product_id: str) -> PromiseGraphData:
        prod = db.get_product(product_id)
        if not prod:
            return PromiseGraphData(nodes=[], edges=[])

        G = nx.DiGraph()
        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []

        # 1. Product Node
        p_id = f"prod_{prod['id']}"
        nodes.append(GraphNode(
            id=p_id,
            label=prod["title"][:24] + "...",
            type="product",
            group="product",
            color="#3b82f6", # Blue
            size=35,
            metadata={
                "title": prod["title"],
                "brand": prod.get("brand"),
                "price": prod.get("price"),
                "category": prod.get("category")
            }
        ))

        # 2. Seller Node
        seller_id = f"seller_{prod.get('seller_id', 's1')}"
        seller_name = prod.get("seller_name", "TechDirect Global")
        nodes.append(GraphNode(
            id=seller_id,
            label=f"Seller: {seller_name}",
            type="seller",
            group="seller",
            color="#06b6d4", # Cyan
            size=28,
            metadata={"seller_name": seller_name}
        ))
        edges.append(GraphEdge(
            id=f"e_{seller_id}_{p_id}",
            source=seller_id,
            target=p_id,
            relation="OFFERS",
            label="lists product",
            color="#06b6d4"
        ))

        # 3. Evidence Document Nodes
        evidence_docs = db.get_evidence_by_product(product_id)
        doc_node_ids = {}
        for ed in evidence_docs:
            d_id = f"doc_{ed['id']}"
            doc_node_ids[ed["id"]] = d_id
            nodes.append(GraphNode(
                id=d_id,
                label=f"Doc: {ed['title'][:20]}...",
                type="evidence",
                group="evidence",
                color="#0284c7", # Sky blue
                size=26,
                metadata={"title": ed["title"], "type": ed["doc_type"]}
            ))
            edges.append(GraphEdge(
                id=f"e_{p_id}_{d_id}",
                source=p_id,
                target=d_id,
                relation="REFERENCED_SPEC",
                label="manufacturer spec",
                color="#38bdf8",
                style="dashed"
            ))

        # 4. Claim / Promise Nodes
        claims = db.get_claims_by_product(product_id)
        for c in claims:
            c_node_id = f"claim_{c['id']}"
            st = c.get("status", PromiseStatus.PENDING.value)
            st_val = st.value if hasattr(st, "value") else str(st)
            color = STATUS_COLORS.get(st_val, "#64748b")

            nodes.append(GraphNode(
                id=c_node_id,
                label=f"{c.get('metric') or 'Claim'}: {c.get('promised_value') or ''}"[:28],
                type="claim",
                status=st_val,
                group="claim",
                color=color,
                size=22,
                metadata={
                    "claim_text": c.get("claim_text"),
                    "category": c.get("category"),
                    "status": st_val,
                    "confidence": c.get("confidence"),
                    "explanation": c.get("explanation"),
                    "verified_value": c.get("verified_value")
                }
            ))

            edges.append(GraphEdge(
                id=f"e_{p_id}_{c_node_id}",
                source=p_id,
                target=c_node_id,
                relation="PROMISES",
                label="promises",
                color="#94a3b8"
            ))

            # Connect Claim to Evidence if citations exist
            for cit in c.get("evidence_citations", []):
                # find doc
                matching_doc_id = None
                for ed in evidence_docs:
                    if ed["title"] in cit.get("source_name", "") or cit.get("source_name", "") in ed["title"]:
                        matching_doc_id = f"doc_{ed['id']}"
                        break
                if matching_doc_id:
                    rel_type = "SUPPORTS" if st_val == PromiseStatus.VERIFIED.value else (
                        "CONTRADICTS" if st_val == PromiseStatus.CONTRADICTED.value else "PARTIAL_MATCH"
                    )
                    edges.append(GraphEdge(
                        id=f"e_{matching_doc_id}_{c_node_id}",
                        source=matching_doc_id,
                        target=c_node_id,
                        relation=rel_type,
                        label=rel_type.lower(),
                        color=color
                    ))

        # 5. Orders & Discrepancies
        all_orders = db.get_orders()
        prod_orders = [o for o in all_orders if o.get("product_id") == product_id]
        for o in prod_orders:
            o_id = f"order_{o['order_id']}"
            nodes.append(GraphNode(
                id=o_id,
                label=f"Order #{o['order_id']}",
                type="order",
                group="order",
                color="#ec4899", # Pink
                size=24,
                metadata=o
            ))
            edges.append(GraphEdge(
                id=f"e_{o_id}_{p_id}",
                source=o_id,
                target=p_id,
                relation="FULFILLMENT",
                label="purchased",
                color="#f472b6"
            ))

        all_reports = db.get_discrepancy_reports()
        prod_reports = [r for r in all_reports if r.get("product_id") == product_id]
        for r in prod_reports:
            r_id = f"discrepancy_{r['id']}"
            nodes.append(GraphNode(
                id=r_id,
                label=f"Discrepancy: {r.get('severity')} Alert",
                type="discrepancy",
                group="discrepancy",
                color="#dc2626", # Dark red
                size=27,
                metadata=r
            ))
            edges.append(GraphEdge(
                id=f"e_{p_id}_{r_id}",
                source=p_id,
                target=r_id,
                relation="GENERATED_DISCREPANCY",
                label="dispute flagged",
                color="#dc2626"
            ))

        return PromiseGraphData(nodes=nodes, edges=edges)

    def export_cypher_queries(self, product_id: str) -> List[str]:
        """Generates exportable Neo4j Cypher queries for the knowledge graph."""
        graph_data = self.build_graph(product_id)
        queries = []
        for n in graph_data.nodes:
            lbl = n.type.capitalize()
            clean_label = n.label.replace("'", "")
            queries.append(
                f"MERGE (n:{lbl} {{id: '{n.id}', name: '{clean_label}', type: '{n.type}'}});"
            )
        for e in graph_data.edges:
            queries.append(
                f"MATCH (a {{id: '{e.source}'}}), (b {{id: '{e.target}'}}) "
                f"MERGE (a)-[:{e.relation} {{label: '{e.label}'}}]->(b);"
            )
        return queries

promise_graph_service = PromiseGraphService()
