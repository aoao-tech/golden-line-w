import { Outlet, Link, useLocation } from "react-router-dom";
import { Database, Zap, LayoutDashboard } from "lucide-react";

const navItems = [
  { path: "/Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/OperationalDebts", label: "Operational Debts", icon: Database },
  { path: "/InjectionEvents", label: "Injection Events", icon: Zap },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">GL</span>
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">Golden Line</h1>
              <p className="text-[11px] text-slate-400 tracking-wide uppercase">Data Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-500 text-center">Golden Line v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
}