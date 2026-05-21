import React from 'react';

function TarjetaOferta({ oferta, onVerDetalle }) {
  // 1. Mapeo de datos planos provenientes del Serializer
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

  // Estilos basados en lo que se ofrece
  const esAgua = itemOfrecido.tipo?.toLowerCase() === 'agua';
  const themeAccent = esAgua ? 'bg-[#5b8cff]' : 'bg-[#ffb443]';

  // 2. Extracción segura del nombre de usuario
  const nombreUsuario = oferta.usuario_nombre || "Usuario";
  const avatarLetra = nombreUsuario.charAt(0).toUpperCase();

  const RenderRecurso = ({ recurso, tipoGrama }) => {
    const isAgua = recurso.tipo?.toLowerCase() === 'agua';
    return (
      <div className={`p-4 rounded-xl ${tipoGrama === 'ofrece' ? 'bg-[#f8fafc]' : 'bg-[#fdf8f4]'} border border-gray-100`}>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
          {tipoGrama === 'ofrece' ? 'Ofrece' : 'A cambio de'}
        </span>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isAgua ? 'bg-[#5b8cff]/10 text-[#5b8cff]' : 'bg-[#ffb443]/10 text-[#ffb443]'}`}>
              {isAgua ? '💧' : '🔧'}
            </div>
            <div>
              <p className="font-bold text-[#1a1d27] text-[15px] m-0">
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
      
      <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-md ${themeAccent} opacity-80 transition-opacity`}></div>

      <div className="pl-3 flex flex-col h-full">
        {/* Cabecera: ID y Estado */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] font-bold text-gray-400">ID: {oferta.id}</span>
          <span className="text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
            {oferta.estado}
          </span>
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

        {/* Footer: Usuario y Acción */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-600">
              {avatarLetra}
            </div>
            <span className="text-[13px] font-bold text-gray-700">{nombreUsuario}</span>
          </div>
          <button 
            onClick={() => onVerDetalle(oferta)}
            className="text-[13px] font-bold text-[#0066ff] hover:text-[#004a99] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border-none cursor-pointer"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}

export default TarjetaOferta;