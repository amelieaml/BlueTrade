import { useState, useEffect } from 'react';
import '../styles/RegisterPage.css';
// Asegúrate de tener getServicios exportado en tu archivo item.api.js
import { registrarUsuario, guardarCertificado, getServicios, registrarUsuarioCompleto } from '../api/item.api.js';
import { useNavigate } from 'react-router-dom';
function RegisterPage() {
  const [intencionAgua, setIntencionAgua] = useState(false);
  const [intencionServicio, setIntencionServicio] = useState(false);
  const [tipoServicioIntencion, setTipoServicioIntencion] = useState('');

  // Estado simple para guardar el archivo único del certificado
  const [archivo, setArchivo] = useState(null);
  
  // Estado para guardar la lista de servicios que viene de la BD
  const [serviciosBD, setServiciosBD] = useState([]);

  // ERRORES
  const [errorEmail, setErrorEmail] = useState('');
  const [errorCedula, setErrorCedula] = useState('');
  const [errorPropiedad, setErrorPropiedad] = useState('');
  const [error, setError] = useState('');
  
  // ESTADO PARA LOS CAMPOS DE TEXTO EXACTOS DEL DIAGRAMA
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '', // Representa 'ci' en el diagrama
    email: '',
    telefono: '',
    propiedad: '', // Representa 'codigoCasa' en el diagrama
    password: '', // Representa 'contrasena'
    confirmPassword: ''
  });

  // useEffect para pedir los servicios apenas cargue la página
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const respuesta = await getServicios();
        setServiciosBD(respuesta.data);
      } catch (error) {
        console.error("Error al cargar los servicios:", error);
      }
    };
    cargarServicios();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'email') setErrorEmail('');
    if (e.target.name === 'cedula') setErrorCedula('');
    if (e.target.name === 'propiedad') setErrorPropiedad('');
  };

  // FUNCIÓN PARA ENVIAR LOS DATOS AL BACKEND
  // FUNCIÓN PARA ENVIAR LOS DATOS AL BACKEND (CORREGIDA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 0. Limpieza inicial de errores
    setErrorEmail('');
    setErrorCedula('');
    setErrorPropiedad('');
    setError('');

    // 1. Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // 2. Preparación del payload (según tu modelo)
    const nuevoUsuario = {
      ci: parseInt(formData.cedula),
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      intencion_agua: intencionAgua,
      intencion_servicio: intencionServicio,
      tipo_servicio_intencion: tipoServicioIntencion || null,
      password: formData.password,
      codigo_casa: formData.propiedad,
      certificado: intencionServicio // Marcador booleano
    };
    
    try {
      // 3. Registro del Usuario
      const respuesta = await registrarUsuarioCompleto(nuevoUsuario);
      const idUsuario = respuesta.data.id; 

      // 4. Lógica de Certificados (Solo si aplica)
      if (intencionServicio && tipoServicioIntencion) {
        
        const servicioSeleccionado = serviciosBD.find(s => s.id === Number(tipoServicioIntencion));
        const requiereArchivo = servicioSeleccionado?.necesita_certificado;

        // Si requiere archivo y no lo adjuntó, abortamos antes de realizar peticiones inútiles
        if (requiereArchivo && !archivo) {
          alert("Este servicio requiere que adjuntes un archivo de certificado.");
          return;
        }

        // Si pasamos la validación, guardamos el certificado
        await guardarCertificado(idUsuario, tipoServicioIntencion, archivo);
        alert("¡Usuario y certificado registrados con éxito!");
      } else {
        alert("¡Usuario registrado con éxito!");
      }
      navigate('/login');

    } catch (error) {
        console.error("Error capturado:", error);

        if (error.response) {
          // El servidor respondió con un error (ej: 400, 403, 500)
          const datos = error.response.data;
          
          // Si Django nos dio errores de formulario, los mostramos
          if (datos.codigo_casa || datos.email || datos.ci) {
            if (datos.codigo_casa) setErrorPropiedad("Esta propiedad no existe o ya está ocupada.");
            if (datos.email) setErrorEmail("El correo electrónico ya se encuentra registrado.");
            if (datos.ci) setErrorCedula("El documento de identidad (C.I.) ya está registrado.");
          } else {
            // Si el servidor respondió pero no es un error de formulario (ej: un 500)
            alert(`Error del servidor (${error.response.status}): ${JSON.stringify(datos)}`);
          }
        } else {
          console.error("Error inesperado:", error);
        }
    }
  };

  return (
    <div className="register-page">
      <header className="register-navbar">
        <a href="/" className="register-logo">
          <span className="register-logo-icon">BT</span>
          <span className="register-logo-text">BlueTrade</span>
        </a>

        <a href="/login" className="register-back-link">
          Ya tengo cuenta
        </a>
      </header>

      <main className="register-main">
        <section className="register-info">
          <span className="register-badge">
            Solicitud de ingreso a la urbanización
          </span>

          <h1>
            Crea tu perfil en
            <span> BlueTrade</span>
          </h1>

          <p>
            Registra tus datos personales, valida la identificación de tu
            propiedad dentro de la urbanización y declara si deseas proveer agua,
            prestar servicios técnicos o ambas opciones.
          </p>

          <div className="register-process">
            <div>
              <strong>1. Registro de datos</strong>
              <span>Ingresa tu información personal y de contacto.</span>
            </div>

            <div>
              <strong>2. Validación de propiedad</strong>
              <span>Identifica tu vivienda dentro de la urbanización.</span>
            </div>

            <div>
              <strong>3. Revisión del moderador</strong>
              <span>
                Tu perfil será evaluado antes de habilitar el acceso al sistema.
              </span>
            </div>
          </div>
        </section>

        <section className="register-card">
          <div className="register-card-header">
            <h2>Registro de usuario</h2>
            <p>
              Completa la información requerida. Si deseas prestar servicios,
              deberás cargar tus certificados técnicos.
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Datos personales</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ej. Carlos Gonzalez"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cedula">Documento de identidad (C.I.)</label>
                  <input
                    type="number"
                    id="cedula"
                    name="cedula"
                    placeholder="Ej. 12345678"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                  />
                  {errorCedula && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errorCedula}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errorEmail && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errorEmail}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    placeholder="Ej. 0412 0000000"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Identificación de propiedad</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="propiedad">Código o número de propiedad</label>
                  <input
                    type="text"
                    id="propiedad"
                    name="propiedad"
                    placeholder="Ej. Casa A-12 / Torre 3 Apt. 4B"
                    value={formData.propiedad}
                    onChange={handleChange}
                    required
                  />
                  {errorPropiedad && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errorPropiedad}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Intención dentro del sistema</h3>

              <div className="intentions-grid">
                <label className="intention-card">
                  <input
                    type="checkbox"
                    checked={intencionAgua}
                    onChange={(e) => setIntencionAgua(e.target.checked)}
                  />
                  <div>
                    <strong>Proveer agua</strong>
                    <span>
                      Deseo registrar suministro de agua en litros para
                      intercambios dentro de la urbanización.
                    </span>
                  </div>
                </label>

                <label className="intention-card">
                  <input
                    type="checkbox"
                    checked={intencionServicio}
                    onChange={(e) => setIntencionServicio(e.target.checked)}
                  />
                  <div>
                    <strong>Prestar servicios técnicos</strong>
                    {intencionServicio && (
                      <div 
                        className="my-2.5 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select 
                          name="tipoServicioIntencion"
                          value={tipoServicioIntencion} 
                          onChange={(e) => setTipoServicioIntencion(e.target.value)}        
                          className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[12px] py-1.5 px-2.5 text-xs font-semibold text-[#102033] outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                        >
                          <option value="" disabled hidden>Especialidad</option>
                          {serviciosBD.map((servicio) => (
                            <option key={servicio.id} value={servicio.id}>
                              {servicio.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <span>
                      Deseo ofrecer mantenimiento técnico en infraestructuras
                      comunes.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* SECCIÓN CONDICIONAL ACTUALIZADA CON BASE DE DATOS */}
            {intencionServicio && tipoServicioIntencion !== "" && (() => {
              const servicioSeleccionado = serviciosBD.find(
                (s) => s.id === Number(tipoServicioIntencion)
              );
              const requiereArchivo = servicioSeleccionado && servicioSeleccionado.necesita_certificado;

              if (requiereArchivo) {
                return (
                  <div className="form-section certificate-section">
                    <h3>Certificados técnicos</h3>

                    <p>
                      Carga el documento que permita verificar tu capacidad para
                      prestar servicios técnicos dentro de la urbanización.
                    </p>

                    <div className="form-group">
                      <label htmlFor="certificados">Adjuntar certificado</label>
                      <input
                        type="file"
                        id="certificados"
                        name="certificados"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setArchivo(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="form-section">
              <h3>Credenciales de acceso</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Crea una contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="register-approval-notice">
              <strong>Importante:</strong> tu registro quedará en espera hasta
              que el moderador de la urbanización revise tus datos, propiedad y
              certificados cargados.
            </div>

            <button type="submit" className="register-submit-btn">
              Enviar solicitud de registro
            </button>
            {error && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{error}</span>}
          </form>
        </section>
      </main>
    </div>
  );
}

export default RegisterPage;