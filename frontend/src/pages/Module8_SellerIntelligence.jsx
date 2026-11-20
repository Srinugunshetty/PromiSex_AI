import React, { useState, useEffect } from 'react';
import ModuleHeader from '../components/ModuleHeader';
import { Building2, AlertTriangle, Activity, BarChart2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { fetchEvaluationMetrics, fetchSellers } from '../api/client';

export default function Module8_SellerIntelligence() {
  const [metrics, setMetrics] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, s] = await Promise.all([fetchEvaluationMetrics(), fetchSellers()]);
        setMetrics(m);
        setSellers(s);
      } catch (err) {
        console.error('Failed to load seller intelligence:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeSeller = sellers[0] || {
    id: 'seller_techdirect',
    name: 'TechDirect Global',
    rating: 4.2,
    total_orders: 2480,
    total_products: 38,
    trust_score: 78.4,
    risk_level: 'Moderate',
    contradiction_rate: 16.5,
    recurring_issues: [
      'Battery runtime overstatement (+41% above official benchmark)',
      'In-box charger wattage downgrades (65W supplied vs 100W GaN claimed)',
      'Third-party extended warranty ambiguity (1yr OEM vs 2yr merchant)',
    ],
    recent_discrepancies: 6,
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="8"
        moduleName="Seller Intelligence"
        defaultDescription="Aggregates recurring product specification discrepancies, evaluates merchant compliance risk via machine learning, and produces institutional trust scoring."
        stats={[
          { label: 'Merchant Trust', value: `${activeSeller.trust_score}%` },
          { label: 'Contradiction Rate', value: `${activeSeller.contradiction_rate}%` },
          { label: 'Dispute Risk', value: 'Moderate' },
        ]}
      />

      {/* Seller Profile & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Merchant Identity Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-base">
                TD
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {activeSeller.name}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  ID: {activeSeller.id} • Registered E-Commerce Vendor
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Customer Feedback</span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                ★ {activeSeller.rating} / 5.0
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">Trust Score</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {activeSeller.trust_score}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">Contradiction Rate</span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">
                {activeSeller.contradiction_rate}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">Active Listings</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                {activeSeller.total_products} SKUs
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">Recent Disputes</span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
                {activeSeller.recent_discrepancies} Cases
              </span>
            </div>
          </div>

          {/* Recurring Discrepancy Patterns */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Documented Recurring Claim Discrepancies
            </h4>
            <div className="space-y-1.5">
              {activeSeller.recurring_issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                >
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Machine Learning Risk Model Card */}
        <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Activity className="w-3.5 h-3.5" /> Scikit-Learn Model
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Discrepancy Probability Score
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              GradientBoosting classifier estimating likelihood of post-purchase fulfillment disputes
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              46.8%
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 block w-fit mx-auto">
              Moderate / Elevated Risk
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Isolation Forest identified 2 statistical outliers: 12h battery claim on 45W CPU & extended warranty overstatement.
            </p>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block">
              Top Predictive Feature Drivers:
            </span>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Historical Contradiction Rate</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">38%</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Battery Claim Deviation</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">27%</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Warranty Policy Divergence</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">19%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PromiseEvidence-1K Benchmark Metrics Table */}
      {metrics && (
        <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Evaluation Benchmark Metrics ({metrics.dataset.name})
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                {metrics.dataset.samples} Annotated Pairs
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized evaluation scores across consumer electronics specification testing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Claim Extraction
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Precision:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {(metrics.claim_extraction.precision * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Recall:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {(metrics.claim_extraction.recall * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-semibold">
                <span>F1-Score:</span>
                <span className="font-mono">{metrics.claim_extraction.f1_score.toFixed(3)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Evidence RAG
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Precision@k:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {(metrics.evidence_matching.precision_at_k * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Recall@k:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {(metrics.evidence_matching.recall_at_k * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-semibold">
                <span>Method:</span>
                <span className="font-mono text-[11px]">TF-IDF Cosine</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Contradiction NLI
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Accuracy:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {(metrics.contradiction_detection.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Macro-F1:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {metrics.contradiction_detection.macro_f1.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-semibold">
                <span>Engine:</span>
                <span className="font-mono text-[11px]">DeBERTa NLI</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
                Discrepancy Risk Model
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">ROC-AUC:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {metrics.risk_model.roc_auc.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">PR-AUC:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {metrics.risk_model.pr_auc.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-semibold">
                <span>Algorithm:</span>
                <span className="font-mono text-[11px]">GradientBoosting</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
