import { createContext, useState, useEffect } from 'react';
import { getUsuario } from '../api/item.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  // Buscamos el token al cargar la app
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const actualizarUsuario = (nuevosDatos) => {
    setUsuario((prev) => ({ ...prev, ...nuevosDatos }));
  };

  const obtenerPerfilActualizado = async (id) => {
    try {
      const respuesta = await getUsuario(id);
      setUsuario(respuesta.data);
    } catch (error) {
      console.error("Error obteniendo el perfil actualizado:", error);
    }
  };
  
  // ¡Modificación Clave!: Ahora recibimos el tokenRecibido como segundo parámetro
  const login = (datosUsuario, tokenRecibido) => {
    localStorage.setItem('usuario_comunidad', JSON.stringify(datosUsuario));
    
    // Si nos pasan un token, lo guardamos en su propia bóveda
    if (tokenRecibido) {
      localStorage.setItem('token', tokenRecibido);
      setToken(tokenRecibido);
    }
    
    setUsuario(datosUsuario);
  };

  // Limpiamos todo al cerrar sesión por seguridad
  const cerrarSesion = () => {
    localStorage.removeItem('usuario_comunidad');
    localStorage.removeItem('token'); // Borramos el token
    setUsuario(null);
    setToken(null);
  };

  useEffect(() => {
    const sesionGuardada = localStorage.getItem('usuario_comunidad');
    if (sesionGuardada) {
      const usuarioParseado = JSON.parse(sesionGuardada);
      setUsuario(usuarioParseado);
      if (usuarioParseado && usuarioParseado.id) {
        obtenerPerfilActualizado(usuarioParseado.id);
      }
    }
  }, []);

  // Exponemos el token en el Provider por si lo necesitas en algún componente
  return (
    <AuthContext.Provider value={{ usuario, token, login, cerrarSesion, actualizarUsuario, obtenerPerfilActualizado }}>
      {children}
    </AuthContext.Provider>
  );
};