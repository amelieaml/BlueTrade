import React from 'react';

function TarjetaMiOferta({ oferta, onGestionar }) {
  const itemOfrecido = {
    tipo: oferta.tipo_ofrecido, 
    cantidad: oferta.cantidad_ofrecida || 0, 
    categoria: oferta.categoria_ofrecida
  };

  const itemSolicitado = {
    tipo: oferta.tipo_solicitado, 
    cantidad: oferta.cantidad_solicitada || 0,
    categoria: oferta.categoria_solicitada
  };

  const esAgua = itemOfrecido.tipo?.toLowerCase() === 'agua';
  const themeAccent = esAgua ? 'bg-[#5b8cff]' : 'bg-[#ffb443]';

  const getEstadoEstilos = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'EN_ESPERA':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'COMPLETADA':
        return 'bg-[#f7fbff] text-[#0066ff] border border-blue-100';
      case 'CANCELADA':
        return 'bg-red-50 text-red-500 border border-red-100';
      default:
        return 'bg-gray-50 text-gray-500 border border-gray-100';
    }
  };

  const RenderRecurso = ({ recurso, tipoGrama }) => {
    const isAgua = recurso.tipo?.toLowerCase() === 'agua';
    return (
      <div className={`p-4 rounded-xl ${tipoGrama === 'ofrece' ? 'bg-[#f8fafc]' : 'bg-[#fdf8f4]'} border border-gray-100`}>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
          {tipoGrama === 'ofrece' ? 'Ofrezco' : 'A cambio de'}
        </span>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isAgua ? 'bg-[#5b8cff]/10 text-[#5b8cff]' : 'bg-[#ffb443]/10 text-[#ffb443]'}`}>
              {isAgua ? '💧' : '🔧'}
            </div>
            <div>
              <p className="font-bold text-[#1a1d27] text-[15px] m-0">
                {/* SOLUCIÓN: Usamos recurso.cantidad y le metemos el formato correcto según el tipo */}
                {isAgua 
                  ? `${recurso.cantidad.toLocaleString()} L de Agua` 
                  : `${recurso.cantidad}h de Servicio`
                }
              </p>
              {!isAgua && recurso.categoria && (
                <span className="text-[11px] font-semibold text-[#ffb443] bg-[#ffb443]/10 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block mt-1">
                  {recurso.categoria}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <article className="relative bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col h-full group">
      
      {/* Línea lateral de color que identifica la oferta */}
      <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-md ${themeAccent} opacity-80 transition-opacity`}></div>

      <div className="pl-3 flex flex-col h-full">
        
        {/* Cabecera: Estado evaluado con el Enum y Menú de opciones */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md ${getEstadoEstilos(oferta.estado)}`}>
            {oferta.estado}
          </span>
          <button className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer bg-transparent border-none p-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
        </div>

        {/* Cajas de Intercambio */}
        <div className="flex flex-col gap-2 flex-grow">
          <RenderRecurso recurso={itemOfrecido} tipoGrama="ofrece" />
          
          <div className="flex justify-center -my-3 z-10">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm text-xs font-bold">
              ↓
            </div>
          </div>

          <RenderRecurso recurso={itemSolicitado} tipoGrama="solicita" />
        </div>

        {/* Footer: ID y Botón de Acción */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-gray-50">
          <span className="text-[12px] font-bold text-gray-400">ID: {oferta.id}</span>
          <button 
            onClick={() => onGestionar(oferta)}
            className="text-[13px] font-bold text-[#0066ff] hover:text-[#004a99] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border-none cursor-pointer"
          >
            Gestionar
          </button>
        </div>

      </div>
    </article>
  );
}

export default TarjetaMiOferta;