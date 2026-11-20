import React from 'react';
import {
  Shield,
  Layers,
  FileSearch,
  Share2,
  GitCompare,
  PackageCheck,
  FileWarning,
  Clock,
  Building2,
  LayoutDashboard,
  Sun,
  Moon,
  Plus,
  RotateCcw,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onResetDemo,
  onOpenNewProduct,
}) {
  const modules = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard, tag: 'Overview' },
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand & Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
              PX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  PROMISEX
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-0.5 font-medium hidden sm:block">
                Product Promise Verification & Accountability Platform
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Reset Scenario */}
            <button
              onClick={onResetDemo}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors font-medium"
              title="Reset to clean baseline scenario"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset Baseline
            </button>

            {/* Add New Product Listing */}
            <button
              onClick={onOpenNewProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Listing</span>
            </button>
          </div>
        </div>

        {/* Primary Module Navigation Tabs */}
        <div className="flex overflow-x-auto gap-1 border-t border-slate-200/80 dark:border-slate-800/80 py-1.5 scrollbar-none">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400 dark:text-blue-600' : 'text-slate-400'}`} />
                <span>{m.label}</span>
                {m.tag !== 'Overview' && (
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                      isActive
                        ? 'bg-slate-800 text-slate-300 dark:bg-slate-200 dark:text-slate-800'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500'
                    }`}
                  >
                    {m.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
