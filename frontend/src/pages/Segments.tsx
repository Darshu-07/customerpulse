import React, { useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, Legend
} from 'recharts';
import { Filter, Users, DollarSign, Activity } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { KPICard } from '../components/KPICard';

const scatterData = [
  { x: 10, y: 30, z: 200, segment: 'Champions' },
  { x: 30, y: 80, z: 150, segment: 'At Risk' },
  { x: 70, y: 50, z: 300, segment: 'Loyal' },
  { x: 40, y: 40, z: 250, segment: 'New' },
  { x: 80, y: 20, z: 100, segment: 'Champions' },
  { x: 20, y: 60, z: 180, segment: 'At Risk' },
  { x: 60, y: 70, z: 220, segment: 'Loyal' },
  { x: 50, y: 30, z: 200, segment: 'New' },
  { x: 90, y: 40, z: 120, segment: 'Champions' },
  { x: 15, y: 90, z: 100, segment: 'At Risk' },
];

const barData = [
  { name: 'Champions', churnRate: 5, clv: 1200, engagement: 85 },
  { name: 'Loyal', churnRate: 10, clv: 950, engagement: 70 },
  { name: 'New', churnRate: 25, clv: 400, engagement: 50 },
  { name: 'At Risk', churnRate: 60, clv: 300, engagement: 20 },
];

const radarData = [
  { subject: 'Recency', Champions: 90, Loyal: 70, New: 85, AtRisk: 20, fullMark: 100 },
  { subject: 'Frequency', Champions: 85, Loyal: 90, New: 30, AtRisk: 40, fullMark: 100 },
  { subject: 'Monetary', Champions: 95, Loyal: 80, New: 40, AtRisk: 30, fullMark: 100 },
  { subject: 'Engagement', Champions: 85, Loyal: 75, New: 60, AtRisk: 25, fullMark: 100 },
  { subject: 'Satisfaction', Champions: 90, Loyal: 85, New: 70, AtRisk: 30, fullMark: 100 },
];

const COLORS = {
  Champions: '#10b981', // emerald-500
  Loyal: '#3b82f6', // blue-500
  New: '#8b5cf6', // violet-500
  AtRisk: '#ef4444' // red-500
};

export const Segments = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>('All');

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Customer Segments</h1>
          <p className="text-slate-400">Analyze clustering and behavior patterns.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center text-slate-300">
            <Filter className="w-4 h-4 mr-2" />
            <select 
              className="bg-transparent border-none outline-none text-sm cursor-pointer"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
            >
              <option value="All">All Segments</option>
              <option value="Champions">Champions</option>
              <option value="Loyal">Loyal Customers</option>
              <option value="New">New Customers</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Total Segments" value="4" icon={PieChartIcon} trend={0} trendLabel="Auto-detected" />
        <KPICard title="Avg Segment Size" value="2,450" icon={Users} trend={+5.2} trendLabel="vs last month" />
        <KPICard title="High Value Segment" value="$1.2M" icon={DollarSign} trend={+12.5} trendLabel="revenue" />
        <KPICard title="Highest Engagement" value="Champions" icon={Activity} trend={0} trendLabel="85/100 score" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="2D PCA Cluster Scatter Plot" description="Customer distribution by PCA components">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" dataKey="x" name="PCA 1" stroke="#64748b" />
              <YAxis type="number" dataKey="y" name="PCA 2" stroke="#64748b" />
              <ZAxis type="number" dataKey="z" range={[60, 400]} name="Value" />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
              <Legend />
              <Scatter name="Champions" data={scatterData.filter(d => d.segment === 'Champions')} fill={COLORS.Champions} />
              <Scatter name="At Risk" data={scatterData.filter(d => d.segment === 'At Risk')} fill={COLORS.AtRisk} />
              <Scatter name="Loyal" data={scatterData.filter(d => d.segment === 'Loyal')} fill={COLORS.Loyal} />
              <Scatter name="New" data={scatterData.filter(d => d.segment === 'New')} fill={COLORS.New} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Segment Attributes Comparison" description="Multidimensional view of segments">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Champions" dataKey="Champions" stroke={COLORS.Champions} fill={COLORS.Champions} fillOpacity={0.4} />
              <Radar name="Loyal" dataKey="Loyal" stroke={COLORS.Loyal} fill={COLORS.Loyal} fillOpacity={0.4} />
              <Radar name="At Risk" dataKey="AtRisk" stroke={COLORS.AtRisk} fill={COLORS.AtRisk} fillOpacity={0.4} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average CLV by Segment" description="Customer Lifetime Value comparison">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `$${value}`} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="clv" fill="#6366f1" radius={[4, 4, 0, 0]} name="Avg CLV" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Churn Rate & Engagement" description="Risk and interaction metrics">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" tickFormatter={(v) => `${v}%`} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="churnRate" fill="#ef4444" name="Churn Rate %" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="engagement" fill="#10b981" name="Engagement Score" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// Simple helper component since PieChart icon wasn't imported from lucide
function PieChartIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>;
}
