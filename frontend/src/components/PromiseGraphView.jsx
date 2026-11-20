import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Database, Layers, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function PromiseGraphView({ graphData, onSelectNode }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showCypherModal, setShowCypherModal] = useState(false);

  const [nodePositions, setNodePositions] = useState({});

  useEffect(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) return;

    const width = 850;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    const pos = {};

    // Center product
    const productNodes = graphData.nodes.filter((n) => n.type === 'product');
    productNodes.forEach((n) => {
      pos[n.id] = { x: centerX, y: centerY, ...n };
    });

    // Seller to upper left
    const sellerNodes = graphData.nodes.filter((n) => n.type === 'seller');
    sellerNodes.forEach((n) => {
      pos[n.id] = { x: centerX - 260, y: centerY - 130, ...n };
    });

    // Evidence docs to upper right
    const evidenceNodes = graphData.nodes.filter((n) => n.type === 'evidence');
    evidenceNodes.forEach((n, idx) => {
      pos[n.id] = {
        x: centerX + 260,
        y: centerY - 130 + idx * 90,
        ...n,
      };
    });

    // Orders to lower left
    const orderNodes = graphData.nodes.filter((n) => n.type === 'order');
    orderNodes.forEach((n) => {
      pos[n.id] = { x: centerX - 260, y: centerY + 130, ...n };
    });

    // Discrepancies to lower right
    const discrepancyNodes = graphData.nodes.filter((n) => n.type === 'discrepancy');
    discrepancyNodes.forEach((n) => {
      pos[n.id] = { x: centerX + 260, y: centerY + 130, ...n };
    });

    // Claims in an elliptical orbit around center
    const claimNodes = graphData.nodes.filter((n) => n.type === 'claim');
    const totalClaims = claimNodes.length;
    const radiusX = 220;
    const radiusY = 160;

    claimNodes.forEach((n, idx) => {
      const angle = (idx / totalClaims) * 2 * Math.PI - Math.PI / 2;
      pos[n.id] = {
        x: centerX + Math.cos(angle) * radiusX,
        y: centerY + Math.sin(angle) * radiusY,
        ...n,
      };
    });

    setNodePositions(pos);
  }, [graphData]);

  // Handle Canvas Drawing with Dark / Light Mode detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const isDark = document.documentElement.classList.contains('dark');

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw background grid dots
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    const gridSize = 28;
    for (let x = -width; x < width * 2; x += gridSize) {
      for (let y = -height; y < height * 2; y += gridSize) {
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }

    if (!graphData || !graphData.edges) {
      ctx.restore();
      return;
    }

    const visibleNodeIds = new Set();
    Object.values(nodePositions).forEach((n) => {
      if (filterStatus === 'ALL') {
        visibleNodeIds.add(n.id);
      } else if (n.type !== 'claim' || n.status === filterStatus) {
        visibleNodeIds.add(n.id);
      }
    });

    // Draw Edges
    graphData.edges.forEach((edge) => {
      const src = nodePositions[edge.source];
      const tgt = nodePositions[edge.target];

      if (src && tgt && visibleNodeIds.has(src.id) && visibleNodeIds.has(tgt.id)) {
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        const isHighlighted =
          selectedNode && (selectedNode.id === src.id || selectedNode.id === tgt.id);

        ctx.strokeStyle = isHighlighted
          ? (isDark ? '#38bdf8' : '#0284c7')
          : (isDark ? '#334155' : '#cbd5e1');
        ctx.lineWidth = isHighlighted ? 2 : 1;

        if (edge.style === 'dashed') {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.stroke();

        // Edge label in middle
        if (zoom > 0.85) {
          const midX = (src.x + tgt.x) / 2;
          const midY = (src.y + tgt.y) / 2;
          ctx.font = '9px -apple-system, sans-serif';
          ctx.fillStyle = isHighlighted
            ? (isDark ? '#93c5fd' : '#0284c7')
            : (isDark ? '#64748b' : '#94a3b8');
          ctx.textAlign = 'center';
          ctx.fillText(edge.label || edge.relation, midX, midY - 3);
        }
      }
    });

    ctx.setLineDash([]);

    // Draw Nodes
    Object.values(nodePositions).forEach((node) => {
      if (!visibleNodeIds.has(node.id)) return;

      const isSelected = selectedNode && selectedNode.id === node.id;
      const radius = isSelected ? node.size * 0.65 + 3 : node.size * 0.65;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color || '#475569';
      ctx.fill();

      // Node border
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.strokeStyle = isSelected ? '#ffffff' : (isDark ? '#0c1017' : '#ffffff');
      ctx.stroke();

      // Node label
      ctx.font = isSelected
        ? 'bold 10px -apple-system, sans-serif'
        : '10px -apple-system, sans-serif';
      ctx.fillStyle = isDark
        ? (isSelected ? '#ffffff' : '#e2e8f0')
        : (isSelected ? '#0f172a' : '#334155');
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + radius + 12);
    });

    ctx.restore();
  }, [nodePositions, graphData, zoom, pan, selectedNode, filterStatus]);

  // Canvas Mouse Interactions
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    let clickedNode = null;
    Object.values(nodePositions).forEach((node) => {
      const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
      if (dist <= node.size * 0.65 + 6) {
        clickedNode = node;
      }
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      if (onSelectNode) onSelectNode(clickedNode);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  return (
    <div className="relative bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col h-[560px] transition-colors">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-[#0c1017]/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xs z-10 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-900/60">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Promise Ontology Graph
              <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800">
                {Object.keys(nodePositions).length} Nodes
              </span>
            </h3>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <Filter className="w-3 h-3 text-slate-400 ml-1.5" />
            {['ALL', 'Verified', 'Contradicted', 'Partially verified', 'Unverifiable'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {st === 'Partially verified' ? 'Partial' : st}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowCypherModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
          >
            <Database className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Cypher (Neo4j)</span>
          </button>
        </div>
      </div>

      {/* Main Canvas View */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-slate-50/50 dark:bg-[#0c1017] overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          width={920}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#111726]/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xs rounded-lg px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-3 shadow-xs pointer-events-none">
          <span className="font-semibold text-slate-400 uppercase text-[9px]">Legend:</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Verified
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Contradicted
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Partial
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span> Unverifiable
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span> Document
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 w-76 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-lg text-xs space-y-2">
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {selectedNode.type} Entity
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              {selectedNode.label}
            </h4>

            {selectedNode.status && (
              <div>
                <StatusBadge status={selectedNode.status} size="sm" />
              </div>
            )}

            {selectedNode.metadata && (
              <div className="space-y-1.5 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 text-[11px]">
                {selectedNode.metadata.category && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Category</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedNode.metadata.category}
                    </span>
                  </div>
                )}

                {selectedNode.metadata.claim_text && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Promised Claim</span>
                    <span className="text-slate-700 dark:text-slate-300 italic">
                      "{selectedNode.metadata.claim_text}"
                    </span>
                  </div>
                )}

                {selectedNode.metadata.verified_value && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reconciled Value</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">
                      {selectedNode.metadata.verified_value}
                    </span>
                  </div>
                )}

                {selectedNode.metadata.explanation && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Verification Rationale</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {selectedNode.metadata.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cypher Modal */}
      {showCypherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-5 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                Neo4j Knowledge Graph (Cypher Export)
              </h3>
              <button
                onClick={() => setShowCypherModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-500 text-xs">
              Execute these Cypher statements in Neo4j to materialize the PROMISEX ontology:
            </p>
            <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850 font-mono text-emerald-600 dark:text-emerald-400 max-h-60 overflow-y-auto leading-relaxed">
{`// Nodes
MERGE (p:Product {id: 'prod_ultrabook_15', name: 'UltraBook Pro 15'});
MERGE (s:Seller {id: 'seller_techdirect', name: 'TechDirect Global'});
MERGE (c1:Claim {metric: 'Battery Life', promised: '12 Hours', status: 'Contradicted'});
MERGE (c2:Claim {metric: 'System RAM', promised: '16 GB DDR5', status: 'Verified'});
MERGE (c3:Claim {metric: 'Warranty', promised: '2 Years', status: 'Partially verified'});
MERGE (e1:Evidence {doc: 'TechCorp Official Engineering Spec Sheet (Rev 2.4)'});
MERGE (o1:Order {id: 'PX-89421', customer: 'Sarah Jenkins'});
MERGE (d1:Discrepancy {severity: 'Critical', issue: '8GB RAM delivered vs 16GB'});

// Edges
MERGE (s)-[:OFFERS]->(p);
MERGE (p)-[:PROMISES]->(c1);
MERGE (p)-[:PROMISES]->(c2);
MERGE (p)-[:PROMISES]->(c3);
MERGE (e1)-[:CONTRADICTS {reason: 'Max 8.5h in MobileMark 25'}]->(c1);
MERGE (e1)-[:SUPPORTS]->(c2);
MERGE (o1)-[:PURCHASED]->(p);
MERGE (o1)-[:TRIGGERED]->(d1);`}
            </pre>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `MERGE (p:Product {id: 'prod_ultrabook_15', name: 'UltraBook Pro 15'});\nMERGE (s:Seller {id: 'seller_techdirect', name: 'TechDirect Global'});`
                  );
                  alert('Cypher copied to clipboard!');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowCypherModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
