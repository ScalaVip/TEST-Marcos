
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  desc: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, desc, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-gray-800 p-10 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 className="text-white font-black text-xl mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">{desc}</p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm} 
            className="w-full py-4 bg-accent text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(96,253,252,0.3)] hover:bg-accent-hover transition-all"
          >
            Confirmar Acción
          </button>
          <button 
            onClick={onClose} 
            className="w-full py-4 bg-gray-800/50 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-white hover:bg-gray-800 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
