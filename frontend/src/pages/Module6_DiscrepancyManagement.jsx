import React from 'react';
import ModuleHeader from '../components/ModuleHeader';
import { FileWarning, ShieldAlert, ArrowRight, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function Module6_DiscrepancyManagement({
  discrepancies,
  onOpenDiscrepancy,
}) {
  const getSeverityPill = (sev) => {
    if (sev === 'Critical') {
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          Critical Severity
        </span>
      );
    }
    if (sev === 'High') {
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          High Severity
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        {sev} Severity
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="6"
        moduleName="Discrepancy Management"
        defaultDescription="Creates evidence-backed formal non-conformance reports, dispute dossiers, and remediation workflows for merchant resolution and marketplace compliance review."
        stats={[
          { label: 'Active Reports', value: `${discrepancies.length} Dossiers` },
          { label: 'Resolution Rate', value: '88.5%' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discrepancies.map((rep) => (
          <div
            key={rep.id}
            className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">
                  {rep.id}
                </span>
                {getSeverityPill(rep.severity)}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {rep.product_title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Order <strong className="font-mono text-slate-700 dark:text-slate-300">#{rep.order_id}</strong> • Merchant:{' '}
                  <strong className="text-slate-700 dark:text-slate-300">{rep.seller_name}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-850 leading-relaxed">
                {rep.summary}
              </p>

              {/* Identified Non-Conformances */}
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Identified Specification Breaches ({rep.items?.length || 0}):
                </span>
                <div className="space-y-1">
                  {rep.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.claim_text.slice(0, 36)}...
                      </span>
                      <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                        {item.delivered_value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-850 flex items-center justify-between">
              {rep.status?.includes('Resolved') ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{rep.status}</span>
                </div>
              ) : rep.status?.includes('Arbitration') ? (
                <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{rep.status}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{rep.status}</span>
                </div>
              )}

              <button
                onClick={() => onOpenDiscrepancy(rep)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity"
              >
                <span>Inspect Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
