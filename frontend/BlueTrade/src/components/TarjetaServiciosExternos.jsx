import React from 'react';

const IconoServicioExterno = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

function TarjetaServicioExterno({ servicio, onRedireccionar }) {
  const themeAccent = 'bg-[#0066ff]';
  
  // Extraemos la primera letra del origen para el avatar circular
  const nombreOrigen = servicio.api_origen || 'Aliado';
  const avatarLetra = servicio.nombre ? servicio.nombre.charAt(0).toUpperCase() : 'E';

  return (
    <article className="relative bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col h-full group">
      
      {/* Barra lateral acentuada igual a TarjetaOferta */}
      <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-md ${themeAccent} opacity-80 transition-opacity`}></div>

      <div className="pl-3 flex flex-col h-full">
        {/* Cabecera: Identificador de ecosistema y Estado */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ecosistema Externo</span>
          <span className="text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
            CONECTADO
          </span>
        </div>

        {/* Caja de Información Central (Estructura idéntica al RenderRecurso de Ofertas) */}
        <div className="flex flex-col gap-2 flex-grow">
          <div className="p-4 rounded-xl bg-[#f4f9ff] border border-blue-50 flex-grow flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0066ff] mb-2 block">
              Servicio Integrado
            </span>
            
            <div className="flex items-start gap-3 flex-grow">
              {/* Círculo del Icono */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0066ff]/10 text-[#0066ff] shrink-0">
                <IconoServicioExterno />
              </div>
              
              {/* Textos: Título y descripción interna */}
              <div className="flex flex-col flex-grow">
                <p className="font-bold text-[#1a1d27] text-[15px] m-0 leading-tight">
                  {servicio.nombre}
                </p>
                <p className="text-gray-500 text-[13px] leading-relaxed mt-2 m-0 font-medium line-clamp-4">
                  {servicio.descripcion}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Origen del API (Formato de usuario) y Botón de Acción Estilizado */}
        <div className="mt-6 pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center gap-2 max-w-[60%]">
            {/* Inicial del servicio como Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[12px] font-bold text-[#0066ff] shrink-0">
              {avatarLetra}
            </div>
            {/* Texto del origen/API con truncado por si es muy largo */}
            <span className="text-[13px] font-bold text-gray-600 truncate font-mono bg-[#f3f8ff] px-2 py-0.5 rounded-md border border-gray-100">
              {nombreOrigen.replace(/^https?:\/\//, '').split('/')[0]}
            </span>
          </div>
          
          {/* Botón con el mismo padding, tamaño de letra y diseño que el de TarjetaOferta */}
          <button 
            onClick={() => onRedireccionar(servicio.api_origen, servicio.nombre)}
            className="text-[13px] font-bold text-[#0066ff] hover:text-[#004a99] transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border-none cursor-pointer flex items-center gap-1.5"
          >
            Visitar servicio
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default TarjetaServicioExterno;