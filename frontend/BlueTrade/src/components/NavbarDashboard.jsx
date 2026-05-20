import React from 'react';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NavbarDashboard({ 
  paginaActiva = 'dashboard',
  nombreApp = "BlueTrade",
  textoBoton = "Cerrar sesión",
  onBotonClick
}) {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login'); // Redirige al login de inmediato
  };

  // Extraemos la inicial del nombre del usuario de forma segura
  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U';
  return (
    <header className="navbar">
      
      {/* SECCIÓN IZQUIERDA: Estilo idéntico al logo original */}
      <a href="/dashboard" className="logo" style={{ textDecoration: 'none' }}>
        <span className="logo-icon">BT</span>
        <span className="logo-text">{nombreApp}</span>
      </a>

      {/* SECCIÓN CENTRAL: Enlaces del Dashboard con clases de HomePage */}
      <nav className="nav-links">
        <a 
          href="/dashboard" 
          className={paginaActiva === 'dashboard' ? 'active' : ''}
          style={paginaActiva === 'dashboard' ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' } : {}}
        >
          Vista General
        </a>
        
        <a 
          href="/ofertas" 
          className={paginaActiva === 'ofertas' ? 'active' : ''}
          style={paginaActiva === 'ofertas' ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' } : {}}
        >
          Explorar Ofertas
        </a>
        
        <a 
          href="/historial" 
          className={paginaActiva === 'historial' ? 'active' : ''}
          style={paginaActiva === 'historial' ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' } : {}}
        >
          Mis Intercambios
        </a>
      </nav>

      {/* SECCIÓN DERECHA: Bloque de acciones con tu CSS tradicional */}
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Identificador de usuario sutil integrado */}
        <div className="user-profile-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 255, 0.1)',
            color: '#0066ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid rgba(0, 102, 255, 0.2)'
          }}>
            {inicial}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#102033' }}>{usuario?.nombre}</span>
        </div>
        
        {/* Botón Principal usando tus estilos base .btn y .btn-primary */}
        <button 
          onClick={handleLogout}
          className="btn btn-primary"
          style={{ cursor: 'pointer', border: 'none' }}
        >
          {textoBoton}
        </button>
      </div>

    </header>
  );
}

export default NavbarDashboard;