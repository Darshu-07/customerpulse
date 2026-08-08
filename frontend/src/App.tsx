import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DataUpload } from './pages/DataUpload';
import { Segments } from './pages/Segments';
import { ChurnAnalytics } from './pages/ChurnAnalytics';
import { Customers } from './pages/Customers';
import { CustomerProfile } from './pages/CustomerProfile';
import { Retention } from './pages/Retention';
import { AIInsights } from './pages/AIInsights';
import { ModelPerformance } from './pages/ModelPerformance';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<DataUpload />} />
          <Route path="segments" element={<Segments />} />
          <Route path="churn" element={<ChurnAnalytics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:customerId" element={<CustomerProfile />} />
          <Route path="retention" element={<Retention />} />
          <Route path="ai" element={<AIInsights />} />
          <Route path="model" element={<ModelPerformance />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
