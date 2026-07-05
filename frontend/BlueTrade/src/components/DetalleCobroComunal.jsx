import React, { useState, useEffect } from 'react';
// 1. IMPORTANTE: Agregamos getUsuario a las importaciones
import { obtenerCobroComunal, getUsuario } from '../api/item.api';

function DetalleCobroComunal({ id, onClose }) {
  const [cobro, setCobro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  
  // 2. NUEVO ESTADO: Para guardar el nombre del administrador
  const [nombreAdmin, setNombreAdmin] = useState("Cargando...");

  useEffect(() => {
    const cargarDetalleYAdmin = async () => {
      try {
        // A. Primero obtenemos el cobro
        const responseCobro = await obtenerCobroComunal(id);
        const datosCobro = responseCobro.data;
        setCobro(datosCobro);

        // B. Si el cobro tiene un ID de administrador, buscamos su nombre
        if (datosCobro.administrador) {
          try {
            const responseAdmin = await getUsuario(datosCobro.administrador);
            // Asumimos que la API devuelve el usuario y sacamos su 'nombre'
            setNombreAdmin(responseAdmin.data.nombre); 
          } catch (errorAdmin) {
            console.error("Error al obtener nombre del admin:", errorAdmin);
            // Si falla (ej. el admin fue borrado), mostramos su ID como respaldo
            setNombreAdmin(`ID: ${datosCobro.administrador}`); 
          }
        } else {
          setNombreAdmin("Sistema");
        }

      } catch (err) {
        console.error("Error al cargar el detalle del cobro:", err);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarDetalleYAdmin();
    }
  }, [id]);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha desconocida";
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-VE', opciones);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f33]/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-[0_30px_80px_rgba(20,70,140,0.3)] relative overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {cargando ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#5d6f82] font-bold">Cargando detalles del cobro...</p>
          </div>
        ) : error || !cobro ? (
          <div className="p-12 text-center">
            <h2 className="text-xl font-extrabold text-[#0f1f33] mb-2">Error de conexión</h2>
            <p className="text-[#5d6f82] mb-6">No se pudo cargar la información de este cobro.</p>
            <button onClick={onClose} className="bg-[#0066ff] text-white font-bold py-2 px-6 rounded-xl">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-[#0f1f33] to-[#1a365d] p-8 text-white flex justify-between items-start shrink-0">
              <div>
                <span className="bg-[#0066ff]/20 text-[#66a3ff] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-[#0066ff]/30">
                  Recibo Oficial
                </span>
                <h2 className="text-2xl font-black mt-3 mb-1">Cobro #{cobro.id}</h2>
                <p className="text-white/60 font-medium text-xs">{formatearFecha(cobro.fecha_creacion)}</p>
              </div>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-[11px] font-extrabold text-[#91a0b2] uppercase tracking-wider mb-1">Motivo del Cobro</h3>
                <p className="text-lg font-black text-[#0f1f33] leading-tight">{cobro.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#f3f8ff] p-4 rounded-2xl border border-[#dbe4ea]">
                  <span className="text-[10px] font-extrabold text-[#91a0b2] uppercase tracking-wider block mb-1">Monto Total</span>
                  <span className="text-2xl font-black text-[#102033]">{cobro.monto_total} L</span>
                </div>
                
                <div className="bg-[#f3f8ff] p-4 rounded-2xl border border-[#dbe4ea]">
                  <span className="text-[10px] font-extrabold text-[#91a0b2] uppercase tracking-wider block mb-1">Alícuota Aplicada</span>
                  <span className="text-2xl font-black text-[#0066ff]">
                    {Number(cobro.alicuota).toFixed(2)} L
                  </span>
                </div>
              </div>

              <div className="border-t border-[#dbe4ea] pt-5 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[11px] font-bold text-[#5d6f82] block mb-0.5">Comunidad Afectada</span>
                  <span className="text-[#102033] font-black text-sm">
                    {cobro.usuarios_involucrados} residentes activos
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#5d6f82] block mb-0.5">Administrador Emisor</span>
                  {/* 3. CAMBIO VISUAL: Mostramos el nombre en lugar del ID estático */}
                  <span className="text-[#102033] font-black text-sm">
                    {nombreAdmin}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DetalleCobroComunal;