import { useState, useMemo } from 'react';

import NavbarDashboard from '../components/NavbarDashboard';
import FiltroOfertas from '../components/FiltroOfertas';
import FiltroTags from '../components/FiltroTags';
import TarjetaOferta from '../components/TarjetaOferta';
import ModalDetalleOferta from '../components/ModalDetalleOferta';


function PerfilUsuario() {
  
  return (
  <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
    {/* Reflejo radial del CSS original en la esquina superior izquierda */}
    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

    <NavbarDashboard paginaActiva="perfil" />
    
    </div>
);
}

export default PerfilUsuario;