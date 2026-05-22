import React, { useState } from 'react';

function FiltroTags({ tagActivo, onTagChange, tagsDisponibles = [] }) {
  // 1. Estado para controlar el acordeón
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // 2. Lógica para cortar el arreglo a solo 5 elementos si está cerrado
  const tagsVisibles = mostrarTodos ? tagsDisponibles : tagsDisponibles.slice(0, 5);
  
  // 3. Verificamos si hay suficientes elementos para mostrar el botón
  const hayMasTags = tagsDisponibles.length > 5;

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

      {/* Renderizado dinámico en base a tagsVisibles (con límite de 5) */}
      {tagsVisibles.map((tag) => (
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

      {/* Botón de Acordeón "Ver más / Ocultar" */}
      {hayMasTags && (
        <button
          onClick={() => setMostrarTodos(!mostrarTodos)}
          className="px-4 py-2 text-[13px] transition-all duration-200 cursor-pointer bg-white border border-[#0066ff]/20 text-[#0066ff] hover:bg-[#0066ff]/5 rounded-full font-bold flex items-center gap-1.5"
        >
          {mostrarTodos ? 'Ocultar' : `Ver más (${tagsDisponibles.length - 5})`}
          
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${mostrarTodos ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      
    </div>
  );
}

export default FiltroTags;