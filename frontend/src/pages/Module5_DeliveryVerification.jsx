import React from 'react';
import ModuleHeader from '../components/ModuleHeader';
import { PackageCheck, ShieldAlert, FileText, Cpu, Battery, Wrench, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function Module5_DeliveryVerification({
  orders,
  discrepancies,
  onOpenDeliveryVerifyModal,
  onOpenDiscrepancy,
}) {
  return (
    <div className="space-y-6">
      <ModuleHeader
        moduleNumber="5"
        moduleName="Delivery Verification"
        defaultDescription="Audits customer-uploaded packaging receipts, unboxing photographs, and device hardware diagnostics against original listing specifications to detect physical non-conformances."
        stats={[
          { label: 'Audited Orders', value: `${orders.length} Orders` },
          { label: 'Active Flags', value: `${discrepancies.length} Discrepancies` },
        ]}
        actionButton={
          <button
            onClick={onOpenDeliveryVerifyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            Audit Delivered Package
          </button>
        }
      />

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const relatedReport = discrepancies.find((d) => d.id === order.report_id);

          return (
            <div
              key={order.order_id}
              className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5"
            >
              {/* Order Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      ORDER #{order.order_id}
                    </span>
                    {order.status?.includes('Resolved') ? (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        ✓ {order.status}
                      </span>
                    ) : order.status?.includes('Arbitration') ? (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        ⚖ {order.status}
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        {order.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Customer Diagnostic Scan & Delivery Audit
                  </h3>
                  <span className="text-xs text-slate-500">
                    Recipient: <strong className="text-slate-700 dark:text-slate-300">{order.customer_name}</strong> • Delivery Date:{' '}
                    <span className="font-mono text-slate-600 dark:text-slate-400">{order.delivery_date}</span>
                  </span>
                </div>

                {relatedReport && (
                  <button
                    onClick={() => onOpenDiscrepancy(relatedReport)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Open Dispute Dossier ({relatedReport.id})
                  </button>
                )}
              </div>

              {/* Hardware Spec Comparison Matrix */}
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Pre-Purchase Listing Promise vs Delivered Diagnostic Matrix
                </h4>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 uppercase tracking-wider font-medium border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Component / Spec</th>
                        <th className="p-3">Advertised in Listing</th>
                        <th className="p-3">Diagnosed in Delivery</th>
                        <th className="p-3">Audit Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {/* CPU */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-slate-400" /> CPU Processor
                        </td>
                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">Intel Core i7-13700H (14-Core)</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">Intel Core i7-13700H @ 2.40GHz</td>
                        <td className="p-3">
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Exact Conformity
                          </span>
                        </td>
                      </tr>

                      {/* RAM */}
                      <tr className="bg-rose-50/40 dark:bg-rose-950/20">
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-rose-500" /> System Memory (RAM)
                        </td>
                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">16 GB DDR5 Dual-Channel</td>
                        <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                          8 GB DDR5 Single Stick (Slot 2 Empty)
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                            ✕ CRITICAL NON-CONFORMANCE (-50%)
                          </span>
                        </td>
                      </tr>

                      {/* Storage */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400" /> Internal SSD
                        </td>
                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">1 TB PCIe Gen 4.0 NVMe SSD</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">1 TB Samsung PM9A1 NVMe</td>
                        <td className="p-3">
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Exact Conformity
                          </span>
                        </td>
                      </tr>

                      {/* Charger */}
                      <tr className="bg-amber-50/40 dark:bg-amber-950/20">
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Battery className="w-3.5 h-3.5 text-amber-500" /> Power Adapter
                        </td>
                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">100W GaN Fast Charger</td>
                        <td className="p-3 font-mono font-medium text-amber-700 dark:text-amber-400">
                          65W Standard Adapter (AD65W)
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            ✕ Accessory Downgrade (-35W)
                          </span>
                        </td>
                      </tr>

                      {/* Warranty */}
                      <tr className="bg-amber-50/40 dark:bg-amber-950/20">
                        <td className="p-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Wrench className="w-3.5 h-3.5 text-amber-500" /> Warranty Certificate
                        </td>
                        <td className="p-3 font-mono text-slate-700 dark:text-slate-300">2-Year Comprehensive Onsite</td>
                        <td className="p-3 font-mono font-medium text-amber-700 dark:text-amber-400">
                          1-Year Standard Limited Pamphlet
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            ✕ Year 2 Certificate Missing
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
