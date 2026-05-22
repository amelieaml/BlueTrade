import { useState, useMemo, useEffect, useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import { getOfertas, getServicios, iniciarTransaccion, actualizarOferta } from '../api/item.api'; 

import NavbarDashboard from '../components/NavbarDashboard';
import FiltroOfertas from '../components/FiltroOfertas';
import FiltroTags from '../components/FiltroTags';
import TarjetaOferta from '../components/TarjetaOferta';
import ModalDetalleOferta from '../components/ModalDetalleOferta'; 
import ModalCrearOferta from '../components/ModalCrearOferta'; 
import Alerta from '../components/alerta';

function OfertasPage() {
  const { usuario } = useContext(AuthContext);
  
  // Estados de datos
  const [ofertas, setOfertas] = useState([]);
  const [serviciosDB, setServiciosDB] = useState([]);
  
  // Estados de UI y Filtros
  const [filtros, setFiltros] = useState({ tipoBuscado: '', cantidadMinima: 0 });
  const [busqueda, setBusqueda] = useState('');
  const [tagActivo, setTagActivo] = useState('');
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });

  // Carga inicial de datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resOfertas, resServicios] = await Promise.all([
          getOfertas(),
          getServicios()
        ]);
        setOfertas(resOfertas.data);
        setServiciosDB(resServicios.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  // Manejadores de eventos
  const handleVerDetalle = (oferta) => setOfertaSeleccionada(oferta);
  const handleCerrarModal = () => setOfertaSeleccionada(null);
  
  const handleConfirmar = async () => {
    if (!ofertaSeleccionada || !usuario) return;
    console.log("Oferta seleccionada para confirmar:", ofertaSeleccionada);
    
    const tipoSolicitado = ofertaSeleccionada.tipo_solicitado?.toUpperCase();

    // 2. Validamos si es agua y si el usuario NO tiene suficiente
    if (tipoSolicitado === 'AGUA' && ofertaSeleccionada.cantidad_solicitada > usuario.litros) {
        setAlerta({
            mostrar: true,
            mensaje: 'No tienes suficientes litros para confirmar esta oferta.',
            tipo: 'error'
        });
        handleCerrarModal();
        return; // Detenemos la ejecución aquí, no iniciará la transacción
    }

    try {
        // CORRECCIÓN: El segundo parámetro debe ser el dueño de la oferta (vendedor), NO el usuario logueado (comprador)
        const aux = await iniciarTransaccion(ofertaSeleccionada.id, ofertaSeleccionada.usuario, usuario.id);
        console.log("Transacción iniciada:", aux.data);

        // 2. Reutilizamos tu función para cambiar el estado de la oferta
        await actualizarOferta(ofertaSeleccionada.id, {
            estado: 'EN_PROCESO' // O el estado que utilices en tu modelo
        });

        setAlerta({ 
          mostrar: true, 
          mensaje: 'Transacción iniciada correctamente.', 
          tipo: 'success' 
        });

        // Opcional: Remueve la oferta de la lista local para que ya no aparezca disponible
        setOfertas((prev) => prev.filter((o) => o.id !== ofertaSeleccionada.id));
       

    } catch (error) {
      console.error("Error al iniciar transacción:", error);
      setAlerta({ 
        mostrar: true, 
        mensaje: error.response?.data?.error || 'Ocurrió un error al intentar iniciar la transacción.', 
        tipo: 'error' 
      });
    } finally {
      handleCerrarModal();
    }
  };

  const handleOfertaCreada = (nuevaOferta) => {
    setOfertas((prev) => [nuevaOferta, ...prev]);
    setAlerta({ mostrar: true, mensaje: '¡Oferta publicada con éxito!', tipo: 'success' });
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  // Memoización de categorías basadas en la BD
  const categoriesDisponibles = useMemo(() => {
    return serviciosDB.map((s) => s.nombre);
  }, [serviciosDB]);

  // Lógica de filtrado
  const ofertasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase();
    
    return ofertas.filter((o) => {
      if (o.estado !== 'ACTIVO') return false;

      // Ocultar ofertas propias
      if (usuario?.id && o.usuario === usuario.id) return false;

      // Filtro de texto
      const textoBusqueda = `${o.usuario_nombre} ${o.descripcion} ${o.categoria_ofrecida} ${o.categoria_solicitada}`.toLowerCase();
      if (q && !textoBusqueda.includes(q)) return false;

      // Filtro de tipo (Agua/Servicio)
      if (filtros.tipoBuscado && o.tipo_ofrecido?.toLowerCase() !== filtros.tipoBuscado.toLowerCase()) return false;

      // Filtro de cantidad
      if (filtros.cantidadMinima > 0 && (parseFloat(o.cantidad_ofrecida) || 0) < filtros.cantidadMinima) return false;

      // Filtro de Tags
      if (tagActivo) {
        const coincideOfrecida = o.categoria_ofrecida === tagActivo;
        const coincideSolicitada = o.categoria_solicitada === tagActivo;
        if (!coincideOfrecida && !coincideSolicitada) return false;
      }

      return true;
    });
  }, [ofertas, filtros, busqueda, tagActivo, usuario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

      <NavbarDashboard paginaActiva="ofertas" />
      
      {/* Modales */}
      <ModalCrearOferta 
        isOpen={isModalCrearOpen}
        onClose={() => setIsModalCrearOpen(false)}
        onSuccess={handleOfertaCreada}
        serviciosDB={serviciosDB}
        usuario={usuario}
      />

      <ModalDetalleOferta
        oferta={ofertaSeleccionada}
        isOpen={!!ofertaSeleccionada}
        onClose={handleCerrarModal}
        onConfirmar={handleConfirmar}
        onRechazar={() => {
          handleCerrarModal();
          setAlerta({ mostrar: true, mensaje: 'Has cerrado la oferta.', tipo: 'warning' });
        }}
      />
      
      {alerta.mostrar && (
        <Alerta 
          mensaje={alerta.mensaje} 
          tipo={alerta.tipo} 
          onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))} 
        />
      )}

      {/* Contenido Principal */}
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white/86 border border-white/90 p-8 rounded-[32px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(20,70,140,0.18)]">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-2px] text-[#0f1f33] leading-none m-0">
              Ofertas <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">disponibles</span>
            </h1>
            <p className="text-[#5d6f82] mt-4 text-lg leading-relaxed max-w-2xl m-0">
              Explora los recursos de intercambio en tu comunidad.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalCrearOpen(true)}
            className="bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white font-bold py-3.5 px-7 rounded-full shadow-[0_12px_28px_rgba(0,102,255,0.28)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            + Publicar intercambio
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-[320px] xl:w-[380px] shrink-0">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-extrabold text-[#102033] mb-6">Filtros de búsqueda</h3>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="busqueda" className="text-[12px] font-bold text-[#6a7b8f] uppercase tracking-wider mb-1">Palabra clave</label>
                  <input
                    id="busqueda"
                    type="search"
                    placeholder="Ej. Cisterna, Electricidad..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full bg-[#f3f8ff] border border-transparent rounded-xl pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all font-medium text-[#102033]"
                  />
                </div>
                <hr className="border-[#0066ff]/10 my-2" />
                <FiltroOfertas 
                    filtroTipo={filtros.tipoBuscado} 
                    cantidadMinima={filtros.cantidadMinima} 
                    onChange={handleFiltroChange} 
                />
                <hr className="border-[#0066ff]/10 my-2" />
                <FiltroTags 
                    tagActivo={tagActivo} 
                    onTagChange={setTagActivo} 
                    tagsDisponibles={categoriesDisponibles} 
                />
              </div>
            </div>
          </aside>

          <section className="flex-grow w-full">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
              <div className="mb-8 border-b border-[#0066ff]/10 pb-6 flex justify-between items-center">
                <h3 className="text-2xl font-extrabold text-[#102033]">Resultados</h3>
                <p className="text-sm font-bold text-[#0066ff] bg-[#0066ff]/10 px-4 py-2 rounded-full inline-flex m-0">
                  {ofertasFiltradas.length} encontrados
                </p>
              </div>

              {ofertasFiltradas.length === 0 ? (
                <div className="text-center py-20 text-[#637489]">No hay ofertas activas disponibles.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ofertasFiltradas.map((oferta) => (
                    <TarjetaOferta key={oferta.id} oferta={oferta} onVerDetalle={handleVerDetalle} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default OfertasPage;