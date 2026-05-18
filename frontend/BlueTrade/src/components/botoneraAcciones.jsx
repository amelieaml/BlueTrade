function BotoneraAcciones({ isModerator = false, onAccion }) {
  return (
    <div className="w-full flex flex-col sm:flex-row flex-wrap lg:flex-nowrap gap-4 mb-8">
      
      <button 
        onClick={() => onAccion('recargar')}
        className="flex-1 px-4 py-3.5 bg-gradient-to-r from-[#0066ff] to-[#00b8ff] text-white text-sm font-bold rounded-xl shadow-[0_8px_20px_rgba(0,102,255,0.2)] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
        </svg>
        Recargar
      </button>

      <button 
        onClick={() => onAccion('crear')}
        className="flex-1 px-4 py-3.5 bg-white border border-gray-100 text-[#102033] text-sm font-bold rounded-xl shadow-sm hover:border-[#0066ff]/20 hover:bg-blue-50/40 transition-colors cursor-pointer"
      >
        Crear oferta
      </button>

      <button 
        onClick={() => onAccion('catalogo')}
        className="flex-1 px-4 py-3.5 bg-white border border-gray-100 text-[#102033] text-sm font-bold rounded-xl shadow-sm hover:border-[#0066ff]/20 hover:bg-blue-50/40 transition-colors cursor-pointer"
      >
        Catálogo
      </button>

      <button 
        onClick={() => onAccion('historial')}
        className="flex-1 px-4 py-3.5 bg-white border border-gray-100 text-[#102033] text-sm font-bold rounded-xl shadow-sm hover:border-[#0066ff]/20 hover:bg-blue-50/40 transition-colors cursor-pointer"
      >
        Historial
      </button>

      {isModerator && (
        <button 
          onClick={() => onAccion('solicitudes')}
          className="flex-1 px-4 py-3.5 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl shadow-sm hover:bg-red-100/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Solicitudes
        </button>
      )}

    </div>
  );
}

export default BotoneraAcciones;