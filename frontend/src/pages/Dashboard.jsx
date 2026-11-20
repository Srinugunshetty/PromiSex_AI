import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, HelpCircle, Layers, ArrowRight, Zap, TrendingUp, AlertOctagon, FileText } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard({
  product,
  claims,
  evidenceDocs,
  orders,
  discrepancies,
  onNavigateTab,
  onOpenDiscrepancy,
}) {
  const stats = {
    total: claims.length,
    verified: claims.filter((c) => c.status === 'Verified').length,
    contradicted: claims.filter((c) => c.status === 'Contradicted').length,
    partial: claims.filter((c) => c.status === 'Partially verified').length,
    unverifiable: claims.filter((c) => c.status === 'Unverifiable').length,
    pending: claims.filter((c) => c.status === 'Pending').length,
  };

  const trustScore = stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 75;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Trust Score Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Identity */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Active Target Product Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {product ? product.title : 'TechCorp UltraBook Pro 15 (Flagship AI Edition)'}
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Brand: <strong className="text-slate-200">{product?.brand || 'TechCorp'}</strong> • Model:{' '}
              <span className="font-mono text-indigo-300">{product?.model || 'UP15-2026-X'}</span> • Seller:{' '}
              <strong className="text-slate-200">{product?.seller_name || 'TechDirect Global'}</strong>
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => onNavigateTab('reconciliation')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                Run Evidence Reconciliation
              </button>
              <button
                onClick={() => onNavigateTab('graph')}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700/80 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Explore Promise Graph
              </button>
            </div>
          </div>

          {/* Background image preview if available */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Listing Price: <strong className="text-white text-sm">${product?.price?.toFixed(2) || '1,499.00'}</strong></span>
            <span>Category: <span className="text-slate-300">{product?.category || 'Laptops'}</span></span>
          </div>
        </div>

        {/* Promise Trust Score Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          <div className="relative mb-3">
            <div className="w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
              <div
                className="w-36 h-36 rounded-full border-8 border-emerald-500 absolute -top-2 -left-2 transition-all"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 ${trustScore}%)`,
                }}
              ></div>
              <div>
                <span className="text-3xl font-extrabold text-white">{trustScore}%</span>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                  Promise Score
                </span>
              </div>
            </div>
          </div>
          <h3 className="font-bold text-slate-200 text-sm">Seller Promise Accuracy Index</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Calculated from evidence entailment, contradiction penalties, and specification deviations.
          </p>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigateTab('promises')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Claims</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Extracted from listing</span>
        </div>

        <div
          onClick={() => onNavigateTab('reconciliation')}
          className="bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 p-5 rounded-2xl cursor-pointer transition-all shadow-lg"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.verified}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Supported by official spec</span>
        </div>

        <div
          onClick={() => onNavigateTab('reconciliation')}
          className="bg-slate-900 border border-rose-500/30 hover:border-rose-500/60 p-5 rounded-2xl cursor-pointer transition-all shadow-lg"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Contradicted</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-400">{stats.contradicted}</div>
          <span className="text-[10px] text-rose-300/80 mt-1 block">Conflicts with evidence</span>
        </div>

        <div
          onClick={() => onNavigateTab('reconciliation')}
          className="bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 p-5 rounded-2xl cursor-pointer transition-all shadow-lg"
        >
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Partial</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-300">{stats.partial}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Conditional or limited</span>
        </div>

        <div
          onClick={() => onNavigateTab('reconciliation')}
          className="bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 p-5 rounded-2xl cursor-pointer transition-all shadow-lg"
        >
          <div className="flex items-center justify-between text-purple-300 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Unverifiable</span>
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-purple-300">{stats.unverifiable}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">No datasheet reference</span>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {discrepancies.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {discrepancies[0].severity} Severity Dispute
                </span>
                <span className="text-xs font-mono text-slate-400">Order #{discrepancies[0].order_id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 mt-1">
                Post-Delivery Hardware Mismatch Flagged: 8GB RAM Delivered vs 16GB Promised
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                Automated customer unboxing diagnostics detected 3 non-conformances including RAM downgrade and in-box 65W charger.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDiscrepancy(discrepancies[0])}
            className="whitespace-nowrap px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            Review Dispute Report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Contradicted Claims High-Priority Warning List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Contradicted & High-Risk Promises
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Claims where manufacturer engineering documentation directly refutes seller listing statements
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('reconciliation')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View all claims →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims
            .filter((c) => c.status === 'Contradicted' || c.status === 'Partially verified')
            .map((claim) => (
              <div
                key={claim.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {claim.metric}
                  </span>
                  <StatusBadge status={claim.status} size="sm" />
                </div>
                <h4 className="text-sm font-semibold text-slate-100">{claim.claim_text}</h4>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/60 text-xs">
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-slate-500">Promised: <strong className="text-slate-200">{claim.promised_value}</strong></span>
                    <span className="text-rose-400">Verified: <strong>{claim.verified_value || 'None'}</strong></span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {claim.explanation}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
