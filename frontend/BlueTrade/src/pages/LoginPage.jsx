import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import '../styles/LoginPage.css';
import { loginUsuario } from '../api/item.api.js';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar la visibilidad de la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await loginUsuario({ email: email.toLowerCase(), password });

      login(response.data.user);
      if (response.data.user.estado === 'EN_ESPERA' || response.data.user.estado === 'en_espera') {
        console.log("Usuario en espera, redirigiendo a perfil...");
        navigate('/perfil'); 
      } else {
        console.log("Usuario activo, redirigiendo a dashboard...");
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error("Error en el login:", error);
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('No se pudo conectar con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  // SVGs para los ojitos de la contraseña
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
    <div className="login-page">
      <div className="login-background"></div>

      <header className="login-navbar">
        <a href="/" className="login-logo">
          <span className="login-logo-icon">BT</span>
          <span className="login-logo-text">BlueTrade</span>
        </a>

        <a href="/" className="login-back-link">
          Volver al inicio
        </a>
      </header>

      <main className="login-main">
        <section className="login-info">
          <span className="login-badge">
            Acceso a la plataforma hídrica
          </span>

          <h1>
            Bienvenido de nuevo a
            <span> BlueTrade</span>
          </h1>

          <p>
            Inicia sesión para gestionar intercambios de suministro de agua,
            conversión de litros a horas técnicas y prorrateo de costos de
            mantenimiento comunitario. El acceso está disponible únicamente para
            usuarios cuyo perfil haya sido aprobado por el moderador de la urbanización.
          </p>

          <div className="login-benefits">
            <div>
              <strong>Control hídrico</strong>
              <span>Consulta litros disponibles y operaciones activas.</span>
            </div>

            <div>
              <strong>Mantenimiento técnico</strong>
              <span>Administra servicios equivalentes en horas.</span>
            </div>

            <div>
              <strong>Gestión transparente</strong>
              <span>Revisa registros, costos y asignaciones.</span>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-header">
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus credenciales para continuar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@correo.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.5rem', width: '100%' }}
                />
                <button 
                  type="button" 
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6c757d', padding: 0, display: 'flex' }}
                  title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? iconEyeOpen : iconEyeClosed}
                </button>
              </div>
            </div>
            
            {errorMsg && <p className="login-error-message" style={{color: 'red', fontSize: '0.85rem', marginTop: '10px'}}>{errorMsg}</p>}
            
            <div className="login-options">
              <a href="/recuperar-password">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-register">
            <span>¿No tienes cuenta?</span>
            <a href="/registro">Crear cuenta</a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;