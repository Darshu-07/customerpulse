import React, { useState } from 'react';
import { Shield, Play, ArrowRight, Settings, Users, AlertTriangle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { RiskBadge } from '../components/ui';

export const Retention = () => {
  const [discount, setDiscount] = useState(10);
  const [freeMonths, setFreeMonths] = useState(1);
  const [simulating, setSimulating] = useState(false);

  // Mock table data
  const data = [
    { id: 'CUST-1021', risk: 'Critical', prob: 92, action: 'Personalized Check-in Call', cost: '$25', impact: 'High (+40% retention)' },
    { id: 'CUST-3942', risk: 'High', prob: 78, action: '20% Discount for 3 months', cost: '$60', impact: 'Medium (+25% retention)' },
    { id: 'CUST-8432', risk: 'High', prob: 71, action: '1-on-1 Training Session', cost: '$50', impact: 'High (+35% retention)' },
    { id: 'CUST-2210', risk: 'Medium', prob: 45, action: 'Automated Re-engagement Email', cost: '$0', impact: 'Low (+10% retention)' },
    { id: 'CUST-5512', risk: 'Medium', prob: 32, action: 'Feature Discovery Tooltip', cost: '$0', impact: 'Low (+5% retention)' },
  ];

  const columns: ColumnDef<typeof data[0]>[] = [
    { accessorKey: 'id', header: 'Customer ID', cell: ({ row }) => <span className="font-medium text-white">{row.getValue('id')}</span> },
    { accessorKey: 'risk', header: 'Risk Level', cell: ({ row }) => <RiskBadge level={row.getValue('risk') as any} /> },
    { accessorKey: 'prob', header: 'Churn Prob.', cell: ({ row }) => `${row.getValue('prob')}%` },
    { accessorKey: 'action', header: 'Recommended Action' },
    { accessorKey: 'cost', header: 'Est. Cost' },
    { accessorKey: 'impact', header: 'Expected Impact' },
    { 
      id: 'apply', 
      cell: () => (
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
          Apply <ArrowRight className="w-4 h-4" />
        </button>
      ) 
    },
  ];

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 1500);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Retention Strategies</h1>
        <p className="text-slate-400">Proactive actions to prevent churn and improve loyalty.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-white">What-If Simulator</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Discount Offer (%)
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0" max="50" step="5" 
                    value={discount} onChange={e => setDiscount(Number(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="text-white font-medium w-12 text-right">{discount}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Free Months Offered
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0" max="6" step="1" 
                    value={freeMonths} onChange={e => setFreeMonths(Number(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="text-white font-medium w-12 text-right">{freeMonths}</span>
                </div>
              </div>

              <button 
                onClick={handleSimulate}
                disabled={simulating}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {simulating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Run Simulation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Simulation Results</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-300">Customers Saved</span>
                </div>
                <span className="text-xl font-bold text-white">{simulating ? '-' : Math.floor(discount * 2.5 + freeMonths * 10)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <span className="text-slate-300">New Retention Rate</span>
                </div>
                <span className="text-xl font-bold text-white">{simulating ? '-' : (90.6 + discount * 0.1).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-slate-300">Est. Revenue Cost</span>
                </div>
                <span className="text-xl font-bold text-white">{simulating ? '-' : `$${(discount * 120 + freeMonths * 500).toLocaleString()}`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Table */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
            <h2 className="text-lg font-semibold text-white mb-4">Recommended Interventions</h2>
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};
