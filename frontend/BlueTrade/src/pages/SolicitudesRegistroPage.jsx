import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        return "Corrección requerida";
      case "RECHAZADO":
        return "Rechazado";
      default:
        return usuario.estado;
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

  return (
    <main className="solicitudes-page">
      <section className="solicitudes-header">
        <div>
          <p className="solicitudes-etiqueta">Panel administrativo</p>
          <h1>Solicitudes de registro</h1>
          <p>
            Revisa los perfiles enviados por los usuarios y valida su ingreso a
            la comunidad.
          </p>
        </div>

        <button className="btn-volver-admin" onClick={volverPanelAdmin}>
          Volver
        </button>
      </section>

      <section className="solicitudes-card">
        <div className="solicitudes-card-header">
          <div>
            <h2>Usuarios registrados</h2>
            <p>Lista de perfiles pendientes o ya revisados por administración.</p>
          </div>

          <span className="contador-solicitudes">
            {solicitudes.length} usuarios
          </span>
        </div>

        {cargando && (
          <p className="mensaje-solicitudes">Cargando usuarios...</p>
        )}

        {error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && solicitudes.length === 0 && (
          <p className="mensaje-solicitudes">No hay usuarios registrados.</p>
        )}

        {!cargando && !error && solicitudes.length > 0 && (
          <div className="tabla-contenedor">
            <table className="tabla-solicitudes">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Propiedad</th>
                  <th>Intención</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    className={solicitud.es_admin ? "fila-admin" : ""}
                  >
                    <td>
                      <div className="usuario-info">
                        <strong>{solicitud.nombre}</strong>
                        <span>{solicitud.email}</span>
                      </div>
                    </td>

                    <td>Casa {solicitud.codigo_casa}</td>

                    <td>{obtenerIntencion(solicitud)}</td>

                    <td>
                      <span className={obtenerClaseEstado(solicitud)}>
                        {formatearEstado(solicitud)}
                      </span>
                    </td>

                    <td>
                      {solicitud.es_admin ? (
                        <span className="accion-admin">Sin acción</span>
                      ) : (
                        <button
                          className="btn-ver-solicitud"
                          onClick={() => verSolicitud(solicitud)}
                        >
                          Ver solicitud
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default SolicitudesRegistroPage;