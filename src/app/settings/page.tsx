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
          <h1 className="text-[20px] font-extrabold text-[#18181B] tracking-tight">
            Data Management & CSV Ingestion
          </h1>
          <p className="text-[12px] text-[#71717A] font-medium">
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
            className="flex items-center gap-1.5 bg-[#18181B] hover:bg-black text-white text-[12px] font-bold px-4 py-2 rounded-full transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Demo Shop</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {statusMessage && (
        <div className="bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] text-[12px] p-4 rounded-[20px] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid: Download Templates & Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Templates Card */}
        <div className="bg-white p-6 rounded-[20px] border border-[#EBEBEF] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center border border-[#BAE6FD]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight">
                Download CSV Templates
              </h3>
            </div>
            <p className="text-[12px] text-[#52525B] leading-relaxed mb-4 font-medium">
              Inspect the exact schema required for products and historical orders. Download the ready-to-use CSV template files to test custom datasets.
            </p>

            <div className="bg-[#F9F9FB] p-3 rounded-xl border border-[#EBEBEF] text-[11px] font-mono text-[#52525B] mb-4 overflow-x-auto">
              product_id,product_name,category,cost_price,selling_price,current_stock,reorder_level
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadSampleProducts}
              className="flex items-center gap-2 bg-white hover:bg-[#F4F4F6] text-[#18181B] border border-[#EBEBEF] text-[12px] font-bold px-4 py-2 rounded-full transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Products Template (.csv)</span>
            </button>
            <button
              onClick={handleDownloadSampleOrders}
              className="flex items-center gap-2 bg-white hover:bg-[#F4F4F6] text-[#18181B] border border-[#EBEBEF] text-[12px] font-bold px-4 py-2 rounded-full transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#18181B]" />
              <span>Orders Template (.csv)</span>
            </button>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white p-6 rounded-[20px] border border-[#EBEBEF] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#F4F4F6] text-[#18181B] flex items-center justify-center border border-[#EBEBEF]">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight">
                Upload Merchant Products CSV
              </h3>
            </div>
            <p className="text-[12px] text-[#52525B] leading-relaxed mb-4 font-medium">
              Select a CSV file containing your product catalogue, stock levels, and prices. The schema is validated client-side with row-level error reporting.
            </p>
          </div>

          <label className="border-2 border-dashed border-[#EBEBEF] hover:border-[#18181B] rounded-[20px] p-6 text-center cursor-pointer transition-colors bg-[#F9F9FB] block">
            <UploadCloud className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
            <span className="text-[13px] font-bold text-[#18181B] block">
              Click to choose CSV file or drag and drop
            </span>
            <span className="text-[11px] text-[#71717A] font-medium block mt-0.5">
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
        <div className="bg-white rounded-[20px] border border-[#EBEBEF] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBEBEF] pb-4">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0284C7]" />
                CSV Validation Summary
              </h3>
              <p className="text-[12px] text-[#71717A] font-medium">
                {validationResult.validRowsCount} valid rows • {validationResult.rejectedRowsCount} rejected rows
              </p>
            </div>

            {validationResult.validRowsCount > 0 && (
              <button
                onClick={handleApplyDataset}
                className="flex items-center gap-1.5 bg-[#18181B] hover:bg-black text-white text-[12px] font-bold px-5 py-2.5 rounded-full transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Apply & Switch to Uploaded Inventory ({validationResult.validRowsCount} Items)</span>
              </button>
            )}
          </div>

          {/* Error List if any */}
          {validationResult.errors.length > 0 && (
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-[16px] p-4 space-y-2">
              <h4 className="text-[12px] font-bold text-[#DC2626] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                Validation Errors Detected ({validationResult.errors.length} issues):
              </h4>
              <ul className="text-[12px] text-[#B91C1C] space-y-1 list-disc list-inside font-medium">
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
              <h4 className="text-[13px] font-bold text-[#18181B] mb-2">
                Preview Parsed Valid Products:
              </h4>
              <div className="overflow-x-auto border border-[#EBEBEF] rounded-[16px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F4F6] text-[#71717A] border-b border-[#EBEBEF]">
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
                  <tbody className="divide-y divide-[#EBEBEF]">
                    {validationResult.data.slice(0, 10).map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-3 font-mono text-[#71717A]">{p.id}</td>
                        <td className="py-2.5 px-3 font-bold text-[#18181B]">{p.name}</td>
                        <td className="py-2.5 px-3 text-[#52525B] font-medium">{p.category}</td>
                        <td className="py-2.5 px-3 text-right text-[#52525B] font-medium">{formatINR(p.costPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-[#18181B]">{formatINR(p.sellingPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-[#18181B]">{p.currentStock} {p.unit}</td>
                        <td className="py-2.5 px-3 text-right text-[#71717A] font-medium">{p.reorderLevel}</td>
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
