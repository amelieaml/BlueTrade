import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">BT</span>
          <span className="logo-text">BlueTrade</span>
        </div>

        <nav className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#funciones">Funciones</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="nav-actions">
          <a href="/login" className="btn btn-secondary">Iniciar sesión</a>
          <a href="/registro" className="btn btn-primary">Registrarse</a>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">
              Intercambio de agua por mantenimiento técnico
            </span>

            <h1>
              Administra recursos hídricos con
              <span> BlueTrade</span>
            </h1>

            <p>
              BlueTrade es una plataforma web para gestionar el intercambio de
              suministro de agua en litros por horas de servicio técnico en
              infraestructuras comunes. El sistema facilita el registro de
              ofertas, demandas, prorrateo de costos y conversión de volumen a
              tiempo de mantenimiento.
            </p>

            <div className="hero-buttons">
              <a href="/registro" className="btn btn-primary btn-large">
                Comenzar ahora
              </a>
              <a href="/login" className="btn btn-outline btn-large">
                Ya tengo cuenta
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="dashboard-preview">
              <div className="preview-header">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="preview-content">
                <div className="stat-card">
                  <p>Litros disponibles</p>
                  <h3>12.800</h3>
                </div>

                <div className="stat-card">
                  <p>Horas técnicas</p>
                  <h3>64h</h3>
                </div>

                <div className="chart-box">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                </div>

                <div className="activity-list">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="funciones" className="features-section">
          <div className="section-title">
            <span>Funciones principales</span>
            <h2>Control eficiente del intercambio hídrico y técnico</h2>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <h3>Registro de suministro</h3>
              <p>
                Permite registrar ofertas de agua en litros, identificar usuarios
                proveedores y controlar la disponibilidad del recurso hídrico
                dentro de la comunidad.
              </p>
            </article>

            <article className="feature-card">
              <h3>Conversión a horas técnicas</h3>
              <p>
                Convierte unidades de volumen de agua en horas equivalentes de
                mantenimiento técnico, facilitando intercambios claros y
                medibles.
              </p>
            </article>

            <article className="feature-card">
              <h3>Prorrateo de costos</h3>
              <p>
                Distribuye los costos de mantenimiento entre los participantes
                según criterios definidos por el sistema, garantizando mayor
                transparencia operativa.
              </p>
            </article>
          </div>
        </section>

        <section id="beneficios" className="features-section benefits-section">
          <div className="section-title">
            <span>Beneficios</span>
            <h2>Una plataforma pensada para comunidades organizadas</h2>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <h3>Transparencia</h3>
              <p>
                Cada intercambio queda registrado para facilitar el seguimiento
                de litros aportados, horas recibidas y costos asignados.
              </p>
            </article>

            <article className="feature-card">
              <h3>Equidad</h3>
              <p>
                El sistema ayuda a calcular una distribución más justa de los
                costos y servicios asociados al mantenimiento común.
              </p>
            </article>

            <article className="feature-card">
              <h3>Organización</h3>
              <p>
                Centraliza en una sola plataforma las ofertas, demandas,
                conversiones y operaciones relacionadas con el recurso hídrico.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;