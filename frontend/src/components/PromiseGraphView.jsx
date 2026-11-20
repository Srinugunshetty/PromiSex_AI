import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Database, ShieldCheck, AlertCircle, FileText, ShoppingCart, User, Layers } from 'lucide-react';
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

  // Position nodes radially or in layered clusters
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
    sellerNodes.forEach((n, idx) => {
      pos[n.id] = { x: centerX - 260, y: centerY - 140, ...n };
    });

    // Evidence docs to upper right
    const evidenceNodes = graphData.nodes.filter((n) => n.type === 'evidence');
    evidenceNodes.forEach((n, idx) => {
      const angle = -0.3 + idx * 0.6;
      pos[n.id] = {
        x: centerX + 270 + Math.cos(angle) * 40,
        y: centerY - 140 + idx * 100,
        ...n,
      };
    });

    // Orders to lower left
    const orderNodes = graphData.nodes.filter((n) => n.type === 'order');
    orderNodes.forEach((n, idx) => {
      pos[n.id] = { x: centerX - 260, y: centerY + 140, ...n };
    });

    // Discrepancies to lower right
    const discrepancyNodes = graphData.nodes.filter((n) => n.type === 'discrepancy');
    discrepancyNodes.forEach((n, idx) => {
      pos[n.id] = { x: centerX + 260, y: centerY + 150, ...n };
    });

    // Claims in an elliptical orbit around center
    const claimNodes = graphData.nodes.filter((n) => n.type === 'claim');
    const totalClaims = claimNodes.length;
    const radiusX = 230;
    const radiusY = 170;

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

  // Handle Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw background grid dots
    ctx.fillStyle = '#1e293b';
    const gridSize = 30;
    for (let x = -width; x < width * 2; x += gridSize) {
      for (let y = -height; y < height * 2; y += gridSize) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    if (!graphData || !graphData.edges) {
      ctx.restore();
      return;
    }

    // Filtered claim nodes
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

        ctx.strokeStyle = isHighlighted ? '#38bdf8' : edge.color || '#334155';
        ctx.lineWidth = isHighlighted ? 2.5 : 1.2;

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
          ctx.font = '10px Inter, sans-serif';
          ctx.fillStyle = isHighlighted ? '#93c5fd' : '#64748b';
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
      const radius = isSelected ? node.size * 0.7 + 4 : node.size * 0.7;

      // Glow effect for selected or contradicted nodes
      if (isSelected || node.status === 'Contradicted') {
        ctx.shadowColor = node.color || '#3b82f6';
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color || '#475569';
      ctx.fill();

      // Border ring
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? '#ffffff' : '#0f172a';
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Node label
      ctx.font = isSelected
        ? 'bold 11px Inter, sans-serif'
        : '10px Inter, sans-serif';
      ctx.fillStyle = isSelected ? '#ffffff' : '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + radius + 13);
    });

    ctx.restore();
  }, [nodePositions, graphData, zoom, pan, selectedNode, filterStatus]);

  // Canvas Mouse Interactions
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    // Check hit node
    let clickedNode = null;
    Object.values(nodePositions).forEach((node) => {
      const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
      if (dist <= node.size * 0.7 + 6) {
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
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md z-10 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Promise Knowledge Graph
              <span className="text-xs font-normal text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                {Object.keys(nodePositions).length} Entities
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive relationship network connecting products, claims, evidence, and orders
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {['ALL', 'Verified', 'Contradicted', 'Partially verified', 'Unverifiable'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    filterStatus === st
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'Partially verified' ? 'Partial' : st}
                </button>
              )
            )}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.2))}
              className="p-1 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
              className="p-1 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Reset Canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowCypherModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-medium transition-all"
          >
            <Database className="w-3.5 h-3.5" />
            Neo4j Cypher
          </button>
        </div>
      </div>

      {/* Main Canvas View */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          width={920}
          height={520}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800/80 backdrop-blur-md rounded-xl p-2.5 text-xs text-slate-300 flex items-center gap-3 shadow-lg pointer-events-none">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
            Node Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Verified
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            Contradicted
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            Partial
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            Unverifiable
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            Evidence Doc
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                {selectedNode.type} Entity
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-200 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <h4 className="font-semibold text-slate-100 text-sm mb-2">
              {selectedNode.label}
            </h4>

            {selectedNode.status && (
              <div className="mb-3">
                <StatusBadge status={selectedNode.status} />
              </div>
            )}

            {selectedNode.metadata && (
              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {selectedNode.metadata.category && (
                  <div>
                    <span className="text-slate-500 block">Category</span>
                    <span className="font-medium text-slate-200">
                      {selectedNode.metadata.category}
                    </span>
                  </div>
                )}

                {selectedNode.metadata.claim_text && (
                  <div>
                    <span className="text-slate-500 block">Promised Claim</span>
                    <span className="text-slate-200 italic">
                      "{selectedNode.metadata.claim_text}"
                    </span>
                  </div>
                )}

                {selectedNode.metadata.verified_value && (
                  <div>
                    <span className="text-slate-500 block">Reconciled Value</span>
                    <span className="font-mono text-emerald-400">
                      {selectedNode.metadata.verified_value}
                    </span>
                  </div>
                )}

                {selectedNode.metadata.explanation && (
                  <div>
                    <span className="text-slate-500 block">AI Verification Rationale</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      {selectedNode.metadata.explanation}
                    </p>
                  </div>
                )}

                {selectedNode.metadata.confidence && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <span className="text-slate-500">Confidence Score</span>
                    <span className="font-semibold text-indigo-400">
                      {(selectedNode.metadata.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cypher Export Modal */}
      {showCypherModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400">
                <Database className="w-5 h-5" />
                <h3 className="font-bold text-lg text-slate-100">
                  Export to Neo4j Knowledge Graph (Cypher)
                </h3>
              </div>
              <button
                onClick={() => setShowCypherModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Run these Cypher statements in Neo4j Browser or AuraDB to materialize the PROMISEX
              accountability graph:
            </p>
            <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-400 max-h-72 overflow-y-auto">
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
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `MERGE (p:Product {id: 'prod_ultrabook_15', name: 'UltraBook Pro 15'});\nMERGE (s:Seller {id: 'seller_techdirect', name: 'TechDirect Global'});`
                  );
                  alert('Cypher copied to clipboard!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowCypherModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
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
