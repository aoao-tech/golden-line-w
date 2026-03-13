import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OperationalDebts() {
  const { data: debts, isLoading } = useQuery({
    queryKey: ["operational_debts"],
    queryFn: () => base44.entities.OperationalDebts.list("-created_date", 100),
    initialData: [],
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Database className="w-5 h-5 text-amber-500" />
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Operational Debts</h1>
        </div>
        <p className="text-sm text-slate-500 ml-8">
          {!isLoading && `${debts.length} records`}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Restaurant</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Active</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Action Code</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Golden Line</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Failed Items</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Confidence</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Injected</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Source Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(9).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : debts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-slate-400">
                    No operational debts found
                  </td>
                </tr>
              ) : (
                debts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-800">{debt.customer_id || "—"}</td>
                    <td className="px-4 py-3.5 text-slate-600">{debt.restaurant_id || "—"}</td>
                    <td className="px-4 py-3.5">
                      {debt.is_active !== false ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 gap-1 font-normal">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50 gap-1 font-normal">
                          <XCircle className="w-3 h-3" /> Inactive
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {debt.action_code ? (
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">{debt.action_code}</code>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-[200px] truncate" dir="rtl">{debt.golden_line_hebrew || "—"}</td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-[150px] truncate">{debt.failed_items || "—"}</td>
                    <td className="px-4 py-3.5">
                      {debt.confidence_score != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{ width: `${Math.min(debt.confidence_score * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{(debt.confidence_score * 100).toFixed(0)}%</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 tabular-nums">{debt.injected_count ?? 0}</td>
                    <td className="px-4 py-3.5">
                      {debt.source_ticket_id ? (
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">{debt.source_ticket_id}</code>
                      ) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}