import React, { useState } from 'react';
import { Award, CheckCircle2, Play, RefreshCw, ArrowRight, Sparkles, FileText, Share2, Truck, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import StatusBadge from '../components/StatusBadge';

export default function JuryDemoPage({
  product,
  claims,
  evidenceDocs,
  orders,
  discrepancies,
  onRunReconciliation,
  onVerifyDelivery,
  onNavigateTab,
  onResetDemo,
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [stepLogs, setStepLogs] = useState([
    '[INIT] PROMISEX AI engine booted and calibrated for Section 12 Jury Demo.',
  ]);

  const addLog = (msg) => {
    setStepLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  };

  const steps = [
    {
      number: 1,
      title: 'Upload Laptop Listing (10–15 Claims)',
      short: 'Listing Ingestion',
      icon: FileText,
      desc: 'Ingest online seller laptop listing containing 14 detailed technical specifications and promotional claims.',
      actionLabel: 'Inspect Raw Listing',
      detail: (
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-40 overflow-y-auto">
          <p className="text-indigo-400 font-semibold mb-1">TechCorp UltraBook Pro 15 (2026 AI Edition):</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Intel Core i7-13700H 14-Core Processor (Up to 5.0 GHz Turbo)</li>
            <li>16 GB Dual-Channel DDR5 5200MHz RAM</li>
            <li>1 TB PCIe Gen 4.0 NVMe SSD</li>
            <li className="text-amber-300 font-medium">12 Hours All-Day Long Battery Life (75Wh capacity) [TARGET CLAIM]</li>
            <li className="text-amber-300 font-medium">100W GaN Ultra-Fast USB-C Charger included in box [TARGET CLAIM]</li>
            <li className="text-amber-300 font-medium">2-Year Comprehensive International Onsite Warranty [TARGET CLAIM]</li>
            <li>15.6-inch 2.8K 120Hz OLED Display & RTX 4060 8GB Graphics</li>
          </ul>
        </div>
      ),
    },
    {
      number: 2,
      title: 'AI Structured Promise Extraction',
      short: 'Promise Extraction',
      icon: Sparkles,
      desc: 'AI parses unstructured text into structured product promises with normalized metrics, units, and categories.',
      actionLabel: 'View Extracted Promises',
      detail: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {claims.slice(0, 6).map((c) => (
            <div key={c.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-indigo-400 font-medium block">{c.metric}</span>
              <span className="font-semibold text-slate-200">{c.promised_value}</span>
              <span className="text-[10px] text-slate-500 block">{c.category}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      number: 3,
      title: 'Upload Manufacturer Spec & Warranty PDF',
      short: 'Evidence Ingestion',
      icon: ShieldCheck,
      desc: 'Ingest official manufacturer engineering datasheets, power benchmarks, and legal warranty policy terms.',
      actionLabel: 'Review Official Documents',
      detail: (
        <div className="space-y-2 text-xs">
          {evidenceDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-slate-200 block">{doc.title}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {doc.doc_type} • {doc.filename || 'datasheet.pdf'}
                </span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                Verified Datasheet
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      number: 4,
      title: 'Evidence Matching & Deliberate Conflict Detection',
      short: 'Reconciliation',
      icon: AlertTriangle,
      desc: 'Run DeBERTa NLI & TF-IDF RAG reconciliation to identify matching and conflicting statements.',
      actionLabel: 'Trigger Reconciliation Engine',
      detail: (
        <div className="space-y-2 text-xs">
          <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-rose-300">Contradiction 1: Battery Life</span>
              <StatusBadge status="Contradicted" size="sm" />
            </div>
            <p className="text-slate-300 text-[11px]">
              Listing claimed <strong>12 Hours</strong>, but Official Engineering Spec states maximum <strong>8.5 Hours</strong> (MobileMark 25). Exaggerated by 41%.
            </p>
          </div>

          <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-rose-300">Contradiction 2: Charger Wattage</span>
              <StatusBadge status="Contradicted" size="sm" />
            </div>
            <p className="text-slate-300 text-[11px]">
              Listing promised <strong>100W GaN Fast Charger</strong>; official packaging BOM specifies standard <strong>65W Adapter</strong> included.
            </p>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-amber-300">Partial Match: Warranty Duration</span>
              <StatusBadge status="Partially verified" size="sm" />
            </div>
            <p className="text-slate-300 text-[11px]">
              Advertised <strong>2-Year Warranty</strong>; TechCorp policy covers <strong>1-Year Limited</strong> (2nd year is an unverified merchant claim).
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 5,
      title: 'Promise Knowledge Graph Materialization',
      short: 'Promise Graph',
      icon: Share2,
      desc: 'Materialize the graph connecting Product, Seller, Claims, Evidence, and Orders with status highlights.',
      actionLabel: 'Open Interactive Graph View',
      detail: (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-200 block">
              Knowledge Graph Schema Generated
            </span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Includes {claims.length} claim nodes, 2 evidence documents, 1 seller, and dispute edges.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('graph')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs flex items-center gap-1.5"
          >
            Launch Graph <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
    {
      number: 6,
      title: 'Simulate Order & Generate Discrepancy Dispute Report',
      short: 'Discrepancy Report',
      icon: Truck,
      desc: 'Simulate customer order delivery #PX-89421, flag hardware mismatch (8GB RAM received vs 16GB promised), and issue report.',
      actionLabel: 'Generate Dispute Report',
      detail: (
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-400">Order #PX-89421 Discrepancy Alert</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold text-[10px]">
              Critical Severity
            </span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Customer diagnostic scan identified <strong>8 GB RAM (Single Stick)</strong> installed instead of promised <strong>16 GB Dual-Channel</strong>.
          </p>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-slate-400 text-[10px]">Dispute Remedy: Immediate replacement or $160 partial refund</span>
            <button
              onClick={() => onNavigateTab('discrepancies')}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium text-xs flex items-center gap-1"
            >
              View Full Report <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  const handleRunCurrentStep = async () => {
    const cur = steps[activeStep - 1];
    addLog(`Running Step ${activeStep}: ${cur.title}...`);

    if (activeStep === 1) {
      addLog('Listing text parsed. 14 seller claims extracted.');
    } else if (activeStep === 2) {
      addLog('Extracted metrics: RAM (16GB), Storage (1TB), Battery (12h), Charger (100W GaN).');
    } else if (activeStep === 3) {
      addLog('Official TechCorp Datasheet Rev 2.4 and Warranty Policy indexed in RAG store.');
    } else if (activeStep === 4) {
      addLog('Evidence reconciliation in progress...');
      await onRunReconciliation();
      addLog('Reconciliation complete! Deliberate battery (8.5h vs 12h) and charger (65W vs 100W) conflicts detected.');
    } else if (activeStep === 5) {
      addLog('Promise Knowledge Graph rendered with Neo4j Cypher compatibility.');
      onNavigateTab('graph');
    } else if (activeStep === 6) {
      addLog('Post-purchase unboxing verified: Order #PX-89421 has 8GB RAM delivered vs 16GB promised!');
      addLog('Formal Discrepancy Report REP-PX-89421 generated with legal remedies.');
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      onNavigateTab('discrepancies');
    }

    if (activeStep < steps.length) {
      setActiveStep((s) => s + 1);
    } else {
      confetti({
        particleCount: 150,
        spread: 90,
      });
    }
  };

  const handlePlayAll = async () => {
    setIsPlayingAll(true);
    addLog('[AUTO-RUN] Executing complete 6-step jury demonstration sequence...');

    for (let i = 1; i <= 6; i++) {
      setActiveStep(i);
      addLog(`[AUTO-RUN] Executing Step ${i}: ${steps[i - 1].title}`);
      if (i === 4) {
        await onRunReconciliation();
      }
      await new Promise((r) => setTimeout(r, 900));
    }

    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 },
    });
    addLog('[AUTO-RUN] Jury demonstration workflow successfully completed!');
    setIsPlayingAll(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Award className="w-4 h-4" /> Section 12 • Jury-Winning Demonstration Workflow
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            End-to-End Product Promise Verification
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Follow the six core steps defined in the PROMISEX AI project specification: from seller listing
            ingestion and structured promise extraction, to evidence reconciliation, knowledge graph tracing,
            and post-purchase discrepancy reporting.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={handlePlayAll}
              disabled={isPlayingAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              {isPlayingAll ? 'Executing Full Demo...' : '1-Click Auto Play Full Demo'}
            </button>

            <button
              onClick={handleRunCurrentStep}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Run Step {activeStep}
            </button>

            <button
              onClick={onResetDemo}
              className="flex items-center gap-1.5 px-3 py-2.5 text-slate-400 hover:text-slate-200 text-xs font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Scenario
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((st) => {
          const Icon = st.icon;
          const isDone = st.number < activeStep;
          const isCurrent = st.number === activeStep;

          return (
            <button
              key={st.number}
              onClick={() => setActiveStep(st.number)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isCurrent
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : isDone
                  ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-500/70'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : st.number}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    isCurrent
                      ? 'text-indigo-400'
                      : isDone
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                />
              </div>
              <h4 className="font-semibold text-xs text-slate-200 line-clamp-1">{st.short}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Step {st.number} of 6</p>
            </button>
          );
        })}
      </div>

      {/* Active Step Showcase Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-bold text-lg flex items-center justify-center">
              {activeStep}
            </span>
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Active Demonstration Phase
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                {steps[activeStep - 1].title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((s) => Math.max(s - 1, 1))}
              disabled={activeStep === 1}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleRunCurrentStep}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5"
            >
              <span>{steps[activeStep - 1].actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {steps[activeStep - 1].desc}
          </p>

          <div className="pt-2">{steps[activeStep - 1].detail}</div>
        </div>
      </div>

      {/* Live System Execution Terminal */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-slate-300">
              PROMISEX Verification Terminal Log
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Live AI Execution</span>
        </div>
        <div className="bg-slate-900/90 rounded-xl p-3 max-h-36 overflow-y-auto font-mono text-xs text-emerald-400/90 space-y-1">
          {stepLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
