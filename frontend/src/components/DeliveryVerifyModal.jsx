import React, { useState } from 'react';
import { PackageCheck, X } from 'lucide-react';

export default function DeliveryVerifyModal({ productId, onClose, onVerified }) {
  const [orderId, setOrderId] = useState('PX-89421');
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [invoiceText, setInvoiceText] = useState(
    `Order #PX-89421 Delivery Hardware Diagnostic:
- Processor: Intel Core i7-13700H @ 2.40GHz
- Memory Installed: 1x 8 GB DDR5 4800MHz Micron (1 Slot Empty - 8GB Total)
- Storage: 1 TB PCIe 4.0 NVMe SSD
- Display: 15.6" 2.8K OLED Panel
- In-Box Adapter: TechCorp 65W Standard Power Adapter (AD65W)
- Warranty Document: 1-Year Limited Standard Warranty Certificate`
  );
  const [packageNotes, setPackageNotes] = useState(
    'Box opened. Checked Windows DxDiag system specifications. Only 8GB RAM reported instead of promised 16GB.'
  );
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const payload = {
        order_id: orderId,
        product_id: productId,
        customer_name: customerName,
        invoice_text: invoiceText,
        package_notes: packageNotes,
      };
      await onVerified(payload);
      onClose();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 text-slate-900 dark:text-slate-100 my-6 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-900/60">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Audit Delivered Merchandise
              </h3>
              <p className="text-xs text-slate-500">
                Compare customer unboxing diagnostic telemetry against listing commitments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-850 text-xs text-slate-600 dark:text-slate-400">
          <strong>Audit Scenario:</strong> Customer delivery diagnostics report <strong>8 GB RAM</strong> (promised 16GB dual-channel) and a <strong>65W adapter</strong> (promised 100W GaN). PROMISEX will detect non-conformances and generate an evidence-backed dispute dossier.
        </div>

        <form onSubmit={handleSimulate} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Order Number</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Customer Recipient</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
              Packaging Manifest / Hardware Diagnostic Log
            </label>
            <textarea
              rows={5}
              value={invoiceText}
              onChange={(e) => setInvoiceText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Recipient Observation Notes</label>
            <input
              type="text"
              value={packageNotes}
              onChange={(e) => setPackageNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs disabled:opacity-50"
            >
              {isVerifying ? 'Analyzing...' : 'Execute Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
