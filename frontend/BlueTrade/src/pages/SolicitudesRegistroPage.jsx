import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";
import "../styles/SolicitudesRegistroPage.css";

function SolicitudesRegistroPage() {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/item/test/usuarios/listar-admin/"
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los usuarios");
        }

        const data = await respuesta.json();

        const usuariosOrdenados = data.sort((a, b) => {
          if (a.es_admin === b.es_admin) {
            return a.id - b.id;
          }

          return a.es_admin ? 1 : -1;
        });

        setSolicitudes(usuariosOrdenados);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setError("No se pudieron cargar los usuarios registrados.");
      } finally {
        setCargando(false);
      }
    };

    cargarSolicitudes();
  }, []);

  const usuariosAdmins = solicitudes.filter((usuario) => usuario.es_admin);

  const solicitudesPendientes = solicitudes.filter(
    (usuario) => !usuario.es_admin && usuario.estado !== "ACTIVO"
  );

  const usuariosAceptados = solicitudes.filter(
    (usuario) => !usuario.es_admin && usuario.estado === "ACTIVO"
  );

  const obtenerClaseEstado = (usuario) => {
    if (usuario.es_admin) {
      return "estado admin";
    }

    switch (usuario.estado) {
      case "EN_ESPERA":
        return "estado pendiente";
      case "ACTIVO":
        return "estado aprobado";
      case "CORRECCION_REQUERIDA":
      case "REVISION_PENDIENTE":
      case "EN_REVISION":
        return "estado correccion";
      case "RECHAZADO":
        return "estado rechazado";
      default:
        return "estado";
    }
  };

  const formatearEstado = (usuario) => {
    if (usuario.es_admin) {
      return "ADMIN";
    }

    switch (usuario.estado) {
      case "EN_ESPERA":
        return "Pendiente";
      case "ACTIVO":
        return "Aprobado";
      case "CORRECCION_REQUERIDA":
      case "REVISION_PENDIENTE":
      case "EN_REVISION":
        return "Corrección requerida";
      case "RECHAZADO":
        return "Rechazado";
      default:
        return usuario.estado || "Sin estado";
    }
  };

  const obtenerIntencion = (usuario) => {
    if (usuario.intencion_agua && usuario.intencion_servicio) {
      return "Proveedor de agua y servicio técnico";
    }

    if (usuario.intencion_agua) {
      return "Proveedor de agua";
    }

    if (usuario.intencion_servicio) {
      return "Servicio técnico";
    }

    return "Sin intención registrada";
  };

  const volverPanelAdmin = () => {
    navigate("/admin");
  };

  const verSolicitud = (usuario) => {
    navigate(`/admin/solicitudes/${usuario.id}`, {
      state: { usuario },
    });
  };

  const renderTablaUsuarios = (usuarios, tipo) => {
    const mostrarEstado = tipo !== "aceptados";
    const mostrarAccion = tipo !== "admin";

    if (usuarios.length === 0) {
      return (
        <p className="mensaje-solicitudes">
          No hay usuarios en esta categoría.
        </p>
      );
    }

    return (
      <div className="tabla-contenedor">
        <table className="tabla-solicitudes">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Propiedad</th>
              <th>Intención</th>
              {mostrarEstado && <th>Estado</th>}
              {mostrarAccion && <th>Acción</th>}
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className={usuario.es_admin ? "fila-admin" : ""}
              >
                <td>
                  <div className="usuario-info">
                    <strong>{usuario.nombre}</strong>
                    <span>{usuario.email}</span>
                  </div>
                </td>

                <td>Casa {usuario.codigo_casa}</td>

                <td>{obtenerIntencion(usuario)}</td>

                {mostrarEstado && (
                  <td>
                    <span className={obtenerClaseEstado(usuario)}>
                      {formatearEstado(usuario)}
                    </span>
                  </td>
                )}

                {mostrarAccion && (
                  <td>
                    <button
                      className="btn-ver-solicitud"
                      onClick={() => verSolicitud(usuario)}
                    >
                      Ver solicitud
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <NavbarDashboard paginaActiva="administrador" />

      <main className="solicitudes-page">
        <section className="solicitudes-header">
          <div>
            <p className="solicitudes-etiqueta">Panel administrativo</p>
            <h1>Gestión de usuarios</h1>
            <p>
              Administra solicitudes pendientes, usuarios aceptados y cuentas con permisos
              administrativos dentro de la comunidad.
            </p>
          </div>

          <button className="btn-volver-admin" onClick={volverPanelAdmin}>
            Volver
          </button>
        </section>

        {cargando && (
          <p className="mensaje-solicitudes">Cargando usuarios...</p>
        )}

        {error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && solicitudes.length === 0 && (
          <p className="mensaje-solicitudes">No hay usuarios registrados.</p>
        )}

        {!cargando && !error && solicitudes.length > 0 && (
          <section className="solicitudes-widgets">
            <article className="solicitudes-card admins-widget">
              <div className="solicitudes-card-header">
                <div>
                  <h2>Administradores</h2>
                  <p>Usuarios con permisos administrativos dentro del sistema.</p>
                </div>

                <span className="contador-solicitudes">
                  {usuariosAdmins.length} admins
                </span>
              </div>

              {renderTablaUsuarios(usuariosAdmins, "admin")}
            </article>

            <div className="solicitudes-grid">
              <article className="solicitudes-card pendientes-widget">
                <div className="solicitudes-card-header">
                  <div>
                    <h2>Solicitudes pendientes</h2>
                    <p>
                      Usuarios que todavía requieren revisión, corrección o
                      decisión administrativa.
                    </p>
                  </div>

                  <span className="contador-solicitudes">
                    {solicitudesPendientes.length} solicitudes
                  </span>
                </div>

                {renderTablaUsuarios(solicitudesPendientes, "pendientes")}
              </article>

              <article className="solicitudes-card aceptados-widget">
                <div className="solicitudes-card-header">
                  <div>
                    <h2>Usuarios aceptados</h2>
                    <p>
                      Usuarios aprobados que ya forman parte de la comunidad.
                    </p>
                  </div>

                  <span className="contador-solicitudes">
                    {usuariosAceptados.length} usuarios
                  </span>
                </div>

                {renderTablaUsuarios(usuariosAceptados, "aceptados")}
              </article>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default SolicitudesRegistroPage;