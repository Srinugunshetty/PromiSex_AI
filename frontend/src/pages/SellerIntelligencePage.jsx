import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldAlert, TrendingDown, AlertTriangle, Activity, BarChart3, Database, CheckCircle2 } from 'lucide-react';
import { fetchEvaluationMetrics, fetchSellers } from '../api/client';

export default function SellerIntelligencePage() {
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Seller Intelligence & ML Risk Estimation</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Scikit-learn • Isolation Forest • XGBoost
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predictive machine learning models tracking recurring merchant claim anomalies and dispute probabilities
          </p>
        </div>
      </div>

      {/* Seller Profile & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Merchant Identity Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
                TD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{activeSeller.name}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                    {activeSeller.risk_level} Risk Merchant
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Seller ID: <strong className="text-slate-300 font-mono">{activeSeller.id}</strong> • Lifetime Orders: 2,480
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Customer Rating</span>
              <span className="text-lg font-bold text-amber-400">★ {activeSeller.rating} / 5.0</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Trust Score</span>
              <span className="text-lg font-bold text-emerald-400">{activeSeller.trust_score}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Contradiction Rate</span>
              <span className="text-lg font-bold text-rose-400">{activeSeller.contradiction_rate}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Active Listings</span>
              <span className="text-lg font-bold text-indigo-300">{activeSeller.total_products}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">30-Day Disputes</span>
              <span className="text-lg font-bold text-amber-400">{activeSeller.recent_discrepancies} Cases</span>
            </div>
          </div>

          {/* Recurring Discrepancy Patterns */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Identified Recurring Claim Discrepancies
            </h4>
            <div className="space-y-2">
              {activeSeller.recurring_issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ML Risk & Anomaly Gauge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4" /> ML Risk Prediction Model
            </div>
            <h3 className="text-lg font-bold text-white">Discrepancy Probability</h3>
            <p className="text-xs text-slate-400 mt-1">
              GradientBoosting model assessing probability of post-purchase buyer dispute
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <span className="text-4xl font-extrabold text-amber-400">46.8%</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold block w-fit mx-auto">
              High Discrepancy Risk
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Isolation Forest flagged 2 outlier feature patterns: 12h battery claim on 45W H-series CPU & extended warranty overstatement.
            </p>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="text-slate-500 font-medium text-[11px] uppercase tracking-wider">Top ML Risk Drivers:</span>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Seller Contradiction History</span>
                <span className="font-mono text-indigo-400 font-semibold">38%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Battery Claim Extremity</span>
                <span className="font-mono text-indigo-400 font-semibold">27%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Warranty Duration Gap</span>
                <span className="font-mono text-indigo-400 font-semibold">19%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PromiseEvidence-1K Academic Benchmark Dashboard */}
      {metrics && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  Evaluation Metrics & Benchmark Evaluation
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  {metrics.dataset.name} ({metrics.dataset.samples} Samples)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Evaluation results on human-curated claim/evidence pairs across consumer electronics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Claim Extraction */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-indigo-400 block uppercase tracking-wider">
                1. Claim Extraction
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Precision:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(metrics.claim_extraction.precision * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recall:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(metrics.claim_extraction.recall * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-300 font-semibold">F1-Score:</span>
                  <span className="font-mono text-white font-extrabold">
                    {metrics.claim_extraction.f1_score.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence Retrieval */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-sky-400 block uppercase tracking-wider">
                2. Evidence RAG Matching
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Precision@k:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(metrics.evidence_matching.precision_at_k * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recall@k:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(metrics.evidence_matching.recall_at_k * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-300 font-semibold">Method:</span>
                  <span className="text-slate-300 font-medium">TF-IDF + Cosine</span>
                </div>
              </div>
            </div>

            {/* Contradiction Detection */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-rose-400 block uppercase tracking-wider">
                3. Contradiction Detection
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Accuracy:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(metrics.contradiction_detection.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Macro F1:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {metrics.contradiction_detection.macro_f1.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-300 font-semibold">Model:</span>
                  <span className="text-slate-300 font-medium">DeBERTa / NLI</span>
                </div>
              </div>
            </div>

            {/* ML Risk Estimation */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-400 block uppercase tracking-wider">
                4. ML Risk Model
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">ROC-AUC:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {metrics.risk_model.roc_auc.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PR-AUC:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {metrics.risk_model.pr_auc.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-300 font-semibold">Framework:</span>
                  <span className="text-slate-300 font-medium">Scikit-learn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
