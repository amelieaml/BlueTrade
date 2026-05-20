import { useState, useMemo } from 'react';

import NavbarDashboard from '../components/NavbarDashboard';
import FiltroOfertas from '../components/FiltroOfertas';
import FiltroTags from '../components/FiltroTags';
import TarjetaOferta from '../components/TarjetaOferta';
import ModalDetalleOferta from '../components/ModalDetalleOferta';

// Mock de datos estructurado basándose en el UML (Diagrama de Clases)
const OFERTAS_MOCK = [
  {
    id: 'OFE-001',
    ciUsuario: 'V-12345678',
    usuario: 'Carlos Gómez',
    urbanizacion: 'Res. Los Jardines',
    fechaPublicacion: '12 may 2026',
    estado: 'ACTIVO',
    itemOfrecido: { tipo: 'agua', litros: 3200, descripcion: 'Agua potable directo de cisterna principal' },
    itemSolicitado: { tipo: 'servicio', categoria: 'electricidad', horasEstimadas: 8, descripcionDetallada: 'Revisión y cambio de cableado en PB' }
  },
  {
    id: 'OFE-002',
    ciUsuario: 'V-87654321',
    usuario: 'Luis Rodríguez',
    urbanizacion: 'Res. Las Palmas',
    fechaPublicacion: '14 may 2026',
    estado: 'ACTIVO',
    itemOfrecido: { tipo: 'servicio', categoria: 'plomeria', horasEstimadas: 12, descripcionDetallada: 'Reparación de filtraciones en tuberías matriz' },
    itemSolicitado: { tipo: 'agua', litros: 1500, descripcion: 'Suministro para tanque del apartamento' }
  },
  {
    id: 'OFE-003',
    ciUsuario: 'V-11223344',
    usuario: 'Ana Martínez',
    urbanizacion: 'Urb. El Prado',
    fechaPublicacion: '15 may 2026',
    estado: 'ACTIVO',
    itemOfrecido: { tipo: 'agua', litros: 4800, descripcion: 'Excedente de pozo privado certificado' },
    itemSolicitado: { tipo: 'servicio', categoria: 'jardineria', horasEstimadas: 6, descripcionDetallada: 'Poda de árboles áreas comunes' }
  }
];

