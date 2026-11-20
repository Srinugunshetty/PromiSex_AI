import React, { useState } from 'react';
import { Search, Filter, Sparkles, CheckCircle2, AlertTriangle, XCircle, HelpCircle, Layers, ArrowUpDown } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function ProductClaimsPage({ product, claims, onExtractClaims }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isExtracting, setIsExtracting] = useState(false);

  const categories = ['ALL', ...new Set(claims.map((c) => c.category || 'General'))];
  const statuses = ['ALL', 'Verified', 'Contradicted', 'Partially verified', 'Unverifiable', 'Pending'];

  const filtered = claims.filter((c) => {
    const matchesSearch =
      c.claim_text.toLowerCase().includes(search.toLowerCase()) ||
      (c.metric && c.metric.toLowerCase().includes(search.toLowerCase())) ||
      (c.promised_value && c.promised_value.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExtract = async () => {
    setIsExtracting(true);
    try {
      await onExtractClaims();
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Extracted Product Promises</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              {claims.length} Promises
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured claims parsed from online listing text with normalized metrics, units, and categories
          </p>
        </div>

        <button
          onClick={handleExtract}
          disabled={isExtracting}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {isExtracting ? 'Extracting via AI...' : 'Re-Run Promise Extraction'}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promises, metrics (e.g. RAM, Battery, 120Hz)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2 py-1 rounded-lg transition-all ${
                selectedStatus === st
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'Partially verified' ? 'Partial' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Metric & Promised Claim</th>
                <th className="p-4">Category</th>
                <th className="p-4">Promised Value</th>
                <th className="p-4">Reconciled Status</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Official Evidence Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-medium text-slate-100 max-w-[280px]">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[11px] mb-0.5">
                      <span>{c.metric || 'General Spec'}</span>
                    </div>
                    <span className="text-slate-200 text-xs leading-relaxed block">
                      {c.claim_text}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 font-medium text-[11px]">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-semibold text-slate-200">
                    <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400 inline-block">
                      {c.promised_value || 'Present'}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="p-4 font-mono text-slate-300 font-semibold">
                    {Math.round((c.confidence || 0.85) * 100)}%
                  </td>
                  <td className="p-4 text-slate-300 max-w-[320px] text-[11px] leading-relaxed">
                    {c.verified_value && (
                      <div className="font-mono text-rose-400 mb-0.5 font-semibold">
                        Reconciled: {c.verified_value}
                      </div>
                    )}
                    <span className="text-slate-400">{c.explanation}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No claims matched your search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
