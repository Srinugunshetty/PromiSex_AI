import React, { useState } from 'react';
import { GitPullRequest, UploadCloud, Zap, FileText, CheckCircle2, XCircle, AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function EvidenceReconciliationPage({
  product,
  claims,
  evidenceDocs,
  onRunReconciliation,
  onOpenUploadEvidence,
}) {
  const [selectedClaim, setSelectedClaim] = useState(claims[3] || claims[0]); // default to battery or first
  const [isReconciling, setIsReconciling] = useState(false);
  const [viewDocsTab, setViewDocsTab] = useState(false);

  const handleReconcile = async () => {
    setIsReconciling(true);
    try {
      await onRunReconciliation();
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Evidence Reconciliation & NLI Audit</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
              RAG + DeBERTa NLI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reconciles online seller claims against manufacturer engineering specs, warranty policies, and lab benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUploadEvidence}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all"
          >
            <UploadCloud className="w-4 h-4 text-sky-400" />
            Upload Document
          </button>

          <button
            onClick={handleReconcile}
            disabled={isReconciling}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            {isReconciling ? 'Reconciling Claims...' : 'Run Evidence Reconciliation'}
          </button>
        </div>
      </div>

      {/* Toggle View Mode: Audit vs Ingested Docs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewDocsTab(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !viewDocsTab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            Claim vs Evidence Audit
          </button>
          <button
            onClick={() => setViewDocsTab(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewDocsTab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            Ingested Evidence Documents ({evidenceDocs.length})
          </button>
        </div>
      </div>

      {!viewDocsTab ? (
        /* Side by Side Reconciliation View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Claims Selector Column */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 h-[680px] overflow-y-auto">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 px-1 mb-2">
              Select Claim to Inspect Evidence Trail ({claims.length})
            </h3>
            {claims.map((c) => {
              const isSelected = selectedClaim && selectedClaim.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClaim(c)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-indigo-400 font-semibold">
                      {c.metric || 'General Spec'}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <h4 className="font-medium text-slate-200 line-clamp-2">{c.claim_text}</h4>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Promised: <strong className="text-emerald-400">{c.promised_value}</strong></span>
                    {c.verified_value && (
                      <span className="text-rose-400 font-mono">Found: {c.verified_value}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Evidence Reconciliation Breakdown */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {selectedClaim ? (
              <>
                {/* Claim Card */}
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-indigo-400">
                      {selectedClaim.category}
                    </span>
                    <StatusBadge status={selectedClaim.status} size="md" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-100">{selectedClaim.claim_text}</h2>
                  <div className="mt-2 flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">
                      Promised Value: <strong className="text-emerald-400">{selectedClaim.promised_value}</strong>
                    </span>
                    {selectedClaim.verified_value && (
                      <span className="text-slate-400">
                        Official Spec Value: <strong className="text-rose-400">{selectedClaim.verified_value}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Explainable Verification Rationale */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    AI Explainable Verification Rationale
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                    <p>{selectedClaim.explanation}</p>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                      <span>NLI Entailment Confidence: <strong className="text-indigo-400 font-mono font-semibold">{Math.round((selectedClaim.confidence || 0.9) * 100)}%</strong></span>
                      <span>Extraction Source: <strong className="text-slate-300 font-mono">{selectedClaim.source_section || 'Listing Specifications'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Retrieved Evidence Citations (RAG Snippets) */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    Retrieved Manufacturer Proof Citations (RAG Retrieval)
                  </h4>

                  {selectedClaim.evidence_citations && selectedClaim.evidence_citations.length > 0 ? (
                    <div className="space-y-3">
                      {selectedClaim.evidence_citations.map((cit, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950 p-4 rounded-xl border border-sky-500/30 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                            <span className="font-semibold text-sky-300">{cit.source_name}</span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              Section: {cit.section || 'Specification'} {cit.page ? `• Page ${cit.page}` : ''}
                            </span>
                          </div>
                          <blockquote className="italic text-slate-300 bg-slate-900/60 p-3 rounded-lg border-l-2 border-sky-400">
                            "{cit.snippet}"
                          </blockquote>
                          <div className="text-[10px] text-slate-500 text-right">
                            Semantic Relevance Match: {(cit.relevance_score * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                      No matching clauses or sections found in ingested documents for this specification.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                Select a claim on the left to inspect its evidence trail.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Ingested Documents View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evidenceDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 font-bold">
                    {doc.doc_type}
                  </span>
                  <span className="text-slate-500 text-[10px] font-mono">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 text-sm mb-2">{doc.title}</h3>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {doc.text_content}
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>File: {doc.filename || 'datasheet.txt'}</span>
                <span className="text-emerald-400 font-medium">Indexed in RAG Corpus</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
