
import React from 'react';

interface HeaderProps {
  view: 'budget' | 'config';
  onGoHome: () => void;
  onToggleView: () => void;
  onNewBudget: () => void;
  onAddProduct: () => void;
}

const Header: React.FC<HeaderProps> = ({ view, onGoHome, onToggleView, onNewBudget, onAddProduct }) => {
  return (
    <header className="w-full max-w-6xl mx-auto p-6 flex justify-between items-center z-50 no-print">
      <div className="flex gap-6 items-center">
        <button onClick={onGoHome} className="flex flex-col hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-black tracking-tighter text-white">
            NEON<span className="text-accent">.BUDGET</span>
          </h1>
          <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-bold">Quoting Hub</span>
        </button>
        
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:border-white/30 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Inicio
        </button>
      </div>
      
      <div className="flex gap-3">
        {view === 'budget' ? (
          <button 
            onClick={onNewBudget}
            className="p-2.5 border border-gray-800 rounded-full hover:border-accent hover:bg-accent/5 text-gray-500 hover:text-accent transition-all"
            title="Limpiar Presupuesto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        ) : (
          <button 
            onClick={onAddProduct}
            className="p-2.5 border border-accent rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-black transition-all shadow-[0_0_15px_rgba(96,253,252,0.3)]"
            title="Añadir Producto al Inventario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        )}

        <button 
          onClick={onToggleView}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-800 rounded-full hover:border-accent hover:bg-accent/5 transition-all group overflow-hidden relative"
        >
          <span className="text-xs font-bold text-gray-400 group-hover:text-accent uppercase tracking-widest relative z-10">
            {view === 'budget' ? 'Inventario' : 'Ver Editor'}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" height="16" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            className={`text-gray-500 group-hover:text-accent transition-transform duration-500 relative z-10 ${view === 'config' ? 'rotate-180' : ''}`}
          >
            {view === 'budget' ? (
              <circle cx="12" cy="12" r="3"></circle>
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
            {view === 'budget' && (
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
