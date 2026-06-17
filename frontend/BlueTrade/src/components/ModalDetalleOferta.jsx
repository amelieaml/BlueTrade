import React, { useState, useEffect } from 'react';

const IconoAgua = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16a5 5 0 005-5c0-2.76-2.5-5.5-5-8.5-2.5 3-5 5.74-5 8.5a5 5 0 005 5z" />
  </svg>
);

const IconoServicio = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconoFlechaAbajo = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

function ModalDetalleOferta({ 
  oferta, 
  isOpen, 
  onClose, 
  onConfirmar, 
  onRechazar,
  serviciosDB, 
  certificadosUsuario 
}) {
  const [errorValidacion, setErrorValidacion] = useState(null);

  useEffect(() => {
    setErrorValidacion(null);
  }, [isOpen, oferta]);

  if (!isOpen || !oferta) return null;
  
  const esAgua = oferta.tipo_ofrecido === 'agua' || oferta.tipo_ofrecido === 'AGUA';
  const detalleOfrecido = oferta.tipo_ofrecido;
  const cantidadOfrecida = oferta.cantidad_ofrecida;

  const detalleSolicitado = oferta.tipo_solicitado;
  const cantidadSolicitada = oferta.cantidad_solicitada;

  const config = {
    AGUA: {
      color: '#5b8cff',
      bg: 'bg-[#f0f6ff]',
      border: 'border-[#5b8cff]/20',
      icono: <IconoAgua className="w-8 h-8 text-[#5b8cff]" />
    },
    SERVICIO: {
      color: '#ffb443',
      bg: 'bg-[#fffaf5]',
      border: 'border-[#ffb443]/20',
      icono: <IconoServicio className="w-8 h-8 text-[#ffb443]" />
    }
  };

  const estiloOfrecido = config[oferta.tipo_ofrecido.toUpperCase()];
  const estiloSolicitado = config[oferta.tipo_solicitado.toUpperCase()];
  
  const handleIntentarConfirmar = () => {
    setErrorValidacion(null);

    if (oferta.tipo_solicitado?.toUpperCase() === 'SERVICIO') {
      const servicioSolicitado = serviciosDB?.find(s => s.nombre === oferta.categoria_solicitada);

      if (servicioSolicitado?.necesita_certificado) {
        const tieneCertificado = certificadosUsuario?.some(
          cert => cert.tipo_servicio === servicioSolicitado.id
        );

        if (!tieneCertificado) {
          setErrorValidacion(`Necesitas una certificación técnica para ofrecer "${servicioSolicitado.nombre}". No puedes aceptar esta oferta.`);
          return; 
        }
      }
    }

    onConfirmar(oferta);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      <div 
        className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 font-['Poppins',_sans-serif]">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all z-10 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0066ff] to-[#00b8ff] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/20">
              {oferta.usuario_nombre.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#102033] tracking-tight m-0">Detalles de la Oferta</h2>
              <p className="text-gray-400 text-sm font-medium m-0">Publicada por <span className="text-[#0066ff]">{oferta.usuario_nombre}</span></p>
            </div>
          </div>

          <div className="space-y-6">
            
            <div className={`p-6 rounded-[24px] ${estiloOfrecido.bg} border ${estiloOfrecido.border}`}>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] mb-3 block" style={{ color: estiloOfrecido.color }}>Recibirás (Ofrecido)</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  {estiloOfrecido.icono}
                </div>
                <div>
                  {/* LÓGICA: Si es agua, pinta los litros. Si es servicio, pinta las horas y la categoría (ej. "4h de Plomería") */}
                  <h3 className="text-xl font-extrabold text-[#102033] m-0">
                    {oferta.tipo_ofrecido?.toUpperCase() === 'AGUA' 
                      ? `${(oferta.cantidad_ofrecida || 0).toLocaleString()} Litros de Agua` 
                      : `${oferta.cantidad_ofrecida || 0}h de ${oferta.categoria_ofrecida || 'Servicio'}`}
                  </h3>
                  {/* LÓGICA: Si es agua, el subtítulo es "Agua". Si es servicio, es la descripción exacta del usuario */}
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    {oferta.tipo_ofrecido?.toUpperCase() === 'AGUA' ? 'Agua' : oferta.descripcion}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white border-4 border-[#f7fbff] shadow-sm flex items-center justify-center text-blue-500">
                <IconoFlechaAbajo className="w-5 h-5" />
              </div>
            </div>

            <div className={`p-6 rounded-[24px] ${estiloSolicitado.bg} border ${estiloSolicitado.border}`}>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] mb-3 block" style={{ color: estiloSolicitado.color }}>Entregarás (Solicitado)</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  {estiloSolicitado.icono}
                </div>
                <div>
                  {/* LÓGICA: Evaluamos directamente el 'tipo_solicitado' para saber si damos agua o categoría de servicio */}
                  <h3 className="text-xl font-extrabold text-[#102033] m-0">
                    {oferta.tipo_solicitado?.toUpperCase() === 'AGUA' 
                      ? `${(oferta.cantidad_solicitada || 0).toLocaleString()} Litros de Agua` 
                      : `${oferta.cantidad_solicitada || 0}h de ${oferta.categoria_solicitada || 'Servicio'}`}
                  </h3>
                  {/* LÓGICA: Mostramos "Agua" o la descripción larga según corresponda */}
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    {oferta.tipo_solicitado?.toUpperCase() === 'AGUA' ? 'Agua' : oferta.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {errorValidacion && (
             <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
               <p className="text-red-700 text-sm font-semibold m-0">{errorValidacion}</p>
             </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onRechazar}
              className="flex-1 px-6 py-4 border border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              onClick={handleIntentarConfirmar}
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