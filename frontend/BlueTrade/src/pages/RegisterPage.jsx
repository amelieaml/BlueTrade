import { useState } from 'react';
import '../styles/RegisterPage.css';
// IMPORTA TU FUNCIÓN DE AXIOS
import { registrarUsuario } from '../api/item.api.js';

function RegisterPage() {
  const [intencionAgua, setIntencionAgua] = useState(false);
  const [intencionServicio, setIntencionServicio] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // FUNCIÓN PARA ENVIAR LOS DATOS AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se refresque
    
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Mapeamos los datos del front a los atributos exactos de tu modelo de Django
    const nuevoUsuario = {
      ci: parseInt(formData.cedula), // Lo convertimos a int porque así está en el diagrama
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      intencion_agua: intencionAgua,
      intencion_servicio: intencionServicio,
      contrasena: formData.password,
      codigo_casa: formData.propiedad,
      certificado: intencionServicio // Por ahora enviamos True si tiene intención de servicio
    };

    try {
      const respuesta = await registrarUsuario(nuevoUsuario);
      console.log("Usuario creado:", respuesta.data);
      alert("¡Registro enviado con éxito! El moderador revisará tus datos.");
      // Aquí podrías redirigir al login si usas react-router-dom
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Hubo un error al crear el usuario.");
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

          {/* ATAMOS EL EVENTO ONSUBMIT AL FORMULARIO */}
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
                {/* SE ELIMINÓ EL CAMPO URBANIZACIÓN PARA RESPETAR EL DIAGRAMA */}
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
                    <span>
                      Deseo ofrecer mantenimiento técnico en infraestructuras
                      comunes.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {intencionServicio && (
              <div className="form-section certificate-section">
                <h3>Certificados técnicos</h3>

                <p>
                  Carga documentos que permitan verificar tu capacidad para
                  prestar servicios técnicos dentro de la urbanización.
                </p>

                <div className="form-group">
                  <label htmlFor="certificados">Adjuntar certificados</label>
                  <input
                    type="file"
                    id="certificados"
                    name="certificados"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            )}

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
          </form>
        </section>
      </main>
    </div>
  );
}

export default RegisterPage;