import React from 'react';
import { Truck, CheckCircle2, AlertOctagon, FileText, ArrowRight, ShieldAlert, Cpu, Battery, Wrench } from 'lucide-react';

export default function DeliveryPage({
  orders,
  discrepancies,
  onOpenDeliveryVerifyModal,
  onOpenDiscrepancy,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Post-Purchase Delivery Verification</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-semibold">
              Packaging & Hardware Audit
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validates customer-uploaded delivery invoices, packaging BOMs, and system diagnostic logs against pre-purchase promises
          </p>
        </div>

        <button
          onClick={onOpenDeliveryVerifyModal}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-pink-600/25 transition-all"
        >
          <Truck className="w-4 h-4" />
          Verify Delivered Package
        </button>
      </div>

      {/* Active Demonstration Order Card */}
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const relatedReport = discrepancies.find((d) => d.id === order.report_id);

            return (
              <div
                key={order.order_id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                        Order #{order.order_id}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                        {order.status || 'Discrepancy Reported'}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-100 mt-1">
                      Customer Unboxing & Hardware Diagnostic Audit
                    </h2>
                    <span className="text-xs text-slate-400">
                      Customer: <strong className="text-slate-200">{order.customer_name}</strong> • Delivery Date:{' '}
                      <span className="font-mono text-slate-300">{order.delivery_date}</span>
                    </span>
                  </div>

                  {relatedReport && (
                    <button
                      onClick={() => onOpenDiscrepancy(relatedReport)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/25 transition-all"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      View Formal Dispute Report ({relatedReport.id})
                    </button>
                  )}
                </div>

                {/* Hardware Spec Comparison Matrix */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Pre-Purchase Promise vs Physical Delivery Hardware Matrix
                  </h4>

                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Component / Spec</th>
                          <th className="p-3.5">Promised in Listing</th>
                          <th className="p-3.5">Delivered & Diagnosed</th>
                          <th className="p-3.5">Audit Verdict</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {/* Processor */}
                        <tr className="hover:bg-slate-900/40">
                          <td className="p-3.5 font-medium text-slate-200 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-slate-400" />
                            CPU Processor
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">Intel Core i7-13700H (14-Core)</td>
                          <td className="p-3.5 font-mono text-emerald-400">Intel Core i7-13700H @ 2.40GHz</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium text-[11px]">
                              ✓ Exact Match
                            </span>
                          </td>
                        </tr>

                        {/* RAM */}
                        <tr className="bg-rose-950/20 hover:bg-rose-950/30">
                          <td className="p-3.5 font-medium text-slate-200 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-rose-400" />
                            System Memory (RAM)
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">16 GB DDR5 Dual-Channel</td>
                          <td className="p-3.5 font-mono text-rose-400 font-bold">
                            8 GB DDR5 Micron (Slot 2 Empty)
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[11px]">
                              ✕ CRITICAL MISMATCH (50% Deficit)
                            </span>
                          </td>
                        </tr>

                        {/* Storage */}
                        <tr className="hover:bg-slate-900/40">
                          <td className="p-3.5 font-medium text-slate-200 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            SSD Storage
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">1 TB PCIe 4.0 NVMe SSD</td>
                          <td className="p-3.5 font-mono text-emerald-400">1 TB Samsung PM9A1 NVMe</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium text-[11px]">
                              ✓ Exact Match
                            </span>
                          </td>
                        </tr>

                        {/* Charger */}
                        <tr className="bg-amber-950/15 hover:bg-amber-950/25">
                          <td className="p-3.5 font-medium text-slate-200 flex items-center gap-2">
                            <Battery className="w-4 h-4 text-amber-400" />
                            Power Adapter
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">100W GaN Ultra-Fast Charger</td>
                          <td className="p-3.5 font-mono text-amber-300 font-medium">
                            65W Standard Adapter (AD65W)
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold text-[11px]">
                              ✕ Accessory Downgrade (-35W)
                            </span>
                          </td>
                        </tr>

                        {/* Warranty */}
                        <tr className="bg-amber-950/15 hover:bg-amber-950/25">
                          <td className="p-3.5 font-medium text-slate-200 flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-amber-400" />
                            Warranty Certificate
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">2-Year International Onsite</td>
                          <td className="p-3.5 font-mono text-amber-300 font-medium">
                            1-Year Standard Limited Card
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold text-[11px]">
                              ✕ 1 Year Uncovered
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Next Steps Prompt */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Dispute status: <strong className="text-rose-400">Escalated to Marketplace Resolution Desk</strong>
                  </span>
                  {relatedReport && (
                    <button
                      onClick={() => onOpenDiscrepancy(relatedReport)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      Inspect dispute resolution details →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No delivery orders tracked yet. Click "Verify Delivered Package" to run a simulation.
        </div>
      )}
    </div>
  );
}
