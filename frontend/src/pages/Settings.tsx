import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Webhook, Save } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="p-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-slate-400">Manage your workspace, integrations, and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-white">General Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Workspace Name</label>
              <input type="text" defaultValue="Acme Corp Analytics" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-white">Alerts & Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
              <span className="text-sm text-slate-300">Email alerts for High Risk customer churn</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
              <span className="text-sm text-slate-300">Weekly automated insights report</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
              <span className="text-sm text-slate-300">Slack integration notifications</span>
            </label>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-white">Data Integrations</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Stripe API</h4>
                <p className="text-sm text-slate-400">Sync payment and subscription data</p>
              </div>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Salesforce</h4>
                <p className="text-sm text-slate-400">Sync CRM customer profiles</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Zendesk</h4>
                <p className="text-sm text-slate-400">Sync support tickets and CSAT</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                Connect
              </button>
            </div>
          </div>
        </div>
        
        {/* ML Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-white">Machine Learning Config</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Prediction Threshold</label>
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="100" defaultValue="60" className="flex-1 accent-indigo-500" />
                <span className="text-white text-sm font-medium w-10 text-right">0.6</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Probability threshold for marking a customer as "High Risk"</p>
            </div>
            
            <div className="pt-4">
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-red-400 rounded-lg text-sm font-medium transition-colors">
                Force Full Model Retraining
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
