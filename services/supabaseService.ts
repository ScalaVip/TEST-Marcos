
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Product, BudgetHistory, BudgetItem } from '../types';

let supabase: any = null;

export const initSupabase = (url: string, key: string) => {
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
};

export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('inventory').select('id').limit(1);
    if (error) return false;
    return true;
  } catch {
    return false;
  }
};

export const syncInventory = async (products: Product[]) => {
  if (!supabase) return;
  const { error } = await supabase
    .from('inventory')
    .upsert(products, { onConflict: 'id' });
  if (error) console.error('Error syncing inventory:', error);
};

export const fetchInventory = async (): Promise<Product[] | null> => {
  if (!supabase) return null;
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) return null;
  return data;
};

export const saveBudgetToSupabase = async (budget: BudgetHistory) => {
  if (!supabase) return false;

  try {
    // 1. Guardar cabecera del presupuesto
    const { error: budgetError } = await supabase.from('budgets').insert([{
      id: budget.id,
      sequence_id: budget.sequenceId,
      client_name: budget.clientName,
      project_name: budget.projectName,
      comments: budget.comments,
      total_unique: budget.totalUnique,
      total_recurring: budget.totalRecurring,
      created_at: new Date(budget.timestamp).toISOString()
    }]);

    if (budgetError) throw budgetError;

    // 2. Guardar líneas del presupuesto
    const itemsToSave = budget.items.map(item => {
      const disc = item.discountType === 'percent' ? item.pvp * (item.discount / 100) : item.discount;
      const finalPriceUnit = Math.max(0, item.pvp - disc);
      
      return {
        budget_id: budget.id,
        product_id: item.id,
        quantity: item.quantity,
        discount: item.discount,
        discount_type: item.discountType,
        final_price: finalPriceUnit * item.quantity // Total de la línea
      };
    });

    const { error: itemsError } = await supabase.from('budget_items').insert(itemsToSave);
    if (itemsError) throw itemsError;

    return true;
  } catch (error) {
    console.error('Supabase Save Error:', error);
    return false;
  }
};
