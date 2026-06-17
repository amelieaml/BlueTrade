import React, { useState, useEffect } from 'react';

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
  // 1. Estados para manejar la carga de la oferta específica
  const [detalleOferta, setDetalleOferta] = useState(null);
  const [cargandoOferta, setCargandoOferta] = useState(false);

  // 2. Efecto que se dispara al abrir el modal para buscar el ID en tu API
  useEffect(() => {
    const obtenerDetallesOferta = async () => {
      if (!isOpen || !transaccion?.oferta) return;
      
      setCargandoOferta(true);
      try {
        const token = localStorage.getItem('token');
        const urlOferta = `http://127.0.0.1:8000/item/test/ofertas/${transaccion.oferta}/`;
        
        const response = await fetch(urlOferta, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDetalleOferta(data);
        } else {
          console.error("Error al obtener la oferta, status:", response.status);
        }
      } catch (error) {
        console.error("Error de red al cargar la oferta:", error);
      } finally {
        setCargandoOferta(false);
      }
    };

    obtenerDetallesOferta();

    // Limpiar el estado cuando el modal se cierra
    if (!isOpen) setDetalleOferta(null);
  }, [isOpen, transaccion]);

  if (!isOpen || !transaccion) return null;

  // 3. Lógica de confirmaciones y roles
  const confirmoYo = vistaActiva === 'compras' ? transaccion.confirmacion_comprador : transaccion.confirmacion_vendedor;
  const confirmoContraparte = vistaActiva === 'compras' ? transaccion.confirmacion_vendedor : transaccion.confirmacion_comprador;
  const miRol = vistaActiva === 'compras' ? 'Comprador' : 'Vendedor';
  const contraparteRol = vistaActiva === 'compras' ? 'Vendedor' : 'Comprador';

  // 4. Configuración de colores e íconos
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

  // 5. Lógica cruzada para determinar qué recibo y qué entrego según mi rol
  let miReceptor = null;
  let miEntrega = null;
  
  if (detalleOferta) {
    
    // Función auxiliar para saber qué texto gris poner debajo de los litros/horas
    const obtenerDetalle = (tipo, categoria, descripcion) => {
      if (tipo?.toUpperCase() === 'AGUA') return 'Agua';
      // Si es servicio, intentará mostrar la categoría. Si no hay categoría, mostrará la descripción general.
      return categoria || descripcion || 'Servicio no especificado';
    };

    if (miRol === 'Comprador') {
      miReceptor = { 
        tipo: detalleOferta.tipo_ofrecido, 
        cantidad: detalleOferta.cantidad_ofrecida, 
        desc: obtenerDetalle(detalleOferta.tipo_ofrecido, detalleOferta.categoria_ofrecida, detalleOferta.descripcion) 
      };
      miEntrega = { 
        tipo: detalleOferta.tipo_solicitado, 
        cantidad: detalleOferta.cantidad_solicitada, 
        desc: obtenerDetalle(detalleOferta.tipo_solicitado, detalleOferta.categoria_solicitada, detalleOferta.descripcion) 
      };
    } else {
      miReceptor = { 
        tipo: detalleOferta.tipo_solicitado, 
        cantidad: detalleOferta.cantidad_solicitada, 
        desc: obtenerDetalle(detalleOferta.tipo_solicitado, detalleOferta.categoria_solicitada, detalleOferta.descripcion) 
      };
      miEntrega = { 
        tipo: detalleOferta.tipo_ofrecido, 
        cantidad: detalleOferta.cantidad_ofrecida, 
        desc: obtenerDetalle(detalleOferta.tipo_ofrecido, detalleOferta.categoria_ofrecida, detalleOferta.descripcion) 
      };
    }
  }

  const estiloReceptor = miReceptor ? config[miReceptor.tipo?.toUpperCase() || 'AGUA'] : config.AGUA;
  const estiloEntrega = miEntrega ? config[miEntrega.tipo?.toUpperCase() || 'SERVICIO'] : config.SERVICIO;
  const estiloConfirmacion = { color: '#ffb443', bg: 'bg-[#fffaf5]', border: 'border-[#ffb443]/20' };
  const entregoAgua = miEntrega && (miEntrega.tipo?.toUpperCase() === 'AGUA');
  const litrosInsuficientes = entregoAgua && (miEntrega.cantidad > (usuario?.litros_disponibles || 0));

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
          
          {/* Cabecera del Modal */}
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
            
            {/* Si está cargando, mostramos un aviso. Si ya cargó, mostramos las dos tarjetas */}
            {cargandoOferta || !detalleOferta ? (
              <div className="p-10 text-center bg-gray-50 rounded-[24px] border border-gray-100 animate-pulse">
                <p className="text-gray-500 font-semibold m-0">Obteniendo detalles del intercambio...</p>
              </div>
            ) : (
              <>
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
                        {miReceptor.tipo?.toUpperCase() === 'AGUA' || miReceptor.tipo?.toUpperCase() === 'agua' 
                          ? `${(miReceptor.cantidad || 0).toLocaleString()} Litros de Agua` 
                          : `${miReceptor.cantidad || 0}h de Servicio`}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed capitalize">
                        {miReceptor.desc?.toLowerCase()}
                      </p>
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
                        {miEntrega.tipo?.toUpperCase() === 'AGUA' || miEntrega.tipo?.toUpperCase() === 'agua' 
                          ? `${(miEntrega.cantidad || 0).toLocaleString()} Litros de Agua` 
                          : `${miEntrega.cantidad || 0}h de Servicio`}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        {miEntrega.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Bloque Inferior: Confirmaciones (Roles Resaltados) */}
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
                      <span className="text-sm font-bold text-[#102033] flex items-center gap-2">
                        Tú
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#ffb443]/10 text-[#e69b24] px-2 py-0.5 rounded-md">
                          ({miRol})
                        </span>
                      </span>
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
                      <span className="text-sm font-bold text-[#102033] flex items-center gap-2">
                        Contraparte
                        <span className="text-[10px] font-black uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
                          ({contraparteRol})
                        </span>
                      </span>
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

          {/* --- ALERTA VISUAL DE LITROS INSUFICIENTES --- */}
          {litrosInsuficientes && (
            <div className="mt-8 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                No tienes suficientes litros ({usuario?.litros_disponibles || 0}L) para realizar esta entrega. Debes cancelar la transacción.
              </span>
            </div>
          )}

          {/* --- BOTONES DE ACCIÓN --- */}
          <div className={`flex flex-col sm:flex-row gap-3 ${litrosInsuficientes ? 'mt-4' : 'mt-10'}`}>
            
            <button 
              onClick={onClose}
              className="px-6 py-4 border border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer bg-transparent"
            >
              Cerrar
            </button>

            {/* Solo aparece si tu rol implica entregar agua */}
            {entregoAgua && (
              <button 
                onClick={() => onCancelar(transaccion.id)}
                className="flex-1 px-6 py-4 border border-rose-200 text-rose-600 bg-rose-50 font-bold rounded-2xl hover:bg-rose-100 transition-all cursor-pointer"
              >
                Cancelar transacción
              </button>
            )}

            <button 
              onClick={() => onConfirmar(transaccion.id)}
              disabled={litrosInsuficientes}
              className={`flex-[2] px-6 py-4 font-bold rounded-2xl transition-all ${
                litrosInsuficientes 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' // Estilo apagado si no hay litros
                  : 'bg-gradient-to-r from-[#0066ff] to-[#00b8ff] text-white shadow-[0_12px_28px_rgba(0,102,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              }`}
            >
              Confirmar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TransaccionSeleccionadaModal;