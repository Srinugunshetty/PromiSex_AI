import React, { useState } from 'react';
import { Edit3, Info, Check, ShieldCheck } from 'lucide-react';

export default function ModuleHeader({
  moduleNumber,
  moduleName,
  defaultDescription,
  stats = [],
  actionButton,
}) {
  const storageKey = `module_desc_${moduleNumber}`;
  const [description, setDescription] = useState(
    () => localStorage.getItem(storageKey) || defaultDescription
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState(description);

  const handleSave = () => {
    setDescription(tempDesc);
    localStorage.setItem(storageKey, tempDesc);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Module Title & Editable Description */}
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
              Module {moduleNumber}
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {moduleName}
            </h1>
          </div>

          {!isEditing ? (
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed group">
              <p>{description}</p>
              <button
                onClick={() => {
                  setTempDesc(description);
                  setIsEditing(true);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-60 group-hover:opacity-100 transition-opacity p-0.5"
                title="Edit module description"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <textarea
                value={tempDesc}
                onChange={(e) => setTempDesc(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save Description
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Metric Chips */}
        <div className="flex flex-wrap items-center gap-3">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-right"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-medium">
                {s.label}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                {s.value}
              </span>
            </div>
          ))}

          {actionButton}
        </div>
      </div>
    </div>
  );
}
