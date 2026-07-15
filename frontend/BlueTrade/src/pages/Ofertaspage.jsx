import { useState, useMemo, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  getOfertas, 
  getServicios, 
  iniciarTransaccion, 
  actualizarOferta,
  getOfertasCompletadas
} from '../api/item.api';

import NavbarDashboard from '../components/NavbarDashboard';
import FiltroOfertas from '../components/FiltroOfertas';
import FiltroTags from '../components/FiltroTags';
import TarjetaOferta from '../components/TarjetaOferta';
import TarjetaServicioExterno from '../components/TarjetaServiciosExternos';
import ModalDetalleOferta from '../components/ModalDetalleOferta'; 
import ModalCrearOferta from '../components/ModalCrearOferta'; 
import Alerta from '../components/alerta';
import ModalMatching from '../components/ModalBuscarMatch';

function OfertasPage() {
  const { usuario } = useContext(AuthContext);
  
  // Estados de datos
  const [ofertas, setOfertas] = useState([]);
  const [cargandoOfertas, setCargandoOfertas] = useState(true);
  const [serviciosDB, setServiciosDB] = useState([]);
  const [serviciosInternos, setServiciosInternos] = useState([]);
  const [certificadosUsuario, setCertificadosUsuario] = useState([]);
  
  // Estados de UI y Filtros
  const [filtros, setFiltros] = useState({ tipoBuscado: '', cantidadMinima: 0 });
  const [busqueda, setBusqueda] = useState('');
  const [tagActivo, setTagActivo] = useState('');
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });
  const [isModalMatchingOpen, setIsModalMatchingOpen] = useState(false);

  const [ofertasCompletadas, setOfertasCompletadas] = useState([]);
  const [completadasCargadas, setCompletadasCargadas] = useState(false);
  const [cargandoCompletadas, setCargandoCompletadas] = useState(false);
  const [offsetCompletadas, setOffsetCompletadas] = useState(0);
  const [hayMasCompletadas, setHayMasCompletadas] = useState(true);

  const LIMITE_COMPLETADAS = 20;

  const usuarioId = usuario?.id;
  const esAdmin = Boolean(usuario?.es_admin);
  
  useEffect(() => {
    if (!usuarioId) return;

    let componenteActivo = true;

    const cargarDatos = async () => {
      try {
        setCargandoOfertas(true);

        const [resOfertas, resServicios] = await Promise.all([
          getOfertas(usuarioId),
          getServicios()
        ]);

        if (!componenteActivo) return;

        setOfertas(resOfertas.data);
        setServiciosDB(resServicios.data);
        setServiciosInternos(resServicios.data.filter(s => !s.es_externo));
      } catch (error) {
        console.error("Error al cargar datos:", error);

        if (componenteActivo) {
          setAlerta({
            mostrar: true,
            mensaje: 'No se pudieron cargar las ofertas disponibles.',
            tipo: 'error'
          });
        }
      } finally {
        if (componenteActivo) {
          setCargandoOfertas(false);
        }
      }
    };

    cargarDatos();

    return () => {
      componenteActivo = false;
    };
  }, [usuarioId]);



  // Manejadores de eventos
  const handleVerDetalle = (oferta) => setOfertaSeleccionada(oferta);
  const handleCerrarModal = () => setOfertaSeleccionada(null);
  
  // En OfertasPage.jsx
  const handleConfirmar = async () => {
    // 1. Validaciones de seguridad iniciales
    if (!ofertaSeleccionada || !usuario) return;

    if (ofertaSeleccionada.estado !== 'ACTIVO') {
        setAlerta({
            mostrar: true,
            mensaje: 'Esta oferta ya no está disponible para iniciar una transacción.',
            tipo: 'warning'
        });
        handleCerrarModal();
        return;
    }
    
    // Validación de lógica de negocio (Agua)
    const tipoSolicitado = ofertaSeleccionada.tipo_solicitado?.toUpperCase();
    if (tipoSolicitado === 'AGUA' && ofertaSeleccionada.cantidad_solicitada > usuario.litros_disponibles) {
        setAlerta({
            mostrar: true,
            mensaje: 'No tienes suficientes litros para confirmar esta oferta.',
            tipo: 'error'
        });
        handleCerrarModal();
        return;
    }

    try {
        // 2. Llamada a la API
        await iniciarTransaccion(ofertaSeleccionada.id, usuario.id);

        // 3. Actualización de estado de la oferta
        await actualizarOferta(ofertaSeleccionada.id, {
            estado: 'EN_PROCESO'
        });

        // 4. Feedback al usuario
        setAlerta({ 
            mostrar: true, 
            mensaje: 'Transacción iniciada correctamente.', 
            tipo: 'success' 
        });

        // 5. Limpieza visual (quitar la oferta de la lista activa)
        setOfertas((prev) => prev.filter((o) => o.id !== ofertaSeleccionada.id));

    } catch (error) {
        console.error("Error al iniciar transacción:", error);
        setAlerta({ 
            mostrar: true, 
            mensaje: 'Error al procesar la solicitud. Verifica la consola.', 
            tipo: 'error' 
        });
    } finally {
        handleCerrarModal();
    }
  };

  const ofertaCreada = (nuevaOferta) => {
    if (esAdmin) {
      setOfertas((prev) => [nuevaOferta, ...prev]);
    }

    setAlerta({
      mostrar: true,
      mensaje: '¡Oferta publicada con éxito!',
      tipo: 'success'
    });
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };
  
  const manejarRedireccionExterna = (url, nombreServicio) => {
    setAlerta({
      mostrar: true,
      mensaje: `Redirigiendo de forma segura a la plataforma externa de ${nombreServicio}...`,
      tipo: 'success'
    });
    if (url) {
      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }, 1200);
    }
  };

  const cargarOfertasCompletadas = async () => {
    if (!usuarioId || !esAdmin || cargandoCompletadas || !hayMasCompletadas) return;

    try {
      setCargandoCompletadas(true);

      const res = await getOfertasCompletadas(
        usuarioId,
        LIMITE_COMPLETADAS,
        offsetCompletadas
      );

      const nuevasCompletadas = res.data.results || [];

      setOfertasCompletadas((prev) => [
        ...prev,
        ...nuevasCompletadas
      ]);

      setOffsetCompletadas(res.data.next_offset || 0);
      setHayMasCompletadas(Boolean(res.data.next_offset));
      setCompletadasCargadas(true);
    } catch (error) {
      console.error("Error al cargar ofertas completadas:", error);

      setAlerta({
        mostrar: true,
        mensaje: 'No se pudieron cargar las ofertas completadas.',
        tipo: 'error'
      });
    } finally {
      setCargandoCompletadas(false);
    }
  };
  
  // Memoización de categorías basadas en la BD
  const categoriesDisponibles = useMemo(() => {
  return serviciosDB.map((s) => s.nombre);
  }, [serviciosDB]);
  
  const serviciosExternosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return serviciosDB.filter((s) => {
      if (!s.es_externo) return false;
      
      // Aplicar filtro de búsqueda por palabra clave al servicio externo
      const nombreServicio = s.nombre?.toLowerCase() || '';
      const descripcionServicio = s.descripcion?.toLowerCase() || '';

      if (q && !nombreServicio.includes(q) && !descripcionServicio.includes(q)) {
        return false;
      }
      // Filtro por tags si coincide con el nombre de la categoría del servicio
      if (tagActivo && s.nombre !== tagActivo) return false;

      return true;
    });
  }, [serviciosDB, busqueda, tagActivo]);

  // Lógica de filtrado
  const aplicarFiltrosVisuales = useCallback((o, q) => {
  const textoBusqueda = `${o.usuario_nombre} ${o.descripcion} ${o.categoria_ofrecida} ${o.categoria_solicitada}`.toLowerCase();

  if (q && !textoBusqueda.includes(q)) return false;

  if (
    filtros.tipoBuscado &&
    o.tipo_ofrecido?.toLowerCase() !== filtros.tipoBuscado.toLowerCase()
  ) {
    return false;
  }

  if (
    filtros.cantidadMinima > 0 &&
    (parseFloat(o.cantidad_ofrecida) || 0) < filtros.cantidadMinima
  ) {
    return false;
  }

  if (tagActivo) {
    const coincideOfrecida = o.categoria_ofrecida === tagActivo;
    const coincideSolicitada = o.categoria_solicitada === tagActivo;

    if (!coincideOfrecida && !coincideSolicitada) return false;
  }

  return true;
}, [filtros, tagActivo]);

