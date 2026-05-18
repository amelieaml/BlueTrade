import React from 'react';

// Importación de componentes base de tu ecosistema
import Navbar from '../components/Navbar.jsx';

// Hojas de estilo integradas
import '../styles/Components.css';
import '../styles/DashboardPage.css';

function DashboardPage() {

  const enlacesNavbar = [
    { texto: 'Inicio', ruta: '/' },
    { texto: 'Funciones', ruta: '#funciones' },
    { texto: 'Beneficios', ruta: '#beneficios' }
  ];

  const handleLogout = () => {
    console.log('Cerrando sesión en BlueTrade...');
  };

  const navegarARuta = (ruta) => {
    console.log(`Redirigiendo a la página autónoma: ${ruta}`);
    // Aquí usarías tu hook de enrutamiento nativo
  };

  const historialTarjetas = [
    { id: "TX-9021", fecha: "15 May 2026", tipo: "Compra Suministro", cantidad: "500 Litros", costo: "$15.00", estado: "Completado" },
    { id: "TX-8843", fecha: "12 May 2026", tipo: "Intercambio Técnico", cantidad: "200 Litros", costo: "Mantenimiento", estado: "Completado" },
    { id: "TX-8711", fecha: "09 May 2026", tipo: "Recarga Saldo", cantidad: "1,000 Litros", costo: "$30.00", estado: "Pendiente" }
  ];

  return (
    <div className="dashboard-page-fintech">
      <Navbar 
        nombreApp="BlueTrade" 
        enlaces={enlacesNavbar} 
        textoBoton="Cerrar sesión" 
        onBotonClick={handleLogout} 
      />

      <main className="dashboard-main-content">
        
        {/* 1. SECCIÓN SUPERIOR: HERO DE BALANCE LIMPIO */}
        {/* Eliminados los recuadros de métricas extra. Solo el balance hídrico imponente */}
        <header className="dashboard-balance-top-minimal">
          <div className="balance-main-wrapper">
            <span className="balance-sub-label">Balance Hídrico Disponible</span>
            <h1 className="balance-numeric-display">2,337 <span className="balance-unit-label">Litros</span></h1>
          </div>
        </header>

        {/* 2. BARRA DE ACCIONES: BOTONES QUE REDIRIGEN */}
        <nav className="dashboard-actions-row">
          <button className="action-pill-btn" onClick={() => navegarARuta('/recargar')}>
            <span className="pill-plus-icon">+</span> Ir a Recargar Saldo
          </button>
          <button className="action-pill-btn" onClick={() => navegarARuta('/crear-oferta')}>
            Publicar Nueva Oferta
          </button>
          <button className="action-pill-btn" onClick={() => navegarARuta('/catalogo')}>
            Ver Catálogo Global
          </button>
          <button className="action-pill-btn" onClick={() => navegarARuta('/historial')}>
            Historial Completo
          </button>
          <button className="action-pill-btn highlight-cyan-pill" onClick={() => navegarARuta('/solicitudes')}>
            Panel de Solicitudes (5)
          </button>
        </nav>

        {/* 3. GRID OPERATIVO: Usando la clase .tarjeta que ya definiste en Components.css */}
        <div className="dashboard-operations-twin-grid">
          
          {/* BLOQUE IZQUIERDO: WIDGET DE CONVERSIÓN CON TUS PROPIOS INPUTS */}
          <section className="tarjeta widget-premium-override">
            <div className="widget-header">
              <h3>Conversión y Tasación Rápida</h3>
              <p>Calcula el valor de tus litros de agua en base al mercado técnico de la red.</p>
            </div>
            <div className="widget-body-calculator">
              <div className="calculator-input-row">
                <div className="calc-field campo-formulario">
                  <label>Tus Litros</label>
                  <input type="number" defaultValue="500" />
                </div>
                <div className="calc-arrow">⇄</div>
                <div className="calc-field campo-formulario">
                  <label>Valor de Servicio Equiv.</label>
                  <input type="text" value="Mantenimiento Estándar" readOnly className="read-only-input" />
                </div>
              </div>
              <div className="calculator-meta-info">
                <span>Tasa de cambio actual: <strong>1 Litro = 0.03 xG (Créditos de Red)</strong></span>
              </div>
              <button className="fintech-widget-action-btn" onClick={() => navegarARuta('/crear-oferta')}>
                Crear Oferta con este Valor
              </button>
            </div>
          </section>

          {/* BLOQUE DERECHO: METRICAS REEMPLAZADAS POR UN GRÁFICO CLARO CON TUS COLORES */}
          <section className="tarjeta widget-premium-override">
            <div className="widget-header">
              <h3>Flujo de Operaciones Mensual</h3>
              <p>Monitoreo del volumen transferido, inyectado y consumido en tu comunidad.</p>
            </div>
            <div className="widget-analytics-placeholder-graph">
              <div className="bar-graph-mock">
                <div className="graph-column">
                  <div className="bar-fill color-water" style={{height: '75%'}}></div>
                  <small>Inyectado</small>
                </div>
                <div className="graph-column">
                  <div className="bar-fill color-service" style={{height: '45%'}}></div>
                  <small>Canjeado</small>
                </div>
                <div className="graph-column">
                  <div className="bar-fill color-reserve" style={{height: '90%'}}></div>
                  <small>Reserva</small>
                </div>
              </div>
              <div className="graph-legend-row">
                <p>Tu actividad aumentó un <strong>12%</strong> respecto a la semana pasada.</p>
              </div>
            </div>
          </section>

        </div>

        {/* 4. SECCIÓN INFERIOR: HISTORIAL DE TARJETAS */}
        <section className="recent-activity-section">
          <div className="section-title-with-link">
            <h3 className="section-block-title">Ofertas e Intercambios Recientes</h3>
            <button className="text-link-btn-navigation" onClick={() => navegarARuta('/historial')}>Ver todo el historial →</button>
          </div>
          
          <div className="homogeneous-cards-narrow-grid">
            {historialTarjetas.map((item) => (
              <article key={item.id} className="fintech-homogeneous-card">
                <div className="card-top-info">
                  <span className="card-tx-id">{item.id}</span>
                  <span className="card-tx-date">{item.fecha}</span>
                </div>
                
                <div className="card-body-info">
                  <span className="card-label-meta">Tipo de Operación</span>
                  <h4 className="card-main-title">{item.tipo}</h4>
                  
                  <div className="card-metrics-row">
                    <div>
                      <small>Volumen</small>
                      <p>{item.cantidad}</p>
                    </div>
                    <div>
                      <small>Costo</small>
                      <p>{item.costo}</p>
                    </div>
                  </div>
                </div>

                <div className="card-footer-info">
                  <span className={`status-pill ${item.estado === 'Completado' ? 'status-done' : 'status-pending'}`}>
                    {item.estado}
                  </span>
                  <button className="card-action-view-btn">Detalles</button>
                </div>
              </article>
            ))}

            <button className="fintech-dashed-add-card-homogeneous" onClick={() => navegarARuta('/crear-oferta')}>
              <div className="plus-icon-ring-center">
                <span className="plus-sign">+</span>
              </div>
              <span className="add-card-text-label">Crear Nueva Oferta</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

export default DashboardPage;