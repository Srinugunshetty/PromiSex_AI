import React from 'react';
import PromiseGraphView from '../components/PromiseGraphView';
import { Share2, Info, Database } from 'lucide-react';

export default function PromiseGraphPage({ graphData, onSelectNode }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Promise Knowledge Graph</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              NetworkX & Neo4j Ontology
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual topological representation mapping sellers, products, extracted promises, manufacturer proof, and post-purchase orders
          </p>
        </div>
      </div>

      {/* Embedded Graph Canvas */}
      <PromiseGraphView graphData={graphData} onSelectNode={onSelectNode} />

      {/* Ontology Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Products & Sellers
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Entities offering goods in the digital marketplace. Seller profiles maintain historical fulfillment and contradiction indices.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Claims & Proof Edges
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Promises link to manufacturer evidence via <code className="text-indigo-300">SUPPORTS</code>, <code className="text-rose-300">CONTRADICTS</code>, or <code className="text-amber-300">PARTIAL_MATCH</code> directed relations.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <h4 className="font-bold text-slate-200 mb-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Orders & Discrepancies
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Customer order fulfillment events connect delivered diagnostic scans to original promises to trigger dispute resolutions.
          </p>
        </div>
      </div>
    </div>
  );
}
