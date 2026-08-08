import React, { useState, useEffect, useCallback } from 'react';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Loader2, Database } from 'lucide-react';
import { apiClient } from '../api/client';

export const DataUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<string>('checking');

  const checkStatus = useCallback(async () => {
    try {
      const status = await apiClient.getDataStatus();
      setPipelineStatus(status.status || 'no_data');
    } catch {
      setPipelineStatus('no_data');
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported.');
      return;
    }
    setError(null);
    setUploading(true);
    setUploadResult(null);
    try {
      const result = await apiClient.uploadData(file);
      setUploadResult(result);
      setPipelineStatus('processing');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Data Upload</h1>
        <p className="text-slate-400">Upload your customer data CSV to run the full analytics pipeline.</p>
      </div>

      {/* Pipeline Status Indicator */}
      <div className={`rounded-xl p-4 flex items-center space-x-3 border ${
        pipelineStatus === 'ready' ? 'bg-emerald-500/10 border-emerald-500/30' :
        pipelineStatus === 'processing' ? 'bg-amber-500/10 border-amber-500/30' :
        'bg-slate-900 border-slate-800'
      }`}>
        {pipelineStatus === 'ready' ? (
          <><Database className="w-5 h-5 text-emerald-500" /><span className="text-emerald-400 font-medium">Data Loaded — Analytics are live</span></>
        ) : pipelineStatus === 'processing' ? (
          <><Loader2 className="w-5 h-5 text-amber-500 animate-spin" /><span className="text-amber-400 font-medium">Pipeline running — Training models and computing analytics...</span></>
        ) : (
          <><AlertCircle className="w-5 h-5 text-slate-500" /><span className="text-slate-400">No data loaded yet. Upload a CSV to get started.</span></>
        )}
      </div>

      {/* Upload Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input id="file-input" type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
        {uploading ? (
          <>
            <Loader2 className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-white mb-2">Uploading & Processing...</h3>
            <p className="text-sm text-slate-400">This may take a minute for large datasets.</p>
          </>
        ) : (
          <>
            <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Drag & Drop your CSV file here</h3>
            <p className="text-sm text-slate-400 mb-6">or click to browse from your computer</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Select File
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center text-red-400">
          <AlertCircle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      {uploadResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center text-emerald-500 mb-4">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="font-medium">Upload successful — Pipeline started</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400">File:</span>
              <span className="text-white ml-2 font-medium">{uploadResult.filename}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400">Rows:</span>
              <span className="text-white ml-2 font-medium">{uploadResult.row_count?.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400">Columns:</span>
              <span className="text-white ml-2 font-medium">{uploadResult.column_count}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400">Status:</span>
              <span className="text-amber-400 ml-2 font-medium">{uploadResult.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