const ofertasActivasFiltradas = useMemo(() => {
  const q = busqueda.toLowerCase();

  return ofertas.filter((o) => {
    if (o.estado !== 'ACTIVO') return false;
    return aplicarFiltrosVisuales(o, q);
  });
}, [ofertas, busqueda, aplicarFiltrosVisuales]);

const ofertasCompletadasFiltradas = useMemo(() => {
  if (!esAdmin) return [];

  const q = busqueda.toLowerCase();

  return ofertasCompletadas.filter((o) => {
    return aplicarFiltrosVisuales(o, q);
  });
}, [ofertasCompletadas, busqueda, esAdmin, aplicarFiltrosVisuales]);

const listaResultadosPrincipales = useMemo(() => {
  const ofertasActivasMapeadas = ofertasActivasFiltradas.map(o => ({
    ...o,
    tipoComponente: 'OFERTA'
  }));

  const serviciosMapeados = serviciosExternosFiltrados.map(s => ({
    ...s,
    tipoComponente: 'SERVICIO_EXTERNO'
  }));

  return [
    ...ofertasActivasMapeadas,
    ...serviciosMapeados
  ];
}, [
  ofertasActivasFiltradas,
  serviciosExternosFiltrados
]);

const ofertasCompletadasMapeadas = useMemo(() => {
  return ofertasCompletadasFiltradas.map(o => ({
    ...o,
    tipoComponente: 'OFERTA'
  }));
}, [ofertasCompletadasFiltradas]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

      <NavbarDashboard paginaActiva="ofertas" />
      
      {/* Modales */}
      <ModalCrearOferta 
        isOpen={isModalCrearOpen}
        onClose={() => setIsModalCrearOpen(false)}
        onSuccess={ofertaCreada}
        serviciosDB={serviciosInternos}
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
        serviciosDB={serviciosDB} 
        usuario={usuario}
        certificadosUsuario={certificadosUsuario}
      />
      {isModalMatchingOpen && (
      <ModalMatching 
        isOpen={true} 
        onClose={() => setIsModalMatchingOpen(false)} 
        onMatchEncontrado={(o) => {
          setOfertaSeleccionada(o);
          setIsModalMatchingOpen(false);
        }}
        serviciosDB={serviciosInternos}
      />
    )}
      
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
          <div className="flex flex-row items-center justify-end gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsModalCrearOpen(true)}
              className="bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white font-bold py-3.5 px-7 rounded-full shadow-[0_12px_28px_rgba(0,102,255,0.28)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              + Publicar intercambio
            </button>
            <button 
              onClick={() => setIsModalMatchingOpen(true)}
              className="bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white font-bold py-3.5 px-7 rounded-full shadow-[0_12px_28px_rgba(0,102,255,0.28)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Matching
            </button>
          </div>
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

          <section className="flex-grow w-full flex flex-col gap-8">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
              <div className="mb-8 border-b border-[#0066ff]/10 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#102033] m-0">
                    Ofertas activas y servicios conectados
                  </h3>
                  <p className="text-sm text-[#637489] mt-2 m-0">
                    Intercambios disponibles y servicios externos compatibles con tu búsqueda.
                  </p>
                </div>

                <p className="text-sm font-bold text-[#0066ff] bg-[#0066ff]/10 px-4 py-2 rounded-full inline-flex m-0">
                  {listaResultadosPrincipales.length} disponibles
                </p>
              </div>

              {cargandoOfertas ? (
                <div className="text-center py-20">
                  <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-[#0066ff]/20 border-t-[#0066ff] animate-spin" />
                  <p className="text-[#637489] font-semibold m-0">
                    Cargando ofertas disponibles...
                  </p>
                </div>
              ) : listaResultadosPrincipales.length === 0 ? (
                <div className="text-center py-20 text-[#637489]">
                  No se encontraron ofertas activas ni servicios conectados para la búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listaResultadosPrincipales.map((item) => {
                    if (item.tipoComponente === 'OFERTA') {
                      return (
                        <TarjetaOferta 
                          key={`oferta-activa-${item.id}`} 
                          oferta={item} 
                          onVerDetalle={handleVerDetalle} 
                        />
                      );
                    }

                    return (
                      <TarjetaServicioExterno 
                        key={`servicio-externo-${item.id}`} 
                        servicio={item} 
                        onRedireccionar={manejarRedireccionExterna} 
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {esAdmin && (
              <div className="bg-white/86 backdrop-blur-[18px] border border-emerald-100 shadow-[0_30px_80px_rgba(20,70,140,0.12)] rounded-[32px] p-8">
                <div className="mb-8 border-b border-emerald-500/10 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#102033] m-0">
                      Ofertas completadas
                    </h3>
                    <p className="text-sm text-[#637489] mt-2 m-0">
                      Consulta el historial administrativo de intercambios finalizados.
                    </p>
                  </div>

                  <p className="text-sm font-bold text-emerald-700 bg-emerald-500/10 px-4 py-2 rounded-full inline-flex m-0">
                    {ofertasCompletadasMapeadas.length} mostradas
                  </p>
                </div>

                {!completadasCargadas ? (
                  <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 px-6 py-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>

                    <h4 className="text-xl font-extrabold text-[#102033] m-0">
                      Historial de ofertas finalizadas
                    </h4>

                    <p className="text-[#637489] mt-3 mb-6 max-w-xl mx-auto">
                      Accede al registro de intercambios completados para revisión administrativa.
                    </p>

                    <button
                      onClick={cargarOfertasCompletadas}
                      disabled={cargandoCompletadas}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all disabled:opacity-60"
                    >
                      {cargandoCompletadas ? 'Consultando historial...' : 'Consultar historial'}
                    </button>
                  </div>
                ) : ofertasCompletadasMapeadas.length === 0 ? (
                  <div className="text-center py-14 text-[#637489]">
                    No hay ofertas completadas para mostrar.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ofertasCompletadasMapeadas.map((item) => (
                        <TarjetaOferta 
                          key={`oferta-completada-${item.id}`} 
                          oferta={item} 
                          onVerDetalle={handleVerDetalle} 
                        />
                      ))}
                    </div>

                    {hayMasCompletadas && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={cargarOfertasCompletadas}
                          disabled={cargandoCompletadas}
                          className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all disabled:opacity-60"
                        >
                          {cargandoCompletadas ? 'Cargando...' : 'Cargar más completadas'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default OfertasPage;