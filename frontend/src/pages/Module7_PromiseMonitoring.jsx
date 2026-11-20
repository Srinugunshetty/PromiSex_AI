import React, { useState, useEffect } from 'react';
import ModuleHeader from '../components/ModuleHeader';
import { Clock, ShieldCheck, AlertTriangle, Activity, Plus, CheckCircle, Calendar, RefreshCw } from 'lucide-react';
import { fetchMonitoringItems, createMonitoringItem, updateMonitoringItem } from '../api/client';

export default function Module7_PromiseMonitoring({ product }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCommitment, setNewCommitment] = useState({
    title: '',
    category: 'Warranty',
    commitment_text: '',
    verified_reality: '',
    start_date: new Date().toISOString().split('T')[0],
    target_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    days_remaining: 365,
    status: 'Active',
    notes: '',
  });

  const loadItems = async () => {
    try {
      const data = await fetchMonitoringItems(product?.id);
      setItems(data);
    } catch (err) {
      console.error('Failed to load monitoring items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [product]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMonitoringItem({
        ...newCommitment,
        product_id: product?.id || 'prod_ultrabook_15',
      });
      setShowAddModal(false);
      await loadItems();
    } catch (err) {
      alert('Failed to add commitment: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          ● Active
        </span>
      );
    }
    if (status.includes('Breached') || status === 'Non-Compliant') {
      return (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          ✕ {status}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
        ▲ {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="7"
        moduleName="Promise Monitoring"
        defaultDescription="Continuously tracks measurable commitments across the post-purchase lifecycle, including warranty expiration timelines, delivery SLAs, and operational performance drift."
        stats={[
          { label: 'Monitored Commitments', value: `${items.length} Metrics` },
          { label: 'SLA Adherence', value: '50.0%' },
        ]}
        actionButton={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Track New Commitment
          </button>
        }
      />

      {/* Commitments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-800">
                {item.category}
              </span>
              {getStatusBadge(item.status)}
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Date: <strong className="text-slate-700 dark:text-slate-300 font-mono">{item.target_date}</strong> •{' '}
                <span className="font-mono">{item.days_remaining} Days Remaining</span>
              </p>
            </div>

            {/* Comparison Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Promised Commitment
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 block">
                  {item.commitment_text}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-850">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Audit Telemetry Status
                </span>
                <span
                  className={`font-mono text-xs ${
                    item.status.includes('Breached') || item.status === 'Non-Compliant'
                      ? 'text-rose-600 dark:text-rose-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.verified_reality}
                </span>
              </div>
            </div>

            {item.notes && (
              <p className="text-[11px] text-slate-500 italic">
                Notes: {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Commitment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Register Measurable Promise for Monitoring
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Commitment Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCommitment.title}
                  onChange={(e) => setNewCommitment({ ...newCommitment, title: e.target.value })}
                  placeholder="e.g. 30-Day Guaranteed Delivery SLA"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={newCommitment.category}
                    onChange={(e) => setNewCommitment({ ...newCommitment, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Warranty">Warranty</option>
                    <option value="Delivery SLA">Delivery SLA</option>
                    <option value="Performance Drift">Performance Drift</option>
                    <option value="Service SLA">Service SLA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                    Target Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newCommitment.target_date}
                    onChange={(e) => setNewCommitment({ ...newCommitment, target_date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Promised Commitment Statement *
                </label>
                <input
                  type="text"
                  required
                  value={newCommitment.commitment_text}
                  onChange={(e) => setNewCommitment({ ...newCommitment, commitment_text: e.target.value })}
                  placeholder="e.g. Guaranteed 3-Day Expedited Courier Delivery"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  Audit Telemetry / Verified Status
                </label>
                <input
                  type="text"
                  value={newCommitment.verified_reality}
                  onChange={(e) => setNewCommitment({ ...newCommitment, verified_reality: e.target.value })}
                  placeholder="e.g. Delivered on Day 5 (2-Day SLA Breach)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs"
                >
                  Register Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
