import React from 'react';
import { BrainCircuit, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, 
  BarChart, Bar
} from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { KPICard } from '../components/KPICard';

const rocData = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.1, tpr: 0.65 },
  { fpr: 0.2, tpr: 0.82 },
  { fpr: 0.3, tpr: 0.88 },
  { fpr: 0.4, tpr: 0.92 },
  { fpr: 0.5, tpr: 0.95 },
  { fpr: 0.6, tpr: 0.97 },
  { fpr: 0.7, tpr: 0.98 },
  { fpr: 0.8, tpr: 0.99 },
  { fpr: 1.0, tpr: 1.0 },
];

const featureImportance = [
  { feature: 'Tenure', importance: 0.32 },
  { feature: 'Monthly Charges', importance: 0.25 },
  { feature: 'Contract Type', importance: 0.18 },
  { feature: 'Support Tickets', importance: 0.12 },
  { feature: 'Payment Method', importance: 0.08 },
  { feature: 'Age', importance: 0.05 },
];

export const ModelPerformance = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Model Performance</h1>
          <p className="text-slate-400">Evaluate churn prediction accuracy and ML metrics.</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border border-slate-700">
          <RefreshCw className="w-4 h-4" /> Retrain Model
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Accuracy" value="94.2%" icon={CheckCircle2} trend={+1.2} />
        <KPICard title="Precision" value="91.5%" icon={TrendingUp} trend={+0.8} />
        <KPICard title="Recall" value="89.3%" icon={BrainCircuit} trend={-0.4} />
        <KPICard title="F1 Score" value="0.90" icon={AlertCircle} trend={+0.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROC Curve */}
        <ChartCard title="ROC Curve (AUC: 0.95)" description="Trade-off between true positive and false positive rates">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rocData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="fpr" type="number" stroke="#64748b" label={{ value: 'False Positive Rate', position: 'bottom', fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
              <Line type="monotone" dataKey="tpr" stroke="#10b981" strokeWidth={3} dot={false} name="XGBoost Model" />
              <Line type="linear" data={[{fpr:0, tpr:0}, {fpr:1, tpr:1}]} dataKey="tpr" stroke="#64748b" strokeDasharray="5 5" dot={false} name="Random Guess" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Feature Importance */}
        <ChartCard title="Feature Importance" description="Top predictors for customer churn">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportance} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 12 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="importance" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} name="Importance Score" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Confusion Matrix & Model Comparison */}
        <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">Confusion Matrix (Test Set)</h3>
            <p className="text-sm text-slate-400 mb-6">Actual vs Predicted values</p>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2 text-center text-sm w-full max-w-sm">
                <div className="col-start-2 text-slate-400 font-medium">Pred: Retained</div>
                <div className="text-slate-400 font-medium">Pred: Churned</div>
                
                <div className="text-slate-400 font-medium self-center text-right pr-2">Act: Retained</div>
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold">1,240</span>
                  <span className="text-xs">True Negative</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold">45</span>
                  <span className="text-xs">False Positive</span>
                </div>
                
                <div className="text-slate-400 font-medium self-center text-right pr-2">Act: Churned</div>
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold">82</span>
                  <span className="text-xs">False Negative</span>
                </div>
                <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 p-4 rounded-lg flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold">310</span>
                  <span className="text-xs">True Positive</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">Model Comparison</h3>
            <p className="text-sm text-slate-400 mb-4">Historical benchmark tracking</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Model Version</th>
                    <th className="px-4 py-3">Algorithm</th>
                    <th className="px-4 py-3">Accuracy</th>
                    <th className="px-4 py-3">F1 Score</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="bg-indigo-500/5">
                    <td className="px-4 py-3 font-medium text-white">v2.4.1</td>
                    <td className="px-4 py-3 text-slate-300">XGBoost</td>
                    <td className="px-4 py-3 text-emerald-400">94.2%</td>
                    <td className="px-4 py-3 text-emerald-400">0.90</td>
                    <td className="px-4 py-3"><span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-medium border border-emerald-500/20">Active</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-300">v2.3.0</td>
                    <td className="px-4 py-3 text-slate-400">Random Forest</td>
                    <td className="px-4 py-3 text-slate-300">91.8%</td>
                    <td className="px-4 py-3 text-slate-300">0.86</td>
                    <td className="px-4 py-3"><span className="text-slate-500 text-xs">Archived</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-300">v1.0.0</td>
                    <td className="px-4 py-3 text-slate-400">Logistic Reg.</td>
                    <td className="px-4 py-3 text-slate-300">85.4%</td>
                    <td className="px-4 py-3 text-slate-300">0.78</td>
                    <td className="px-4 py-3"><span className="text-slate-500 text-xs">Archived</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
