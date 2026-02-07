
import React, { useState } from 'react';
import { Product, BudgetItem } from '../types';

interface BudgetViewProps {
  products: Product[];
  currentItems: BudgetItem[];
  clientName: string;
  projectName: string;
  comments: string;
  setClientName: (s: string) => void;
  setProjectName: (s: string) => void;
  setComments: (s: string) => void;
  onAddItem: (p: Product) => void;
  onUpdateItem: (id: string, updates: Partial<BudgetItem>) => void;
  onRemoveItem: (id: string) => void;
  nextId: string;
}

const BudgetView: React.FC<BudgetViewProps> = ({ 
  products, currentItems, clientName, projectName, comments, 
  setClientName, setProjectName, setComments,
  onAddItem, onUpdateItem, onRemoveItem, nextId 
}) => {
  const [search, setSearch] = useState('');
  
  const filteredInventory = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabecera de Datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/10 pb-10">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-accent uppercase tracking-widest block mb-2">Cliente</label>
            <input 
              type="text" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nombre de la empresa o cliente..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-black focus:outline-none focus:border-accent transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Proyecto</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Nombre descriptivo del proyecto..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-lg font-bold focus:outline-none focus:border-accent transition-all text-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col justify-end items-end text-right">
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1 text-accent">ID Presupuesto</span>
          <span className="text-4xl font-mono font-black text-white">{nextId}</span>
        </div>
      </div>

      {/* Buscador de Productos */}
      <div className="relative z-50 no-print">
        <input 
          type="text"
          placeholder="Añadir producto por nombre o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border-2 border-white/5 rounded-3xl pl-10 pr-6 py-5 text-lg font-bold focus:outline-none focus:border-accent/50 transition-all shadow-2xl"
        />
        
        {search && (
          <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
            {filteredInventory.map(p => (
              <button 
                key={p.id}
                onClick={() => { onAddItem(p); setSearch(''); }}
                className="w-full px-6 py-4 text-left hover:bg-accent/10 flex justify-between items-center group transition-colors"
              >
                <div>
                  <p className="font-bold text-white group-hover:text-accent">{p.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{p.id} • {formatMoney(p.pvp)}</p>
                </div>
                <span className="text-xs font-black text-accent uppercase tracking-widest">+ Añadir</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Líneas del Presupuesto */}
      <div className="space-y-4">
        {currentItems.length > 0 ? currentItems.map(item => {
          const discAmount = item.discountType === 'percent' ? item.pvp * (item.discount / 100) : item.discount;
          const finalPricePerUnit = Math.max(0, item.pvp - discAmount);
          const totalLine = finalPricePerUnit * item.quantity;

          return (
            <div key={item.instanceId} className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-accent/30 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-grow flex gap-4 items-center">
                  <div className="bg-gray-800 px-3 py-1 rounded text-gray-500 font-mono text-[9px]">{item.id}</div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-accent transition-colors">{item.name}</h3>
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{item.type === 'unique' ? 'Inversión' : 'Recurrente'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                  {/* Unidades */}
                  <div>
                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-1">Unidades</label>
                    <input 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.instanceId, { quantity: parseInt(e.target.value) || 1 })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-accent transition-all outline-none"
                    />
                  </div>
                  
                  {/* Descuento */}
                  <div>
                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-1">Dcto. {item.discountType === 'percent' ? '%' : '€'}</label>
                    <input 
                      type="number"
                      value={item.discount}
                      onChange={(e) => onUpdateItem(item.instanceId, { discount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-red-400 font-mono focus:border-red-500 transition-all outline-none"
                    />
                  </div>

                  {/* Total Línea */}
                  <div className="text-right pr-4">
                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-1">Subtotal</label>
                    <span className="text-lg font-black text-white font-mono">{formatMoney(totalLine)}</span>
                  </div>

                  {/* Eliminar */}
                  <div className="text-right">
                    <button onClick={() => onRemoveItem(item.instanceId)} className="p-2 text-gray-700 hover:text-red-500 transition-colors">✕</button>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-gray-700 font-medium">
            Empieza añadiendo productos con el buscador
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-dashed border-white/10">
        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 block">Condiciones y Notas</label>
        <textarea 
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Validez del presupuesto, plazos de entrega, etc..."
          className="w-full bg-transparent border-none text-gray-400 text-sm leading-relaxed resize-none focus:outline-none min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default BudgetView;
