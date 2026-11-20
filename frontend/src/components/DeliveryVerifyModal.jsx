import React, { useState } from 'react';
import { Truck, CheckCircle, AlertTriangle, FileSearch } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-100 my-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-pink-500/20 text-pink-400 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">
                Post-Purchase Delivery Verification
              </h3>
              <p className="text-xs text-slate-400">
                Compare customer unboxing diagnostics and invoice against seller commitments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="bg-pink-950/20 border border-pink-500/20 p-3 rounded-xl text-xs text-pink-300">
          <strong>Jury Simulation Scenario:</strong> A customer received their laptop, but the hardware
          diagnostics show only <strong>8GB RAM</strong> (promised 16GB) and a <strong>65W adapter</strong>{' '}
          (promised 100W GaN). PROMISEX AI will verify and construct an evidence-backed dispute report.
        </div>

        <form onSubmit={handleSimulate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Order Number</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Customer Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Customer Invoice / Packaging BOM / Hardware Diagnostic Log
            </label>
            <textarea
              rows={6}
              value={invoiceText}
              onChange={(e) => setInvoiceText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Customer Unboxing Notes</label>
            <input
              type="text"
              value={packageNotes}
              onChange={(e) => setPackageNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              <FileSearch className="w-4 h-4" />
              {isVerifying ? 'Analyzing Discrepancies...' : 'Run Delivery Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
