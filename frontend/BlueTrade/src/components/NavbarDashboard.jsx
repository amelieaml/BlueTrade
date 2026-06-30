import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getNotificaciones, marcarNotificacionLeida } from '../api/item.api';

const IconoNotificaciones = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth="2"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
    />
  </svg>
);
function NavbarDashboard({ 
  paginaActiva = 'dashboard',
  nombreApp = "BlueTrade",
  textoBoton = "Cerrar sesión",
  esAdmin: esAdminProp = false
}) {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U';
  const esAdmin = esAdminProp || usuario?.es_admin === true || usuario?.es_admin === "true" || usuario?.es_admin === 1 || usuario?.es_admin === "1";
  const estadoUsuario = usuario?.estado?.toString().trim().toLowerCase();

  const [usuarioActivo, setUsuarioActivo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesSinLeer, setNotificacionesSinLeer] = useState(0);

  useEffect(() => {
    setUsuarioActivo(estadoUsuario === "activo" || esAdmin);
  }, [estadoUsuario, esAdmin]);
 useEffect(() => {
    const cargarNotificaciones = async () => {

        try {
            const res = await getNotificaciones(usuario.id);
            setNotificaciones(res.data);
            const sinLeer = res.data.filter(n => !n.leido).length;
            setNotificacionesSinLeer(sinLeer);
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        }
    };
    
    // Solo llamamos si usuarioActivo es true Y tenemos un token
    if (usuario?.id) {
        cargarNotificaciones();
    }
}, [usuario]);
const handleMarcarLeida = async (id) => {
    try {
        await marcarNotificacionLeida(id);
        // Actualizamos el estado local para reflejar el cambio al instante
        setNotificaciones(prev => 
            prev.map(n => n.id === id ? { ...n, leido: true } : n)
        );
        // Restamos uno al contador
        setNotificacionesSinLeer(prev => Math.max(0, prev - 1));
    } catch (error) {
        console.error("Error al marcar como leída:", error);
    }
};

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar flex justify-between items-center p-4">
        {/* SECCIÓN IZQUIERDA */}
        <a href="/dashboard" className="logo flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <span className="logo-icon">BT</span>
          <span className="logo-text">{nombreApp}</span>
        </a>

        {/* SECCIÓN CENTRAL */}
        <nav className="nav-links flex gap-4">
          {usuarioActivo && ['dashboard', 'ofertas', 'historial', 'transacciones'].map(link => (
             <a key={link} href={`/${link}`} className={paginaActiva === link ? 'active font-bold text-blue-600' : ''}>
               {link.charAt(0).toUpperCase() + link.slice(1)}
             </a>
          ))}
          <a href="/perfil" className={paginaActiva === 'perfil' ? 'active font-bold text-blue-600' : ''}>Perfil</a>
          {esAdmin && <a href="/admin" className="font-bold">Gestión Admin</a>}
        </nav>

        {/* SECCIÓN DERECHA */}
        <div className="nav-actions flex items-center gap-4">
          <div className="user-profile-nav flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 border border-blue-100">
              {inicial}
            </div>
            <span className="text-sm font-bold text-slate-800">{usuario?.nombre}</span>
          </div>
          
          <button onClick={handleLogout} className="btn btn-primary">
            {textoBoton}
          </button>
          
          {/* BOTÓN CAMPANITA */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 transition-colors duration-200 hover:text-blue-600 focus:outline-none"
          >
            <IconoNotificaciones className="w-6 h-6" />
            {notificacionesSinLeer > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </header>

      {/* PANEL LATERAL (DRAWER) */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[2px] transition-opacity duration-300 ease-out" 
          onClick={() => setShowNotifications(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-500 ease-out ${showNotifications ? 'translate-x-0' : 'translate-x-full'}`}>
  <div className="p-6 flex flex-col h-full">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">Notificaciones</h2>
      <button onClick={() => setShowNotifications(false)} className="cursor-pointer text-gray-500 hover:text-black">✕</button>
    </div>

    {/* Lista de Notificaciones */}
    <div className="flex-1 overflow-y-auto space-y-4">
      {notificaciones.length > 0 ? (
        notificaciones.map((notif) => (
          <div 
            key={notif.id} 
            onClick={() => !notif.leido && handleMarcarLeida(notif.id)} // <--- Se marca al hacer clic
            className={`p-4 rounded-lg border text-sm transition-all cursor-pointer ${
              notif.leido ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <p className={`font-medium ${notif.leido ? 'text-gray-600' : 'text-blue-900'}`}>
              {notif.mensaje}
            </p>
            <span className="text-xs text-gray-400 mt-2 block">
              {new Date(notif.creado_el).toLocaleDateString()}
            </span>
          </div>
        ))
      ) : (
        <div className="text-gray-400 text-center mt-10">No tienes notificaciones.</div>
      )}
    </div>
  </div>
</div>
    </>
  );
}

export default NavbarDashboard;