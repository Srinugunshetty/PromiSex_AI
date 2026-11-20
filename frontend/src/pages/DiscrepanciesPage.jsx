import React from 'react';
import { ShieldAlert, AlertOctagon, FileText, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function DiscrepanciesPage({
  discrepancies,
  onOpenDiscrepancy,
}) {
  const severityBadge = (sev) => {
    const s = sev || 'High';
    if (s === 'Critical') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
          Critical Severity
        </span>
      );
    }
    if (s === 'High') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
          High Severity
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-bold">
        {s} Severity
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Discrepancy Dispute Reports</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
              Evidence-Backed Legal Audit
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formal marketplace dispute dossiers detailing itemized non-conformances, impact, and actionable resolutions
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discrepancies.map((report) => (
          <div
            key={report.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-rose-400 font-bold uppercase tracking-wider">
                  {report.id}
                </span>
                {severityBadge(report.severity)}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100">{report.product_title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Order <strong className="text-slate-300 font-mono">#{report.order_id}</strong> • Merchant:{' '}
                  <strong className="text-slate-300">{report.seller_name}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {report.summary}
              </p>

              {/* Itemized Non-Conformances */}
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Identified Non-Conformances ({report.items?.length || 0}):
                </span>
                <div className="space-y-1">
                  {report.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-300 font-medium">{item.claim_text.slice(0, 35)}...</span>
                      <span className="text-rose-400 font-mono font-semibold text-[11px]">
                        {item.delivered_value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{report.status}</span>
              </div>

              <button
                onClick={() => onOpenDiscrepancy(report)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                <span>View Full Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {discrepancies.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No discrepancy reports on record. Use the Delivery Verification tab to simulate an unboxing dispute.
        </div>
      )}
    </div>
  );
}
