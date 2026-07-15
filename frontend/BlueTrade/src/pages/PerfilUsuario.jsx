import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavbarDashboard from '../components/NavbarDashboard';
// 1. IMPORTANTE: Agregamos obtenerCobrosComunales aquí
import { guardarCertificado, getServicios, getResenasUsuario, getUsuario, obtenerCobrosComunales } from '../api/item.api'; 
import { useParams } from 'react-router-dom'; 
import '../styles/PerfilUsuario.css'; 
import Alerta from '../components/alerta';

function PerfilUsuario() {
  const { usuario: usuarioLogueado } = useContext(AuthContext);
  const { id } = useParams(); 

  const cobrosCargadosRef = useRef(false);

  const [usuario, setUsuario] = useState(() => {
    return id ? null : usuarioLogueado;
  });
  const [archivo, setArchivo] = useState(null);
  const [serviciosDB, setServiciosDB] = useState([]);
  const [tipoServicio, setTipoServicio] = useState(''); 
  const [cargando, setCargando] = useState(false);
  const [resenas, setResenas] = useState([]);
  
  // 2. Estado para almacenar los cobros comunales
  const [cobros, setCobros] = useState([]);
  const [perfilPublicoConsultado, setPerfilPublicoConsultado] = useState(false);

  const [cargandoPerfil, setCargandoPerfil] = useState(Boolean(id));
  const [cargandoResenas, setCargandoResenas] = useState(true);
  const [cargandoCobros, setCargandoCobros] = useState(true);
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState(null);
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: 'success' });

  useEffect(() => {
    let componenteActivo = true;

    const cargarPerfil = async () => {
      const idUrlNum = id ? Number(id) : null;
      const usuarioLogueadoId = usuarioLogueado?.id
        ? Number(usuarioLogueado.id)
        : null;

      const esPerfilPropio =
        !idUrlNum || idUrlNum === usuarioLogueadoId;

      const usuarioIdAConsultar =
        idUrlNum || usuarioLogueadoId;

      setPerfilPublicoConsultado(false);


      if (esPerfilPropio && usuarioLogueado) {
        setUsuario(usuarioLogueado);
        setCargandoPerfil(false);
        setPerfilPublicoConsultado(true);

        try {
          const responsePerfilCompleto = await getUsuario(
            usuarioLogueadoId
          );

          if (componenteActivo) {
            setUsuario(responsePerfilCompleto.data);
          }
        } catch (error) {
          console.error(
            "Error al cargar el perfil completo:",
            error
          );
        }
      }

      if (!esPerfilPropio && idUrlNum) {
        setUsuario(null);
        setCargandoPerfil(true);

        try {
          const responsePublico = await getUsuario(idUrlNum);

          if (componenteActivo) {
            setUsuario(responsePublico.data);
          }
        } catch (error) {
          console.error("Error al consultar el perfil público:", error);

          if (componenteActivo) {
            setUsuario(null);
          }
        } finally {
          if (componenteActivo) {
            setCargandoPerfil(false);
            setPerfilPublicoConsultado(true);
          }
        }
      }

      if (!usuarioIdAConsultar) {
        setCargandoPerfil(false);
        setCargandoResenas(false);
        setCargandoCobros(false);
        return;
      }

      setCargandoResenas(true);

      if (!cobrosCargadosRef.current) {
        setCargandoCobros(true);
      }

      const promesaServicios = getServicios()
        .then((response) => {
          if (!componenteActivo) return;

          const servicios = Array.isArray(response.data)
            ? response.data
            : response.data?.results || [];

          setServiciosDB(
            servicios.filter((servicio) => !servicio.es_externo)
          );
        })
        .catch((error) => {
          console.error("Error al cargar servicios:", error);

          if (componenteActivo) {
            setServiciosDB([]);
          }
        });

      const promesaResenas = getResenasUsuario(usuarioIdAConsultar)
        .then((response) => {
          if (!componenteActivo) return;

          const data = Array.isArray(response.data)
            ? response.data
            : response.data?.results || [];

          setResenas(data);
        })
        .catch((error) => {
          console.error("Error al cargar reseñas:", error);

          if (componenteActivo) {
            setResenas([]);
          }
        })
        .finally(() => {
          if (componenteActivo) {
            setCargandoResenas(false);
          }
        });

      let promesaCobros = Promise.resolve();

      if (!cobrosCargadosRef.current) {
        cobrosCargadosRef.current = true;

        promesaCobros = obtenerCobrosComunales()
          .then((response) => {
            if (!componenteActivo) return;

            const data = Array.isArray(response.data)
              ? response.data
              : response.data?.results || [];

            const cobrosOrdenados = [...data].sort(
              (a, b) =>
                new Date(b.fecha_creacion) -
                new Date(a.fecha_creacion)
            );

            setCobros(cobrosOrdenados);
          })
          .catch((error) => {
            console.error("Error al cargar cobros:", error);

            cobrosCargadosRef.current = false;

            if (componenteActivo) {
              setCobros([]);
            }
          })
          .finally(() => {
            if (componenteActivo) {
              setCargandoCobros(false);
            }
          });
      } else {
        setCargandoCobros(false);
      }

      await Promise.allSettled([
        promesaServicios,
        promesaResenas,
        promesaCobros,
      ]);
      }; // Cierra cargarPerfil

      cargarPerfil();

      return () => {
        componenteActivo = false;
      };
    }, [id, usuarioLogueado?.id]);

  const promedioCalificacion = resenas.length > 0 
    ? (resenas.reduce((acc, r) => acc + Number(r.calificacion), 0) / resenas.length).toFixed(1)
    : "0.0";

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

  const obtenerUrlCertificado = (archivo) => {
    if (!archivo) return "";

    if (
      archivo.startsWith("http://") ||
      archivo.startsWith("https://")
    ) {
      return archivo;
    }

    return `http://127.0.0.1:8000${archivo}`;
  };

  const esArchivoPDF = (archivo) => {
    if (!archivo) return false;

    const archivoSinParametros = archivo
      .split("?")[0]
      .toLowerCase();

    return archivoSinParametros.endsWith(".pdf");
  };

  const abrirCertificado = (certificado) => {
    const rutaArchivo =
      certificado?.archivo_url || certificado?.archivo;

    if (!rutaArchivo) return;

    setCertificadoSeleccionado(certificado);
  };

  const cerrarCertificado = () => {
    setCertificadoSeleccionado(null);
  };

  const subirArchivo = (e) => {
    const archivoSeleccionado = e.target.files?.[0] || null;
    setArchivo(archivoSeleccionado);
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!archivo || !tipoServicio || !usuario?.id) {
      setAlerta({
          mostrar: true,
          mensaje: "Selecciona una especialidad y un archivo.",
          tipo: "error"
        });
      return;
    }

    setCargando(true);

    try {
      await guardarCertificado(
        usuario.id,
        tipoServicio,
        archivo
      );

      const responseUsuario = await getUsuario(usuario.id);
      setUsuario(responseUsuario.data);
      setAlerta({
          mostrar: true,
          mensaje: "Certificado enviado a revisión con éxito.",
          tipo: "success"
        });

      setArchivo(null);
      setTipoServicio("");
    } catch (error) {
      console.error(
        "Error al procesar el certificado:",
        error.response?.data || error
      );
      setAlerta({
          mostrar: true,
          mensaje: "Error al subir el documento. Revisa la consola.",
          tipo: "error"
        });
    } finally {
      setCargando(false);
    }
  };

  if (!usuario && cargandoPerfil) {
    return (
      <div className="perfil-main-container">
        <NavbarDashboard paginaActiva="perfil" />

        <div className="perfil-wrapper">
          <div className="perfil-card-central">
            <div className="perfil-cabecera">
              <div
                className="perfil-avatar"
                style={{
                  background: "#e8eef7",
                  color: "transparent",
                }}
              >
                --
              </div>

              <div className="perfil-nombre-container">
                <div
                  style={{
                    width: "220px",
                    height: "25px",
                    borderRadius: "8px",
                    background: "#e8eef7",
                  }}
                />

                <div
                  style={{
                    width: "140px",
                    height: "14px",
                    marginTop: "10px",
                    borderRadius: "6px",
                    background: "#f0f4f8",
                  }}
                />
              </div>
            </div>

            <div
              className="balance-container"
              style={{
                minHeight: "190px",
                opacity: 0.55,
              }}
            />

            <div className="grid-detalles">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="detalle-card"
                  style={{
                    minHeight: "90px",
                    background: "#f5f8fc",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario && id && perfilPublicoConsultado) {
    return (
      <div className="perfil-main-container">
        <NavbarDashboard paginaActiva="perfil" />

        <div className="perfil-wrapper">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-bold text-gray-500 m-0">
              El usuario solicitado no existe o no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="perfil-main-container">
        <NavbarDashboard paginaActiva="perfil" />
      </div>
    );
  }

  const litrosTotales = Number(usuario.litros_agua) || 0;
  const litrosBloqueados = Number(usuario.litros_bloqueados) || 0;
  const litrosDisponiblesBackend = Number(usuario.litros_disponibles);

  const litrosDisponibles = Number.isFinite(litrosDisponiblesBackend)
    ? litrosDisponiblesBackend
    : litrosTotales - litrosBloqueados;
  const porcentajeDisponible = litrosTotales > 0 ? (litrosDisponibles / litrosTotales) * 100 : 0;
  
  const misCertificados = usuario.certificados || [];

  const archivoCertificadoSeleccionado =
    certificadoSeleccionado?.archivo_url ||
    certificadoSeleccionado?.archivo ||
    "";

  return (
    <div className="perfil-main-container">
      <NavbarDashboard paginaActiva="perfil" />
      {alerta.mostrar && (
        <Alerta 
          mensaje={alerta.mensaje} 
          tipo={alerta.tipo} 
          onClose={() => setAlerta(prev => ({ ...prev, mostrar: false }))} 
        />
      )}
      <div className="perfil-wrapper">
        <div className="perfil-card-central">
          
          <div className="perfil-cabecera">
            <div className="perfil-avatar">
              {getIniciales(usuario.nombre)}
            </div>
            <div className="perfil-nombre-container">
              <h1 className="perfil-nombre">{usuario.nombre}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      style={{ 
                        width: '15px', 
                        height: '15px', 
                        color: i < Math.round(Number(promedioCalificacion)) ? '#ffb400' : 'rgba(99, 116, 137, 0.4)' 
                      }} 
                      fill={i < Math.round(Number(promedioCalificacion)) ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.233.577 1.83l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.97-2.88a1 1 0 00-1.176 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.783-.597-.384-1.83.577-1.83h4.906a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 'black', color: '#000000' }}>
                  {promedioCalificacion}
                </span>
                <span style={{ fontSize: '11px', color: '#637489' }}>
                  ({resenas.length} {resenas.length === 1 ? 'opinión' : 'opiniones'})
                </span>
              </div>

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
                <span className="balance-subtitulo">Balance Neto Disponible</span>
                <div className="balance-litros-wrapper">
                  <h2 className="balance-litros-principal">
                    {litrosDisponibles.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </h2>
                  <span className="balance-decay-label balance-unidad">Litros</span>
                </div>
              </div>
              
              <div className="balance-widgets-container">
                <div className="balance-widget-total">
                  <span className="balance-widget-label-total">Total</span>
                  <span className="balance-widget-valor-total">{litrosTotales.toLocaleString('de-DE')} L</span>
                </div>
                <div className="balance-widget-bloqueado">
                  <span className="balance-widget-label-bloqueado">
                    <span className="balance-widget-pulso"></span>
                    Bloqueado
                  </span>
                  <span className="balance-widget-valor-bloqueado">
                    {litrosBloqueados.toLocaleString('de-DE', { minimumFractionDigits: 1 })} L
                  </span>
                </div>
              </div>
            </div>

            <div className="balance-progreso-wrapper">
              <div className="balance-barra-fondo">
                <div 
                  className="balance-barra-relleno"
                  style={{ width: `${Math.min(Math.max(porcentajeDisponible, 0), 100)}%` }}
                ></div>
              </div>
              <div className="balance-barra-footer">
                <span>0 L</span>
                <span className="balance-porcentaje-badge">
                  {porcentajeDisponible.toFixed(0)}% Disponible
                </span>
                <span>{litrosTotales.toLocaleString('de-DE')} L</span>
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
                <h3 className="seccion-titulo">Mis Servicios Habilitados</h3>
                <p className="seccion-descripcion">Especialidades postuladas mediante comprobante.</p>
              </div>

              <div className="servicios-lista">
                {misCertificados.length > 0 ? (
                  misCertificados.map((cert, index) => {
                    const rutaArchivo = cert.archivo_url || cert.archivo;
                    const urlArchivo = obtenerUrlCertificado(rutaArchivo);
                    const archivoEsPDF = esArchivoPDF(rutaArchivo);

                    return (
                      <div
                        key={cert.id || index}
                        className="servicio-item-plomeria"
                      >
                        <div className="servicio-certificado-contenido">
                          <button
                            type="button"
                            className="certificado-miniatura"
                            onClick={() => abrirCertificado(cert)}
                            disabled={!urlArchivo}
                            aria-label="Ver certificado"
                          >
                            {urlArchivo ? (
                              archivoEsPDF ? (
                                <div className="certificado-miniatura-pdf">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14 2v6h6M8 13h8M8 17h5"
                                    />
                                  </svg>

                                  <span>PDF</span>
                                </div>
                              ) : (
                                <img
                                  src={urlArchivo}
                                  alt={`Certificado de ${
                                    cert.nombre_servicio || "servicio"
                                  }`}
                                  loading="lazy"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              )
                            ) : (
                              <div className="certificado-miniatura-vacia">
                                Sin archivo
                              </div>
                            )}

                            {urlArchivo && (
                              <span className="certificado-miniatura-overlay">
                                Ver
                              </span>
                            )}
                          </button>

                          <div className="servicio-info-flex">
                            <div className="servicio-icono-plomeria">
                              <svg
                                className="svg-icono-standard"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>

                            <div className="servicio-certificado-datos">
                              <h4 className="servicio-nombre-plomeria">
                                {cert.nombre_servicio ||
                                  `Servicio Técnico #${cert.tipo_servicio}`}
                              </h4>

                              <p className="servicio-id-label">
                                ID Ref:{" "}
                                <span className="servicio-id-badge">
                                  #{cert.id || index + 1}
                                </span>
                              </p>

                              {urlArchivo && (
                                <button
                                  type="button"
                                  className="certificado-ver-boton"
                                  onClick={() => abrirCertificado(cert)}
                                >
                                  Ver certificado
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
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

            {(!id || id == usuarioLogueado?.id) && (
            <div className="formulario-container">
              <div>
                <h3 className="seccion-titulo">Subir Certificado</h3>
                <p className="seccion-descripcion">Sube tu certificado para poder prestar un nuevo servicio.</p>
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
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      onChange={subirArchivo}
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
                  <button type="submit" disabled={cargando} className="form-boton-subir">
                    {cargando ? "Procesando bloque..." : "Postular Certificado"}
                  </button>
                )}
              </form>
            </div>)}
          </div>

          <div className="reseñas-seccion-container" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0, 102, 255, 0.1)' }}>
            <div>
              <h3 className="seccion-titulo">Reseñas de la Comunidad</h3>
              <p className="seccion-descripcion">Calificaciones otorgadas por los vecinos en transacciones previas.</p>
            </div>

            <div className="reseñas-lista" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              {cargandoResenas && resenas.length === 0 ? (
                <p className="text-[11px] font-medium text-[#637489] italic pt-2">
                  Cargando reseñas...
                </p>
              ) : resenas.length > 0 ? (
                resenas.map((resena) => (
                  <div 
                    key={resena.id} 
                    className="resena-item-card" 
                    style={{ 
                      background: 'rgba(254, 240, 138, 0.03)', 
                      border: '1px solid #e2e8f0', 
                      padding: '16px', 
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px -2px rgba(20, 70, 140, 0.06), 0 2px 6px -1px rgba(20, 70, 140, 0.03)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div className="estrellas-container" style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            style={{ 
                              width: '13px', 
                              height: '13px', 
                              color: i < resena.calificacion ? '#eab308' : 'rgba(145, 160, 178, 0.3)' 
                            }} 
                            fill={i < resena.calificacion ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.233.577 1.83l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.97-2.88a1 1 0 00-1.176 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.783-.597-.384-1.83.577-1.83h4.906a1 1 0 00.95-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', color: '#91a0b2', fontWeight: '500' }}>
                        {new Date(resena.fecha).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#000000', margin: '0', lineHeight: '1.5', fontWeight: '500' }}>
                      "{resena.comentario}"
                    </p>

                    <div style={{ marginTop: '8px', fontSize: '10px', color: '#0066ff', fontFamily: 'monospace', fontWeight: '600', opacity: 0.8 }}>
                      Transacción #{resena.transaccion}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] font-medium text-[#637489] italic pt-2">
                  Aún no has recibido calificaciones en la plataforma.
                </p>
              )}
            </div>
          </div>

          {/* 4. NUEVA SECCIÓN: HISTORIAL DE COBROS COMUNALES */}
          <div className="cobros-seccion-container" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0, 102, 255, 0.1)' }}>
            <div>
              <h3 className="seccion-titulo">Historial de Cobros Comunales</h3>
              <p className="seccion-descripcion">Descuentos automáticos aplicados al saldo de litros.</p>
            </div>

            <div className="cobros-lista" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              {cargandoCobros && cobros.length === 0 ? (
                <p className="text-[11px] font-medium text-[#637489] italic pt-2">
                  Cargando historial...
                </p>
              ) : cobros.length > 0 ? (
                cobros.map((cobro) => (
                  <div
                    key={cobro.id}
                    style={{
                      background: '#f3f8ff',
                      border: '1px solid #dbe4ea',
                      padding: '16px',
                      borderRadius: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f1f33' }}>
                        {cobro.descripcion}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#637489', fontWeight: '500' }}>
                        {new Date(cobro.fecha_creacion).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '16px', fontWeight: '900', color: '#ef4444' }}>
                        - {Number(cobro.alicuota).toFixed(2)} L
                      </span>
                      <span style={{ fontSize: '10px', color: '#91a0b2', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Alícuota
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] font-medium text-[#637489] italic pt-2">
                  No se han registrado cobros comunales en la plataforma.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

    {certificadoSeleccionado && (
      <div
        className="certificado-modal-fondo"
        onClick={cerrarCertificado}
        role="presentation"
      >
        <div
          className="certificado-modal"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa del certificado"
        >
          <div className="certificado-modal-header">
            <div>
              <span className="certificado-modal-etiqueta">
                Certificado
              </span>

              <h3 className="certificado-modal-titulo">
                {certificadoSeleccionado.nombre_servicio ||
                  `Servicio Técnico #${certificadoSeleccionado.tipo_servicio}`}
              </h3>
            </div>

            <button
              type="button"
              className="certificado-modal-cerrar"
              onClick={cerrarCertificado}
              aria-label="Cerrar certificado"
            >
              ×
            </button>
          </div>

          <div className="certificado-modal-contenido">
            {esArchivoPDF(archivoCertificadoSeleccionado) ? (
              <iframe
                src={obtenerUrlCertificado(
                  archivoCertificadoSeleccionado
                )}
                title="Vista previa del certificado PDF"
                className="certificado-modal-pdf"
              />
            ) : (
              <img
                src={obtenerUrlCertificado(
                  archivoCertificadoSeleccionado
                )}
                alt="Certificado ampliado"
                className="certificado-modal-imagen"
              />
            )}
          </div>

          <div className="certificado-modal-footer">
            <a
              href={obtenerUrlCertificado(
                certificadoSeleccionado.archivo_url ||
certificadoSeleccionado.archivo
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="certificado-abrir-enlace"
            >
              Abrir archivo original
            </a>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}

export default PerfilUsuario;