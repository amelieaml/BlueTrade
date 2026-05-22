import { useState, useMemo, useEffect, useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import { getOfertas, getServicios } from '../api/item.api'; // 🆕 Agregamos getServicios
import NavbarDashboard from '../components/NavbarDashboard';
import TarjetaMiOferta from '../components/TarjetaMiOferta';
import ModalGestionarOferta from '../components/ModalGestionarOferta'; // 🆕 Cambiamos el modal

function MisOfertasPage() {
  const { usuario } = useContext(AuthContext);
  const [ofertas, setOfertas] = useState([]);
  const [serviciosDB, setServiciosDB] = useState([]); // 🆕 Estado para guardar las categorías
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 🆕 Cargamos tanto las ofertas como los servicios al mismo tiempo
        const [responseOfertas, responseServicios] = await Promise.all([
          getOfertas(),
          getServicios()
        ]);
        
        setOfertas(responseOfertas.data);
        setServiciosDB(responseServicios.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    
    if (usuario?.id) {
      cargarDatos();
    }
  }, [usuario]);

  const handleGestionar = (oferta) => setOfertaSeleccionada(oferta);
  const handleCerrarModal = () => setOfertaSeleccionada(null);

  // 🆕 Función para que la lista se actualice visualmente cuando editas algo en el modal
  const handleOfertaActualizada = (ofertaEditada) => {
    setOfertas(prev => 
      prev.map(oferta => oferta.id === ofertaEditada.id ? { ...oferta, ...ofertaEditada } : oferta)
    );
  };

  // Lógica: Filtramos para mostrar SOLO las del usuario
  const misOfertas = useMemo(() => {
    if (!usuario?.id) return [];
    return ofertas.filter((o) => o.usuario === usuario.id);
  }, [ofertas, usuario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16">
      <NavbarDashboard paginaActiva="mis-ofertas" />
      
      {/* 🆕 Renderizamos el nuevo modal pasándole todos los props que necesita */}
      <ModalGestionarOferta
        isOpen={!!ofertaSeleccionada}
        onClose={handleCerrarModal}
        onSuccess={handleOfertaActualizada}
        serviciosDB={serviciosDB}
        usuario={usuario}
        oferta={ofertaSeleccionada}
      />
      
      <div className="max-w-[1000px] mx-auto px-6 pt-12">
        <div className="mb-12 bg-white/86 border border-white/90 p-8 rounded-[32px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(20,70,140,0.18)]">
          <h1 className="text-4xl font-extrabold tracking-[-2px] text-[#0f1f33] m-0">
            Mis <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">ofertas</span>
          </h1>
          <p className="text-[#5d6f82] mt-2 text-lg">
            Historial de todos tus intercambios publicados.
          </p>
        </div>

        <section className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
          <div className="mb-8 border-b border-[#0066ff]/10 pb-6 flex justify-between items-center">
            <h3 className="text-2xl font-extrabold text-[#102033]">Mis publicaciones</h3>
            <p className="text-sm font-bold text-[#0066ff] bg-[#0066ff]/10 px-4 py-2 rounded-full">
              {misOfertas.length} publicadas
            </p>
          </div>

          {misOfertas.length === 0 ? (
            <div className="text-center py-20 text-[#637489]">Aún no has publicado ninguna oferta.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {misOfertas.map((oferta) => (
                <TarjetaMiOferta 
                  key={oferta.id} 
                  oferta={oferta} 
                  onGestionar={handleGestionar} 
                />
              ))}
              
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default MisOfertasPage;