
import React, { useState, useEffect } from 'react';
import { Product, PaymentType } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
  editingProduct?: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, editingProduct }) => {
  // Fix: Removed 'discount' and 'discountType' from initial state as they are not part of the Product type
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '',
    name: '',
    desc: '',
    cost: 0,
    margin: 30,
    pvp: 0,
    type: 'unique',
    observations: ''
  });

  useEffect(() => {
    if (editingProduct) setFormData(editingProduct);
    // Fix: Removed 'discount' and 'discountType' from reset logic as they are not part of the Product type
    else setFormData({
      id: 'P' + Math.floor(Math.random() * 9000 + 1000),
      name: '', desc: '', cost: 0, margin: 30, pvp: 0, type: 'unique', observations: ''
    });
  }, [editingProduct, isOpen]);

  // Sincronizar PVP cuando cambia Coste o Margen
  useEffect(() => {
    const cost = formData.cost || 0;
    const margin = formData.margin || 0;
    const calculatedPvp = cost * (1 + margin / 100);
    setFormData(prev => ({ ...prev, pvp: Number(calculatedPvp.toFixed(2)) }));
  }, [formData.cost, formData.margin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <h2 className="text-2xl font-black text-white mb-10 tracking-tight">
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto en Inventario'}
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData as Product); onClose(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-600 font-black">Nombre del Producto</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-600 font-black">Forma de Pago</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData(p => ({...p, type: e.target.value as PaymentType}))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
              >
                <option value="unique">Pago Único</option>
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase text-gray-600 font-black">Descripción</label>
            <input 
              value={formData.desc}
              onChange={(e) => setFormData(p => ({...p, desc: e.target.value}))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:border-accent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-600 font-black">Coste (€)</label>
              <input 
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData(p => ({...p, cost: parseFloat(e.target.value) || 0}))}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-600 font-black">Margen (%)</label>
              <input 
                type="number"
                value={formData.margin}
                onChange={(e) => setFormData(p => ({...p, margin: parseFloat(e.target.value) || 0}))}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-accent font-black font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-gray-600 font-black">PVP Final (€)</label>
              <input 
                type="number"
                value={formData.pvp}
                onChange={(e) => {
                  const pvp = parseFloat(e.target.value) || 0;
                  const cost = formData.cost || 0;
                  const margin = cost > 0 ? ((pvp / cost) - 1) * 100 : 0;
                  setFormData(p => ({...p, pvp, margin: Number(margin.toFixed(2))}));
                }}
                className="w-full bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 text-accent font-black text-xl font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase text-gray-600 font-black">Observaciones Internas</label>
            <textarea 
              value={formData.observations}
              onChange={(e) => setFormData(p => ({...p, observations: e.target.value}))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-gray-400 text-xs italic resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-grow py-5 border border-white/10 rounded-3xl text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-white">Cancelar</button>
            <button type="submit" className="flex-grow py-5 bg-accent text-black rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1">Guardar Producto</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
