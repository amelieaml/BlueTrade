import React from 'react';

function FiltroComunidad({ filtros, onFiltroChange, serviciosDisponibles }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Filtro por Nombre */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-[#6a7b8f] uppercase tracking-wider mb-1">
          Buscar Vecino
        </label>
        <input
          type="text"
          placeholder="Ej. Amelie Moreno..."
          value={filtros.nombre}
          onChange={(e) => onFiltroChange('nombre', e.target.value)}
          className="w-full bg-[#f3f8ff] border border-transparent rounded-xl pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all font-medium text-[#102033]"
        />
      </div>

      <hr className="border-[#0066ff]/10 my-1" />

      {/* Filtro por Especialidad/Servicio */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-[#6a7b8f] uppercase tracking-wider mb-1">
          Especialidad de Servicio
        </label>
        <select
          value={filtros.servicio}
          onChange={(e) => onFiltroChange('servicio', e.target.value)}
          className="w-full bg-[#f3f8ff] border border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all font-bold text-[#102033] appearance-none cursor-pointer"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23637489\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', 
            backgroundRepeat: 'no-repeat', 
            backgroundPosition: 'right 12px center', 
            backgroundSize: '14px' 
          }}
        >
          <option value="">Cualquier servicio</option>
          {serviciosDisponibles.map((serv, index) => (
            <option key={index} value={serv}>{serv}</option>
          ))}
        </select>
      </div>

      <hr className="border-[#0066ff]/10 my-1" />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[12px] font-bold text-[#6a7b8f] uppercase tracking-wider">
            Reputación Mínima
          </label>
          <span className="text-xs font-black text-[#0066ff] bg-[#0066ff]/10 px-2 py-0.5 rounded-md">
            {filtros.reputacion > 0 ? `${filtros.reputacion} ★ o más` : 'Todos'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filtros.reputacion}
          onChange={(e) => onFiltroChange('reputacion', parseFloat(e.target.value))}
          className="w-full accent-[#0066ff] cursor-pointer mt-2"
        />
        <div className="flex justify-between text-[11px] font-bold text-[#91a0b2]">
          <span>0 ★</span>
          <span>5 ★</span>
        </div>
      </div>

      <hr className="border-[#0066ff]/10 my-1" />

      {/* Selector de Ordenamiento */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-bold text-[#6a7b8f] uppercase tracking-wider mb-1">
          Ordenar Directorio por
        </label>
        <div className="flex flex-col gap-2">
          {[
            { id: 'alfabetico', label: 'Orden Alfabético (A-Z)' },
            { id: 'reputacion', label: 'Mayor Reputación primero' },
            { id: 'relevancia', label: 'Relevancia de Servicios' }
          ].map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              onClick={() => onFiltroChange('ordenar', opcion.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                filtros.ordenar === opcion.id
                  ? "bg-[#0066ff]/10 border-[#0066ff]/30 text-[#0066ff]"
                  : "bg-white border-[#e2e8f0] text-[#637489] hover:bg-slate-50"
              }`}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FiltroComunidad;