
import React from 'react';
import { BudgetItem } from '../types';

interface TotalBarProps {
  currentItems: BudgetItem[];
  onSave: () => void;
}

const TotalBar: React.FC<TotalBarProps> = ({ currentItems, onSave }) => {
  let totalUnique = 0;
  let totalMonthly = 0;

  currentItems.forEach(item => {
    const disc = item.discountType === 'percent' ? item.pvp * (item.discount / 100) : item.discount;
    const final = Math.max(0, (item.pvp - disc) * item.quantity);
    
    if (item.type === 'unique') {
      totalUnique += final;
    } else {
      totalMonthly += final;
    }
  });

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-2xl border-t border-white/5 p-8 z-40 no-print shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">Total Inversión</p>
            <p className="text-4xl font-black text-accent font-mono tracking-tighter shadow-accent/20 drop-shadow-[0_0_15px_rgba(96,253,252,0.4)]">{formatMoney(totalUnique)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">Total Recurrente</p>
            <p className="text-4xl font-black text-white font-mono tracking-tighter">{formatMoney(totalMonthly)}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={onSave}
            className="flex-grow md:flex-none px-10 py-5 bg-gray-900 border border-white/10 hover:border-accent text-white text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl"
          >
            Guardar y Sincronizar
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-grow md:flex-none px-10 py-5 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1"
          >
            Imprimir PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalBar;
