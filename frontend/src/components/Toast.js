import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const iconMap = { success: 'check_circle', error: 'error', info: 'info' };
  const colorMap = { success: 'text-green-600', error: 'text-error', info: 'text-secondary' };
  const bgMap = { success: 'bg-green-50 border-green-200', error: 'bg-red-50 border-red-200', info: 'bg-blue-50 border-blue-200' };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg bg-surface-container-lowest animate-slide-in ${bgMap[t.type] || bgMap.info}`}>
            <span className={`material-symbols-outlined text-[20px] ${colorMap[t.type] || colorMap.info}`}>{iconMap[t.type] || iconMap.info}</span>
            <span className="font-body-sm text-body-sm text-on-surface">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
