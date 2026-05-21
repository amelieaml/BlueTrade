import { useState, useEffect } from 'react';
import '../styles/RegisterPage.css';
import { registrarUsuario, guardarCertificado, getServicios, registrarUsuarioCompleto } from '../api/item.api.js';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [intencionAgua, setIntencionAgua] = useState(false);
  const [intencionServicio, setIntencionServicio] = useState(false);
  const [tipoServicioIntencion, setTipoServicioIntencion] = useState('');


  const [archivo, setArchivo] = useState(null);
  

  const [serviciosBD, setServiciosBD] = useState([]);


  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);


  const [errorEmail, setErrorEmail] = useState('');
  const [errorCedula, setErrorCedula] = useState('');
  const [errorPropiedad, setErrorPropiedad] = useState('');
  const [errorTelefono, setErrorTelefono] = useState('');
  const [error, setError] = useState('');
  

  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    prefijo: '', 
    telefono: '', 
    propiedad: '', 
    password: '', 
    confirmPassword: ''
  });

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
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cedula' || name === 'telefono') {
      newValue = value.replace(/[^0-9]/g, '');
    }

    setFormData({
      ...formData,
      [name]: newValue
    });

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newValue === '' || emailRegex.test(newValue)) {
        setErrorEmail(''); 
      } else {
        setErrorEmail('Formato inválido'); 
      }
    }

    if (name === 'telefono') {
      if (newValue === '' || newValue.length === 7) {
        setErrorTelefono(''); 
      } else {
        setErrorTelefono('Faltan dígitos'); 
      }
    }

    if (name === 'cedula') setErrorCedula('');
    if (name === 'propiedad') setErrorPropiedad('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrorEmail('');
    setErrorCedula('');
    setErrorPropiedad('');
    setError('');

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorEmail("Por favor, ingresa un correo válido (ej: usuario@correo.com).");
      return;
    }

    const telefonoCompleto = `${formData.prefijo}${formData.telefono}`;

    const nuevoUsuario = {
      ci: parseInt(formData.cedula),
      nombre: formData.nombre,
      email: formData.email.toLowerCase(), 
      telefono: telefonoCompleto,
      intencion_agua: intencionAgua,
      intencion_servicio: intencionServicio,
      tipo_servicio_intencion: tipoServicioIntencion || null,
      password: formData.password,
      codigo_casa: formData.propiedad,
      certificado: intencionServicio 
    };
    
    try {
      const respuesta = await registrarUsuarioCompleto(nuevoUsuario);
      const idUsuario = respuesta.data.id; 

      if (intencionServicio && tipoServicioIntencion) {
        
        const servicioSeleccionado = serviciosBD.find(s => s.id === Number(tipoServicioIntencion));
        const requiereArchivo = servicioSeleccionado?.necesita_certificado;

        if (requiereArchivo) {
          if (!archivo) {
            alert("Este servicio requiere que adjuntes un archivo de certificado.");
            return;
          }
          await guardarCertificado(idUsuario, tipoServicioIntencion, archivo);
          alert("¡Usuario y certificado registrados con éxito!");
        } else {
          alert("¡Usuario registrado con éxito! (Sin certificado requerido para este servicio)");
        }
        
      } else {
        alert("¡Usuario registrado con éxito!");
      }
      
      navigate('/login');

    } catch (error) {
        console.error("Error capturado:", error);

        if (error.response) {
          const datos = error.response.data;
          
          if (datos.codigo_casa || datos.email || datos.ci) {
            if (datos.codigo_casa) setErrorPropiedad("Esta propiedad no existe o ya está ocupada.");
            if (datos.email) setErrorEmail("El correo electrónico ya se encuentra registrado.");
            if (datos.ci) setErrorCedula("El documento de identidad (C.I.) ya está registrado.");
          } else {
            alert(`Error del servidor (${error.response.status}): ${JSON.stringify(datos)}`);
          }
        } else {
          console.error("Error inesperado:", error);
        }
    }
  };

  const iconEyeOpen = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
    </svg>
  );

  const iconEyeClosed = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
    </svg>
  );

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
                    type="text" 
                    id="cedula"
                    name="cedula"
                    placeholder="Ej. 12345678"
                    maxLength="10"
                    inputMode="numeric"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                  />
                  {errorCedula && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errorCedula}</span>}
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={errorEmail === 'Formato inválido' ? 'input-error' : ''}
                  />
                  {errorEmail && <span style={{ color: '#dc3545', fontSize: '11px', display: 'block', position: 'absolute', bottom: '-18px', left: '0' }}>{errorEmail}</span>}
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: '0 0 30%', marginBottom: '0' }}>
                    <label htmlFor="prefijo">Prefijo</label>
                    <select
                      id="prefijo"
                      name="prefijo"
                      value={formData.prefijo}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled hidden>---</option>
                      <option value="0412">0412</option>
                      <option value="0414">0414</option>
                      <option value="0416">0416</option>
                      <option value="0424">0424</option>
                      <option value="0426">0426</option>
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ flex: '1', marginBottom: '0', position: 'relative' }}>
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      placeholder="Ej. 1234567"
                      maxLength="7"
                      inputMode="numeric"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className={errorTelefono ? 'input-error' : ''}
                    />
                    {errorTelefono && (
                      <span style={{ color: '#dc3545', fontSize: '11px', marginTop: '2px', display: 'block', position: 'absolute', bottom: '-18px' }}>
                        {errorTelefono}
                      </span>
                    )}
                  </div>
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
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Crea una contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ paddingRight: '2.5rem', width: '100%' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d', padding: 0, display: 'flex' }}
                    >
                      {mostrarPassword ? iconEyeOpen : iconEyeClosed}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={mostrarConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Repite la contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ paddingRight: '2.5rem', width: '100%' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                      style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d', padding: 0, display: 'flex' }}
                    >
                      {mostrarConfirmPassword ? iconEyeOpen : iconEyeClosed}
                    </button>
                  </div>
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