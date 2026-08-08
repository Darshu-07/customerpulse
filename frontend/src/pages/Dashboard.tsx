import React, { useEffect, useState } from 'react';
import { 
  Users, TrendingDown, IndianRupee, AlertTriangle, Target, Star,
  ArrowRight
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { apiClient } from '../api/client';
import { DashboardSummary } from '../api/types';
import { KPICard } from '../components/KPICard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { RiskBadge, LoadingSpinner } from '../components/ui';

const COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444'
};

export const Dashboard = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.getDashboardSummary();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div>Error loading data</div>;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">
          You have <span className="text-white font-semibold">{data.total_customers.toLocaleString()}</span> customers 
          → <span className="text-white font-semibold">{((data.high_risk_customers / data.total_customers) * 100).toFixed(1)}%</span> are high-risk 
          → <span className="text-orange-400 font-semibold">{formatCurrency(data.revenue_at_risk)}</span> revenue at risk 
          → Top driver is <span className="text-white font-semibold">{data.top_churn_drivers[0]?.name}</span> 
          → <span className="text-white font-semibold">{data.priority_customers.length}</span> customers should be prioritized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard title="Total Customers" value={data.total_customers.toLocaleString()} icon={Users} color="indigo" />
        <KPICard title="Churn Rate" value={`${data.churn_rate}%`} icon={TrendingDown} color={data.churn_rate > 5 ? 'red' : 'emerald'} />
        <KPICard title="Revenue at Risk" value={formatCurrency(data.revenue_at_risk)} icon={IndianRupee} color="orange" />
        <KPICard title="High-Risk Customers" value={data.high_risk_customers.toLocaleString()} icon={AlertTriangle} color="red" />
        <KPICard title="Average CLV" value={formatCurrency(data.average_clv)} icon={Target} color="emerald" />
        <KPICard title="Avg Satisfaction" value={`${data.average_satisfaction} / 5`} icon={Star} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Customer Health Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.health_distribution}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.health_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Churn Drivers">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.top_churn_drivers} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
              <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-x-auto">
          <h3 className="text-base font-semibold text-white mb-4">Segment Performance</h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Customers</th>
                <th className="px-4 py-3">Revenue</th>
                <th className="px-4 py-3">Churn Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {data.segment_performance.map((s, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium">{s.segment}</td>
                  <td className="px-4 py-3">{s.customers.toLocaleString()}</td>
                  <td className="px-4 py-3">{formatCurrency(s.revenue)}</td>
                  <td className="px-4 py-3">{s.churn_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ChartCard title="Revenue at Risk by Segment">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.revenue_at_risk_by_segment}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="segment" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-white">Priority Customers</h3>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <DataTable
          data={data.priority_customers}
          columns={[
            { header: 'ID', accessorKey: 'id' },
            { header: 'Segment', accessorKey: 'segment' },
            { 
              header: 'Risk', 
              accessorKey: 'risk_level',
              cell: (info) => <RiskBadge level={info.getValue() as any} />
            },
            { 
              header: 'Rev at Risk', 
              accessorKey: 'revenue_at_risk',
              cell: (info) => formatCurrency(info.getValue() as number)
            },
            { 
              header: 'Churn Prob', 
              accessorKey: 'churn_probability',
              cell: (info) => `${info.getValue()}%`
            },
            { header: 'Action', accessorKey: 'recommended_action' }
          ]}
        />
      </div>
    </div>
  );
};
