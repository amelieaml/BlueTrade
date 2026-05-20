function FiltroOfertas({ filtroTipo, cantidadMinima, onChange }) {
  // Cálculos para el "relleno" dinámico de la barra según el porcentaje
  const porcentajeAgua = (cantidadMinima / 5000) * 100;
  const porcentajeServicio = (cantidadMinima / 40) * 100;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Select principal */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Estoy buscando recibir...</label>
        <div className="relative">
          <select
            value={filtroTipo}
            onChange={(e) => {
              onChange('tipoBuscado', e.target.value);
              onChange('cantidadMinima', 0); // Resetea el slider al cambiar
            }}
            className="w-full appearance-none bg-[#f8fafc] border border-gray-100 text-gray-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5b8cff]/20 focus:border-[#5b8cff] font-medium cursor-pointer"
          >
            <option value="">Cualquier recurso</option>
            <option value="agua">Agua (Litros)</option>
            <option value="servicio">Servicio (Horas)</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* SLIDER DE AGUA */}
      {filtroTipo === 'agua' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Mínimo de litros</label>
            <span className="text-[12px] font-bold text-[#5b8cff] bg-[#5b8cff]/10 px-2.5 py-1 rounded-md">
              {cantidadMinima.toLocaleString()} L
            </span>
          </div>
          <input
            type="range"
            min="0" max="5000" step="100"
            value={cantidadMinima}
            onChange={(e) => onChange('cantidadMinima', Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #5b8cff ${porcentajeAgua}%, #f1f5f9 ${porcentajeAgua}%)`
            }}
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer outline-none 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#5b8cff] 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-125 
              [&::-webkit-slider-thumb]:transition-transform"
          />
        </div>
      )}

      {/* SLIDER DE SERVICIOS */}
      {filtroTipo === 'servicio' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Mínimo de horas</label>
            <span className="text-[12px] font-bold text-[#ffb443] bg-[#ffb443]/10 px-2.5 py-1 rounded-md">
              {cantidadMinima} h
            </span>
          </div>
          <input
            type="range"
            min="0" max="40" step="1"
            value={cantidadMinima}
            onChange={(e) => onChange('cantidadMinima', Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #ffb443 ${porcentajeServicio}%, #f1f5f9 ${porcentajeServicio}%)`
            }}
            className="w-full h-1.5 appearance-none rounded-full cursor-pointer outline-none 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#ffb443] 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-125 
              [&::-webkit-slider-thumb]:transition-transform"
          />
        </div>
      )}

    </div>
  );
}

export default FiltroOfertas;