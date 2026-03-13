import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function InjectionEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["injection_events"],
    queryFn: () => base44.entities.injection_events.list("-created_date", 100),
    initialData: [],
  });

  const outcomeStyle = (outcome) => {
    const lower = (outcome || "").toLowerCase();
    if (lower === "success") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (lower === "failure" || lower === "error" || lower === "failed") return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Zap className="w-5 h-5 text-amber-500" />
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Injection Events</h1>
        </div>
        <p className="text-sm text-slate-500 ml-8">
          {!isLoading && `${events.length} records`}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Debt ID</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Outcome</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Error Message</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Injected At</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-slate-400">
                    No injection events found
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      {event.debt_id ? (
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">{event.debt_id}</code>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      {event.order_id ? (
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">{event.order_id}</code>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      {event.outcome ? (
                        <Badge className={`${outcomeStyle(event.outcome)} border hover:opacity-90 font-normal`}>
                          {event.outcome}
                        </Badge>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-[300px] truncate">{event.error_message || "—"}</td>
                    <td className="px-4 py-3.5 text-slate-600 tabular-nums">
                      {event.injected_at ? format(new Date(event.injected_at), "MMM d, yyyy HH:mm") : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 tabular-nums text-xs">
                      {event.created_date ? format(new Date(event.created_date), "MMM d, yyyy HH:mm") : "—"}
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