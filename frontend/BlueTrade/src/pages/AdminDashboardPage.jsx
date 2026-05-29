import { useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";
import "../styles/AdminDashboardPage.css";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const opcionesAdmin = [
    {
      titulo: "Gestión de usuarios",
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
      titulo: "Ofertas públicas",
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
  ];

  const manejarClick = (ruta) => {
    navigate(ruta);
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