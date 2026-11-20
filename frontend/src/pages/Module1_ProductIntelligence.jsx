import React, { useState } from 'react';
import ModuleHeader from '../components/ModuleHeader';
import { Layers, Building2, FileText, CheckCircle2, DollarSign, Tag, ExternalLink, Plus } from 'lucide-react';

export default function Module1_ProductIntelligence({
  product,
  evidenceDocs,
  onOpenNewProduct,
  onOpenUploadEvidence,
}) {
  const [activeSubTab, setActiveSubTab] = useState('specifications');

  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="1"
        moduleName="Product Intelligence"
        defaultDescription="Maintains centralized product catalog, merchant credentials, SKU configurations, and authorized manufacturer technical specifications."
        stats={[
          { label: 'Active SKU', value: product?.model || 'UP15-2026-X' },
          { label: 'Manufacturer Specs', value: `${evidenceDocs.length} Docs` },
          { label: 'Retail Price', value: `$${product?.price?.toFixed(2) || '1,499.00'}` },
        ]}
        actionButton={
          <button
            onClick={onOpenNewProduct}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add SKU Listing
          </button>
        }
      />

      {/* Product & Merchant Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase font-semibold text-blue-600 dark:text-blue-400">
                Primary Monitored SKU • {product?.category || 'Consumer Laptops'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {product?.title}
              </h2>
            </div>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
              ${product?.price?.toFixed(2)} {product?.currency || 'USD'}
            </span>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveSubTab('specifications')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeSubTab === 'specifications'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Master Technical Specs
            </button>
            <button
              onClick={() => setActiveSubTab('listing')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeSubTab === 'listing'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Raw Marketplace Listing
            </button>
          </div>

          {activeSubTab === 'specifications' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850">
                <span className="text-slate-500 block font-medium">Brand & Model</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product?.brand} • {product?.model}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850">
                <span className="text-slate-500 block font-medium">Processor (CPU)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  13th Gen Intel Core i7-13700H (14-Core, 5.0 GHz)
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850">
                <span className="text-slate-500 block font-medium">System Memory</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  16 GB DDR5 5200MHz Dual-Channel (SO-DIMM)
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850">
                <span className="text-slate-500 block font-medium">Primary Storage</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  1 TB PCIe Gen 4.0 NVMe SSD
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850">
                <span className="text-slate-500 block font-medium">Display Specification</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  15.6" 2.8K (2880x1800) OLED 120Hz Variable Refresh
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-850">
                <span className="text-slate-500 block font-medium">Dedicated Graphics</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  NVIDIA GeForce RTX 4060 Laptop GPU 8GB GDDR6 (105W)
                </span>
              </div>
            </div>
          ) : (
            <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-850 text-xs font-mono text-slate-800 dark:text-slate-200 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {product?.raw_listing_text}
            </pre>
          )}
        </div>

        {/* Merchant & Manufacturer Reference */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Listing Merchant Profile
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-500">Merchant Name:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {product?.seller_name || 'TechDirect Global'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-500">Merchant ID:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {product?.seller_id || 's_techdirect'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-850">
                <span className="text-slate-500">Platform Rating:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">★ 4.2 / 5.0</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Compliance Audit:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Active Monitoring
                </span>
              </div>
            </div>
          </div>

          {/* Authorized Manufacturer Specs */}
          <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Manufacturer Documents
              </span>
              <button
                onClick={onOpenUploadEvidence}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                + Upload
              </button>
            </div>
            <div className="space-y-2">
              {evidenceDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100 block truncate max-w-[200px]">
                      {doc.title}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {doc.doc_type}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
