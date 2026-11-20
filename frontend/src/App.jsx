import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import JuryDemoPage from './pages/JuryDemoPage';
import ProductClaimsPage from './pages/ProductClaimsPage';
import EvidenceReconciliationPage from './pages/EvidenceReconciliationPage';
import PromiseGraphPage from './pages/PromiseGraphPage';
import DeliveryPage from './pages/DeliveryPage';
import DiscrepanciesPage from './pages/DiscrepanciesPage';
import SellerIntelligencePage from './pages/SellerIntelligencePage';

import DiscrepancyModal from './components/DiscrepancyModal';
import NewProductModal from './components/NewProductModal';
import UploadEvidenceModal from './components/UploadEvidenceModal';
import DeliveryVerifyModal from './components/DeliveryVerifyModal';

import {
  fetchProducts,
  fetchProductDetail,
  extractClaims,
  runReconciliation,
  fetchProductEvidence,
  uploadEvidenceDoc,
  fetchPromiseGraph,
  verifyDelivery,
  fetchOrders,
  fetchDiscrepancies,
  updateDiscrepancyStatus,
  createProduct,
  resetDemo,
} from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('jury');
  const [loading, setLoading] = useState(true);

  // Core Data
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [claims, setClaims] = useState([]);
  const [evidenceDocs, setEvidenceDocs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  // Modals
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [showDeliveryVerifyModal, setShowDeliveryVerifyModal] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = async (productId) => {
    try {
      const prods = await fetchProducts();
      setProducts(prods);

      const targetId = productId || (prods.length > 0 ? prods[0].id : 'prod_ultrabook_15');
      const detail = await fetchProductDetail(targetId);
      setActiveProduct(detail.product);
      setClaims(detail.claims || []);
      setEvidenceDocs(detail.evidence_docs || []);

      const [ords, disc, gData] = await Promise.all([
        fetchOrders(),
        fetchDiscrepancies(),
        fetchPromiseGraph(targetId),
      ]);
      setOrders(ords || []);
      setDiscrepancies(disc || []);
      setGraphData(gData || { nodes: [], edges: [] });
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('Error connecting to PROMISEX AI backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleResetDemo = async () => {
    try {
      await resetDemo();
      await loadAllData();
      showToast('PROMISEX AI demo scenario reset to initial laptop listing state!');
    } catch (err) {
      showToast('Reset failed: ' + err.message, 'error');
    }
  };

  const handleRunReconciliation = async () => {
    if (!activeProduct) return;
    try {
      const res = await runReconciliation(activeProduct.id);
      showToast(res.message);
      await loadAllData(activeProduct.id);
    } catch (err) {
      showToast('Reconciliation error: ' + err.message, 'error');
    }
  };

  const handleExtractClaims = async () => {
    if (!activeProduct) return;
    try {
      const res = await extractClaims(activeProduct.id);
      showToast(res.message);
      await loadAllData(activeProduct.id);
    } catch (err) {
      showToast('Claim extraction failed: ' + err.message, 'error');
    }
  };

  const handleCreateProduct = async (payload) => {
    const res = await createProduct(payload);
    showToast('Listing created & claims parsed successfully!');
    await loadAllData(res.product_id);
    setActiveTab('promises');
  };

  const handleUploadEvidence = async (productId, formData) => {
    await uploadEvidenceDoc(productId, formData);
    showToast('Evidence document ingested into RAG corpus!');
    await loadAllData(productId);
  };

  const handleVerifyDelivery = async (payload) => {
    const res = await verifyDelivery(payload);
    showToast('Delivery verification completed! Discrepancy flagged.');
    await loadAllData(payload.product_id);
    setSelectedDiscrepancy(res.discrepancy_report);
  };

  const handleUpdateDiscrepancyStatus = async (reportId, status) => {
    await updateDiscrepancyStatus(reportId, { status });
    showToast(`Status updated to: ${status}`);
    if (selectedDiscrepancy) {
      setSelectedDiscrepancy({ ...selectedDiscrepancy, status });
    }
    await loadAllData(activeProduct?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 rounded-2xl border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4"></div>
        <p className="font-semibold text-sm">Initializing PROMISEX AI Platform...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-400'
            }`}
          ></span>
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        onOpenNewProduct={() => setShowNewProductModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'jury' && (
          <JuryDemoPage
            product={activeProduct}
            claims={claims}
            evidenceDocs={evidenceDocs}
            orders={orders}
            discrepancies={discrepancies}
            onRunReconciliation={handleRunReconciliation}
            onVerifyDelivery={() => setShowDeliveryVerifyModal(true)}
            onNavigateTab={setActiveTab}
            onResetDemo={handleResetDemo}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            product={activeProduct}
            claims={claims}
            evidenceDocs={evidenceDocs}
            orders={orders}
            discrepancies={discrepancies}
            onNavigateTab={setActiveTab}
            onOpenDiscrepancy={setSelectedDiscrepancy}
          />
        )}

        {activeTab === 'promises' && (
          <ProductClaimsPage
            product={activeProduct}
            claims={claims}
            onExtractClaims={handleExtractClaims}
          />
        )}

        {activeTab === 'reconciliation' && (
          <EvidenceReconciliationPage
            product={activeProduct}
            claims={claims}
            evidenceDocs={evidenceDocs}
            onRunReconciliation={handleRunReconciliation}
            onOpenUploadEvidence={() => setShowUploadEvidenceModal(true)}
          />
        )}

        {activeTab === 'graph' && (
          <PromiseGraphPage
            graphData={graphData}
            onSelectNode={(node) => console.log('Selected node:', node)}
          />
        )}

        {activeTab === 'delivery' && (
          <DeliveryPage
            orders={orders}
            discrepancies={discrepancies}
            onOpenDeliveryVerifyModal={() => setShowDeliveryVerifyModal(true)}
            onOpenDiscrepancy={setSelectedDiscrepancy}
          />
        )}

        {activeTab === 'discrepancies' && (
          <DiscrepanciesPage
            discrepancies={discrepancies}
            onOpenDiscrepancy={setSelectedDiscrepancy}
          />
        )}

        {activeTab === 'seller' && <SellerIntelligencePage />}
      </main>

      {/* Modals */}
      {selectedDiscrepancy && (
        <DiscrepancyModal
          report={selectedDiscrepancy}
          onClose={() => setSelectedDiscrepancy(null)}
          onUpdateStatus={handleUpdateDiscrepancyStatus}
        />
      )}

      {showNewProductModal && (
        <NewProductModal
          onClose={() => setShowNewProductModal(false)}
          onSubmit={handleCreateProduct}
        />
      )}

      {showUploadEvidenceModal && (
        <UploadEvidenceModal
          productId={activeProduct?.id || 'prod_ultrabook_15'}
          onClose={() => setShowUploadEvidenceModal(false)}
          onSubmit={handleUploadEvidence}
        />
      )}

      {showDeliveryVerifyModal && (
        <DeliveryVerifyModal
          productId={activeProduct?.id || 'prod_ultrabook_15'}
          onClose={() => setShowDeliveryVerifyModal(false)}
          onVerified={handleVerifyDelivery}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          PROMISEX AI • AI-Powered Product Promise Verification & Accountability Platform •
          PromiseEvidence-1K Benchmark
        </p>
      </footer>
    </div>
  );
}
