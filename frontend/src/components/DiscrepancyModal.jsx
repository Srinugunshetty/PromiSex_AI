import React from 'react';
import { AlertOctagon, ShieldAlert, FileText, Printer, CheckCircle, ArrowRight } from 'lucide-react';

export default function DiscrepancyModal({ report, onClose, onUpdateStatus }) {
  if (!report) return null;

  const severityColors = {
    Critical: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    High: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    Low: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
                  {report.id}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    severityColors[report.severity] || severityColors.High
                  }`}
                >
                  {report.severity} Severity
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-1">
                Formal Product Promise Discrepancy Report
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 block">Product</span>
            <span className="font-semibold text-slate-200">{report.product_title}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Order Number</span>
            <span className="font-mono font-semibold text-indigo-400">#{report.order_id}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Customer</span>
            <span className="font-semibold text-slate-200">{report.customer_name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Seller</span>
            <span className="font-semibold text-slate-200">{report.seller_name}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-1.5">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Executive Non-Conformance Summary
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            {report.summary}
          </p>
        </div>

        {/* Discrepancy Items Table */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Evidence-Backed Itemized Shortfalls
          </h4>
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Promised Claim</th>
                  <th className="p-3">Delivered Reality</th>
                  <th className="p-3">Type & Severity</th>
                  <th className="p-3">Customer Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                {report.items &&
                  report.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3 font-medium text-slate-200 max-w-[180px]">
                        {item.claim_text}
                        <span className="block font-mono text-[10px] text-emerald-400 mt-0.5">
                          Promise: {item.promised_value}
                        </span>
                      </td>
                      <td className="p-3 text-rose-400 font-mono font-medium max-w-[160px]">
                        {item.delivered_value}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-medium">
                          {item.severity}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {item.discrepancy_type}
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 leading-relaxed max-w-[200px]">
                        {item.impact}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Action / Dispute Remedy */}
        <div className="space-y-1.5 bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-xl">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Recommended Dispute Remedies
          </h4>
          <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
            {report.recommended_action}
          </p>
        </div>

        {/* Audit Citation */}
        <div className="text-[11px] text-slate-500 italic flex items-center justify-between border-t border-slate-800 pt-3">
          <span>{report.evidence_proof}</span>
          <span>Status: <strong className="text-amber-400">{report.status}</strong></span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(report.id, 'Dispute Resolved & Refunded')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl font-medium transition-colors"
            >
              Mark Dispute Resolved
            </button>
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(report.id, 'Escalated to Marketplace Arbitration')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium transition-colors"
            >
              Escalate to Platform Arbitration
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
