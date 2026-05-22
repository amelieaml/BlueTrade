import { createContext, useState, useEffect } from 'react';
import { getUsuario} from '../api/item.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const actualizarUsuario = (nuevosDatos) => {
    setUsuario((prev) => ({ ...prev, ...nuevosDatos }));
  };
  //obtiene el perfil con las actualizaciones que se van realizando 
  const obtenerPerfilActualizado = async (id) => {
    try {
      const respuesta = await getUsuario(id);
      setUsuario(respuesta.data);
    } catch (error) {
      console.error("Error obteniendo el perfil actualizado:", error);
    }
  };
  
  // Función para iniciar sesión
  const login = (datosUsuario) => {
    localStorage.setItem('usuario_comunidad', JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('usuario_comunidad');
    setUsuario(null);
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

return (
  <AuthContext.Provider value={{ usuario, login, cerrarSesion, actualizarUsuario, obtenerPerfilActualizado}}>
    {children}
  </AuthContext.Provider>
);
};