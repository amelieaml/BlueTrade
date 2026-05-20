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

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await loginUsuario({ email, password });

      login(response.data.user);

      navigate('/dashboard'); 
      
    } catch (error) {
      console.error("Error en el login:", error);
      // Capturamos el error estructurado que configuramos en Django
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg('No se pudo conectar con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

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
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMsg && <p className="login-error-message" style={{color: 'red', fontSize: '0.85rem', marginTop: '10px'}}>{errorMsg}</p>}
            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>

              <a href="/recuperar-password">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-submit-btn">
              Entrar
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