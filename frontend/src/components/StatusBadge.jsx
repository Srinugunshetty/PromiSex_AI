import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const norm = (status || 'Pending').toLowerCase();

  const configs = {
    verified: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/80',
      dot: 'bg-emerald-600 dark:bg-emerald-400',
      icon: CheckCircle2,
      label: 'Verified',
    },
    'partially verified': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/80',
      dot: 'bg-amber-600 dark:bg-amber-400',
      icon: AlertTriangle,
      label: 'Partially Verified',
    },
    contradicted: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/80',
      dot: 'bg-rose-600 dark:bg-rose-400',
      icon: XCircle,
      label: 'Contradicted',
    },
    unverifiable: {
      bg: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
      dot: 'bg-slate-500 dark:bg-slate-400',
      icon: HelpCircle,
      label: 'Unverifiable',
    },
    pending: {
      bg: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
      dot: 'bg-slate-400',
      icon: Clock,
      label: 'Pending Audit',
    },
  };

  const current = configs[norm] || configs.pending;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
    lg: 'text-xs px-3 py-1 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-tight ${current.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{current.label}</span>
    </span>
  );
}
