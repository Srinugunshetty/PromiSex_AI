const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}

export async function fetchProductDetail(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}`);
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function extractClaims(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/extract-claims`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchProductEvidence(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/evidence`);
  return res.json();
}

export async function uploadEvidenceDoc(productId, formData) {
  const res = await fetch(`${API_BASE}/products/${productId}/upload-evidence`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function runReconciliation(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/reconcile`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchPromiseGraph(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/graph`);
  return res.json();
}

export async function fetchCypherExport(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}/cypher`);
  return res.json();
}

export async function verifyDelivery(payload) {
  const res = await fetch(`${API_BASE}/delivery/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/delivery/orders`);
  return res.json();
}

export async function fetchDiscrepancies() {
  const res = await fetch(`${API_BASE}/discrepancies`);
  return res.json();
}

export async function fetchDiscrepancyDetail(reportId) {
  const res = await fetch(`${API_BASE}/discrepancies/${reportId}`);
  return res.json();
}

export async function updateDiscrepancyStatus(reportId, payload) {
  const res = await fetch(`${API_BASE}/discrepancies/${reportId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchSellers() {
  const res = await fetch(`${API_BASE}/sellers`);
  return res.json();
}

export async function fetchSellerDetail(sellerId) {
  const res = await fetch(`${API_BASE}/sellers/${sellerId}`);
  return res.json();
}

export async function resetDemo() {
  const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
  return res.json();
}

export async function fetchEvaluationMetrics() {
  const res = await fetch(`${API_BASE}/demo/metrics`);
  return res.json();
}

export async function fetchWalkthroughGuide() {
  const res = await fetch(`${API_BASE}/demo/walkthrough`);
  return res.json();
}
