import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Play, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const navItems = [
  { path: "/LiveDemo", label: "Live Demo", icon: Play },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-40 w-8 h-8 flex items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        style={{ left: sidebarOpen ? '16.5rem' : '1rem' }}
      >
        {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
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
      )}

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-200`}>
        <Outlet />
      </main>
    </div>
  );
}