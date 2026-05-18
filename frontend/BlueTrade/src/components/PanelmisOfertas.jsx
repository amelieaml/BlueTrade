import TarjetaMiOferta from './TarjetaMiOferta';

function PanelMisOfertas({ ofertas, onGestionar, onCrearNueva }) {
  return (
    <section className="bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.06)] rounded-3xl p-8">
      
      {/* Encabezado del panel */}
      <div className="mb-8 border-b border-blue-500/10 pb-6 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#102033]">Mis ofertas en curso</h3>
        <span className="text-sm font-semibold text-[#0066ff] bg-blue-500/10 px-4 py-2 rounded-full inline-flex">
          {ofertas.length} activas
        </span>
      </div>
      
      {/* Grilla de tarjetas individuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Renderizamos las ofertas pasadas por props */}
        {ofertas.map((oferta) => (
          <TarjetaMiOferta 
            key={oferta.id} 
            oferta={oferta} 
            onGestionar={onGestionar} 
          />
        ))}

        {/* Caja para crear una nueva oferta (botón punteado) */}
        <button 
          onClick={onCrearNueva}
          className="flex flex-col items-center justify-center min-h-[220px] rounded-[24px] border-2 border-dashed border-[#0066ff]/30 bg-[#0066ff]/[0.02] hover:bg-[#0066ff]/[0.06] hover:border-[#0066ff]/50 transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <span className="font-bold text-[#0066ff] text-sm">Nueva oferta</span>
        </button>

      </div>
    </section>
  );
}

export default PanelMisOfertas;