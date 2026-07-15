// pages/Solicitudes.jsx
import { useState, useEffect } from 'react';
import NavbarDashboard from '../components/NavbarDashboard';
import alerta from '../components/alerta'; 

const SOLICITUDES_MOCK = [
  {
    id: "SOL-101",
    nombre: "Carlos Gonzalez",
    codigoCasa: "A-12",
    intencion_agua: true,
    intencion_servicio: true,
    email: "carlos.g@correo.com",
    fecha: "Hoy, 10:30 AM"
  },
  {
    id: "SOL-102",
    nombre: "Elena Rodriguez",
    codigoCasa: "Torre 3 - 4B",
    intencion_agua: true,
    intencion_servicio: false,
    email: "elena.rod@correo.com",
    fecha: "Ayer, 04:15 PM"
  },
  {
    id: "SOL-103",
    nombre: "Marcos Peña",
    codigoCasa: "C-05",
    intencion_agua: false,
    intencion_servicio: true,
    email: "m.pena@correo.com",
    fecha: "15 Feb 2026"
  }
];

function SolicitudesPage() {
  const [solicitudes] = useState(SOLICITUDES_MOCK);
  const [filtroActivo, setFiltroActivo] = useState('todas');
  
  // Estado para controlar la animación de desvanecimiento al cambiar de filtro
  const [isAnimate, setIsAnimate] = useState(true);

  // Estados para controlar la modal de comentarios de corrección
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [comentarioCorreccion, setComentarioCorreccion] = useState('');
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });

  // Efecto para disparar la animación cada vez que cambia el filtro
  useEffect(() => {
    setIsAnimate(false);
    const timer = setTimeout(() => setIsAnimate(true), 40); // Pequeño delay para reiniciar la transición
    return () => clearTimeout(timer);
  }, [filtroActivo]);

  function handleAccionDirecta(id, tipo) {
    console.log(`Acción ${tipo} procesada para la solicitud ${id}`);
    setAlerta({
          mostrar: true,
          mensaje: `Solicitud ${id}: Cambiada a estado [${tipo.toUpperCase()}]`,
          tipo: "error"
        });
  }

  function handleAbrirCorreccion(id) {
    setSelectedSolicitudId(id);
    setComentarioCorreccion('');
    setIsCommentModalOpen(true);
  }

  const handleEnviarCorreccion = (e) => {
    e.preventDefault();
    setAlerta({
      mostrar: true,
      mensaje: `Corrección enviada para la solicitud ${selectedSolicitudId} con éxito.`,
      tipo: "error"
    });
    setIsCommentModalOpen(false);
    setSelectedSolicitudId(null);
    setComentarioCorreccion('');
  };

  const solicitudesFiltradas = solicitudes.filter((sol) => {
    if (filtroActivo === 'agua') return sol.intencion_agua;
    if (filtroActivo === 'servicio') return sol.intencion_servicio;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7fbff] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%),linear-gradient(135deg,#f7fbff_0%,#eef6ff_45%,#ffffff_100%)] text-[#102033] font-sans pb-20 relative overflow-x-hidden">
      
      <NavbarDashboard paginaActiva="solicitudes" />
      {alerta.mostrar && (
        <Alerta 
          mensaje={alerta.mensaje} 
          tipo={alerta.tipo} 
          onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))} 
        />
      )}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-10 relative z-10">
        
        {/* HEADER DE SECCIÓN */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-black tracking-[-1.5px] text-[#102033] m-0">
              Gestión de <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">Accesos</span>
            </h1>
            <p className="text-[#5d6f82] font-medium mt-2">
              Revisa y valida los perfiles de los nuevos integrantes de la urbanización.
            </p>
          </div>
          
          <div className="bg-white/80 border border-[#0066ff]/10 px-6 py-3 rounded-2xl shadow-sm backdrop-blur-md">
            <span className="text-xs font-bold text-[#6a7b8f] uppercase tracking-widest block mb-1">Pendientes de revisión</span>
            <span className="text-2xl font-black text-[#0066ff]">{solicitudesFiltradas.length} Solicitudes</span>
          </div>
        </div>

        {/* BOTONERA DE FILTROS (TABS) */}
        <div className="flex items-center gap-2 mb-6 bg-white/60 p-1.5 rounded-2xl border border-gray-100 max-w-max backdrop-blur-sm shadow-sm">
          <button
            onClick={() => setFiltroActivo('todas')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ease-out cursor-pointer border-none ${
              filtroActivo === 'todas'
                ? 'bg-[#102033] text-white shadow-md scale-105'
                : 'text-[#5d6f82] hover:bg-gray-100 hover:text-[#102033]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroActivo('agua')}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ease-out cursor-pointer border-none ${
              filtroActivo === 'agua'
                ? 'bg-[#0066ff] text-white shadow-md shadow-blue-500/20 scale-105'
                : 'text-[#5d6f82] hover:bg-[#f0f7ff] hover:text-[#0066ff]'
            }`}
          >
            <span>💧</span> Solo Agua
          </button>
          <button
            onClick={() => setFiltroActivo('servicio')}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ease-out cursor-pointer border-none ${
              filtroActivo === 'servicio'
                ? 'bg-[#ffb443] text-[#5c3e08] shadow-md shadow-amber-500/20 scale-105'
                : 'text-[#5d6f82] hover:bg-[#fef9f0] hover:text-[#b47d2b]'
            }`}
          >
            <span>🔧</span> Solo Servicio
          </button>
        </div>

        {/* CONTENEDOR DE TABLA CON SCROLLBAR HORIZONTAL Y TRANSICIÓN DE ENTRADA */}
        <div className="w-full overflow-x-auto rounded-[28px] pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200">
          <div className="min-w-[1000px] flex flex-col gap-4">
            
            {/* ENCABEZADO DE LA TABLA (DIV ESTILIZADO) */}
            <div className="grid grid-cols-12 px-8 py-4 bg-white/70 border border-white rounded-[20px] shadow-[0_4px_20px_rgba(20,70,140,0.02)] text-[11px] font-black uppercase tracking-[2px] text-[#637489] backdrop-blur-md">
              <div className="col-span-4 text-left">Usuario y Propiedad</div>
              <div className="col-span-3 text-center">Intención del sistema</div>
              <div className="col-span-2 text-center">Documentación</div>
              <div className="col-span-3 text-right pr-4">Decisión del Moderador</div>
            </div>

            {/* CONTENEDOR ANMADO DE LAS FILAS */}
            <div className={`flex flex-col gap-4 transition-all duration-500 ease-out ${
              isAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              
              {solicitudesFiltradas.map((sol) => (
                <div 
                  key={sol.id}
                  className="grid grid-cols-12 items-center bg-white/90 border border-white rounded-[26px] p-5 px-8 shadow-[0_10px_35px_rgba(20,70,140,0.06)] hover:shadow-[0_18px_50px_rgba(20,70,140,0.14)] hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                >
                  
                  {/* COL 1: PERFIL */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f0f7ff] to-[#e1efff] border border-[#0066ff]/10 flex items-center justify-center text-[#0066ff] font-bold text-lg shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105">
                      {sol.nombre.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h3 className="text-[16px] font-black text-[#102033] m-0">{sol.nombre}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md uppercase tracking-wider">
                          Casa {sol.codigoCasa}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400">{sol.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* COL 2: INTENCIÓN */}
                  <div className="col-span-3 flex justify-center gap-2">
                    {sol.intencion_agua && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f7ff] border border-[#5b8cff]/10 rounded-xl text-[#0066ff] transition-all duration-200">
                        <span className="text-sm">💧</span>
                        <span className="text-[11px] font-bold uppercase tracking-tight">Agua</span>
                      </div>
                    )}
                    {sol.intencion_servicio && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fef9f0] border border-[#ffb443]/10 rounded-xl text-[#b47d2b] transition-all duration-200">
                        <span className="text-sm">🔧</span>
                        <span className="text-[11px] font-bold uppercase tracking-tight">Servicio</span>
                      </div>
                    )}
                  </div>

                  {/* COL 3: DOCUMENTACIÓN */}
                  <div className="col-span-2 flex justify-center">
                    {sol.intencion_servicio ? (
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[#3D4F6E] hover:bg-gray-50 hover:text-[#0066ff] transition-all duration-200 cursor-pointer shadow-sm">
                        <svg className="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span className="text-xs font-bold">Ver Certificado</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400 italic transition-opacity duration-300 animate-fade-in">
                        No requiere
                      </span>
                    )}
                  </div>

                  {/* COL 4: ACCIONES */}
                  <div className="col-span-3 flex justify-end gap-2">
                    <button 
                      onClick={() => handleAbrirCorreccion(sol.id)}
                      title="Pedir correcciones"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-200 cursor-pointer border border-amber-100/70 hover:scale-105"
                    >
                      <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>

                    <button 
                      onClick={() => handleAccionDirecta(sol.id, 'rechazar')}
                      title="Rechazar solicitud"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all duration-200 cursor-pointer border border-rose-100/70 hover:scale-105"
                    >
                      <svg className="w-5 h-5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <button 
                      onClick={() => handleAccionDirecta(sol.id, 'probar')}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-xs shadow-[0_8px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-none"
                    >
                      <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Aprobar
                    </button>
                  </div>

                </div>
              ))}

            </div>

            {/* MENSAJE VACÍO CON ANIMACIÓN DE ENTRADA SUAVE */}
            {solicitudesFiltradas.length === 0 && (
              <div className={`bg-white/50 border-2 border-dashed border-gray-200 rounded-[32px] p-16 text-center transition-all duration-500 ${
                isAnimate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <span className="text-3xl mb-3 block animate-bounce">🔍</span>
                <h3 className="text-[#102033] font-black m-0">No hay solicitudes bajo este filtro</h3>
                <p className="text-gray-400 mt-2 text-sm">Prueba seleccionando otra categoría en la botonera.</p>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL DE COMENTARIOS PARA CORRECCIÓN (TRANSICIÓN CON BACKDROP BLUR)
          ========================================================================= */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f33]/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white/95 backdrop-blur-[18px] border border-gray-100 rounded-[28px] shadow-[0_30px_70px_rgba(20,70,140,0.22)] w-full max-w-[520px] relative flex flex-col overflow-hidden animate-fade-in-up">
            
            <div className="p-6 md:p-7 border-b border-gray-50 relative text-left shrink-0">
              <h2 className="text-xl font-bold text-[#102033] tracking-tight m-0">Solicitar Correcciones</h2>
              <p className="text-xs text-[#637489] m-0 mt-1 leading-relaxed">
                Indica detalladamente al propietario qué datos o archivos debe enmendar para ser aprobado.
              </p>
              <button 
                onClick={() => setIsCommentModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#91a0b2] hover:bg-[#f7fbff] hover:text-[#102033] transition-colors cursor-pointer border-none bg-transparent font-medium text-base"
              >
                ✕
              </button>
            </div>

            <form className="p-6 md:p-7 flex flex-col gap-5" onSubmit={handleEnviarCorreccion}>
              <div className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] bg-[#fdf8f4] relative w-full box-border text-left">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ffb443] opacity-80 rounded-l-[18px]" />
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base leading-none">📝</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Observaciones para {selectedSolicitudId}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-xs">Mensaje de corrección</label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="Ej: El comprobante técnico cargado está borroso. Por favor, sube una foto nítida..."
                    value={comentarioCorreccion}
                    onChange={(e) => setComentarioCorreccion(e.target.value)}
                    className="w-full border border-blue-500/10 bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none transition-all focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/5 resize-none font-sans leading-relaxed"
                  />
                </div>
              </div>

              <div className="register-approval-notice !p-3.5 !rounded-xl text-xs text-left">
                <strong>Nota:</strong> Este comentario se le notificará al usuario de inmediato y su estado pasará a ser "En corrección".
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsCommentModalOpen(false)}
                  className="border border-blue-500/10 cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-[#5d6f82] bg-[#f7fbff] transition-all hover:bg-[#eef6ff] hover:-translate-y-0.5"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="border-none cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_10px_22px_rgba(245,158,11,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(245,158,11,0.3)] sm:col-span-2"
                >
                  Enviar a revisión
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default SolicitudesPage;