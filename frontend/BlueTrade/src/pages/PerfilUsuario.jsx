import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavbarDashboard from '../components/NavbarDashboard';
import { guardarCertificado, getServicios } from '../api/item.api';
import '../styles/PerfilUsuario.css'; 

function PerfilUsuario() {
  const { usuario, obtenerPerfilActualizado } = useContext(AuthContext);
  const [archivo, setArchivo] = useState(null);
  const [serviciosDB, setServiciosDB] = useState([]);
  const [tipoServicio, setTipoServicio] = useState(''); 
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const response = await getServicios();
        setServiciosDB(response.data);
      } catch (error) {
        console.error("Error al recuperar los servicios:", error);
      }
    };
    if (usuario?.id) cargarServicios();
  }, [usuario]);

  const getIniciales = (nombre) => {
    if (!nombre) return "??";
    return nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getBadgeEstadoConfig = (estado) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'EN_ESPERA':
      case 'REVISION_PENDIENTE':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'RECHAZADO':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default:
        return 'bg-[#0066ff]/10 text-[#0066ff]/90 border-[#0066ff]/20';
    }
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo || !tipoServicio) return;
    
    setCargando(true);
    try {
      const formData = new FormData();
      formData.append('certificado', archivo);
      formData.append('tipo_servicio', tipoServicio); 

      await guardarCertificado(usuario.id, formData);
      await obtenerPerfilActualizado(usuario.id); 
      alert("Certificado enviado a revisión con éxito.");
      setArchivo(null);
      setTipoServicio('');
    } catch (error) {
      console.error("Error al procesar el certificado:", error);
      alert("Error al subir el documento.");
    } finally {
      setCargando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="perfil-loading-container">
        <div className="flex items-center gap-3">
          <div className="perfil-loading-spinner"></div>
          <span>Sincronizando registros del sistema...</span>
        </div>
      </div>
    );
  }

  const litrosTotales = usuario.litros_agua || 0;
  const litrosDisponibles = usuario.litros_disponibles !== undefined ? usuario.litros_disponibles : litrosTotales;
  const porcentajeDisponible = litrosTotales > 0 ? (litrosDisponibles / litrosTotales) * 100 : 0;
  
  const misCertificados = usuario.certificados || [];

  return (
    <div className="perfil-main-container">
      <NavbarDashboard paginaActiva="perfil" />

      <div className="perfil-wrapper">
        
        <div className="perfil-card-central">
          
          <div className="perfil-cabecera">
            <div className="perfil-avatar">
              {getIniciales(usuario.nombre)}
            </div>
            
            <div className="perfil-nombre-container">
              <h1 className="perfil-nombre">
                {usuario.nombre}
              </h1>
            </div>

            <div className="perfil-badge-container">
              <span className={`perfil-badge-base ${getBadgeEstadoConfig(usuario.estado)}`}>
                Estatus: {usuario.estado ? usuario.estado.replace('_', ' ') : 'EN ESPERA'}
              </span>
            </div>
          </div>

          <div className="balance-container">
            <div className="balance-decoracion"></div>
            
            <div className="balance-header">
              <div>
                <span className="balance-subtitulo">
                  Balance Neto Disponible
                </span>
                <div className="balance-litros-wrapper">
                  <h2 className="balance-litros-principal">
                    {litrosDisponibles.toLocaleString('de-DE')}
                  </h2>
                  <span className="balance-decay-label balance-unidad">Litros</span>
                </div>
              </div>
              
              <div className="balance-widgets-container">
                <div className="balance-widget-total">
                  <span className="balance-widget-label-total">Total</span>
                  <span className="balance-widget-valor-total">{litrosTotales} L</span>
                </div>
                <div className="balance-widget-bloqueado">
                  <span className="balance-widget-label-bloqueado">
                    <span className="balance-widget-pulso"></span>
                    Bloqueado
                  </span>
                  <span className="balance-widget-valor-bloqueado">{usuario.litros_bloqueados || "0.0"} L</span>
                </div>
              </div>
            </div>

            <div className="balance-progreso-wrapper">
              <div className="balance-barra-fondo">
                <div 
                  className="balance-barra-relleno"
                  style={{ width: `${Math.min(porcentajeDisponible, 100)}%` }}
                ></div>
              </div>
              <div className="balance-barra-footer">
                <span>0 L</span>
                <span className="balance-porcentaje-badge">
                  {porcentajeDisponible.toFixed(0)}% Disponible
                </span>
                <span>{litrosTotales} L</span>
              </div>
            </div>
          </div>

          <div className="grid-detalles">
            <div className="detalle-card">
              <div>
                <span className="detalle-label">Inmueble</span>
                <span className="detalle-valor">{usuario.codigo_casa}</span>
              </div>
              <div className="detalle-icono-wrapper-inmueble">
                <svg className="svg-icono-standard" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
            </div>

            <div className="detalle-card">
              <div>
                <span className="detalle-label">Cédula Identidad</span>
                <span className="detalle-valor">{usuario.ci}</span>
              </div>
              <div className="detalle-icono-wrapper-cedula">
                <svg className="svg-icono-standard" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25zm3-10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10.5 15h3a.75.75 0 01.75.75v.75H9.75v-.75a.75.75 0 01.75-.75z" />
                </svg>
              </div>
            </div>

            <div className="detalle-card">
              <div>
                <span className="detalle-label">Contacto</span>
                <span className="detalle-valor">{usuario.telefono || 'No asociado'}</span>
              </div>
              <div className="detalle-icono-wrapper-contacto">
                <svg className="svg-icono-standard" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
            </div>

            <div className="detalle-card-truncate">
              <div className="truncate w-[75%]">
                <span className="detalle-label">Correo Electrónico</span>
                <span className="detalle-valor-email" title={usuario.email}>{usuario.email}</span>
              </div>
              <div className="detalle-icono-wrapper-correo">
                <svg className="svg-icono-standard" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid-secundario">
            
            <div className="servicios-container">
              <div>
                <h3 className="seccion-titulo">
                  Mis Servicios Habilitados
                </h3>
                <p className="seccion-descripcion">
                  Especialidades postuladas mediante comprobante.
                </p>
              </div>

              <div className="servicios-lista">
                {misCertificados.length > 0 ? (
                  misCertificados.map((cert, index) => {
                    const esActivo = usuario.certificado;

                    return (
                      <div 
                        key={cert.id || index} 
                        className={esActivo ? "servicio-item-plomeria" : "servicio-item-electrico"}
                      >
                        <div className="servicio-info-flex">
                          <div className={esActivo ? "servicio-icono-plomeria" : "servicio-icono-electrico"}>
                            <svg className="svg-icono-standard" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className={esActivo ? "servicio-nombre-plomeria" : "servicio-nombre-electrico"}>
                              {cert.nombre_servicio || `Servicio Técnico #${cert.tipo_servicio}`}
                            </h4>
                            <p className="servicio-id-label">
                              ID Ref: <span className="servicio-id-badge">#{cert.id || index + 1}</span>
                            </p>
                          </div>
                        </div>
                        <span className={esActivo ? "servicio-status-activo" : "servicio-status-revision"}>
                          {esActivo ? "Activo" : "Revisión"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[11px] font-medium text-[#637489] italic pt-2">
                    No has cargado certificados para validar competencias técnicas aún.
                  </p>
                )}
              </div>
            </div>

            <div className="formulario-container">
              <div>
                <h3 className="seccion-titulo">
                  Subir Certificado
                </h3>
                <p className="seccion-descripcion">
                  Sube tu certificado para poder prestar un nuevo servicio.
                </p>
              </div>

              <form onSubmit={handleUpload} className="form-elementos">
                <div>
                  <select 
                    value={tipoServicio}
                    onChange={(e) => setTipoServicio(e.target.value)}
                    required
                    className="form-select"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23637489\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '14px' }}
                  >
                    <option value="" className="form-option-placeholder"> Seleccionar Especialidad </option>
                    {serviciosDB.map((serv) => (
                      <option key={serv.id} value={serv.id}>{serv.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    archivo 
                      ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10" 
                      : "border-[#0066ff]/20 bg-white hover:bg-[#0066ff]/5"
                  }`}>
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      required
                      className="dropzone-input-oculto" 
                    />
                    <div className="dropzone-contenido">
                      <svg className={`svg-icono-mediano ${archivo ? "text-emerald-600" : "text-[#0066ff]/60"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        {archivo ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        )}
                      </svg>
                      <span className={`text-[11px] font-bold block max-w-full truncate ${archivo ? "text-emerald-700" : "text-[#637489]"}`}>
                        {archivo ? `${archivo.name}` : "Adjuntar PDF o Imagen"}
                      </span>
                    </div>
                  </div>
                </div>

                {archivo && tipoServicio && (
                  <button 
                    type="submit"
                    disabled={cargando}
                    className="form-boton-subir"
                  >
                    {cargando ? "Procesando bloque..." : "Postular Certificado"}
                  </button>
                )}
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PerfilUsuario;