function OfertasPage() {
  const [filtros, setFiltros] = useState({ tipoBuscado: '', cantidadMinima: 0 });
  const [busqueda, setBusqueda] = useState('');
  const [tagActivo, setTagActivo] = useState('');

  // --- NUEVO: Estado para controlar el modal ---
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);

  const handleVerDetalle = (oferta) => setOfertaSeleccionada(oferta);
  const handleCerrarModal = () => setOfertaSeleccionada(null);
  const handleConfirmar = (oferta) => {
    // Aquí va la lógica de transacción
    console.log('Iniciando transacción para:', oferta.id);
    handleCerrarModal();
  };
  // ---------------------------------------------

  const categoriasDisponibles = useMemo(() => {
    const tagsSet = new Set();
    OFERTAS_MOCK.forEach((o) => {
      if (o.itemOfrecido.tipo === 'servicio') tagsSet.add(o.itemOfrecido.categoria);
      if (o.itemSolicitado.tipo === 'servicio') tagsSet.add(o.itemSolicitado.categoria);
    });
    return Array.from(tagsSet);
  }, []);

  function handleFiltroChange(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }

  const ofertasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase();
    
    return OFERTAS_MOCK.filter((o) => {
      if (q && ![o.usuario, o.urbanizacion, o.itemOfrecido.descripcion, o.itemSolicitado.descripcionDetallada]
        .some((s) => s && s.toLowerCase().includes(q))) return false;

      if (filtros.tipoBuscado && o.itemOfrecido.tipo !== filtros.tipoBuscado) return false;

      if (filtros.tipoBuscado === 'agua' && o.itemOfrecido.litros < filtros.cantidadMinima) return false;
      if (filtros.tipoBuscado === 'servicio' && o.itemOfrecido.horasEstimadas < filtros.cantidadMinima) return false;

      if (tagActivo) {
        const tieneCategoriaOfrecida = o.itemOfrecido.tipo === 'servicio' && o.itemOfrecido.categoria === tagActivo;
        const tieneCategoriaSolicitada = o.itemSolicitado.tipo === 'servicio' && o.itemSolicitado.categoria === tagActivo;
        if (!tieneCategoriaOfrecida && !tieneCategoriaSolicitada) return false;
      }

      return true;
    });
  }, [filtros, busqueda, tagActivo]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
    {/* Reflejo radial del CSS original en la esquina superior izquierda */}
    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

    <NavbarDashboard paginaActiva="ofertas" />
    
    {/* Modal conectado al estado */}
    <ModalDetalleOferta
      oferta={ofertaSeleccionada}
      isOpen={!!ofertaSeleccionada}
      onClose={handleCerrarModal}
      onConfirmar={handleConfirmar}
    />
    
    <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-12 relative z-10">
      
      {/* HEADER TÍTULO: Adaptado al estilo .dashboard-preview / .hero-badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white/86 border border-white/90 p-8 rounded-[32px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(20,70,140,0.18)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-2px] text-[#0f1f33] leading-none m-0">
            Ofertas <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">disponibles</span>
          </h1>
          <p className="text-[#5d6f82] mt-4 text-lg leading-relaxed max-w-2xl m-0">
            Explora los recursos de intercambio en tu comunidad.
          </p>
        </div>
        {/* Botón principal adaptado de .btn-primary y .btn */}
        <button className="bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white font-bold py-3.5 px-7 rounded-full shadow-[0_12px_28px_rgba(0,102,255,0.28)] hover:-translate-y-0.5 transition-all duration-200 ease-in-out cursor-pointer">
          + Publicar intercambio
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* SIDEBAR FILTROS: Adaptado con .dashboard-preview */}
        <aside className="w-full lg:w-[320px] xl:w-[380px] shrink-0">
          <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-6 lg:sticky lg:top-24">
            <h3 className="text-xl font-extrabold text-[#102033] mb-6">Filtros de búsqueda</h3>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="busqueda" className="text-[12px] font-bold text-[#6a7b8f] uppercase tracking-wider mb-1">
                  Palabra clave
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#6a7b8f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  {/* Input estilizado acorde a la paleta */}
                  <input
                    id="busqueda"
                    type="search"
                    placeholder="Ej. Cisterna, Electricidad..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full bg-[#f3f8ff] border border-transparent rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all font-medium text-[#102033]"
                  />
                </div>
              </div>
              
              <hr className="border-[#0066ff]/10 my-2" />
              
              <FiltroOfertas
                filtroTipo={filtros.tipoBuscado}
                cantidadMinima={filtros.cantidadMinima}
                onChange={handleFiltroChange}
              />
              
              <hr className="border-[#0066ff]/10 my-2" />
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6a7b8f] uppercase tracking-wider">Categorías de Servicio</label>
                <FiltroTags 
                  tagActivo={tagActivo} 
                  onTagChange={setTagActivo} 
                  tagsDisponibles={categoriasDisponibles} 
                />
              </div>
            </div>
          </div>
        </aside>

        {/* GRAN TARJETA CENTRAL DE RESULTADOS */}
        <section className="flex-grow w-full">
          <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
            <div className="mb-8 border-b border-[#0066ff]/10 pb-6 flex justify-between items-center">
              <h3 className="text-2xl font-extrabold text-[#102033]">Resultados</h3>
              {/* Badge de contador estilo .hero-badge */}
              <p className="text-sm font-bold text-[#0066ff] bg-[#0066ff]/10 px-4 py-2 rounded-full inline-flex m-0">
                {ofertasFiltradas.length === 0
                  ? 'Sin resultados'
                  : ofertasFiltradas.length === 1
                  ? '1 intercambio encontrado'
                  : `${ofertasFiltradas.length} intercambios encontrados`}
              </p>
            </div>

            {/* Contenedor Empty State */}
            {ofertasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-[#f7fbff] border border-dashed border-[#0066ff]/20 rounded-[24px] py-20 px-6 text-center">
                <div className="w-12 h-12 mb-4 rounded-xl bg-[#0066ff]/10 flex items-center justify-center text-[#0066ff] text-xl font-bold">
                  🔍
                </div>
                <h4 className="text-lg font-bold text-[#102033] mb-1">No encontramos開coincidencias</h4>
                <p className="text-[#637489] text-sm max-w-sm leading-relaxed m-0">
                  Intenta ajustando los filtros laterales o reduciendo la cantidad mínima del recurso que buscas recibir.
                </p>
              </div>
            ) : (
              /* Grid de Tarjetas (Cada tarjeta interna heredará indirectamente el look limpio si usas clases similares) */
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