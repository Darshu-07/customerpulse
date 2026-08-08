import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreVertical, Eye } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { RiskBadge } from '../components/ui';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

type Customer = {
  id: string;
  segment: string;
  charges: number;
  tenure: number;
  engagement: number;
  satisfaction: number;
  churnProb: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
};

const mockData: Customer[] = Array.from({ length: 50 }).map((_, i) => {
  const prob = Math.random() * 100;
  let risk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (prob > 80) risk = 'Critical';
  else if (prob > 60) risk = 'High';
  else if (prob > 30) risk = 'Medium';

  const segments = ['Champions', 'Loyal', 'New', 'At Risk'];

  return {
    id: `CUST-${1000 + i}`,
    segment: segments[Math.floor(Math.random() * segments.length)],
    charges: Math.floor(Math.random() * 200) + 10,
    tenure: Math.floor(Math.random() * 60) + 1,
    engagement: Math.floor(Math.random() * 100),
    satisfaction: Math.floor(Math.random() * 5) + 1,
    churnProb: parseFloat(prob.toFixed(1)),
    riskLevel: risk,
  };
});

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  const filteredData = useMemo(() => {
    return mockData.filter(c => {
      const matchSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSegment = segmentFilter === 'All' || c.segment === segmentFilter;
      const matchRisk = riskFilter === 'All' || c.riskLevel === riskFilter;
      return matchSearch && matchSegment && matchRisk;
    });
  }, [searchTerm, segmentFilter, riskFilter]);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'id',
      header: 'Customer ID',
      cell: ({ row }) => <span className="font-medium text-white">{row.getValue('id')}</span>
    },
    {
      accessorKey: 'segment',
      header: 'Segment',
    },
    {
      accessorKey: 'charges',
      header: 'Monthly Charges',
      cell: ({ row }) => `$${row.getValue('charges')}`
    },
    {
      accessorKey: 'tenure',
      header: 'Tenure (mo)',
    },
    {
      accessorKey: 'engagement',
      header: 'Engagement',
      cell: ({ row }) => (
        <div className="w-full bg-slate-800 rounded-full h-2 mt-1">
          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${row.getValue('engagement')}%` }}></div>
        </div>
      )
    },
    {
      accessorKey: 'satisfaction',
      header: 'CSAT',
      cell: ({ row }) => `${row.getValue('satisfaction')}/5`
    },
    {
      accessorKey: 'churnProb',
      header: 'Churn Prob.',
      cell: ({ row }) => `${row.getValue('churnProb')}%`
    },
    {
      accessorKey: 'riskLevel',
      header: 'Risk Level',
      cell: ({ row }) => <RiskBadge level={row.getValue('riskLevel')} />
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link to={`/customers/${row.original.id}`} className="text-slate-400 hover:text-white transition-colors p-1 block">
          <Eye className="w-5 h-5" />
        </Link>
      )
    }
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Customer List</h1>
          <p className="text-slate-400">View and filter customer risk predictions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center text-slate-300 w-64">
            <Search className="w-4 h-4 mr-2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Customer ID..." 
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center text-slate-300">
            <Filter className="w-4 h-4 mr-2 text-slate-500" />
            <select 
              className="bg-transparent border-none outline-none text-sm cursor-pointer"
              value={segmentFilter}
              onChange={e => setSegmentFilter(e.target.value)}
            >
              <option value="All">All Segments</option>
              <option value="Champions">Champions</option>
              <option value="Loyal">Loyal</option>
              <option value="New">New</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center text-slate-300">
            <AlertTriangleIcon className="w-4 h-4 mr-2 text-slate-500" />
            <select 
              className="bg-transparent border-none outline-none text-sm cursor-pointer"
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
            >
              <option value="All">All Risks</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

function AlertTriangleIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
