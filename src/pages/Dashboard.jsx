import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, X, CheckCircle2, XCircle, Edit2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Dashboard() {
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoldenLine, setEditedGoldenLine] = useState("");

  const queryClient = useQueryClient();

  const { data: debts, isLoading } = useQuery({
    queryKey: ["operational_debts"],
    queryFn: () => base44.entities.OperationalDebts.list("-created_date", 1000),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.OperationalDebts.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operational_debts"] });
      toast.success("Updated successfully");
    },
  });

  const activeDebts = debts.filter((d) => d.is_active !== false);
  const avgConfidence = debts.length > 0
    ? debts.reduce((sum, d) => sum + (d.confidence_score || 0), 0) / debts.length
    : 0;
  const totalInjections = debts.reduce((sum, d) => sum + (d.injected_count || 0), 0);

  const handleRowClick = (debt) => {
    setSelectedDebt(debt);
    setEditedGoldenLine(debt.golden_line_hebrew || "");
    setIsEditing(false);
  };

  const handleToggleActive = async () => {
    if (!selectedDebt) return;
    await updateMutation.mutateAsync({
      id: selectedDebt.id,
      data: { is_active: !selectedDebt.is_active },
    });
    setSelectedDebt({ ...selectedDebt, is_active: !selectedDebt.is_active });
  };

  const handleSaveGoldenLine = async () => {
    if (!selectedDebt) return;
    await updateMutation.mutateAsync({
      id: selectedDebt.id,
      data: { golden_line_hebrew: editedGoldenLine },
    });
    setSelectedDebt({ ...selectedDebt, golden_line_hebrew: editedGoldenLine });
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main content */}
      <div className={`flex-1 overflow-y-auto transition-all ${selectedDebt ? "mr-[480px]" : ""}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <LayoutDashboard className="w-5 h-5 text-amber-500" />
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">CSM Dashboard</h1>
            </div>
            <p className="text-sm text-slate-500 ml-8">Operations management and quality control</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Active Debts</div>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">{activeDebts.length}</div>
              )}
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Avg Confidence</div>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">{(avgConfidence * 100).toFixed(0)}%</div>
              )}
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Injections</div>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">{totalInjections}</div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Customer ID</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Restaurant ID</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Action Code</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Golden Line</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Failed Items</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Confidence</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Active</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Injected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        {Array(8).fill(0).map((_, j) => (
                          <td key={j} className="px-4 py-3.5">
                            <Skeleton className="h-4 w-20" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : debts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                        No operational debts found
                      </td>
                    </tr>
                  ) : (
                    debts.map((debt) => (
                      <tr
                        key={debt.id}
                        onClick={() => handleRowClick(debt)}
                        className={`cursor-pointer transition-colors ${
                          selectedDebt?.id === debt.id
                            ? "bg-amber-50"
                            : "hover:bg-slate-50/50"
                        }`}
                      >
                        <td className="px-4 py-3.5 font-medium text-slate-800">{debt.customer_id || "—"}</td>
                        <td className="px-4 py-3.5 text-slate-600">{debt.restaurant_id || "—"}</td>
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
                        <td className="px-4 py-3.5 text-slate-600 tabular-nums">{debt.injected_count ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Side panel */}
      {selectedDebt && (
        <div className="fixed right-0 top-0 h-screen w-[480px] bg-white border-l border-slate-200 shadow-xl overflow-y-auto z-50">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Debt Details</h2>
            <Button variant="ghost" size="icon" onClick={() => setSelectedDebt(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-900">Status</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedDebt.is_active !== false ? "This debt is currently active" : "This debt is inactive"}
                </div>
              </div>
              <Switch
                checked={selectedDebt.is_active !== false}
                onCheckedChange={handleToggleActive}
              />
            </div>

            {/* Action Code */}
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Action Code</div>
              <code className="text-sm bg-slate-100 px-3 py-2 rounded font-mono text-slate-700 block">
                {selectedDebt.action_code || "—"}
              </code>
            </div>

            {/* Golden Line Hebrew */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Golden Line (Hebrew)</div>
                {!isEditing ? (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-7 text-xs">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={handleSaveGoldenLine} className="h-7 text-xs text-emerald-600 hover:text-emerald-700">
                    <Save className="w-3 h-3 mr-1" /> Save
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  dir="rtl"
                  value={editedGoldenLine}
                  onChange={(e) => setEditedGoldenLine(e.target.value)}
                  className="text-sm"
                  rows={2}
                />
              ) : (
                <div className="text-sm bg-slate-50 px-4 py-3 rounded border border-slate-200" dir="rtl">
                  {selectedDebt.golden_line_hebrew || "—"}
                </div>
              )}
            </div>

            {/* Evidence Quote */}
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Evidence Quote</div>
              <div className="text-sm bg-amber-50 px-4 py-3 rounded border border-amber-200 text-slate-700 leading-relaxed">
                "{selectedDebt.evidence_quote || "—"}"
              </div>
            </div>

            {/* Reasoning Logic */}
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Reasoning Logic</div>
              <div className="text-sm bg-slate-50 px-4 py-3 rounded border border-slate-200 text-slate-700 leading-relaxed">
                {selectedDebt.reasoning_logic || "—"}
              </div>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Customer ID</div>
                <div className="text-sm text-slate-900">{selectedDebt.customer_id || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Restaurant ID</div>
                <div className="text-sm text-slate-900">{selectedDebt.restaurant_id || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Source Ticket</div>
                <div className="text-sm text-slate-900">{selectedDebt.source_ticket_id || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Injected Count</div>
                <div className="text-sm text-slate-900">{selectedDebt.injected_count ?? 0}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}