import React from 'react';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NavbarDashboard({ 
  paginaActiva = 'dashboard',
  nombreApp = "BlueTrade",
  textoBoton = "Cerrar sesión",
  onBotonClick,
  esAdmin: esAdminProp = false
}) {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U';

  const esAdmin =
    esAdminProp ||
    usuario?.es_admin === true ||
    usuario?.es_admin === "true" ||
    usuario?.es_admin === 1 ||
    usuario?.es_admin === "1";

  const estadoUsuario = usuario?.estado?.toString().trim().toLowerCase();

  const [usuarioActivo, setUsuarioActivo] = useState(false);

  useEffect(() => {
    if (estadoUsuario === "activo" || esAdmin) {
      setUsuarioActivo(true);
    } else {
      setUsuarioActivo(false);
    }
  }, [estadoUsuario, esAdmin]);

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <header className="navbar">
      
      {/* SECCIÓN IZQUIERDA */}
      <a href="/dashboard" className="logo" style={{ textDecoration: 'none' }}>
        <span className="logo-icon">BT</span>
        <span className="logo-text">{nombreApp}</span>
      </a>

      {/* SECCIÓN CENTRAL */}
      <nav className="nav-links">
        {usuarioActivo && (
          <a 
            href="/dashboard" 
            className={paginaActiva === 'dashboard' ? 'active' : ''}
            style={
              paginaActiva === 'dashboard'
                ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' }
                : {}
            }
          >
            Vista General
          </a>
        )}

        {usuarioActivo && (
          <a 
            href="/ofertas" 
            className={paginaActiva === 'ofertas' ? 'active' : ''}
            style={
              paginaActiva === 'ofertas'
                ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' }
                : {}
            }
          >
            Catálogo de Ofertas
          </a>
        )}

        {usuarioActivo && (
          <a 
            href="/historial" 
            className={paginaActiva === 'historial' ? 'active' : ''}
            style={
              paginaActiva === 'historial'
                ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' }
                : {}
            }
          >
            Mis Ofertas
          </a>
        )}

        {usuarioActivo && (
          <a 
            href="/transacciones" 
            className={paginaActiva === 'transacciones' ? 'active' : ''}
            style={
              paginaActiva === 'transacciones'
                ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' }
                : {}
            }
          >
            Mis Transacciones
          </a>
        )}

        {usuarioActivo && (
          <a 
            href="/comunidad" 
            className={paginaActiva === 'comunidad' ? 'active' : ''}
            style={
              paginaActiva === 'comunidad'
                ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' }
                : {}
            }
          >
            Comunidad
          </a>
        )}
        
        <a 
          href="/perfil" 
          className={paginaActiva === 'perfil' ? 'active' : ''}
          style={
            paginaActiva === 'perfil'
              ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' }
              : {}
          }
        >
          Perfil
        </a>

        {esAdmin && (
        <a 
          href="/admin" 
          className={paginaActiva === 'admin' ? 'active' : ''}
          style={
            paginaActiva === 'admin'
              ? { fontWeight: 'bold', color: 'var(--color-primary, #0066ff)' }
              : { fontWeight: 'bold' }
          }
        >
          Gestión Admin
        </a>
      )}
      </nav>

      {/* SECCIÓN DERECHA */}
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
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

          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#102033' }}>
            {usuario?.nombre}
          </span>
        </div>
        
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