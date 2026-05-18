function NavbarDashboard({ 
  paginaActiva = 'dashboard',
  nombreApp = "BlueTrade",
  textoBoton = "Cerrar sesión",
  onBotonClick
}) {
  return (
    <nav className="w-full px-6 lg:px-12 py-6 bg-transparent flex items-center justify-between sticky top-0 z-50">
      
      {/* SECCIÓN IZQUIERDA: Logo simple */}
      <a href="/dashboard" className="text-2xl font-extrabold text-[#0066ff] tracking-tight no-underline">
        {nombreApp}
      </a>
      
      {/* SECCIÓN CENTRAL: Enlaces del Dashboard */}
      <div className="hidden md:flex items-center gap-8">
        <a 
          href="/dashboard" 
          className={`text-[15px] transition-colors ${
            paginaActiva === 'dashboard' 
              ? 'font-bold text-[#0066ff]' 
              : 'font-medium text-[#5d6f82] hover:text-[#0066ff]'
          }`}
        >
          Vista General
        </a>
        
        <a 
          href="/ofertas" 
          className={`text-[15px] transition-colors ${
            paginaActiva === 'ofertas' 
              ? 'font-bold text-[#0066ff]' 
              : 'font-medium text-[#5d6f82] hover:text-[#0066ff]'
          }`}
        >
          Explorar Ofertas
        </a>
        
        <a 
          href="/historial" 
          className={`text-[15px] transition-colors ${
            paginaActiva === 'historial' 
              ? 'font-bold text-[#0066ff]' 
              : 'font-medium text-[#5d6f82] hover:text-[#0066ff]'
          }`}
        >
          Mis Intercambios
        </a>
      </div>

      {/* SECCIÓN DERECHA: Usuario y Botón principal */}
      <div className="flex items-center gap-6">
        {/* Identificador de usuario sutil */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-[#0066ff] flex items-center justify-center text-sm font-bold border border-blue-500/20">
            M
          </div>
          <span className="text-sm font-bold text-[#102033]">Manuel R.</span>
        </div>
        
        {/* Botón principal */}
        <button 
          onClick={onBotonClick}
          className="bg-[#0066ff] hover:bg-[#004a99] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(0,102,255,0.2)]"
        >
          {textoBoton}
        </button>
      </div>
    </nav>
  );
}

export default NavbarDashboard;