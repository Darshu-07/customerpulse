import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, DollarSign, Activity, Star, AlertTriangle, ShieldCheck, TrendingDown } from 'lucide-react';
import { RiskBadge } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from 'recharts';

export const CustomerProfile = () => {
  const { customerId } = useParams<{ customerId: string }>();

  // Mock data for the specific customer
  const churnProb = 84;
  const risk = 'Critical';
  const segment = 'At Risk';
  
  const drivers = [
    { name: 'Declining Usage', value: 85 },
    { name: 'Recent Support Tickets', value: 72 },
    { name: 'Payment Failures', value: 65 },
    { name: 'Low Satisfaction', value: 50 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/customers" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{customerId || 'CUST-1042'}</h1>
            <RiskBadge level={risk} />
            <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-800 text-slate-300 border-slate-700">
              {segment}
            </span>
          </div>
          <p className="text-slate-400">Joined Oct 2021 • Pro Plan</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><User className="w-5 h-5" /></div>
            <h3 className="font-semibold text-white">Profile</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white font-medium">Jane Doe</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-white font-medium">jane@example.com</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Location</span><span className="text-white font-medium">New York, USA</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><DollarSign className="w-5 h-5" /></div>
            <h3 className="font-semibold text-white">Financials</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">MRR</span><span className="text-white font-medium">$149.00</span></div>
            <div className="flex justify-between"><span className="text-slate-400">LTV</span><span className="text-white font-medium">$3,576.00</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Next Billing</span><span className="text-white font-medium">Nov 12, 2023</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Activity className="w-5 h-5" /></div>
            <h3 className="font-semibold text-white">Engagement</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Score</span><span className="text-white font-medium">24/100</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Last Login</span><span className="text-white font-medium">14 days ago</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Active Days</span><span className="text-white font-medium">3 / 30</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Star className="w-5 h-5" /></div>
            <h3 className="font-semibold text-white">Satisfaction</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">NPS</span><span className="text-white font-medium">Detractor (4)</span></div>
            <div className="flex justify-between"><span className="text-slate-400">CSAT</span><span className="text-white font-medium">2.5/5</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Tickets</span><span className="text-white font-medium">3 Open</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Prediction */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingDown className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">Churn Risk Drivers</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center h-64">
            <div className="w-48 h-48 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: churnProb }, { value: 100 - churnProb }]}
                    cx="50%" cy="50%" innerRadius={70} outerRadius={85}
                    startAngle={90} endAngle={-270}
                    dataKey="value" stroke="none"
                  >
                    <Cell fill="#ef4444" />
                    <Cell fill="#1e293b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{churnProb}%</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Churn Risk</span>
              </div>
            </div>

            <div className="flex-1 w-full h-full">
              <h4 className="text-sm font-medium text-slate-400 mb-4">Key Factors Influencing Prediction</h4>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={drivers} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 12 }} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} cursor={{ fill: '#1e293b' }} />
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-white">Recommended Actions</h2>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded mt-0.5">1</div>
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">Schedule Check-in Call</h4>
                  <p className="text-xs text-slate-400">Address the 3 open support tickets directly and check product satisfaction.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded mt-0.5">2</div>
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">Offer 3-Month Discount</h4>
                  <p className="text-xs text-slate-400">Provide a 20% discount on the Pro Plan to offset recent payment friction.</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full py-2.5 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Execute Action Plan
          </button>
        </div>
      </div>
    </div>
  );
};
