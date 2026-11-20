import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md', showIcon = true }) {
  const norm = (status || 'Pending').toLowerCase();

  const configs = {
    verified: {
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400',
      icon: CheckCircle2,
      label: 'Verified',
    },
    'partially verified': {
      bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      dot: 'bg-amber-400',
      icon: AlertTriangle,
      label: 'Partially Verified',
    },
    contradicted: {
      bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      dot: 'bg-rose-500',
      icon: XCircle,
      label: 'Contradicted',
    },
    unverifiable: {
      bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
      dot: 'bg-purple-400',
      icon: HelpCircle,
      label: 'Unverifiable',
    },
    pending: {
      bg: 'bg-slate-700/40 border-slate-600/40 text-slate-300',
      dot: 'bg-slate-400',
      icon: Clock,
      label: 'Pending',
    },
  };

  const current = configs[norm] || configs.pending;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-sm transition-all shadow-sm ${current.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{current.label}</span>
    </span>
  );
}
