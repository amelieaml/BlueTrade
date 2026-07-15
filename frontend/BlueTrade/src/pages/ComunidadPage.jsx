// pages/ComunidadPage.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

import NavbarDashboard from '../components/NavbarDashboard';
import FiltroComunidad from '../components/FiltroComunidad';
import Alerta from '../components/alerta';
import { getServicios } from '../api/item.api';

function ComunidadPage() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [vecinos, setVecinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });

  const [filtros, setFiltros] = useState({
    nombre: '',
    servicio: '',
    reputacion: 0,
    ordenar: 'alfabetico'
  });

  const [tagActivo, setTagActivo] = useState('');

  const obtenerDirectorio = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        nombre: filtros.nombre || '',
        servicio: tagActivo || '',
        reputacion: filtros.reputacion || 0,
        ordenar: filtros.ordenar || 'alfabetico'
      });

      const sesionGuardada = localStorage.getItem('usuario_comunidad');
      const token = sesionGuardada ? JSON.parse(sesionGuardada).token : null; 

      const response = await axios.get(`http://127.0.0.1:8000/item/test/usuarios/comunidad/?${params.toString()}`, {
        headers: { 
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      console.log("Usuarios recibidos de la comunidad:", response.data);

      if (Array.isArray(response.data)) {
        setVecinos(response.data);
      } else if (response.data && response.data.results) {
        setVecinos(response.data.results);
      } else {
        setVecinos([]);
      }

    } catch (error) {
      console.error("Error al obtener el directorio:", error);
      setAlerta({
        mostrar: true,
        mensaje: "No se pudo sincronizar el directorio de la comunidad.",
        tipo: "error"
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDirectorio();
  }, [filtros, tagActivo]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const [serviciosDB, setServiciosDB] = useState([]);
  useEffect(() => {
      getServicios().then(res => setServiciosDB(res.data));
  }, []);

  const categoriasDisponibles = useMemo(() => serviciosDB.map(s => s.nombre), [serviciosDB]);

  const getIniciales = (nombre) => {
    if (!nombre) return "??";
    return nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

      <NavbarDashboard paginaActiva="comunidad" />

      {alerta.mostrar && (
        <Alerta 
          mensaje={alerta.mensaje} 
          tipo={alerta.tipo} 
          onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))} 
        />
      )}

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-12 relative z-10">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white/86 border border-white/90 p-8 rounded-[32px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(20,70,140,0.18)]">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-2px] text-[#0f1f33] leading-none m-0">
              Directorio de la <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">Comunidad</span>
            </h1>
            <p className="text-[#5d6f82] mt-4 text-lg leading-relaxed max-w-2xl m-0">
              Conoce los perfiles de tus vecinos.
            </p>
          </div>
        </div>

        {/* Layout en dos columnas: Filtros e Información */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Aside de Filtros */}
          <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-extrabold text-[#102033] mb-6">Filtros Avanzados</h3>
              <FiltroComunidad 
                filtros={filtros} 
                onFiltroChange={handleFiltroChange} 
                tagActivo={tagActivo} 
                onTagChange={setTagActivo} 
                tagsDisponibles={serviciosDB.map(s => s.nombre)} // <--- Esto envía solo los nombres
              />
            </div>
          </aside>

          {/* Sección de Tarjetas de Perfil */}
          <section className="flex-grow w-full">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
              <div className="mb-8 border-b border-[#0066ff]/10 pb-6 flex justify-between items-center">
                <h3 className="text-2xl font-extrabold text-[#102033]">Vecinos Registrados</h3>
                <p className="text-sm font-bold text-[#0066ff] bg-[#0066ff]/10 px-4 py-2 rounded-full inline-flex m-0">
                  {Array.isArray(vecinos) ? vecinos.length : 0} activos
                </p>
              </div>

              {cargando ? (
                <div className="text-center py-20 font-semibold text-[#5d6f82]">
                  <div className="w-6 h-6 border-2 border-[#0066ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Sincronizando perfiles del condominio...
                </div>
              ) : (!Array.isArray(vecinos) || vecinos.length === 0) ? (
                <div className="text-center py-20 text-[#637489] font-medium border-2 border-dashed border-[#0066ff]/20 rounded-2xl bg-slate-50/50">
                  No se encontraron vecinos que coincidan con los criterios establecidos.
                </div>
              ) : (
                /* Grid de Perfiles de Vecinos PROTEGIDO */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vecinos.map((vecino) => (
                    <div
                      key={vecino.id}
                      onClick={() => navigate(`/perfil/${vecino.id}`)} // Acceso directo al detalle en 1 clic
                      className="bg-white border border-[#dbe4ea] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-[0_20px_40px_rgba(20,70,140,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    >
                      {/* Cabecera Tarjeta */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0052cc] to-[#00b8ff] flex items-center justify-center text-white text-md font-black shadow-sm group-hover:scale-105 transition-transform">
                          {getIniciales(vecino.nombre)}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-base font-extrabold text-[#0f1f33] truncate m-0 group-hover:text-[#0066ff] transition-colors">
                            {vecino.nombre}
                          </h4>
                          <span className="text-[11px] font-bold text-[#91a0b2] block uppercase tracking-wider mt-0.5">
                            Inmueble: <span className="text-[#3D4F6E]">{vecino.codigo_casa}</span>
                          </span>
                        </div>
                      </div>

                      {/* Cuerpo Técnico */}
                      <div className="bg-[#f3f8ff] rounded-xl p-3 mb-4 flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-[#91a0b2] uppercase tracking-wider">Servicio Principal</span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#0066ff] truncate">
                            {vecino.tipo_servicio_principal || "Sin especificar"}
                          </span>
                          {vecino.certificado_verificado && (
                            <span className="bg-emerald-500/10 text-emerald-600 font-bold text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                              ✓ Verificado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer Tarjeta: Reputación Basada en tus Estrellas */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#eef6ff]">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-3.5 h-3.5"
                                style={{
                                  color: i < Math.round(Number(vecino.reputacion || 0)) ? '#ffb400' : 'rgba(99, 116, 137, 0.2)'
                                }}
                                fill={i < Math.round(Number(vecino.reputacion || 0)) ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.233.577 1.83l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.97-2.88a1 1 0 00-1.176 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.783-.597-.384-1.83.577-1.83h4.906a1 1 0 00.95-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-black text-[#102033] ml-1">{vecino.reputacion || "0.0"}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#0066ff] group-hover:underline inline-flex items-center gap-0.5">
                          Ver Perfil 
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default ComunidadPage;