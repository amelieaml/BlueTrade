function FiltroTags({ tagActivo, onTagChange, tagsDisponibles = [] }) {
  return (
    <div className="flex flex-wrap gap-2.5 pt-1">
      
      {/* Botón "Todas" */}
      <button
        onClick={() => onTagChange('')}
        className={`px-4 py-2 text-[13px] transition-all duration-200 cursor-pointer ${
          tagActivo === ''
            ? 'bg-gradient-to-r from-[#0066ff] to-[#00b8ff] text-white font-bold rounded-full shadow-[0_6px_16px_rgba(0,102,255,0.25)] border-transparent'
            : 'bg-[#f8fafc] text-gray-500 hover:bg-gray-100 border border-gray-100 rounded-full font-semibold'
        }`}
      >
        Todas
      </button>

      {/* Renderizado dinámico en base a las ofertas publicadas únicamente */}
      {tagsDisponibles.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-4 py-2 text-[13px] transition-all duration-200 cursor-pointer ${
            tagActivo === tag
              ? 'bg-gradient-to-r from-[#0066ff] to-[#00b8ff] text-white font-bold rounded-full shadow-[0_6px_16px_rgba(0,102,255,0.25)] border-transparent'
              : 'bg-[#f8fafc] text-gray-500 hover:bg-gray-100 border border-gray-100 rounded-full font-semibold'
          }`}
        >
          {tag.charAt(0).toUpperCase() + tag.slice(1)}
        </button>
      ))}
      
    </div>
  );
}

export default FiltroTags;