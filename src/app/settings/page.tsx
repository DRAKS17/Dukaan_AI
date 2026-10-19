'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Table,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  validateProductsCsv,
  SAMPLE_PRODUCTS_CSV,
  SAMPLE_ORDERS_CSV,
  CsvValidationResult,
} from '@/lib/validation/csv-parser';
import { Product, StoreDataset } from '@/types';
import { formatINR } from '@/lib/utils/formatters';

export default function SettingsDataPage() {
  const { dataset, setCustomDataset, resetToDefaultDemo, isCustomDataLoaded } = useStore();
  const [csvContent, setCsvContent] = useState<string>('');
  const [validationResult, setValidationResult] = useState<CsvValidationResult<Product> | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleDownloadSampleProducts = () => {
    const blob = new Blob([SAMPLE_PRODUCTS_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dukaanai_sample_products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleOrders = () => {
    const blob = new Blob([SAMPLE_ORDERS_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dukaanai_sample_orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      const result = validateProductsCsv(text);
      setValidationResult(result);
      setStatusMessage(null);
    };
    reader.readAsText(file);
  };

  const handleApplyDataset = () => {
    if (!validationResult || validationResult.data.length === 0) return;

    // Create custom dataset with validated products, preserving simulated orders structure
    const updatedDataset: StoreDataset = {
      ...dataset,
      storeName: 'My Custom Retail Store (Uploaded)',
      storeLocation: 'Custom Merchant Location',
      products: validationResult.data,
    };

    setCustomDataset(updatedDataset);
    setStatusMessage('Custom dataset successfully applied! The dashboard, analytics, and AI assistant are now using your uploaded inventory.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Management & CSV Ingestion</h1>
          <p className="text-xs text-slate-500">
            Upload custom merchant inventory data, validate schema compliance, and download sample templates
          </p>
        </div>

        {isCustomDataLoaded && (
          <button
            onClick={() => {
              resetToDefaultDemo();
              setValidationResult(null);
              setCsvContent('');
              setStatusMessage('Reset to default Shree Ganesh Kirana demo dataset.');
            }}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Demo Shop</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid: Download Templates & Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Templates Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Download CSV Templates</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Inspect the exact schema required for products and historical orders. Download the ready-to-use CSV template files to test custom datasets.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] font-mono text-slate-600 mb-4 overflow-x-auto">
              product_id,product_name,category,cost_price,selling_price,current_stock,reorder_level
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadSampleProducts}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Products Template (.csv)</span>
            </button>
            <button
              onClick={handleDownloadSampleOrders}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Orders Template (.csv)</span>
            </button>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Upload Merchant Products CSV</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Select a CSV file containing your product catalogue, stock levels, and prices. The schema is validated client-side with row-level error reporting.
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-sky-50/20 block">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-700 block">
              Click to choose CSV file or drag and drop
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Supports .csv files up to 5MB
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Validation Feedback & Preview Section */}
      {validationResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-600" />
                CSV Validation Summary
              </h3>
              <p className="text-xs text-slate-500">
                {validationResult.validRowsCount} valid rows • {validationResult.rejectedRowsCount} rejected rows
              </p>
            </div>

            {validationResult.validRowsCount > 0 && (
              <button
                onClick={handleApplyDataset}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply & Switch to Uploaded Inventory ({validationResult.validRowsCount} Items)</span>
              </button>
            )}
          </div>

          {/* Error List if any */}
          {validationResult.errors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Validation Errors Detected ({validationResult.errors.length} issues):
              </h4>
              <ul className="text-xs text-rose-700 space-y-1 list-disc list-inside">
                {validationResult.errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>
                    Row {err.rowNumber} ({err.field}): {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Valid Items Preview Table */}
          {validationResult.validRowsCount > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">
                Preview Parsed Valid Products:
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">ID</th>
                      <th className="py-2.5 px-3 font-semibold">Product Name</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Cost Price</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Selling Price</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Current Stock</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Reorder Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {validationResult.data.slice(0, 10).map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 px-3 font-mono text-slate-500">{p.id}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{p.name}</td>
                        <td className="py-2 px-3 text-slate-600">{p.category}</td>
                        <td className="py-2 px-3 text-right text-slate-600">{formatINR(p.costPrice)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900">{formatINR(p.sellingPrice)}</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-800">{p.currentStock} {p.unit}</td>
                        <td className="py-2 px-3 text-right text-slate-600">{p.reorderLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
