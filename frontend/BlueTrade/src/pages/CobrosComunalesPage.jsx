// pages/CobrosComunalesPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Asegúrate de importar las funciones que creamos previamente
import { obtenerCobrosComunales } from '../api/item.api'; 

import NavbarDashboard from '../components/NavbarDashboard';
import ModalCobroComunal from '../components/ModalCobroComunal';
import DetalleCobroComunal from '../components/DetalleCobroComunal';
import Alerta from '../components/alerta';
// Si tienes un componente Modal para crear el cobro, impórtalo aquí
// import ModalCobroComunal from '../components/ModalCobroComunal';

function CobrosComunalesPage() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cobros, setCobros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  
  // Estado para controlar la apertura del modal de creación
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cobroSeleccionadoId, setCobroSeleccionadoId] = useState(null);

  const cargarHistorialCobros = async () => {
    setCargando(true);
    try {
      const response = await obtenerCobrosComunales();
      console.log("Cobros recibidos:", response.data);

      if (Array.isArray(response.data)) {
        setCobros(response.data);
      } else if (response.data && response.data.results) {
        setCobros(response.data.results);
      } else {
        setCobros([]);
      }
    } catch (error) {
      console.error("Error al obtener los cobros:", error);
      setAlerta({
        mostrar: true,
        mensaje: "No se pudo sincronizar el historial de cobros comunales.",
        tipo: "error"
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorialCobros();
  }, []);

  // Función para formatear fechas de manera legible
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha desconocida";
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

      <NavbarDashboard paginaActiva="cobros" />

      {alerta.mostrar && (
        <Alerta 
          mensaje={alerta.mensaje} 
          tipo={alerta.tipo} 
          onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))} 
        />
      )}

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-12 relative z-10">
        
        {/* Encabezado Principal y Botón de Acción */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white/86 border border-white/90 p-8 rounded-[32px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(20,70,140,0.18)]">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-2px] text-[#0f1f33] leading-none m-0">
              Gestión de <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">Cobros</span>
            </h1>
            <p className="text-[#5d6f82] mt-4 text-lg leading-relaxed max-w-2xl m-0">
              Administra los cobros comunales y los descuentos de litros de agua.
            </p>
          </div>
          
          {/* Botón para Crear Cobro (Solo visible si el usuario tiene permisos o si decides dejarlo público para admins) */}
          <button 
            onClick={() => setModalAbierto(true)}
            className="bg-gradient-to-r from-[#0066ff] to-[#0052cc] hover:from-[#0052cc] hover:to-[#0040a8] text-white font-extrabold py-3 px-8 rounded-full shadow-[0_10px_20px_rgba(0,102,255,0.3)] hover:shadow-[0_15px_30px_rgba(0,102,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Crear Cobro Comunal
          </button>
        </div>

        {/* Layout Información */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sección de Tarjetas de Cobros */}
          <section className="flex-grow w-full">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
              <div className="mb-8 border-b border-[#0066ff]/10 pb-6 flex justify-between items-center">
                <h3 className="text-2xl font-extrabold text-[#102033]">Historial de Cobros</h3>
                <p className="text-sm font-bold text-[#0066ff] bg-[#0066ff]/10 px-4 py-2 rounded-full inline-flex m-0">
                  {Array.isArray(cobros) ? cobros.length : 0} registros
                </p>
              </div>

              {cargando ? (
                <div className="text-center py-20 font-semibold text-[#5d6f82]">
                  <div className="w-6 h-6 border-2 border-[#0066ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Cargando historial de la base de datos...
                </div>
              ) : (!Array.isArray(cobros) || cobros.length === 0) ? (
                <div className="text-center py-20 text-[#637489] font-medium border-2 border-dashed border-[#0066ff]/20 rounded-2xl bg-slate-50/50">
                  No se han emitido cobros comunales aún.
                </div>
              ) : (
                /* Grid de Tarjetas de Cobros */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {cobros.map((cobro) => (
                    <div
                      key={cobro.id}
                      onClick={() => setCobroSeleccionadoId(cobro.id)}
                      className="bg-white border border-[#dbe4ea] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-[0_20px_40px_rgba(20,70,140,0.1)] transition-all duration-300"
                    >
                      {/* Cabecera Tarjeta: Descripción y Fecha */}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="overflow-hidden">
                          <h4 className="text-lg font-extrabold text-[#0f1f33] mb-1">
                            {cobro.descripcion}
                          </h4>
                          <span className="text-xs font-bold text-[#91a0b2] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            {formatearFecha(cobro.fecha_creacion)}
                          </span>
                        </div>
                        
                      </div>

                      {/* Cuerpo: Métricas Financieras / Litros */}
                      <div className="bg-[#f3f8ff] rounded-xl p-4 mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#91a0b2] uppercase tracking-wider block mb-1">Monto Total</span>
                          <span className="text-lg font-black text-[#102033]">{cobro.monto_total} L</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#91a0b2] uppercase tracking-wider block mb-1">Alícuota (Por vecino)</span>
                          <span className="text-lg font-black text-[#0066ff]">
                            {/* Mostramos el cálculo matemático que hace tu backend */}
                            {Number(cobro.alicuota).toFixed(2)} L
                          </span>
                        </div>
                      </div>

                      {/* Footer Tarjeta: Usuarios Afectados */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#eef6ff]">
                        <span className="text-xs font-bold text-[#5d6f82]">
                          Aplicado a <span className="text-[#102033] font-black">{cobro.usuarios_involucrados}</span> vecinos
                        </span>
                        <span className="text-[10px] font-bold text-[#91a0b2] uppercase">
                          ID: {cobro.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
      
      {/* Aquí renderizarías tu modal cuando lo crees. Ejemplo: */}
      {modalAbierto && (
        <ModalCobroComunal 
          onClose={() => setModalAbierto(false)} 
          onCobroCreado={() => {
            setModalAbierto(false);
            cargarHistorialCobros(); // Recarga la lista automáticamente
          }} 
        />
      )}
      {/* Renderizamos el modal de detalle solo si hay un cobro seleccionado */}
      {cobroSeleccionadoId && (
        <DetalleCobroComunal 
          id={cobroSeleccionadoId} 
          onClose={() => setCobroSeleccionadoId(null)} 
        />
      )}
    </div>
  );
}

export default CobrosComunalesPage;