
import React from 'react';

interface ToastProps {
  msg: string;
  type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ msg, type = 'info' }) => {
  const bgColor = type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                  type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
                  'bg-accent/10 border-accent/30 text-accent';

  return (
    <div className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] ${bgColor} backdrop-blur-lg px-8 py-4 rounded-2xl border shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300`}>
      <div className={`w-2 h-2 rounded-full animate-pulse ${type === 'success' ? 'bg-green-400' : type === 'error' ? 'bg-red-400' : 'bg-accent'}`}></div>
      <span className="text-xs font-black uppercase tracking-widest">{msg}</span>
    </div>
  );
};

export default Toast;
