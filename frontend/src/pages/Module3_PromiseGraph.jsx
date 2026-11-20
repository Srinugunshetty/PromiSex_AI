import React from 'react';
import ModuleHeader from '../components/ModuleHeader';
import PromiseGraphView from '../components/PromiseGraphView';
import { Share2, Database, Network } from 'lucide-react';

export default function Module3_PromiseGraph({ graphData }) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="3"
        moduleName="Promise Graph"
        defaultDescription="Builds a verifiable knowledge network connecting sellers, products, claims, evidence sources, and fulfillment orders into an auditable graph."
        stats={[
          { label: 'Graph Entities', value: `${graphData.nodes?.length || 0} Nodes` },
          { label: 'Relational Edges', value: `${graphData.edges?.length || 0} Links` },
        ]}
      />

      {/* Embedded Knowledge Graph Visualizer */}
      <PromiseGraphView graphData={graphData} />

      {/* Entity Relationship Schema Reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            Commercial Entities (Sellers & SKUs)
          </h4>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Sellers connect to Products via directed <code className="text-blue-600 dark:text-blue-400 font-mono">OFFERS</code> relations, storing merchant risk scores and dispute histories.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Reconciliation Edges (Proof & Claims)
          </h4>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Manufacturer evidence documents link to extracted claims via <code className="text-emerald-600 dark:text-emerald-400 font-mono">SUPPORTS</code>, <code className="text-rose-600 dark:text-rose-400 font-mono">CONTRADICTS</code>, or <code className="text-amber-600 dark:text-amber-400 font-mono">PARTIAL</code> verification relations.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
            Dispute Nodes (Orders & Discrepancies)
          </h4>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Customer order fulfillment events connect delivered diagnostic scans to original promises, triggering structured dispute dossiers.
          </p>
        </div>
      </div>
    </div>
  );
}
