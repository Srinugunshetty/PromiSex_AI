import React, { useState } from 'react';
import ModuleHeader from '../components/ModuleHeader';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, RefreshCw, Edit2, Check, X } from 'lucide-react';
import { updateClaimStatus } from '../api/client';

export default function Module2_PromiseExtraction({
  claims,
  onExtractClaims,
  onReloadData,
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isExtracting, setIsExtracting] = useState(false);

  // Edit claim state
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [editForm, setEditForm] = useState({ claim_text: '', promised_value: '', metric: '' });

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

  const handleStartEdit = (claim) => {
    setEditingClaimId(claim.id);
    setEditForm({
      claim_text: claim.claim_text,
      promised_value: claim.promised_value || '',
      metric: claim.metric || '',
    });
  };

  const handleSaveEdit = async (claimId) => {
    try {
      await updateClaimStatus(claimId, {
        claim_text: editForm.claim_text,
        promised_value: editForm.promised_value,
        metric: editForm.metric,
      });
      setEditingClaimId(null);
      if (onReloadData) await onReloadData();
    } catch (err) {
      alert('Failed to update claim: ' + err.message);
    }
  };

  const handleTriggerExtraction = async () => {
    setIsExtracting(true);
    try {
      await onExtractClaims();
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="2"
        moduleName="Promise Extraction"
        defaultDescription="Parses unstructured listing text, promotional bullet points, and specification tables into structured, verifiable promise entities with normalized metrics."
        stats={[
          { label: 'Total Extracted', value: `${claims.length} Promises` },
          { label: 'Active Categories', value: `${categories.length - 1} Types` },
        ]}
        actionButton={
          <button
            onClick={handleTriggerExtraction}
            disabled={isExtracting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isExtracting ? 'animate-spin' : ''}`} />
            <span>{isExtracting ? 'Parsing...' : 'Re-Run Extraction'}</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search claims, metrics, or values (e.g. RAM, 12 Hours, OLED)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg text-xs">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                selectedStatus === st
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {st === 'Partially verified' ? 'Partial' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Claims Registry Table */}
      <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 font-medium">
              <tr>
                <th className="p-3.5">Promise Metric</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Promised Claim Description</th>
                <th className="p-3.5">Normalized Value</th>
                <th className="p-3.5">Verification Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {filtered.map((c) => {
                const isEditingThis = editingClaimId === c.id;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition-colors"
                  >
                    <td className="p-3.5 font-mono font-medium text-blue-600 dark:text-blue-400">
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={editForm.metric}
                          onChange={(e) => setEditForm({ ...editForm, metric: e.target.value })}
                          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded text-xs text-slate-900 dark:text-slate-100"
                        />
                      ) : (
                        c.metric || 'General Spec'
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-800">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-[320px]">
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={editForm.claim_text}
                          onChange={(e) => setEditForm({ ...editForm, claim_text: e.target.value })}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded text-xs text-slate-900 dark:text-slate-100"
                        />
                      ) : (
                        <span className="text-slate-800 dark:text-slate-200 leading-relaxed block">
                          {c.claim_text}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={editForm.promised_value}
                          onChange={(e) => setEditForm({ ...editForm, promised_value: e.target.value })}
                          className="w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded text-xs text-slate-900 dark:text-slate-100"
                        />
                      ) : (
                        <span className="bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          {c.promised_value || 'Present'}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-3.5 text-right">
                      {isEditingThis ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(c.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingClaimId(null)}
                            className="p-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit claim details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
