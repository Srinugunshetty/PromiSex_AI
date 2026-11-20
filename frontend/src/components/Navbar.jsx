import React from 'react';
import { Sun, Moon, Plus, RotateCcw, Menu, Shield } from 'lucide-react';

export default function Navbar({
  activeTab,
  theme,
  setTheme,
  onResetDemo,
  onOpenNewProduct,
  onToggleMobileSidebar,
}) {
  const titles = {
    dashboard: 'Executive Overview',
    product_intel: 'Module 1: Product Intelligence',
    extraction: 'Module 2: Promise Extraction',
    graph: 'Module 3: Promise Graph',
    evidence: 'Module 4: Evidence Verification',
    delivery: 'Module 5: Delivery Verification',
    discrepancy: 'Module 6: Discrepancy Management',
    monitoring: 'Module 7: Promise Monitoring',
    seller: 'Module 8: Seller Intelligence',
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors h-14 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Active Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium hidden sm:inline">Platform</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
            {titles[activeTab] || 'Executive Overview'}
          </h2>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Reset Baseline */}
        <button
          onClick={onResetDemo}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors font-medium"
          title="Reset to clean baseline scenario"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Baseline</span>
        </button>

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

        {/* Add New Product Listing */}
        <button
          onClick={onOpenNewProduct}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Listing</span>
        </button>
      </div>
    </header>
  );
}
