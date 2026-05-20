import { createContext, useState, useEffect } from 'react';

// 1. Creamos el contenedor de los datos
export const AuthContext = createContext();

// 2. Creamos el proveedor que envolverá a la aplicación
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Al abrir la aplicación, revisamos si el navegador recuerda al usuario
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('usuario_comunidad');
    if (sesionGuardada) {
      setUsuario(JSON.parse(sesionGuardada));
    }
  }, []);

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

  return (
    <AuthContext.Provider value={{ usuario, login, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};