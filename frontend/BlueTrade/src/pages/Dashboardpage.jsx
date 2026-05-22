import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavbarDashboard from '../components/NavbarDashboard';
import PanelMisOfertas from '../components/PanelMisOfertas';
import ModalCrearOferta from "../components/ModalCrearOferta";
import ModalGestionarOferta from "../components/ModalGestionarOferta";

import { getServicios, getOfertas } from '../api/item.api';
import '../styles/RegisterPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  
  const [isModerator] = useState(true);
  const [saldoLitros] = useState(3250);
  const [serviciosDB, setServiciosDB] = useState([]);
  const [ofertasActivas, setOfertasActivas] = useState([]); 

  // 🆕 Estados para controlar los modales separados
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [ofertaParaGestionar, setOfertaParaGestionar] = useState(null);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        const respuestaServicios = await getServicios();
        setServiciosDB(respuestaServicios.data);
        
        const respuestaOfertas = await getOfertas();
        const deUsuarioYActivas = respuestaOfertas.data.filter(oferta => 
          oferta.usuario === usuario?.id && oferta.estado === 'ACTIVO'
        );
        setOfertasActivas(deUsuarioYActivas);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    if (usuario?.id) cargarDatosDashboard();
  }, [usuario]);

  const saldoWaterCoins = `W ${saldoLitros.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  function handleAccionDashboard(tipoAccion) {
    if (tipoAccion === 'crear') setIsModalCrearOpen(true);
    else if (tipoAccion === 'solicitudes') navigate('/solicitudes');
  }

  // 🆕 Callbacks para actualizar la lista sin recargar la página
  const handleOfertaCreada = (nuevaOferta) => {
    setOfertasActivas(prev => [nuevaOferta, ...prev]);
  };

  const handleOfertaActualizada = (ofertaEditada) => {
    setOfertasActivas(prev => 
      prev.map(oferta => oferta.id === ofertaEditada.id ? { ...oferta, ...ofertaEditada } : oferta)
    );
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
            
            {/* BOTÓN CREAR OFERTA */}
            <div className="flex flex-col items-center gap-2.5">
              <button onClick={() => handleAccionDashboard('crear')} className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white shadow-[0_8px_20px_rgba(15,95,237,0.24)] hover:shadow-[0_12px_24px_rgba(15,95,237,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group">
                <svg className="w-6 h-6 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <span className="text-[11px] font-bold text-[#102033] tracking-wide">Crear oferta</span>
            </div>

            {/* ... Resto de tu botonera (Recargar, Catálogo, Solicitudes) ... */}
            
          </div>
        </div>

        <div className="w-full">
          <PanelMisOfertas 
            ofertas={ofertasActivas}
            onGestionar={(oferta) => setOfertaParaGestionar(oferta)} // 🆕 Abre modal de gestionar
            onCrearNueva={() => setIsModalCrearOpen(true)}
          />
        </div>

      </div>

      {/* Renderizamos los modales separados */}
      <ModalCrearOferta 
        isOpen={isModalCrearOpen}
        onClose={() => setIsModalCrearOpen(false)}
        onSuccess={handleOfertaCreada}
        serviciosDB={serviciosDB}
        usuario={usuario}
      />

      <ModalGestionarOferta 
        isOpen={!!ofertaParaGestionar} // Se abre si hay un objeto en el estado
        oferta={ofertaParaGestionar}
        onClose={() => setOfertaParaGestionar(null)} // Cerramos limpiando el estado
        onSuccess={handleOfertaActualizada}
        serviciosDB={serviciosDB}
        usuario={usuario}
      />

    </div>
  );
}

export default DashboardPage;