import React, { useState } from 'react';
import { Filter, Users, UserX, AlertTriangle, Target, Activity, DollarSign } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { KPICard } from '../components/KPICard';

const churnBySub = [
  { name: 'Basic', value: 12 },
  { name: 'Pro', value: 5 },
  { name: 'Enterprise', value: 2 },
];
const churnByContract = [
  { name: 'Month-to-Month', rate: 25 },
  { name: '1 Year', rate: 8 },
  { name: '2 Years', rate: 2 },
];
const churnByTenure = [
  { name: '< 6 mo', rate: 18 },
  { name: '6-12 mo', rate: 12 },
  { name: '1-2 yrs', rate: 7 },
  { name: '> 2 yrs', rate: 3 },
];
const churnByPayment = [
  { name: 'Credit Card', rate: 14 },
  { name: 'Bank Transfer', rate: 4 },
  { name: 'PayPal', rate: 12 },
  { name: 'Invoice', rate: 2 },
];
const churnBySatisfaction = [
  { name: 'Low (1-2)', rate: 45 },
  { name: 'Medium (3-4)', rate: 12 },
  { name: 'High (5)', rate: 3 },
];

const PIE_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export const ChurnAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Churn Analytics</h1>
          <p className="text-slate-400">Deep dive into churn drivers and trends.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center text-slate-300">
            <Filter className="w-4 h-4 mr-2" />
            <select 
              className="bg-transparent border-none outline-none text-sm cursor-pointer"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Total Customers" value="9,842" icon={Users} trend={+2.1} />
        <KPICard title="Active" value="8,912" icon={Activity} trend={+1.5} />
        <KPICard title="Churned" value="930" icon={UserX} trend={-0.5} trendLabel="down" />
        <KPICard title="Churn Rate" value="9.4%" icon={Target} trend={-0.2} trendLabel="vs last month" />
        <KPICard title="High Risk" value="452" icon={AlertTriangle} trend={+12} trendLabel="customers" />
        <KPICard title="Revenue at Risk" value="$45.2k" icon={DollarSign} trend={+5.1} trendLabel="MRR" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Churn by Subscription Type" description="Distribution of churn across tiers">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={churnBySub}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {churnBySub.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Churn Rate by Contract Type" description="Percentage of churned customers">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={churnByContract} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="name" type="category" stroke="#64748b" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="rate" fill="#ef4444" radius={[0, 4, 4, 0]} name="Churn Rate %" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Churn Rate by Tenure" description="When are customers leaving?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={churnByTenure} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="rate" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Churn Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Churn by Satisfaction Score" description="Correlation with CSAT">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={churnBySatisfaction} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Churn Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Churn by Payment Method" description="Friction in payments driving churn">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={churnByPayment} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="name" type="category" stroke="#64748b" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="rate" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Churn Rate %" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
