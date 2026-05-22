import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboardPage.css";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const opcionesAdmin = [
    {
      titulo: "Usuarios y solicitudes",
      descripcion:
        "Gestionar usuarios registrados, revisar perfiles pendientes, certificados técnicos y datos de propiedad.",
      ruta: "/admin/usuarios",
      etiqueta: "Gestión de usuarios",
      destacado: true,
    },
    {
      titulo: "Ofertas publicadas",
      descripcion:
        "Supervisar las ofertas de intercambio de agua y servicios dentro de la urbanización.",
      ruta: "/admin/ofertas",
      etiqueta: "Intercambios",
      destacado: false,
    },
    {
      titulo: "Servicios disponibles",
      descripcion:
        "Consultar los tipos de servicios técnicos registrados en el sistema.",
      ruta: "/admin/servicios",
      etiqueta: "Catálogo",
      destacado: false,
    },
  ];

  const manejarClick = (ruta) => {
    navigate(ruta);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    sessionStorage.clear();

    navigate("/login");
  };

  return (
    <main className="admin-dashboard-page">
      <button
        type="button"
        className="admin-logout-button"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>

      <section className="admin-dashboard-hero">
        <div>
          <span className="admin-dashboard-badge">Panel administrativo</span>

          <h1>Menú principal del administrador</h1>

          <p>
            Desde este panel puedes supervisar usuarios, solicitudes de registro,
            ofertas y servicios registrados en BlueTrade.
          </p>
        </div>
      </section>

      <section className="admin-dashboard-grid">
        {opcionesAdmin.map((opcion) => (
          <article
            className={`admin-dashboard-card ${
              opcion.destacado ? "admin-dashboard-card-wide" : ""
            }`}
            key={opcion.titulo}
          >
            <span className="admin-card-tag">{opcion.etiqueta}</span>

            <h2>{opcion.titulo}</h2>

            <p>{opcion.descripcion}</p>

            <button
              type="button"
              className="admin-card-button"
              onClick={() => manejarClick(opcion.ruta)}
            >
              Entrar
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminDashboardPage;