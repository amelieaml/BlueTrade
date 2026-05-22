import { useEffect } from 'react';

const Alerta = ({ mensaje, tipo, onClose }) => {
  // Se cierra sola después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Configuración de estilos según el tipo
  const configs = {
    error: {
      bg: 'from-red-50 to-white',
      border: 'border-red-200',
      shadow: 'shadow-[0_16px_36px_rgba(239,68,68,0.12)]',
      iconBg: 'bg-red-500',
      textMain: 'text-red-500',
      bar: 'bg-red-500',
      title: 'Error en la acción'
    },
    success: {
      bg: 'from-emerald-50 to-white',
      border: 'border-emerald-200',
      shadow: 'shadow-[0_16px_36px_rgba(16,185,129,0.12)]',
      iconBg: 'bg-emerald-500',
      textMain: 'text-emerald-600',
      bar: 'bg-emerald-500',
      title: 'Acción completada'
    },
    warning: {
      bg: 'from-amber-50 to-white',
      border: 'border-amber-200',
      shadow: 'shadow-[0_16px_36px_rgba(245,158,11,0.12)]',
      iconBg: 'bg-amber-500',
      textMain: 'text-amber-600',
      bar: 'bg-amber-500',
      title: 'Atención'
    }
  };

  const style = configs[tipo] || configs.success;

  return (
    <div 
      className={`fixed top-6 right-6 z-[100] flex items-start gap-4 px-5 py-4 rounded-[20px] max-w-sm border overflow-hidden
        transition-all duration-500 animate-in slide-in-from-top-4 sm:slide-in-from-right-8
        bg-gradient-to-r ${style.bg} ${style.border} ${style.shadow}`}
    >
      {/* Icono dinámico */}
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${style.iconBg} text-white`}>
        {tipo === 'error' && <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
        {tipo === 'success' && <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
        {tipo === 'warning' && <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
      </div>
      
      {/* Contenido del Mensaje */}
      <div className="flex flex-col gap-0.5 text-left pr-2">
        <span className={`text-[11px] font-black uppercase tracking-wider ${style.textMain}`}>
          {style.title}
        </span>
        <p className="text-sm font-semibold text-[#102033] leading-snug m-0">
          {mensaje}
        </p>
      </div>
      
      {/* Botón Cerrar */}
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50 -mt-1 cursor-pointer">
        <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100">
        <div 
          className={`h-full animate-progress-bar ${style.bar}`}
          style={{ animationDuration: '4000ms', animationTimingFunction: 'linear', animationFillMode: 'forwards' }}
        />
      </div>
    </div>
  );
};

export default Alerta;