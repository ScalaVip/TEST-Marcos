
import React, { useState, useEffect } from 'react';
import { Product, BudgetItem, BudgetHistory, AppConfig } from './types';
import Header from './components/Header';
import BudgetView from './components/BudgetView';
import ConfigView from './components/ConfigView';
import TotalBar from './components/TotalBar';
import HomeView from './components/HomeView';
import ProductModal from './components/ProductModal';
import Toast from './components/Toast';
import { saveToWebhook } from './services/sheetsService';
import { initSupabase, saveBudgetToSupabase, syncInventory, fetchInventory, checkSupabaseConnection } from './services/supabaseService';

const STORAGE_KEY = 'wabely_inventory_v4';
const HISTORY_KEY = 'wabely_history_v4';
const CONFIG_KEY = 'wabely_config_v4';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentItems, setCurrentItems] = useState<BudgetItem[]>([]);
  const [history, setHistory] = useState<BudgetHistory[]>([]);
  const [view, setView] = useState<'home' | 'budget' | 'config'>('home');
  const [activeConfigTab, setActiveConfigTab] = useState<'inventory' | 'history' | 'settings'>('inventory');
  
  const [config, setConfig] = useState<AppConfig>({ 
    webhookUrl: '', 
    supabaseUrl: '', 
    supabaseKey: '' 
  });
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [dbConnected, setDbConnected] = useState(false);

  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const p = localStorage.getItem(STORAGE_KEY);
    const h = localStorage.getItem(HISTORY_KEY);
    const c = localStorage.getItem(CONFIG_KEY);

    if (p) setProducts(JSON.parse(p));
    if (h) setHistory(JSON.parse(h));
    if (c) {
      const parsedConfig = JSON.parse(c);
      setConfig(parsedConfig);
      if (parsedConfig.supabaseUrl && parsedConfig.supabaseKey) {
        initSupabase(parsedConfig.supabaseUrl, parsedConfig.supabaseKey);
        checkSupabaseConnection().then(setDbConnected);
        fetchInventory().then(data => {
          if (data) setProducts(data);
        });
      }
    }
  }, []);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(HISTORY_KEY, JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem(CONFIG_KEY, JSON.stringify(config)), [config]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddItem = (product: Product) => {
    const newItem: BudgetItem = {
      ...product,
      instanceId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      quantity: 1,
      discount: 0,
      discountType: 'percent'
    };
    setCurrentItems(prev => [...prev, newItem]);
    showToast(`Añadido: ${product.name}`);
  };

  const handleUpdateItem = (instanceId: string, updates: Partial<BudgetItem>) => {
    setCurrentItems(prev => prev.map(item => item.instanceId === instanceId ? { ...item, ...updates } : item));
  };

  const handleRemoveItem = (instanceId: string) => {
    setCurrentItems(prev => prev.filter(item => item.instanceId !== instanceId));
  };

  const handleSaveBudget = async () => {
    if (!clientName || !projectName || currentItems.length === 0) {
      showToast('Faltan datos o productos', 'error');
      return;
    }

    let tUnique = 0;
    let tMonthly = 0;
    currentItems.forEach(item => {
      const disc = item.discountType === 'percent' ? item.pvp * (item.discount / 100) : item.discount;
      const final = Math.max(0, (item.pvp - disc) * item.quantity);
      if (item.type === 'unique') tUnique += final;
      else tMonthly += final;
    });

    const newBudget: BudgetHistory = {
      id: Date.now().toString(),
      sequenceId: generateSequenceId(),
      timestamp: Date.now(),
      clientName,
      projectName,
      comments,
      items: currentItems,
      totalUnique: tUnique,
      totalRecurring: tMonthly,
      itemCount: currentItems.length,
      status: 'pending'
    };

    setHistory(prev => [newBudget, ...prev]);

    const sbOk = await saveBudgetToSupabase(newBudget);
    const whOk = await saveToWebhook(config.webhookUrl, newBudget);

    if (sbOk || whOk) {
      setHistory(prev => prev.map(h => h.id === newBudget.id ? { ...h, status: 'synced' } : h));
      showToast('Presupuesto guardado y sincronizado', 'success');
      setCurrentItems([]);
      setClientName('');
      setProjectName('');
      setComments('');
      setView('home');
    } else {
      setHistory(prev => prev.map(h => h.id === newBudget.id ? { ...h, status: 'failed' } : h));
      showToast('Error al sincronizar. Guardado local.', 'error');
    }
  };

  const generateSequenceId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const yearBudgets = history.filter(h => h.sequenceId.startsWith(year));
    if (yearBudgets.length === 0) return year + "0001";
    const lastIds = yearBudgets.map(h => parseInt(h.sequenceId.slice(2))).filter(n => !isNaN(n));
    const lastId = lastIds.length > 0 ? Math.max(...lastIds) : 0;
    return year + (lastId + 1).toString().padStart(4, '0');
  };

  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      const newList = exists ? prev.map(p => p.id === product.id ? product : p) : [...prev, product];
      syncInventory(newList);
      return newList;
    });
    showToast('Inventario actualizado', 'success');
  };

  const handleRestoreHistory = (h: BudgetHistory) => {
    setClientName(h.clientName);
    setProjectName(h.projectName);
    setComments(h.comments);
    setCurrentItems(h.items);
    setView('budget');
    showToast(`Restaurado ${h.sequenceId}`);
  };

  const navigateToHistory = () => {
    setActiveConfigTab('history');
    setView('config');
  };

  const navigateToConfig = () => {
    setActiveConfigTab('inventory');
    setView('config');
  };

  const navigateToNewBudget = () => {
    setCurrentItems([]);
    setClientName('');
    setProjectName('');
    setComments('');
    setView('budget');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 text-white">
      {view !== 'home' && (
        <Header 
          view={view} 
          onGoHome={() => setView('home')}
          onToggleView={() => setView(v => v === 'budget' ? 'config' : 'budget')} 
          onNewBudget={navigateToNewBudget}
          onAddProduct={() => { setEditingProduct(undefined); setIsProductModalOpen(true); }}
        />
      )}

      <main className={`flex-grow w-full ${view === 'home' ? '' : 'max-w-5xl mx-auto px-4 py-8 pb-40'}`}>
        {view === 'home' ? (
          <HomeView 
            onNewBudget={navigateToNewBudget}
            onViewHistory={navigateToHistory}
            onViewConfig={navigateToConfig}
            dbConnected={dbConnected}
          />
        ) : view === 'budget' ? (
          <BudgetView 
            products={products} clientName={clientName} projectName={projectName} comments={comments}
            currentItems={currentItems}
            setClientName={setClientName} setProjectName={setProjectName} setComments={setComments}
            onAddItem={handleAddItem} onUpdateItem={handleUpdateItem} onRemoveItem={handleRemoveItem}
            nextId={generateSequenceId()}
          />
        ) : (
          <ConfigView 
            products={products} history={history} config={config}
            initialTab={activeConfigTab}
            onUpdateConfig={(c) => { 
              setConfig(c); 
              if (c.supabaseUrl && c.supabaseKey) initSupabase(c.supabaseUrl, c.supabaseKey);
            }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={(id) => setProducts(p => p.filter(x => x.id !== id))}
            onDeleteHistory={(id) => setHistory(h => h.filter(x => x.id !== id))}
            onRestoreHistory={handleRestoreHistory}
            onAddProduct={() => { setEditingProduct(undefined); setIsProductModalOpen(true); }}
            showToast={showToast}
          />
        )}
      </main>

      {view === 'budget' && <TotalBar currentItems={currentItems} onSave={handleSaveBudget} />}
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={handleSaveProduct} editingProduct={editingProduct} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default App;
