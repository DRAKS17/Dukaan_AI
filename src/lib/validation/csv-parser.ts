/**
 * DukaanAI - CSV Validation and Ingestion Engine
 * Validates uploaded merchant CSVs using Zod schemas with row-level error tracking.
 */

import { z } from 'zod';
import { Product, Order, OrderItem, Customer, StoreDataset, ProductCategory } from '@/types';

export const VALID_CATEGORIES: ProductCategory[] = [
  'Staples & Grains',
  'Packaged Foods & Snacks',
  'Dairy & Bakery',
  'Beverages & Tea',
  'Personal Care',
  'Household Essentials',
];

export const ProductCsvRowSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(2, 'Product Name must be at least 2 characters'),
  category: z.enum([
    'Staples & Grains',
    'Packaged Foods & Snacks',
    'Dairy & Bakery',
    'Beverages & Tea',
    'Personal Care',
    'Household Essentials',
  ] as [ProductCategory, ...ProductCategory[]]),
  unit: z.string().default('unit'),
  cost_price: z.coerce.number().positive('Cost price must be greater than 0'),
  selling_price: z.coerce.number().positive('Selling price must be greater than 0'),
  current_stock: z.coerce.number().min(0, 'Current stock cannot be negative'),
  reorder_level: z.coerce.number().min(0).default(10),
  lead_time_days: z.coerce.number().min(1).default(2),
  safety_stock: z.coerce.number().min(0).default(5),
});

export const OrderCsvRowSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Date must be formatted as YYYY-MM-DD'),
  customer_id: z.string().min(1, 'Customer ID is required'),
  product_id: z.string().min(1, 'Product ID is required'),
  quantity: z.coerce.number().int().positive('Quantity must be an integer >= 1'),
  unit_price: z.coerce.number().positive('Unit price must be greater than 0'),
  item_discount: z.coerce.number().min(0).default(0),
});

export interface RowError {
  rowNumber: number;
  field: string;
  message: string;
  rawValue?: string;
}

export interface CsvValidationResult<T> {
  success: boolean;
  totalRows: number;
  validRowsCount: number;
  rejectedRowsCount: number;
  data: T[];
  errors: RowError[];
}

/**
 * Basic RFC 4180 compliant CSV line tokenizer
 */
export function parseCsvText(csvText: string): Array<Record<string, string>> {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
  const rows: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Split by comma ignoring commas inside quotes
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let charIndex = 0; charIndex < rawLine.length; charIndex++) {
      const char = rawLine[charIndex];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });
    rows.push(rowObj);
  }

  return rows;
}

/**
 * Validate Products CSV
 */
export function validateProductsCsv(csvText: string): CsvValidationResult<Product> {
  const rawRows = parseCsvText(csvText);
  const errors: RowError[] = [];
  const validProducts: Product[] = [];

  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // 1-indexed, header is row 1

    const normalizedRow = {
      id: row.id || row.product_id || '',
      name: row.name || row.product_name || '',
      category: row.category || '',
      unit: row.unit || 'unit',
      cost_price: row.cost_price || row.cost || '0',
      selling_price: row.selling_price || row.price || '0',
      current_stock: row.current_stock || row.stock || '0',
      reorder_level: row.reorder_level || '10',
      lead_time_days: row.lead_time_days || '2',
      safety_stock: row.safety_stock || '5',
    };

    const parsed = ProductCsvRowSchema.safeParse(normalizedRow);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        errors.push({
          rowNumber: rowNum,
          field: issue.path.join('.'),
          message: issue.message,
          rawValue: String((normalizedRow as any)[issue.path[0]] || ''),
        });
      });
    } else {
      const p = parsed.data;
      validProducts.push({
        id: p.id,
        name: p.name,
        category: p.category,
        unit: p.unit,
        costPrice: p.cost_price,
        sellingPrice: p.selling_price,
        currentStock: p.current_stock,
        reorderLevel: p.reorder_level,
        leadTimeDays: p.lead_time_days,
        safetyStock: p.safety_stock,
        isActive: true,
      });
    }
  });

  return {
    success: errors.length === 0,
    totalRows: rawRows.length,
    validRowsCount: validProducts.length,
    rejectedRowsCount: rawRows.length - validProducts.length,
    data: validProducts,
    errors,
  };
}

/**
 * Sample CSV Templates for Download
 */
export const SAMPLE_PRODUCTS_CSV = `product_id,product_name,category,cost_price,selling_price,current_stock,reorder_level,lead_time_days
PROD-001,Aashirvaad Atta 5kg,Staples & Grains,215,245,25,15,2
PROD-002,Fortune Sunflower Oil 1L,Staples & Grains,132,138,30,20,2
PROD-003,Maggi Masala 4-Pack,Packaged Foods & Snacks,50,60,4,30,2
PROD-004,Amul Taaza Milk 1L,Dairy & Bakery,66,74,6,35,1
PROD-005,Tata Tea Premium 500g,Beverages & Tea,210,275,8,20,3
PROD-006,Dettol Soap 125g 3-Pack,Personal Care,125,165,22,15,3
PROD-007,Surf Excel Easy Wash 1kg,Household Essentials,120,145,28,18,3`;

export const SAMPLE_ORDERS_CSV = `order_id,order_date,customer_id,product_id,quantity,unit_price,item_discount
ORD-9001,2026-10-18,CUST-0001,PROD-001,1,245,0
ORD-9001,2026-10-18,CUST-0001,PROD-003,2,60,0
ORD-9002,2026-10-18,CUST-0002,PROD-004,1,74,0
ORD-9002,2026-10-18,CUST-0002,PROD-005,1,275,0
ORD-9003,2026-10-19,CUST-0003,PROD-002,2,138,10
ORD-9004,2026-10-19,CUST-0004,PROD-006,1,165,0`;
