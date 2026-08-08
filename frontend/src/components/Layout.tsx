import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, PieChart, TrendingDown, Users, 
  Shield, Sparkles, BarChart3, Settings, Activity
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Data Upload' },
    { to: '/segments', icon: PieChart, label: 'Customer Segments' },
    { to: '/churn', icon: TrendingDown, label: 'Churn Analytics' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/retention', icon: Shield, label: 'Retention' },
    { to: '/ai', icon: Sparkles, label: 'AI Insights' },
    { to: '/model', icon: BarChart3, label: 'Model Performance' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-[260px] h-screen fixed left-0 top-0 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Activity className="w-6 h-6 text-indigo-500 mr-2" />
        <span className="text-xl font-bold text-white tracking-wide">CustomerPulse</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800 text-center">
        <span className="text-xs text-slate-500 font-medium">CustomerPulse v1.0</span>
      </div>
    </div>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <main className="flex-1 ml-[260px]">
        <Outlet />
      </main>
    </div>
  );
};
