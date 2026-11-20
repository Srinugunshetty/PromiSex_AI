import React, { useState } from 'react';
import ModuleHeader from '../components/ModuleHeader';
import StatusBadge from '../components/StatusBadge';
import { GitCompare, FileText, CheckCircle2, XCircle, AlertTriangle, HelpCircle, UploadCloud, RefreshCw } from 'lucide-react';

export default function Module4_EvidenceVerification({
  claims,
  evidenceDocs,
  onRunReconciliation,
  onOpenUploadEvidence,
}) {
  const [selectedClaim, setSelectedClaim] = useState(claims[3] || claims[0]);
  const [isReconciling, setIsReconciling] = useState(false);
  const [activeTab, setActiveTab] = useState('reconciliation');

  const handleReconcile = async () => {
    setIsReconciling(true);
    try {
      await onRunReconciliation();
    } finally {
      setIsReconciling(false);
    }
  };

  const statusCounts = {
    verified: claims.filter((c) => c.status === 'Verified').length,
    contradicted: claims.filter((c) => c.status === 'Contradicted').length,
    partial: claims.filter((c) => c.status === 'Partially verified').length,
    unverifiable: claims.filter((c) => c.status === 'Unverifiable').length,
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="4"
        moduleName="Evidence Verification"
        defaultDescription="Matches extracted seller claims against manufacturer engineering specifications and detects contradictions, exaggerations, or unsupported assertions via DeBERTa NLI."
        stats={[
          { label: 'Verified', value: statusCounts.verified },
          { label: 'Contradicted', value: statusCounts.contradicted },
          { label: 'Partial', value: statusCounts.partial },
          { label: 'Unverifiable', value: statusCounts.unverifiable },
        ]}
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUploadEvidence}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700"
            >
              + Ingest Document
            </button>
            <button
              onClick={handleReconcile}
              disabled={isReconciling}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
              <span>{isReconciling ? 'Reconciling...' : 'Run Reconciliation'}</span>
            </button>
          </div>
        }
      />

      {/* Sub-navigation */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            activeTab === 'reconciliation'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Claim vs Evidence Audit Matrix
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Ingested Evidence Documents ({evidenceDocs.length})
        </button>
      </div>

      {activeTab === 'reconciliation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Claims Selector Column */}
          <div className="lg:col-span-5 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-2 max-h-[620px] overflow-y-auto">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 px-1 mb-2">
              Select Promise to Review Evidence Audit ({claims.length})
            </h4>

            {claims.map((c) => {
              const isSelected = selectedClaim && selectedClaim.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClaim(c)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 dark:bg-blue-950/40 dark:border-blue-700 shadow-xs'
                      : 'bg-slate-50/70 dark:bg-slate-950/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {c.metric || 'General Spec'}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <h5 className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                    {c.claim_text}
                  </h5>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Promised: <strong className="text-slate-700 dark:text-slate-300">{c.promised_value}</strong></span>
                    {c.verified_value && (
                      <span className="text-rose-600 dark:text-rose-400 font-mono font-medium">
                        Found: {c.verified_value.slice(0, 22)}...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evidence Details Column */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
            {selectedClaim ? (
              <>
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                      {selectedClaim.category}
                    </span>
                    <StatusBadge status={selectedClaim.status} size="md" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedClaim.claim_text}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-500">
                      Promised Value: <strong className="text-slate-900 dark:text-slate-100">{selectedClaim.promised_value}</strong>
                    </span>
                    {selectedClaim.verified_value && (
                      <span className="text-slate-500">
                        Official Spec: <strong className="text-rose-600 dark:text-rose-400">{selectedClaim.verified_value}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Reconciliation Rationale */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Explainable Verification Rationale
                  </h4>
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    <p>{selectedClaim.explanation}</p>
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-850 flex justify-between items-center text-[11px] text-slate-500">
                      <span>NLI Inference Confidence: <strong className="text-blue-600 dark:text-blue-400 font-mono font-semibold">{Math.round((selectedClaim.confidence || 0.9) * 100)}%</strong></span>
                      <span>Source: <strong className="text-slate-700 dark:text-slate-300 font-mono">{selectedClaim.source_section}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Retrieved Proof Citations */}
                <div className="space-y-2">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Retrieved Manufacturer Proof Citations
                  </h4>

                  {selectedClaim.evidence_citations && selectedClaim.evidence_citations.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedClaim.evidence_citations.map((cit, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200 dark:border-slate-850 text-[11px]">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{cit.source_name}</span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {cit.section || 'Specification'}
                            </span>
                          </div>
                          <blockquote className="italic text-slate-700 dark:text-slate-300 pl-2.5 border-l-2 border-blue-600">
                            "{cit.snippet}"
                          </blockquote>
                          <div className="text-[10px] text-slate-400 text-right">
                            Semantic Relevance Match: {(cit.relevance_score * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                      No matching clauses or sections found in ingested documents for this specification.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Select a promise from the left panel to review its evidence trail.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Ingested Documents Registry */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evidenceDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-800">
                  {doc.doc_type}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{doc.title}</h4>
              <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 text-xs font-mono text-slate-700 dark:text-slate-300 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {doc.text_content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
