
import React, { useState, useEffect } from 'react';
import { Product, BudgetHistory, AppConfig } from '../types';
import { checkSupabaseConnection } from '../services/supabaseService';

interface ConfigViewProps {
  products: Product[];
  history: BudgetHistory[];
  config: AppConfig;
  initialTab?: 'inventory' | 'history' | 'settings';
  onUpdateConfig: (c: AppConfig) => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onRestoreHistory: (h: BudgetHistory) => void;
  onAddProduct: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const ConfigView: React.FC<ConfigViewProps> = ({ 
  products, history, config, initialTab = 'inventory', onUpdateConfig,
  onEditProduct, onDeleteProduct, onDeleteHistory, onRestoreHistory, onAddProduct, showToast
}) => {
  const [tab, setTab] = useState<'inventory' | 'history' | 'settings'>(initialTab);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (tab === 'settings') {
      const verify = async () => {
        setDbStatus('checking');
        const isOk = await checkSupabaseConnection();
        setDbStatus(isOk ? 'connected' : 'disconnected');
      };
      verify();
    }
  }, [tab, config.supabaseUrl, config.supabaseKey]);

  const handleConfirmSettings = () => {
    showToast('Configuración guardada', 'success');
  };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

  const calculateTotalUnits = (h: BudgetHistory) => {
    return h.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl animate-in zoom-in-95 duration-300">
      <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex gap-8">
          {(['inventory', 'history', 'settings'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${tab === t ? 'border-accent text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
            >
              {t === 'inventory' ? 'Inventario' : t === 'history' ? 'Historial' : 'Conexión'}
            </button>
          ))}
        </div>
        {tab === 'inventory' && (
          <button 
            onClick={onAddProduct}
            className="px-6 py-2 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-all transform hover:scale-105"
          >
            Añadir Producto
          </button>
        )}
      </div>

      <div className="p-8">
        {tab === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] text-gray-600 uppercase tracking-widest border-b border-white/5">
                  <th className="pb-4 pl-4">ID</th>
                  <th className="pb-4">Producto</th>
                  <th className="pb-4">Pago</th>
                  <th className="pb-4 text-right">PVP Base</th>
                  <th className="pb-4 text-right pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pl-4 font-mono text-[10px] text-gray-500">{p.id}</td>
                    <td className="py-4 font-bold">{p.name}</td>
                    <td className="py-4 text-[8px] uppercase font-black text-gray-500">{p.type}</td>
                    <td className="py-4 text-right font-mono font-bold text-accent">{formatMoney(p.pvp)}</td>
                    <td className="py-4 text-right pr-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEditProduct(p)} className="p-2 text-gray-500 hover:text-white transition-colors">✎</button>
                        <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-4">
            {history.map(h => (
              <div key={h.id} className="group bg-black/30 border border-white/10 rounded-3xl p-6 flex justify-between items-center hover:border-accent/30 transition-all">
                <div className="flex gap-6 items-center">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 font-mono mb-1">{h.sequenceId}</p>
                    <div className="flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-accent opacity-50"><path d="M21 8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="m21 8-9-6-9 6"/><path d="M12 22V8"/></svg>
                       <span className="text-xl font-black text-white">{calculateTotalUnits(h)}</span>
                       <span className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">u.</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl leading-tight">{h.clientName}</h4>
                    <p className="text-xs text-gray-500 mt-1">{h.projectName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Valor Estimado</p>
                    <p className="font-black text-accent text-lg leading-none">{formatMoney(h.totalUnique)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">+{formatMoney(h.totalRecurring)}/m</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => onRestoreHistory(h)} className="px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">Editar</button>
                    <button onClick={() => onDeleteHistory(h.id)} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">✕</button>
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-20 opacity-20">
                <p className="text-xs font-black uppercase tracking-widest">No hay registros guardados</p>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
              <div className={`w-3 h-3 rounded-full ${
                dbStatus === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                dbStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
              }`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {dbStatus === 'connected' ? 'Supabase Conectado' : 
                 dbStatus === 'disconnected' ? 'Error de Conexión Supabase' : 'Verificando Base de Datos...'}
              </span>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-3xl p-8">
              <h4 className="text-accent font-black uppercase tracking-widest text-xs mb-6">Configuración Supabase</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] uppercase text-gray-500 font-black block mb-1">Supabase URL</label>
                  <input 
                    type="text" 
                    value={config.supabaseUrl}
                    onChange={(e) => onUpdateConfig({ ...config, supabaseUrl: e.target.value })}
                    placeholder="https://your-project.supabase.co" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-gray-500 font-black block mb-1">Supabase Anon/Service Key</label>
                  <input 
                    type="password" 
                    value={config.supabaseKey}
                    onChange={(e) => onUpdateConfig({ ...config, supabaseKey: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-accent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h4 className="text-gray-400 font-black uppercase tracking-widest text-xs mb-6">Webhook n8n / Sheets</h4>
              <input 
                type="text" 
                value={config.webhookUrl}
                onChange={(e) => onUpdateConfig({ ...config, webhookUrl: e.target.value })}
                placeholder="https://n8n.your-server.com/..." 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-accent outline-none"
              />
            </div>

            <button 
              onClick={handleConfirmSettings}
              className="w-full py-4 bg-accent text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white transition-all shadow-2xl"
            >
              Guardar Conexiones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigView;
