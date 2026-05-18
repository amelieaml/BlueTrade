// CAMBIO: se agrega `onVerDetalle` como prop
function TarjetaOferta({ oferta, onVerDetalle }) {
  const avatarLetra = oferta.usuario.charAt(0).toUpperCase();
  const esAgua = oferta.itemOfrecido.tipo === 'agua';
  
  const themeAccent = esAgua ? 'bg-[#5b8cff]' : 'bg-[#ffb443]';

  const RenderRecurso = ({ recurso, tipoGrama }) => {
    const isAgua = recurso.tipo === 'agua';
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
              <p className="font-bold text-[#1a1d27] text-[15px]">
                {isAgua ? `${recurso.litros.toLocaleString()} L de Agua` : `${recurso.horasEstimadas}h de Servicio`}
              </p>
              {!isAgua && (
                <span className="text-[11px] font-semibold text-[#ffb443] bg-[#ffb443]/10 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block mt-1">
                  {recurso.categoria}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-[13px] text-gray-500 mt-3 line-clamp-2 leading-relaxed">
          {isAgua ? recurso.descripcion : recurso.descripcionDetallada}
        </p>
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
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${oferta.estado === 'ACTIVO' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
            {oferta.estado}
          </span>
        </div>

        {/* Cajas de Intercambio */}
        <div className="flex flex-col gap-2 flex-grow">
          <RenderRecurso recurso={oferta.itemOfrecido} tipoGrama="ofrece" />
          
          <div className="flex justify-center -my-3 z-10">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
              ↓
            </div>
          </div>

          <RenderRecurso recurso={oferta.itemSolicitado} tipoGrama="solicita" />
        </div>

        {/* Footer: Usuario */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-600">
              {avatarLetra}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-700">{oferta.usuario}</span>
              <span className="text-[11px] text-gray-400">{oferta.urbanizacion}</span>
            </div>
          </div>
          {/* CAMBIO: onClick llama a onVerDetalle con la oferta */}
          <button
            onClick={() => onVerDetalle(oferta)}
            className="text-[13px] font-bold text-[#0066ff] hover:text-[#004a99] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}

export default TarjetaOferta;