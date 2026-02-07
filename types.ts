
export type PaymentType = 'unique' | 'monthly' | 'yearly';
export type DiscountType = 'percent' | 'fixed';

export interface Product {
  id: string;
  name: string;
  desc?: string;
  cost: number;
  margin: number;
  pvp: number;
  type: PaymentType;
  observations?: string;
}

export interface BudgetItem extends Product {
  instanceId: string; // Para identificar líneas únicas aunque sean el mismo producto
  quantity: number;
  discount: number;
  discountType: DiscountType;
}

export interface BudgetHistory {
  id: string;
  sequenceId: string;
  timestamp: number;
  clientName: string;
  projectName: string;
  comments: string;
  items: BudgetItem[];
  totalUnique: number;
  totalRecurring: number;
  itemCount: number;
  status: 'pending' | 'synced' | 'failed';
}

export interface AppConfig {
  webhookUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
}
