import React, { useState, useRef, useEffect } from 'react';

const IconoAgua = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16a5 5 0 005-5c0-2.76-2.5-5.5-5-8.5-2.5 3-5 5.74-5 8.5a5 5 0 005 5z" />
  </svg>
);

const IconoServicio = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconoFlechaAbajo = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const IconoPlay = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconoPausa = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconoCancelar = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function TarjetaMiOferta({ oferta, onGestionar, onCambiarEstado }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const esEditable = oferta.estado === 'ACTIVO' || oferta.estado === 'PAUSADO';
  const esEstadoPausado = oferta.estado === 'PAUSADO';
  const esCancelable = oferta.estado !== 'CANCELADO' && oferta.estado !== 'COMPLETADO';

  const getEstadoEstilos = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'EN_PROCESO':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'PAUSADO': 
        return 'bg-slate-100 text-slate-600 border border-slate-200';
      case 'COMPLETADO':
        return 'bg-[#f7fbff] text-[#0066ff] border border-blue-100';
      case 'CANCELADO': 
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAgua ? 'bg-[#5b8cff]/10 text-[#5b8cff]' : 'bg-[#ffb443]/10 text-[#ffb443]'}`}>
              {isAgua ? <IconoAgua /> : <IconoServicio />}
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

  const handleAccionMenu = (nuevoEstado) => {
    setMenuAbierto(false);
    if (onCambiarEstado) {
      onCambiarEstado(oferta, nuevoEstado);
    }
  };

  return (
    <article className="relative bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col h-full group">
      
      <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-md ${themeAccent} opacity-80 transition-opacity`}></div>

      <div className="pl-3 flex flex-col h-full">
        
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md ${getEstadoEstilos(oferta.estado)}`}>
            {oferta.estado}
          </span>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-gray-400 hover:text-[#0066ff] transition-colors cursor-pointer bg-transparent border-none p-1 rounded-full hover:bg-blue-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>

            {menuAbierto && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                
                {esEditable && (
                  <button 
                    onClick={() => handleAccionMenu(esEstadoPausado ? 'ACTIVO' : 'PAUSADO')}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-amber-600 hover:bg-amber-50 cursor-pointer border-none bg-transparent transition-colors flex items-center gap-2"
                  >
                    {esEstadoPausado ? (
                      <><IconoPlay /> Activar oferta</>
                    ) : (
                      <><IconoPausa /> Pausar oferta</>
                    )}
                  </button>
                )}

                {esCancelable && (
                  <button 
                    onClick={() => handleAccionMenu('CANCELADO')}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-red-600 hover:bg-red-50 cursor-pointer border-none bg-transparent transition-colors flex items-center gap-2"
                  >
                    <IconoCancelar /> Cancelar oferta
                  </button>
                )}
                
                {!esEditable && !esCancelable && (
                  <div className="px-4 py-2 text-xs text-gray-400 italic">
                    Sin acciones disponibles
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <RenderRecurso recurso={itemOfrecido} tipoGrama="ofrece" />
          
          <div className="flex justify-center -my-3 z-10">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
              <IconoFlechaAbajo />
            </div>
          </div>

          <RenderRecurso recurso={itemSolicitado} tipoGrama="solicita" />
        </div>

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