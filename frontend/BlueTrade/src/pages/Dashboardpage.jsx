// DashboardPage.jsx
import { useState, useEffect, useContext } from 'react'; // 🆕 Añadido useEffect
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavbarDashboard from '../components/NavbarDashboard';
import PanelMisOfertas from '../components/PanelMisOfertas';

import { crearOferta, getServicios, getOfertas } from '../api/item.api';

// Importamos el archivo de estilos para heredar la tipografía y los cimientos de diseño
import '../styles/RegisterPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [isModerator] = useState(true);
  const [saldoLitros] = useState(3250);
  
  const { usuario, cerrarSesion } = useContext(AuthContext);
  
  // Estado para controlar la apertura y cierre de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🆕 Estado para almacenar los servicios reales provenientes de la base de datos
  const [serviciosDB, setServiciosDB] = useState([]);
  const [ofertasActivas, setOfertasActivas] = useState([]); // 🆕 Aquí se guardarán tus ofertas reales de la DB

  // Estado del formulario de la nueva oferta (Adaptado para control automático e invertido)
  const [formData, setFormData] = useState({
    tipoOfrecido: 'agua',
    cantidadOfrecida: '',
    categoriaOfrecidaServicio: '',
    cantidadSolicitada: '',
    categoriaSolicitadaServicio: '',
    descripcion: ''
  });

  // 🆕 EFECTO: Carga los servicios desde Supabase/Django al renderizar el Dashboard
  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        // 1. Cargar servicios comunitarios (Tu lógica que ya funcionaba)
        const respuestaServicios = await getServicios();
        setServiciosDB(respuestaServicios.data);
        
        if (respuestaServicios.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            categoriaOfrecidaServicio: respuestaServicios.data[0].nombre,
            categoriaSolicitadaServicio: respuestaServicios.data[0].nombre
          }));
        }

        // 2. 🆕 Cargar ofertas desde Django y filtrarlas en caliente
        const respuestaOfertas = await getOfertas();
        
        const deUsuarioYActivas = respuestaOfertas.data.filter(oferta => 
          oferta.usuario === usuario?.id && oferta.estado === 'ACTIVO'
        );
        
        // Guardamos el resultado filtrado en el estado
        setOfertasActivas(deUsuarioYActivas);

      } catch (error) {
        console.error("Error al cargar los datos en el Dashboard:", error);
      }
    };

    // Solo ejecuta la función si el usuario ya está cargado y autenticado en el sistema
    if (usuario?.id) {
      cargarDatosDashboard();
    }
  }, [usuario]);

  // 🔄 REGLA AUTOMÁTICA: Si cambia el tipo ofrecido, reseteamos las cantidades por seguridad
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipoOfrecido') {
      setFormData(prev => ({
        ...prev,
        tipoOfrecido: value,
        cantidadOfrecida: '',
        cantidadSolicitada: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 🧠 REGLA DE NEGOCIO: Determinar automáticamente el opuesto (Nunca similar por similar)
  const tipoSolicitadoCalculado = formData.tipoOfrecido === 'agua' ? 'servicio' : 'agua';

  const saldoWaterCoins = `W ${saldoLitros.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  function handleAccionDashboard(tipoAccion) {
    console.log(`Disparando acción desde la botonera: ${tipoAccion}`);
    if (tipoAccion === 'crear') {
      setIsModalOpen(true);
    } else if (tipoAccion === 'solicitudes') {
      navigate('/solicitudes');
    }
  }

  function handleGestionarOferta(oferta) {
    console.log('Gestionando oferta específica:', oferta.id);
  }

  const handleSubmitOferta = async (e) => {
    e.preventDefault();
    
    // 1. Estructuramos los datos adaptándolos al formato exacto de Django (OfertaSerializer)
    const payload = {
      usuario: usuario?.id,
      tipo_ofrecido: formData.tipoOfrecido.toUpperCase(), // 'AGUA' o 'SERVICIO'
      descripcion: formData.descripcion,
      
      // Si ofrece agua, mandamos su valor numérico; si ofrece servicio mandamos sus horas estimadas.
      cantidad_ofrecida: parseFloat(formData.cantidadOfrecida),
      categoria_ofrecida: formData.tipoOfrecido === 'servicio' ? formData.categoriaOfrecidaServicio : null,

      // Se inyecta la determinación cruzada e inteligente calculada en el Frontend
      tipo_solicitado: tipoSolicitadoCalculado.toUpperCase(),
      
      cantidad_solicitada: parseFloat(formData.cantidadSolicitada),
      categoria_solicitada: tipoSolicitadoCalculado === 'servicio' ? formData.categoriaSolicitadaServicio : null
    };

    try {
      console.log("Enviando payload a Django:", payload);
      
      // 2. Consumimos el endpoint mediante axios
      const respuesta = await crearOferta(payload);
      
      if (respuesta.status === 201) {
        alert("¡Oferta publicada exitosamente en la cartelera comunitaria!");
        setIsModalOpen(false); 
        
        // 3. Reseteamos el formulario a su estado inicial limpio utilizando la base de datos
        setFormData({
          tipoOfrecido: 'agua',
          cantidadOfrecida: '',
          categoriaOfrecidaServicio: serviciosDB[0]?.nombre || '',
          cantidadSolicitada: '',
          categoriaSolicitadaServicio: serviciosDB[0]?.nombre || '',
          descripcion: ''
        });
      }
    } catch (error) {
      console.error("Error al publicar la oferta:", error);
      alert(error.response?.data?.detail || "Hubo un error al intentar registrar tu intercambio. Por favor, verifica.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbff] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%),linear-gradient(135deg,#f7fbff_0%,#eef6ff_45%,#ffffff_100%)] text-[#102033] font-sans pb-16 relative">
      
      <NavbarDashboard paginaActiva="dashboard" />

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-10 flex flex-col items-center">
        
        {/* SECCIÓN DEL SALDO Y BOTONERA */}
        <div className="w-full max-w-[660px] bg-white border border-[#e2e8f0] p-8 rounded-[32px] shadow-[0_20px_50px_rgba(15,31,51,0.06)] mb-12 relative z-10 flex flex-col items-center">
          <div className="w-full flex flex-col items-center text-center relative overflow-hidden group mb-6">
            <div className="relative z-10 flex flex-col items-center w-full">
              <h2 className="text-xs font-bold text-[#6a7b8f] uppercase tracking-wider m-0 mb-3">
                {usuario?.nombre} - Saldo Disponible
              </h2>
              <h1 className="text-5xl md:text-6xl font-black tracking-[-2.5px] text-[#102033] m-0 leading-none select-none">
                {saldoWaterCoins}
              </h1>
              <p className="text-xs font-semibold text-[#5d6f82] mt-4 mb-0 tracking-wide">
                Equivalente en litros y horas técnicas de la comunidad
              </p>
            </div>
          </div>

          <hr className="w-full border-[#e2e8f0] m-0 mb-8" />

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-11 w-full pb-2">
            <div className="flex flex-col items-center gap-2.5">
              <button 
                onClick={() => handleAccionDashboard('crear')}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white shadow-[0_8px_20px_rgba(15,95,237,0.24)] hover:shadow-[0_12px_24px_rgba(15,95,237,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
              >
                <svg className="w-6 h-6 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <span className="text-[11px] font-bold text-[#102033] tracking-wide">Crear oferta</span>
            </div>

            <div className="flex flex-col items-center gap-2.5">
              <button 
                onClick={() => handleAccionDashboard('recargar')}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-[#e2e8f0] text-[#3D4F6E] shadow-sm hover:border-[#0066ff]/30 hover:text-[#0066ff] hover:bg-[#f3f8ff] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
              <span className="text-[11px] font-bold text-[#5d6f82] tracking-wide">Recargar</span>
            </div>

            <div className="flex flex-col items-center gap-2.5">
              <button 
                onClick={() => handleAccionDashboard('catalogo')}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-[#e2e8f0] text-[#3D4F6E] shadow-sm hover:border-[#0066ff]/30 hover:text-[#0066ff] hover:bg-[#f3f8ff] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h16.875c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375a1.125 1.125 0 0 1-1.125-1.125V7.125Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M5.625 13.5h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm3-2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Z" />
                </svg>
              </button>
              <span className="text-[11px] font-bold text-[#5d6f82] tracking-wide">Catálogo</span>
            </div>

            {isModerator && (
              <div className="flex flex-col items-center gap-2.5">
                <button 
                  onClick={() => handleAccionDashboard('solicitudes')}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-[#e2e8f0] text-[#3D4F6E] shadow-sm hover:border-amber-500/40 hover:text-amber-600 hover:bg-amber-500/5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 9h.008v.008H9V9Zm0 3h.008v.008H9V12Zm0 3h.008v.008H9V15Zm0-6h3.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
                <span className="text-[11px] font-bold text-[#5d6f82] tracking-wide">Solicitudes</span>
              </div>
            )}
          </div>
        </div>

        {/* LISTADO DE OFERTAS */}
        <div className="w-full">
          <PanelMisOfertas 
            ofertas={ofertasActivas}
            onGestionar={handleGestionarOferta}
            onCrearNueva={() => setIsModalOpen(true)}
          />
        </div>

      </div>

      {/* =========================================================================
          VENTANA MODAL REFACTORIZADA 100% CON CLASES DE TAILWIND
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f33]/40 backdrop-blur-sm overflow-y-auto">
          
          <div className="bg-white/95 backdrop-blur-[18px] border border-gray-100 rounded-[28px] shadow-[0_30px_70px_rgba(20,70,140,0.22)] w-full max-w-[560px] relative max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header de la Modal */}
            <div className="p-6 md:p-7 border-b border-gray-50 relative text-left shrink-0">
              <h2 className="text-xl font-bold text-[#102033] tracking-tight m-0">Crear nueva oferta</h2>
              <p className="text-xs text-[#637489] m-0 mt-1 leading-relaxed">
                Define los recursos para publicarlos en la cartelera comunitaria de intercambio.
              </p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#91a0b2] hover:bg-[#f7fbff] hover:text-[#102033] transition-colors cursor-pointer border-none bg-transparent font-medium text-base"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form className="p-6 md:p-7 overflow-y-auto flex flex-col gap-5" onSubmit={handleSubmitOferta}>
              
              {/* BLOQUE TAILWIND 1: OFRECE (Fondo #f8fafc + indicador lateral azul) */}
              <div className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] bg-[#f8fafc] relative w-full box-border text-left">
                {/* Línea decorativa azul */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5b8cff] opacity-80 rounded-l-[18px]" />
                
                {/* Encabezado de sección interna */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base leading-none">
                    {formData.tipoOfrecido === 'agua' ? '💧' : '🔧'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Ofrece
                  </span>
                </div>

                {/* Campos del input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[#102033] font-bold text-13px">Tipo de recurso</label>
                    <select 
                      name="tipoOfrecido"
                      value={formData.tipoOfrecido}
                      onChange={handleInputChange}
                      className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="agua">Agua (Litros)</option>
                      <option value="servicio">Servicio Técnico</option>
                    </select>
                  </div>

                  {formData.tipoOfrecido === 'agua' ? (
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-[#102033] font-bold text-13px">Cantidad (Litros)</label>
                      <input 
                        type="number"
                        name="cantidadOfrecida"
                        placeholder="Ej. 1000"
                        value={formData.cantidadOfrecida}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-[#102033] font-bold text-13px">Categoría (Desde BD)</label>
                      <select 
                        name="categoriaOfrecidaServicio"
                        value={formData.categoriaOfrecidaServicio}
                        onChange={handleInputChange}
                        className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                      >
                        {serviciosDB.map(s => (
                          <option key={s.id} value={s.nombre}>{s.nombre}</option>
                        ))}
                      </select>
                      {/* Solicitud de horas agregada de forma compacta */}
                      <label className="text-[#102033] font-bold text-13px mt-2">Horas Técnicas Estimadas</label>
                      <input 
                        type="number"
                        name="cantidadOfrecida"
                        placeholder="Ej. 4"
                        value={formData.cantidadOfrecida}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Separador de flujo */}
              <div className="flex justify-center -my-2 shrink-0">
                <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm text-xs font-bold">
                  ↓
                </div>
              </div>

              {/* BLOQUE TAILWIND 2: A CAMBIO DE (Fondo #fdf8f4 + indicador lateral naranja + 🆕 BLOQUEADO DE FORMA CRUZADA) */}
              <div className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] bg-[#fdf8f4] relative w-full box-border text-left">
                {/* Línea decorativa naranja */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ffb443] opacity-80 rounded-l-[18px]" />
                
                {/* Encabezado de sección interna */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base leading-none">
                    {tipoSolicitadoCalculado === 'agua' ? '💧' : '🔧'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    A cambio de
                  </span>
                </div>

                {/* Campos del input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[#102033] font-bold text-13px">Recurso solicitado</label>
                    {/* Se reemplaza el select manual por un campo informativo inmutable */}
                    <input 
                      type="text"
                      value={tipoSolicitadoCalculado === 'agua' ? "Agua (Litros)" : "Servicio Técnico"}
                      disabled
                      className="w-full border border-gray-100 bg-gray-100/70 rounded-[14px] py-2.5 px-3.5 text-sm text-[#5d6f82] font-semibold outline-none box-border font-inherit cursor-not-allowed"
                    />
                  </div>

                  {tipoSolicitadoCalculado === 'agua' ? (
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-[#102033] font-bold text-13px">Cantidad (Litros)</label>
                      <input 
                        type="number"
                        name="cantidadSolicitada"
                        placeholder="Ej. 800"
                        value={formData.cantidadSolicitada}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-[#102033] font-bold text-13px">Categoría (Desde BD)</label>
                      <select 
                        name="categoriaSolicitadaServicio"
                        value={formData.categoriaSolicitadaServicio}
                        onChange={handleInputChange}
                        className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                      >
                        {serviciosDB.map(s => (
                          <option key={s.id} value={s.nombre}>{s.nombre}</option>
                        ))}
                      </select>
                      {/* Solicitud de horas requeridas de forma compacta */}
                      <label className="text-[#102033] font-bold text-13px mt-2">Horas Requeridas</label>
                      <input 
                        type="number"
                        name="cantidadSolicitada"
                        placeholder="Ej. 3"
                        value={formData.cantidadSolicitada}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Textarea Observaciones */}
              <div className="flex flex-col gap-1.5 w-full text-left">
                <label className="text-[#102033] font-bold text-13px">Notas u observaciones adicionales (Opcional)</label>
                <textarea 
                  name="descripcion"
                  rows="2"
                  placeholder="Detalla especificaciones de horarios, urgencias o condiciones..."
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>

              {/* Aviso Informativo (Inyectando clase de RegisterPage) */}
              <div className="register-approval-notice !p-3.5 !rounded-xl text-xs text-left">
                <strong>Importante:</strong> al publicar la oferta, estará disponible inmediatamente para que otros miembros de la urbanización la visualicen e inicien la transacción.
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="border border-[rgba(0,102,255,0.14)] cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-[#5d6f82] bg-[#f7fbff] transition-all hover:bg-[#eef6ff] hover:-translate-y-0.5"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="border-none cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-[#0066ff] to-[#00b8ff] shadow-[0_10px_22px_rgba(0,102,255,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,102,255,0.28)] sm:col-span-2"
                >
                  Publicar oferta de intercambio
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardPage;