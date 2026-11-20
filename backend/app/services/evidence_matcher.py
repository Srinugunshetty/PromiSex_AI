import re
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models.schemas import Claim, EvidenceDocument, EvidenceCitation

class EvidenceMatcher:
    def __init__(self):
        pass

    def chunk_document(self, doc: EvidenceDocument) -> List[Dict[str, Any]]:
        """Splits document text into readable, cited paragraphs or sections."""
        chunks = []
        raw_text = doc.text_content
        # Split by numbered sections like "1. PROCESSOR", "Section 1: ...", markdown headings "#", or double newlines
        sections = re.split(r'\n(?=(?:\d+\.\s+[A-Z]|Section\s+\d+|#{1,3}\s+|[A-Z\s]{4,}:))', raw_text)

        current_page = 1
        for sec in sections:
            sec_clean = sec.strip()
            if not sec_clean:
                continue

            page_match = re.search(r'---\s*Page\s*(\d+)\s*---', sec_clean)
            if page_match:
                current_page = int(page_match.group(1))

            lines = [l.strip() for l in sec_clean.splitlines() if l.strip()]
            header = lines[0] if lines else "General Spec"

            # Filter out pure page separator lines
            body_text = "\n".join([l for l in lines if not l.startswith("---")])
            if len(body_text) > 15:
                chunks.append({
                    "doc_id": doc.id,
                    "doc_title": doc.title,
                    "doc_type": doc.doc_type,
                    "section": header[:60],
                    "page": current_page,
                    "text": body_text
                })
        return chunks

    def find_matches_for_claim(self, claim: Claim, documents: List[EvidenceDocument], top_k: int = 3) -> List[EvidenceCitation]:
        all_chunks: List[Dict[str, Any]] = []
        for doc in documents:
            all_chunks.extend(self.chunk_document(doc))

        if not all_chunks:
            return []

        corpus = [c["text"] for c in all_chunks]
        query = f"{claim.claim_text} {claim.metric or ''} {claim.promised_value or ''} {claim.category}"

        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
            tfidf_matrix = vectorizer.fit_transform(corpus + [query])
            query_vec = tfidf_matrix[-1]
            doc_vecs = tfidf_matrix[:-1]

            sims = cosine_similarity(query_vec, doc_vecs)[0]
            top_indices = sims.argsort()[::-1][:top_k]

            citations: List[EvidenceCitation] = []
            for idx in top_indices:
                score = float(sims[idx])
                # Allow relevant contextual paragraphs
                if score > 0.05:
                    chunk = all_chunks[idx]
                    citations.append(EvidenceCitation(
                        source_name=chunk["doc_title"],
                        doc_type=chunk["doc_type"],
                        section=chunk["section"],
                        page=chunk["page"],
                        snippet=chunk["text"],
                        relevance_score=round(score, 3)
                    ))
            return citations
        except Exception as e:
            print(f"[EvidenceMatcher] TF-IDF matching error: {e}")
            return []

evidence_matcher = EvidenceMatcher()
