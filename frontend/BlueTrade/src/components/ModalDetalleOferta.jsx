function ModalDetalleOferta({ oferta, isOpen, onClose, onConfirmar }) {
  if (!isOpen || !oferta) return null;

  const esAgua = oferta.itemOfrecido.tipo === 'agua';
  const themeColor = esAgua ? 'text-[#5b8cff]' : 'text-[#ffb443]';
  const themeBg = esAgua ? 'bg-[#5b8cff]/10' : 'bg-[#ffb443]/10';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Fondo con desenfoque */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 font-['Poppins',_sans-serif]">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all z-10 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 sm:p-10">
          {/* Encabezado: Info del Usuario */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0066ff] to-[#00b8ff] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/20">
              {oferta.usuario.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#102033] tracking-tight m-0">Detalles de la Oferta</h2>
              <p className="text-gray-400 text-sm font-medium m-0">Publicada por <span className="text-[#0066ff]">{oferta.usuario}</span> • {oferta.urbanizacion}</p>
            </div>
          </div>

          {/* Cuerpo: El Intercambio */}
          <div className="space-y-6">
            
            {/* Box: Lo que recibes */}
            <div className="p-6 rounded-[24px] bg-[#f8fafc] border border-blue-500/5">
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#5b8cff] mb-3 block">Recibirás (Ofrecido)</span>
              <div className="flex items-center gap-4">
                <div className="text-3xl">
                  {esAgua ? '💧' : '🔧'}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#102033] m-0">
                    {esAgua ? `${oferta.itemOfrecido.litros.toLocaleString()} Litros de Agua` : `${oferta.itemOfrecido.horasEstimadas}h de Servicio`}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{esAgua ? oferta.itemOfrecido.descripcion : oferta.itemOfrecido.descripcionDetallada}</p>
                </div>
              </div>
            </div>

            {/* Icono de flujo */}
            <div className="flex justify-center -my-3">
              <div className="w-12 h-12 rounded-full bg-white border-4 border-[#f7fbff] shadow-sm flex items-center justify-center text-blue-500 font-bold">
                ↓
              </div>
            </div>

            {/* Box: Lo que entregas */}
            <div className="p-6 rounded-[24px] bg-[#fffaf5] border border-orange-500/5">
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#ffb443] mb-3 block">Entregarás (Solicitado)</span>
              <div className="flex items-center gap-4">
                <div className="text-3xl">
                  {!esAgua ? '💧' : '🔧'}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#102033] m-0">
                    {!esAgua ? `${oferta.itemSolicitado.litros.toLocaleString()} Litros de Agua` : `${oferta.itemSolicitado.horasEstimadas}h de ${oferta.itemSolicitado.categoria}`}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{!esAgua ? oferta.itemSolicitado.descripcion : oferta.itemSolicitado.descripcionDetallada}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Acciones */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onConfirmar(oferta)}
              className="flex-[2] px-6 py-4 bg-gradient-to-r from-[#0066ff] to-[#00b8ff] text-white font-bold rounded-2xl shadow-[0_12px_28px_rgba(0,102,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              Empezar transacción
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ModalDetalleOferta;