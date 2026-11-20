import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Module1_ProductIntelligence from './pages/Module1_ProductIntelligence';
import Module2_PromiseExtraction from './pages/Module2_PromiseExtraction';
import Module3_PromiseGraph from './pages/Module3_PromiseGraph';
import Module4_EvidenceVerification from './pages/Module4_EvidenceVerification';
import Module5_DeliveryVerification from './pages/Module5_DeliveryVerification';
import Module6_DiscrepancyManagement from './pages/Module6_DiscrepancyManagement';
import Module7_PromiseMonitoring from './pages/Module7_PromiseMonitoring';
import Module8_SellerIntelligence from './pages/Module8_SellerIntelligence';

import DiscrepancyModal from './components/DiscrepancyModal';
import NewProductModal from './components/NewProductModal';
import UploadEvidenceModal from './components/UploadEvidenceModal';
import DeliveryVerifyModal from './components/DeliveryVerifyModal';

import {
  fetchProducts,
  fetchProductDetail,
  extractClaims,
  runReconciliation,
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
  // Theme state: defaults to dark or system preference, with light mode toggle
  const [theme, setTheme] = useState(() => localStorage.getItem('promisex_theme') || 'dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Core Platform Data
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

  // Notifications
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync theme to <html> tag
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('promisex_theme', theme);
  }, [theme]);

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
      notify('Connection failed to PROMISEX backend service', 'error');
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
      notify('Baseline product scenario reinitialized.');
    } catch (err) {
      notify('Reset failed: ' + err.message, 'error');
    }
  };

  const handleRunReconciliation = async () => {
    if (!activeProduct) return;
    try {
      const res = await runReconciliation(activeProduct.id);
      notify(res.message);
      await loadAllData(activeProduct.id);
    } catch (err) {
      notify('Reconciliation error: ' + err.message, 'error');
    }
  };

  const handleExtractClaims = async () => {
    if (!activeProduct) return;
    try {
      const res = await extractClaims(activeProduct.id);
      notify(res.message);
      await loadAllData(activeProduct.id);
    } catch (err) {
      notify('Claim extraction failed: ' + err.message, 'error');
    }
  };

  const handleCreateProduct = async (payload) => {
    const res = await createProduct(payload);
    notify('Listing SKU registered and claims extracted.');
    await loadAllData(res.product_id);
    setActiveTab('product_intel');
  };

  const handleUploadEvidence = async (productId, formData) => {
    await uploadEvidenceDoc(productId, formData);
    notify('Engineering specification sheet indexed.');
    await loadAllData(productId);
  };

  const handleVerifyDelivery = async (payload) => {
    const res = await verifyDelivery(payload);
    notify('Delivery audit completed. Specification breach flagged.');
    await loadAllData(payload.product_id);
    setSelectedDiscrepancy(res.discrepancy_report);
  };

  const handleUpdateDiscrepancyStatus = async (reportId, status) => {
    await updateDiscrepancyStatus(reportId, { status });
    notify(`Dispute status updated: ${status}`);
    if (selectedDiscrepancy) {
      setSelectedDiscrepancy({ ...selectedDiscrepancy, status });
    }
    await loadAllData(activeProduct?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-blue-600 animate-spin mb-3"></div>
        <p className="text-xs font-medium">Connecting to PROMISEX Verification Service...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2.5 text-xs font-medium transition-all">
          <span
            className={`w-2 h-2 rounded-full ${
              notification.type === 'error' ? 'bg-rose-500' : 'bg-emerald-400'
            }`}
          ></span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Institutional Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onResetDemo={handleResetDemo}
        onOpenNewProduct={() => setShowNewProductModal(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
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

        {activeTab === 'product_intel' && (
          <Module1_ProductIntelligence
            product={activeProduct}
            evidenceDocs={evidenceDocs}
            onOpenNewProduct={() => setShowNewProductModal(true)}
            onOpenUploadEvidence={() => setShowUploadEvidenceModal(true)}
          />
        )}

        {activeTab === 'extraction' && (
          <Module2_PromiseExtraction
            claims={claims}
            onExtractClaims={handleExtractClaims}
            onReloadData={() => loadAllData(activeProduct?.id)}
          />
        )}

        {activeTab === 'graph' && <Module3_PromiseGraph graphData={graphData} />}

        {activeTab === 'evidence' && (
          <Module4_EvidenceVerification
            claims={claims}
            evidenceDocs={evidenceDocs}
            onRunReconciliation={handleRunReconciliation}
            onOpenUploadEvidence={() => setShowUploadEvidenceModal(true)}
          />
        )}

        {activeTab === 'delivery' && (
          <Module5_DeliveryVerification
            orders={orders}
            discrepancies={discrepancies}
            onOpenDeliveryVerifyModal={() => setShowDeliveryVerifyModal(true)}
            onOpenDiscrepancy={setSelectedDiscrepancy}
          />
        )}

        {activeTab === 'discrepancy' && (
          <Module6_DiscrepancyManagement
            discrepancies={discrepancies}
            onOpenDiscrepancy={setSelectedDiscrepancy}
          />
        )}

        {activeTab === 'monitoring' && <Module7_PromiseMonitoring product={activeProduct} />}

        {activeTab === 'seller' && <Module8_SellerIntelligence />}
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

      {/* Institutional Enterprise Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1017] py-4 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PROMISEX AI Platform • Commercial Specification Verification Suite</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>FastAPI Backend 1.0.0</span>
            <span>•</span>
            <span>PromiseEvidence-1K Standard</span>
            <span>•</span>
            <span>Status: Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
