import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboardPage.css";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const opcionesAdmin = [
    {
      titulo: "Usuarios y solicitudes",
      descripcion:
        "Revisar perfiles pendientes, certificados técnicos, datos de propiedad y solicitudes de registro.",
      ruta: "/admin/usuarios",
      etiqueta: "Principal",
      accion: "Gestionar usuarios",
      icono: (
        <svg
          className="admin-action-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      ),
    },
    {
      titulo: "Ofertas publicadas",
      descripcion:
        "Supervisar las ofertas de intercambio de agua y servicios dentro de la urbanización.",
      ruta: "/ofertas",
      etiqueta: "Intercambios",
      accion: "Ver ofertas",
      icono: (
        <svg
          className="admin-action-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h17.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375a1.125 1.125 0 0 1-1.125-1.125v-9.75ZM6.75 12h.008v.008H6.75V12Zm3 0h.008v.008H9.75V12Zm3 0h.008v.008h-.008V12Z"
          />
        </svg>
      ),
    },
    {
      titulo: "Solicitudes",
      descripcion:
        "Consultar solicitudes enviadas por usuarios y validar información asociada a sus perfiles.",
      ruta: "/solicitudes",
      etiqueta: "Solicitudes",
      accion: "Revisar",
      icono: (
        <svg
          className="admin-action-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
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
    <main className="admin-profile-dashboard">
      <button
        type="button"
        className="admin-logout-button"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>

      <section className="admin-dashboard-content">
        <div className="admin-main-card">
          <div className="admin-card-header">
            <span className="admin-small-label">Panel administrativo</span>

            <h1>Dashboard de administrador</h1>

            <p>
              Gestiona usuarios, solicitudes, ofertas y operaciones principales
              de BlueTrade desde un solo panel.
            </p>
          </div>

          <hr className="admin-card-divider" />

          <div className="admin-action-row">
            {opcionesAdmin.map((opcion, index) => (
              <button
                type="button"
                className="admin-circle-action"
                key={opcion.titulo}
                onClick={() => manejarClick(opcion.ruta)}
              >
                <span
                  className={`admin-circle-icon ${
                    index === 0 ? "admin-circle-icon-primary" : ""
                  }`}
                >
                  {opcion.icono}
                </span>

                <span className="admin-circle-text">{opcion.accion}</span>
              </button>
            ))}
          </div>
        </div>

        <section className="admin-summary-section">
          <div className="admin-section-title-row">
            <div>
              <span className="admin-section-eyebrow">Opciones disponibles</span>
              <h2>Gestión del sistema</h2>
            </div>
          </div>

          <div className="admin-dashboard-grid">
            {opcionesAdmin.map((opcion) => (
              <article className="admin-dashboard-card" key={opcion.titulo}>
                <div>
                  <span className="admin-card-tag">{opcion.etiqueta}</span>

                  <h3>{opcion.titulo}</h3>

                  <p>{opcion.descripcion}</p>
                </div>

                <button
                  type="button"
                  className="admin-card-button"
                  onClick={() => manejarClick(opcion.ruta)}
                >
                  Entrar
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminDashboardPage;