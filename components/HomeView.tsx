
import React from 'react';

interface HomeViewProps {
  onNewBudget: () => void;
  onViewHistory: () => void;
  onViewConfig: () => void;
  dbConnected: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ onNewBudget, onViewHistory, onViewConfig, dbConnected }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-dark relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-accent/10 blur-[120px] rounded-full -z-10"></div>
      
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-none mb-4 drop-shadow-[0_0_15px_rgba(96,253,252,0.3)]">
          NEON<span className="text-accent">.BUDGET</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <span className="text-xs font-black text-gray-500 uppercase tracking-[0.4em]">Professional Quoting System</span>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">DB Status</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
        <button 
          onClick={onNewBudget}
          className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-accent hover:bg-accent/5 transition-all text-left overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] block mb-4">Empezar de cero</span>
          <h2 className="text-4xl font-black text-white group-hover:text-accent transition-colors leading-tight">Nuevo<br/>Presupuesto</h2>
        </button>

        <button 
          onClick={onViewHistory}
          className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-white/20 hover:bg-white/10 transition-all text-left overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-4">Gestión de archivos</span>
          <h2 className="text-4xl font-black text-white leading-tight">Historial de<br/>Presupuestos</h2>
        </button>

        <button 
          onClick={onViewConfig}
          className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:border-white/20 hover:bg-white/10 transition-all text-left overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </div>
          <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-4">Inventario y API</span>
          <h2 className="text-4xl font-black text-white leading-tight">Ajustes y<br/>Catálogo</h2>
        </button>
      </div>

      <footer className="absolute bottom-10 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.5em] text-gray-500">
        Wabely Professional Quoting Engine v4.0.0
      </footer>
    </div>
  );
};

export default HomeView;
