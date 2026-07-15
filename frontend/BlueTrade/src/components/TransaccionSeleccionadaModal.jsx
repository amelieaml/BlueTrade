import React from 'react';

// --- ICONOS ---
const IconoCross = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconoCheck = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const IconoFlechaAbajo = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

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

const IconoConfirmacion = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function TransaccionSeleccionadaModal({ transaccion, isOpen, onClose, vistaActiva, usuario, onConfirmar, onCancelar }) {
  if (!isOpen || !transaccion) return null;

  // 1. Lógica de roles
  const confirmoYo = vistaActiva === 'compras' ? transaccion.confirmacion_comprador : transaccion.confirmacion_vendedor;
  const confirmoContraparte = vistaActiva === 'compras' ? transaccion.confirmacion_vendedor : transaccion.confirmacion_comprador;
  const miRol = vistaActiva === 'compras' ? 'Comprador' : 'Vendedor';

  // 2. Configuración de colores e íconos
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

  // 3. Extracción de datos directos desde la vista sin Request a la API
  const resumen = transaccion.oferta_resumen || '';
  const partes = resumen.split(' ⇄ ');
  const detalleOfrecido = partes[0] || `Detalles de oferta #${transaccion.oferta}`;
  const detalleSolicitado = partes[1] || 'Detalles no disponibles';

  let textoReceptor = '';
  let textoEntrega = '';

  // El comprador recibe lo ofrecido y entrega lo solicitado. El vendedor al revés.
  if (miRol === 'Comprador') {
    textoReceptor = detalleOfrecido;
    textoEntrega = detalleSolicitado;
  } else {
    textoReceptor = detalleSolicitado;
    textoEntrega = detalleOfrecido;
  }

  // 4. Determinar los estilos basados en el texto (Agua vs Servicio)
  const esAguaReceptor = textoReceptor.toLowerCase().includes('agua');
  const esAguaEntrega = textoEntrega.toLowerCase().includes('agua');

  const estiloReceptor = esAguaReceptor ? config.AGUA : config.SERVICIO;
  const estiloEntrega = esAguaEntrega ? config.AGUA : config.SERVICIO;
  const estiloConfirmacion = { color: '#ffb443', bg: 'bg-[#fffaf5]', border: 'border-[#ffb443]/20' };

  // 5. Validación de litros extrayendo el número del texto si se entrega agua
  let cantidadAguaEntregar = 0;
  if (esAguaEntrega) {
    const match = textoEntrega.match(/([\d.]+)/); // Busca el número en "40.0L de Agua"
    if (match) {
      cantidadAguaEntregar = parseFloat(match[1]);
    }
  }
  const litrosInsuficientes = esAguaEntrega && (cantidadAguaEntregar > (usuario?.litros_disponibles || 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 font-['Poppins',_sans-serif]">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all z-10 cursor-pointer border-none focus:outline-none"
        >
          <IconoCross className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0066ff] to-[#00b8ff] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/20">
              Tx
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#102033] tracking-tight m-0">Detalles de Transacción</h2>
              <p className="text-gray-400 text-sm font-medium m-0 flex items-center gap-2 mt-1">
                ID: #{transaccion.id}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {transaccion.estado}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tarjeta: Lo que Recibes */}
            <div className={`p-6 rounded-[24px] ${estiloReceptor.bg} border ${estiloReceptor.border}`}>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] mb-3 block" style={{ color: estiloReceptor.color }}>
                Recibirás
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  {estiloReceptor.icono}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#102033] m-0">
                    {textoReceptor}
                  </h3>
                </div>
              </div>
            </div>

            {/* Divisor con Flecha */}
            <div className="flex justify-center -my-3 relative z-10">
              <div className="w-12 h-12 rounded-full bg-white border-4 border-[#f7fbff] shadow-sm flex items-center justify-center text-blue-500 font-bold">
                <IconoFlechaAbajo className="w-5 h-5" />
              </div>
            </div>

            {/* Tarjeta: Lo que Entregas */}
            <div className={`p-6 rounded-[24px] ${estiloEntrega.bg} border ${estiloEntrega.border}`}>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] mb-3 block" style={{ color: estiloEntrega.color }}>
                Entregarás
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  {estiloEntrega.icono}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#102033] m-0">
                    {textoEntrega}
                  </h3>
                </div>
              </div>
            </div>

            {/* Bloque Inferior: Confirmaciones */}
            <div className={`p-6 rounded-[24px] ${estiloConfirmacion.bg} border ${estiloConfirmacion.border}`}>
              <span className="text-[11px] font-black uppercase tracking-[0.15em] mb-3 block" style={{ color: estiloConfirmacion.color }}>
                Estado de Confirmaciones
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  <IconoConfirmacion className="w-8 h-8 text-[#ffb443]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center w-full max-w-sm mt-1">
                    
                    {/* Sección: Tú */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold text-[#102033] flex items-center gap-2">Tú</span>
                      {confirmoYo ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1.5 text-sm bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <IconoCheck className="w-3.5 h-3.5"/> Confirmado
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold flex items-center gap-1.5 text-sm bg-gray-100 px-2.5 py-1 rounded-lg">
                          <IconoCross className="w-3.5 h-3.5"/> Pendiente
                        </span>
                      )}
                    </div>
                    
                    <div className="w-px h-12 bg-[#ffb443]/30"></div>
                    
                    {/* Sección: Contraparte */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold text-[#102033] flex items-center gap-2">Contraparte</span>
                      {confirmoContraparte ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1.5 text-sm bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <IconoCheck className="w-3.5 h-3.5"/> Confirmado
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold flex items-center gap-1.5 text-sm bg-gray-100 px-2.5 py-1 rounded-lg">
                          <IconoCross className="w-3.5 h-3.5"/> Pendiente
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- BOTONES DE ACCIÓN --- */}
          {['PENDIENTE', 'EN_PROCESO'].includes(transaccion.estado) ? (
            <div className={`flex flex-col sm:flex-row gap-3 ${litrosInsuficientes ? 'mt-4' : 'mt-10'}`}>
              {(() => {
                const yaConfirmeYo = vistaActiva === 'compras' 
                  ? transaccion.confirmacion_comprador 
                  : transaccion.confirmacion_vendedor;

                return (
                  <>
                    {esAguaEntrega && !yaConfirmeYo && (
                      <button 
                        onClick={() => onCancelar(transaccion.id)}
                        className="flex-1 px-6 py-4 border border-rose-200 text-rose-600 bg-rose-50 font-bold rounded-2xl hover:bg-rose-100 transition-all cursor-pointer"
                      >
                        Cancelar transacción
                      </button>
                    )}

                    <button 
                      onClick={() => onConfirmar(transaccion.id)}
                      disabled={litrosInsuficientes || yaConfirmeYo}
                      className={`flex-[2] px-6 py-4 font-bold rounded-2xl transition-all ${
                        yaConfirmeYo
                          ? 'bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-not-allowed'
                          : litrosInsuficientes
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-[#0066ff] to-[#00b8ff] text-white shadow-[0_12px_28px_rgba(0,102,255,0.25)] hover:shadow-[0_12px_35px_rgba(0,102,255,0.35)] hover:-translate-y-0.5 cursor-pointer'
                      }`}
                    >
                      {yaConfirmeYo ? 'Ya has confirmado' : 'Confirmar'}
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="mt-10 text-center py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium text-sm">
              Esta transacción ha finalizado y se encuentra en modo de solo lectura.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default TransaccionSeleccionadaModal;