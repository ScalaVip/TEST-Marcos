
import { BudgetHistory } from '../types';

/**
 * Envía el presupuesto completo al webhook en una sola petición.
 * Esto es más robusto y permite a n8n manejar todos los items a la vez.
 */
export const saveToWebhook = async (url: string, budget: BudgetHistory): Promise<boolean> => {
  if (!url) return false;

  const cleanUrl = url.trim();

  // Preparamos los items con todos los cálculos de unidades y precios
  const enrichedItems = budget.items.map(item => {
    const disc = item.discountType === 'percent' ? item.pvp * (item.discount / 100) : item.discount;
    const pricePerUnit = Math.max(0, item.pvp - disc);
    const subtotal = pricePerUnit * item.quantity;
    
    return {
      item_id: item.id,
      item_name: item.name,
      item_type: item.type === 'unique' ? 'Único' : 'Recurrente',
      item_quantity: item.quantity,
      item_original_pvp: item.pvp,
      item_discount_unit: disc,
      item_final_price_unit: pricePerUnit,
      item_subtotal: subtotal,
      item_observations: item.observations || ''
    };
  });

  const payload = {
    budget_id: budget.sequenceId,
    timestamp: new Date(budget.timestamp).toISOString(),
    client: budget.clientName,
    project: budget.projectName,
    comments: budget.comments,
    total_unique: budget.totalUnique,
    total_recurring: budget.totalRecurring,
    total_items_count: budget.itemCount,
    items: enrichedItems, // Enviamos el array completo
    _app_version: '4.0-single-payload'
  };

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error: any) {
    console.error('Error enviando al Webhook:', error);
    return false;
  }
};
