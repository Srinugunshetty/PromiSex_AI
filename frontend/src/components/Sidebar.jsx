import React from 'react';
import {
  LayoutDashboard,
  Layers,
  FileSearch,
  Share2,
  GitCompare,
  PackageCheck,
  FileWarning,
  Clock,
  Building2,
  ChevronRight,
  Shield,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, product }) {
  const modules = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard, tag: null },
    { id: 'product_intel', label: 'Product Intelligence', icon: Layers, tag: 'M1' },
    { id: 'extraction', label: 'Promise Extraction', icon: FileSearch, tag: 'M2' },
    { id: 'graph', label: 'Promise Graph', icon: Share2, tag: 'M3' },
    { id: 'evidence', label: 'Evidence Verification', icon: GitCompare, tag: 'M4' },
    { id: 'delivery', label: 'Delivery Verification', icon: PackageCheck, tag: 'M5' },
    { id: 'discrepancy', label: 'Discrepancy Management', icon: FileWarning, tag: 'M6' },
    { id: 'monitoring', label: 'Promise Monitoring', icon: Clock, tag: 'M7' },
    { id: 'seller', label: 'Seller Intelligence', icon: Building2, tag: 'M8' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-[#0c1017] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-14 px-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
            PX
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                PROMISEX
              </span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
              Promise Verification Suite
            </p>
          </div>
        </div>

        {/* Modules Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            Navigation & Modules
          </div>

          <nav className="space-y-0.5">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeTab === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-blue-400 dark:text-blue-600'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="truncate">{m.label}</span>
                  </div>

                  {m.tag && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        isActive
                          ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {m.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer: Active SKU info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-2.5 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono font-semibold">
            <span>Target SKU</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
            </span>
          </div>
          <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px]">
            {product?.title || 'TechCorp UltraBook Pro 15'}
          </p>
          <span className="text-[10px] text-slate-500 font-mono block">
            SN: UP15-99482
          </span>
        </div>
      </div>
    </aside>
  );
}
