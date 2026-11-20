import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Printer,
  CheckCircle,
  CheckCircle2,
  X,
  Scale,
  Clock,
  AlertTriangle,
  Loader2,
  FileCheck2,
} from 'lucide-react';

export default function DiscrepancyModal({ report, onClose, onUpdateStatus }) {
  if (!report) return null;

  const [currentStatus, setCurrentStatus] = useState(
    report.status || 'Pending Seller Review'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // 'resolved' | 'arbitration'
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    if (report && report.status) {
      setCurrentStatus(report.status);
    }
  }, [report?.status, report?.id]);

  const handleAction = async (targetStatus, actionKey) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setActiveAction(actionKey);
    setFeedbackMsg(null);

    try {
      if (onUpdateStatus) {
        await onUpdateStatus(report.id, targetStatus);
      }
      setCurrentStatus(targetStatus);
      setFeedbackMsg(
        actionKey === 'resolved'
          ? '✓ Dispute successfully resolved! Buyer refund settlement authorized and logged.'
          : '✓ Case formally escalated to Marketplace Arbitration Tribunal for binding adjudication.'
      );
    } catch (err) {
      console.error('Failed to update dispute status:', err);
      setFeedbackMsg('⚠ Failed to update dispute status on server. Please try again.');
    } finally {
      setIsUpdating(false);
      setActiveAction(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isResolved = currentStatus.includes('Resolved');
  const isArbitration = currentStatus.includes('Arbitration');

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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold text-rose-600 dark:text-rose-400">
                  {report.id}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {report.severity} Non-Conformance
                </span>

                {/* Real-time Status Badge */}
                {isResolved ? (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolved & Refund Issued
                  </span>
                ) : isArbitration ? (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    Under Arbitration
                  </span>
                ) : (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Under Seller Review
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
                Product Specification Discrepancy & Dispute Dossier
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

        {/* Live Lifecycle Adjudication Panel */}
        <div
          className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
            isResolved
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : isArbitration
              ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200'
              : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              {isResolved ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : isArbitration ? (
                <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              Current Dossier Status:
            </span>
            <span className="font-bold underline decoration-dotted">{currentStatus}</span>
          </div>
          <span className="text-[11px] opacity-75 font-mono">
            SLA Compliance Protocol v2.4
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-850 text-xs">
          <div>
            <span className="text-slate-500 block">Product</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {report.product_title}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Order Number</span>
            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
              #{report.order_id}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Recipient</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {report.customer_name}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Merchant</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {report.seller_name}
            </span>
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

        {/* Confirmation Feedback Banner */}
        {feedbackMsg && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2.5 border transition-all ${
              feedbackMsg.startsWith('✓')
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">{feedbackMsg}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 gap-2">
          {/* Dispute Resolution Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleAction('Dispute Resolved & Refund Issued', 'resolved')
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-lg font-semibold transition-all shadow-xs ${
                isResolved
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/60'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              } ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isUpdating && activeAction === 'resolved' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Resolution...</span>
                </>
              ) : isResolved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dispute Resolved ✓</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Dispute Resolved</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleAction(
                  'Escalated to Marketplace Arbitration',
                  'arbitration'
                )
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-lg font-semibold border transition-all shadow-xs ${
                isArbitration
                  ? 'bg-purple-700 text-white border-purple-600 ring-2 ring-purple-500/60'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              } ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isUpdating && activeAction === 'arbitration' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Escalating Dossier...</span>
                </>
              ) : isArbitration ? (
                <>
                  <Scale className="w-3.5 h-3.5" />
                  <span>Escalated to Arbitration ⚖</span>
                </>
              ) : (
                <>
                  <Scale className="w-3.5 h-3.5" />
                  <span>Escalate to Arbitration</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Dossier Utility Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Dossier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
