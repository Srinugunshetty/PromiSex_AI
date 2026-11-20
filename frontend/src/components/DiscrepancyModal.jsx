import React from 'react';
import { ShieldAlert, Printer, CheckCircle, X } from 'lucide-react';

export default function DiscrepancyModal({ report, onClose, onUpdateStatus }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl max-w-3xl w-full p-6 shadow-xl space-y-5 my-8 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold text-rose-600 dark:text-rose-400">
                  {report.id}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {report.severity} Non-Conformance
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
                Product Specification Discrepancy & Dispute Report
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-850 text-xs">
          <div>
            <span className="text-slate-500 block">Product</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{report.product_title}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Order Number</span>
            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">#{report.order_id}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Recipient</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{report.customer_name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Merchant</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{report.seller_name}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-1">
          <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            Executive Non-Conformance Summary
          </h4>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-850">
            {report.summary}
          </p>
        </div>

        {/* Itemized Non-Conformances Table */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            Itemized Specification Breaches
          </h4>
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 uppercase tracking-wider font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-2.5">Promised Claim</th>
                  <th className="p-2.5">Delivered Value</th>
                  <th className="p-2.5">Breach Classification</th>
                  <th className="p-2.5">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {report.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                    <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100 max-w-[180px]">
                      {item.claim_text}
                      <span className="block font-mono text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                        Promised: {item.promised_value}
                      </span>
                    </td>
                    <td className="p-2.5 text-rose-600 dark:text-rose-400 font-mono font-bold max-w-[160px]">
                      {item.delivered_value}
                    </td>
                    <td className="p-2.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {item.severity}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {item.discrepancy_type}
                      </div>
                    </td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-400 leading-relaxed max-w-[200px]">
                      {item.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-lg space-y-1">
          <h4 className="text-[11px] uppercase tracking-wider font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Remediation & Arbitration Actions
          </h4>
          <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {report.recommended_action}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(report.id, 'Dispute Resolved & Refund Issued')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg font-medium shadow-xs"
            >
              Mark Dispute Resolved
            </button>
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(report.id, 'Escalated to Marketplace Arbitration')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs rounded-lg font-medium border border-slate-200 dark:border-slate-700"
            >
              Escalate to Arbitration
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Dossier
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
