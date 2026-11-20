import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  FileSearch,
  Share2,
  GitCompare,
  PackageCheck,
  FileWarning,
  Clock,
  Building2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
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
  };

  const trustScore = stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 75;

  const moduleDirectory = [
    {
      id: 'product_intel',
      title: 'Module 1: Product Intelligence',
      desc: 'Product catalog, seller details and manufacturer specifications.',
      icon: Layers,
    },
    {
      id: 'extraction',
      title: 'Module 2: Promise Extraction',
      desc: 'Extracts claims from product listings, PDFs and images.',
      icon: FileSearch,
    },
    {
      id: 'graph',
      title: 'Module 3: Promise Graph',
      desc: 'Connects claims to products, sources, evidence and orders.',
      icon: Share2,
    },
    {
      id: 'evidence',
      title: 'Module 4: Evidence Verification',
      desc: 'Matches claims against documents and detects contradictions.',
      icon: GitCompare,
    },
    {
      id: 'delivery',
      title: 'Module 5: Delivery Verification',
      desc: 'Checks customer-uploaded product photos and documents.',
      icon: PackageCheck,
    },
    {
      id: 'discrepancy',
      title: 'Module 6: Discrepancy Management',
      desc: 'Creates evidence-backed reports for seller review.',
      icon: FileWarning,
    },
    {
      id: 'monitoring',
      title: 'Module 7: Promise Monitoring',
      desc: 'Tracks measurable claims such as warranty and delivery commitments.',
      icon: Clock,
    },
    {
      id: 'seller',
      title: 'Module 8: Seller Intelligence',
      desc: 'Summarizes recurring product and claim discrepancies.',
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Product & Institutional Verification Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Details */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <span>●</span> Active Audit Target SKU
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {product ? product.title : 'TechCorp UltraBook Pro 15 (Flagship AI Edition)'}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              Brand: <strong className="text-slate-700 dark:text-slate-300">{product?.brand}</strong> • Model:{' '}
              <span className="font-mono text-slate-700 dark:text-slate-300">{product?.model}</span> • Merchant:{' '}
              <strong className="text-slate-700 dark:text-slate-300">{product?.seller_name}</strong> • Category:{' '}
              <span>{product?.category}</span>
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-850 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Retail Price: <strong className="text-slate-900 dark:text-slate-100 font-mono">${product?.price?.toFixed(2)}</strong>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateTab('evidence')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-xs"
              >
                Audit Evidence Matrix
              </button>
              <button
                onClick={() => onNavigateTab('graph')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg font-medium border border-slate-200 dark:border-slate-700"
              >
                Inspect Promise Graph
              </button>
            </div>
          </div>
        </div>

        {/* Verification Index Card */}
        <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-2 bg-slate-50/50 dark:bg-slate-950/50">
            <div>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {trustScore}%
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                Accuracy
              </span>
            </div>
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Promise Verification Index
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Proportion of marketing claims substantiated by official manufacturer technical engineering specifications.
          </p>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('extraction')}
          className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Claims Audited</span>
            <FileSearch className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
            {stats.total}
          </div>
          <span className="text-[10px] text-slate-400">Parsed from listing</span>
        </div>

        <div
          onClick={() => onNavigateTab('evidence')}
          className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verified Spec</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {stats.verified}
          </div>
          <span className="text-[10px] text-slate-400">Confirmed by datasheet</span>
        </div>

        <div
          onClick={() => onNavigateTab('evidence')}
          className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Contradictions</span>
            <XCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {stats.contradicted}
          </div>
          <span className="text-[10px] text-slate-400">Direct evidence conflicts</span>
        </div>

        <div
          onClick={() => onNavigateTab('discrepancy')}
          className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Discrepancy Cases</span>
            <FileWarning className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {discrepancies.length}
          </div>
          <span className="text-[10px] text-slate-400">Post-purchase dispute reports</span>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {discrepancies.length > 0 && (
        <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                {discrepancies[0].severity} Severity Dispute
              </span>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                Case {discrepancies[0].id} • Order #{discrepancies[0].order_id}
              </span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
              Hardware Specification Mismatch: 8 GB RAM Delivered vs 16 GB Dual-Channel Promised
            </h4>
          </div>

          <button
            onClick={() => onOpenDiscrepancy(discrepancies[0])}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs whitespace-nowrap"
          >
            Review Formal Dossier →
          </button>
        </div>
      )}

      {/* 8 Core Modules Architecture Directory */}
      <div className="space-y-3">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            System Operational Modules (PROMISEX Specification Architecture)
          </h3>
          <span className="text-xs text-slate-500">8 Functional Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleDirectory.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigateTab(mod.id)}
                className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="p-2 w-fit rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  <span>Open Module</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
