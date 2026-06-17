import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NavbarDashboard from '../components/NavbarDashboard';
import PanelMisOfertas from '../components/PanelMisOfertas';
import ModalCrearOferta from "../components/ModalCrearOferta";
import ModalGestionarOferta from "../components/ModalGestionarOferta";
import Alerta from '../components/alerta'; // Asegúrate de que la ruta sea correcta

import { getServicios, getOfertas, recargarAgua } from '../api/item.api';
import '../styles/RegisterPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { usuario, obtenerPerfilActualizado } = useContext(AuthContext);

  // Estados de UI y Modales
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [isRecargaModalOpen, setIsRecargaModalOpen] = useState(false);
  const [ofertaParaGestionar, setOfertaParaGestionar] = useState(null);
  
  // Datos
  const [serviciosDB, setServiciosDB] = useState([]);
  const [serviciosInternos, setServiciosInternos] = useState([]);
  const [ofertasActivas, setOfertasActivas] = useState([]);
  const [cantidadRecarga, setCantidadRecarga] = useState('');
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  const [isModerator] = useState(true); // O lógica para detectar rol

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        const [respuestaServicios, respuestaOfertas] = await Promise.all([
          getServicios(),
          getOfertas()
        ]);
        
        setServiciosDB(respuestaServicios.data);
        setServiciosInternos(respuestaServicios.data.filter(s => !s.es_externo));
        
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

  // --- Manejadores de Acciones ---

  const handleAccionDashboard = (tipoAccion) => {
    switch (tipoAccion) {
      case 'crear': setIsModalCrearOpen(true); break;
      case 'recargar': setIsRecargaModalOpen(true); break;
      case 'catalogo': navigate('/ofertas'); break;
      default: break;
    }
  };

  const recargarLitros = async (e) => {
    e.preventDefault();
    try {
      let respuesta = await recargarAgua(usuario.id, cantidadRecarga);
      if (respuesta.status === 201 || respuesta.status === 200) {
        await obtenerPerfilActualizado(usuario.id);
        setAlerta({ mostrar: true, mensaje: "Recarga exitosa", tipo: "success" });
        setIsRecargaModalOpen(false);
        setCantidadRecarga('');
      }
    } catch (error) {
      setAlerta({ mostrar: true, mensaje: "Error al recargar", tipo: "error" });
    }
  };

  // Callbacks para mantener el estado sincronizado
  const handleOfertaCreada = (nuevaOferta) => {
    setOfertasActivas(prev => [nuevaOferta, ...prev]);
    setIsModalCrearOpen(false);
  };

  const handleOfertaActualizada = (ofertaEditada) => {
    setOfertasActivas(prev => 
      prev.map(oferta => oferta.id === ofertaEditada.id ? { ...oferta, ...ofertaEditada } : oferta)
    );
    setOfertaParaGestionar(null);
  };

  return (
    <div className="min-h-screen bg-[#f7fbff] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%),linear-gradient(135deg,#f7fbff_0%,#eef6ff_45%,#ffffff_100%)] text-[#102033] font-sans pb-16 relative">
      
      <NavbarDashboard paginaActiva="dashboard" />

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-10 flex flex-col items-center">
        
        {/* SECCIÓN DEL SALDO Y BOTONERA */}
        <div className="w-full max-w-[660px] bg-white border border-[#e2e8f0] p-8 rounded-[32px] shadow-[0_20px_50px_rgba(15,31,51,0.06)] mb-12 relative z-10 flex flex-col items-center">
          <div className="w-full flex flex-col items-center text-center mb-6">
            <h2 className="text-xs font-bold text-[#6a7b8f] uppercase tracking-wider mb-3">
              {usuario?.nombre} - Saldo Disponible
            </h2>
            <h1 className="text-5xl md:text-6xl font-black tracking-[-2.5px] text-[#102033]">
              {usuario?.litros_disponibles || 0} L
            </h1>
            <p className="text-xs font-semibold text-[#5d6f82] mt-4">Equivalente en litros y horas técnicas</p>
          </div>

          <hr className="w-full border-[#e2e8f0] mb-8" />

          {/* BOTONERA */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-11 w-full pb-2">
            
            {/* Crear */}
            <div className="flex flex-col items-center gap-2.5 cursor-pointer" onClick={() => handleAccionDashboard('crear')}>
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white shadow-[0_8px_20px_rgba(15,95,237,0.24)] hover:shadow-lg transition-all">
                <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </div>
              <span className="text-[11px] font-bold text-[#102033]">Crear oferta</span>
            </div>

            {/* Recargar */}
            <div className="flex flex-col items-center gap-2.5 cursor-pointer" onClick={() => handleAccionDashboard('recargar')}>
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-[#e2e8f0] hover:border-blue-400 text-[#3D4F6E] transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              </div>
              <span className="text-[11px] font-bold text-[#5d6f82]">Recargar</span>
            </div>

             {/* Catálogo */}
            <div className="flex flex-col items-center gap-2.5 cursor-pointer" onClick={() => handleAccionDashboard('catalogo')}>
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-[#e2e8f0] hover:border-blue-400 text-[#3D4F6E] transition-all">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h16.875c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375a1.125 1.125 0 0 1-1.125-1.125V7.125Z" /></svg>
              </div>
              <span className="text-[11px] font-bold text-[#5d6f82]">Catálogo</span>
            </div>

          </div>
        </div>

        <div className="w-full">
          <PanelMisOfertas 
            ofertas={ofertasActivas}
            onGestionar={(oferta) => setOfertaParaGestionar(oferta)}
            onCrearNueva={() => setIsModalCrearOpen(true)}
          />
        </div>
      </div>

      {/* --- Modales --- */}

      <ModalCrearOferta 
        isOpen={isModalCrearOpen}
        onClose={() => setIsModalCrearOpen(false)}
        onSuccess={handleOfertaCreada}
        serviciosDB={serviciosInternos}
        usuario={usuario}
      />

      <ModalGestionarOferta 
        isOpen={!!ofertaParaGestionar}
        oferta={ofertaParaGestionar}
        onClose={() => setOfertaParaGestionar(null)}
        onSuccess={handleOfertaActualizada}
        serviciosDB={serviciosInternos}
        usuario={usuario}
      />

      {/* Modal Recarga (Inline) */}
      {isRecargaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f33]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-[420px] shadow-xl">
             <h2 className="text-xl font-bold mb-4">Recargar Saldo</h2>
             <input type="number" value={cantidadRecarga} onChange={(e) => setCantidadRecarga(e.target.value)} className="w-full border p-3 rounded-lg mb-4" placeholder="Cantidad de litros" />
             <div className="flex gap-2">
                <button onClick={() => setIsRecargaModalOpen(false)} className="flex-1 py-2 bg-gray-100 rounded-full font-bold">Cancelar</button>
                <button onClick={recargarLitros} className="flex-1 py-2 bg-blue-600 text-white rounded-full font-bold">Confirmar</button>
             </div>
          </div>
        </div>
      )}

      {alerta.mostrar && (
        <Alerta 
          mensaje={alerta.mensaje} 
          tipo={alerta.tipo} 
          onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))} 
        />
      )}
    </div>
  );
}

export default DashboardPage;