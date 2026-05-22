import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/DetalleSolicitudPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function DetalleSolicitudPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [usuario, setUsuario] = useState(location.state?.usuario || null);
  const [cargando, setCargando] = useState(!location.state?.usuario);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeAccion, setMensajeAccion] = useState("");

  useEffect(() => {
    if (usuario) {
      return;
    }

    const cargarUsuario = async () => {
      try {
        const respuesta = await fetch(
          `${API_BASE_URL}/item/test/usuarios/listar-admin/`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el usuario");
        }

        const data = await respuesta.json();

        const usuarioEncontrado = data.find(
          (item) => String(item.id) === String(id)
        );

        if (!usuarioEncontrado) {
          throw new Error("Usuario no encontrado");
        }

        setUsuario(usuarioEncontrado);
      } catch (error) {
        console.error("Error al obtener detalle del usuario:", error);
        setError("No se pudo cargar el detalle de la solicitud.");
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, [id, usuario]);

  const volverSolicitudes = () => {
    navigate("/admin/usuarios");
  };

  const actualizarEstadoUsuario = async (nuevoEstado) => {
    if (!usuario || guardando) {
      return;
    }

    try {
      setGuardando(true);
      setMensajeAccion("");
      setError("");

      const respuesta = await fetch(
        `${API_BASE_URL}/item/test/usuarios/${usuario.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el estado del usuario");
      }

      const usuarioActualizado = await respuesta.json();

      setUsuario(usuarioActualizado);
      setMensajeAccion("Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setError("No se pudo actualizar el estado del usuario.");
    } finally {
      setGuardando(false);
    }
  };

  const obtenerEstadoTexto = () => {
    if (!usuario) return "";

    if (usuario.es_admin) {
      return "ADMIN";
    }

    switch (usuario.estado) {
      case "EN_ESPERA":
        return "Pendiente";
      case "ACTIVO":
        return "Aprobado";
      case "REVISION_PENDIENTE":
        return "Corrección requerida";
      case "RECHAZADO":
        return "Rechazado";
      default:
        return usuario.estado;
    }
  };

  const obtenerClaseEstado = () => {
    if (!usuario) return "badge-estado";

    if (usuario.es_admin) {
      return "badge-estado admin";
    }

    switch (usuario.estado) {
      case "EN_ESPERA":
        return "badge-estado pendiente";
      case "ACTIVO":
        return "badge-estado aprobado";
      case "REVISION_PENDIENTE":
        return "badge-estado correccion";
      case "RECHAZADO":
        return "badge-estado rechazado";
      default:
        return "badge-estado";
    }
  };

  const obtenerIntencion = () => {
    if (!usuario) return "";

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

  const obtenerCertificadoUrl = () => {
    if (!usuario) return null;

    /*
      Recomendado desde backend:
      usuario.certificado_url = "http://127.0.0.1:8000/media/certificados/archivo.jpg"

      También se dejan otras opciones por si tu backend devuelve:
      usuario.certificado
      usuario.certificado.imagen
      usuario.certificado.archivo
      usuario.certificado.url
    */
    const certificado =
      usuario.certificado_url ||
      usuario.certificado?.imagen ||
      usuario.certificado?.archivo ||
      usuario.certificado?.url ||
      usuario.certificado;

    if (!certificado || certificado === true) {
      return null;
    }

    if (typeof certificado !== "string") {
      return null;
    }

    if (certificado.startsWith("http://") || certificado.startsWith("https://")) {
      return certificado;
    }

    return `${API_BASE_URL}${certificado}`;
  };

  const certificadoUrl = obtenerCertificadoUrl();

  if (cargando) {
    return (
      <main className="detalle-solicitud-page">
        <section className="detalle-card">
          <p className="mensaje-detalle">Cargando detalle de solicitud...</p>
        </section>
      </main>
    );
  }

  if (error && !usuario) {
    return (
      <main className="detalle-solicitud-page">
        <section className="detalle-card">
          <p className="mensaje-detalle-error">{error}</p>

          <button className="btn-volver-detalle" onClick={volverSolicitudes}>
            Volver
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="detalle-solicitud-page">
      <section className="detalle-header">
        <div>
          <p className="detalle-etiqueta">Panel administrativo</p>
          <h1>Detalle de solicitud</h1>
          <p>Información completa del usuario seleccionado.</p>
        </div>

        <button className="btn-volver-detalle" onClick={volverSolicitudes}>
          Volver
        </button>
      </section>

      <section className="detalle-layout">
        <article className="detalle-card">
          <div className="card-header card-header-flex">
            <div>
              <h2>Datos personales</h2>
              <p>Información básica del usuario registrado.</p>
            </div>

            <span className={obtenerClaseEstado()}>{obtenerEstadoTexto()}</span>
          </div>

          <div className="datos-grid">
            <div className="dato-item">
              <span>Nombre</span>
              <strong>{usuario.nombre}</strong>
            </div>

            <div className="dato-item">
              <span>Cédula</span>
              <strong>{usuario.ci}</strong>
            </div>

            <div className="dato-item">
              <span>Correo</span>
              <strong>{usuario.email}</strong>
            </div>

            <div className="dato-item">
              <span>Teléfono</span>
              <strong>{usuario.telefono}</strong>
            </div>
          </div>
        </article>

        <article className="detalle-card">
          <div className="card-header">
            <h2>Propiedad</h2>
            <p>Datos asociados a la vivienda dentro de la comunidad.</p>
          </div>

          <div className="datos-grid">
            <div className="dato-item">
              <span>Código de casa</span>
              <strong>Casa {usuario.codigo_casa}</strong>
            </div>

            <div className="dato-item">
              <span>Litros de agua</span>
              <strong>{usuario.litros_agua}</strong>
            </div>

            <div className="dato-item">
              <span>Administrador</span>
              <strong>{usuario.es_admin ? "Sí" : "No"}</strong>
            </div>

            <div className="dato-item">
              <span>Estado</span>
              <strong>{obtenerEstadoTexto()}</strong>
            </div>
          </div>
        </article>

        <article className="detalle-card detalle-card-full">
          <div className="card-header">
            <h2>Intención de participación</h2>
            <p>Servicios o recursos que el usuario desea ofrecer en BlueTrade.</p>
          </div>

          <div className="intenciones-grid">
            <div
              className={
                usuario.intencion_agua ? "intencion activa" : "intencion"
              }
            >
              <span>Proveedor de agua</span>
              <strong>{usuario.intencion_agua ? "Sí" : "No"}</strong>
            </div>

            <div
              className={
                usuario.intencion_servicio ? "intencion activa" : "intencion"
              }
            >
              <span>Servicio técnico</span>
              <strong>{usuario.intencion_servicio ? "Sí" : "No"}</strong>
            </div>
          </div>

          <div className="descripcion-box">
            <span>Resumen</span>
            <p>{obtenerIntencion()}</p>
          </div>
        </article>

        <article className="detalle-card detalle-card-full">
          <div className="card-header">
            <h2>Certificación</h2>
            <p>Validación de documentos asociados al servicio técnico.</p>
          </div>

          <div className="datos-grid">
            <div className="dato-item">
              <span>Tipo de servicio</span>
              <strong>
                {usuario.tipo_servicio_intencion
                  ? usuario.tipo_servicio_intencion
                  : "No aplica"}
              </strong>
            </div>

            <div className="dato-item">
              <span>Certificado</span>
              <strong>{certificadoUrl ? "Cargado" : "No cargado"}</strong>
            </div>
          </div>

          {certificadoUrl ? (
            <div className="certificado-preview">
              <img
                src={certificadoUrl}
                alt="Certificado del usuario"
                className="certificado-imagen"
              />

              <a
                href={certificadoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="certificado-link"
              >
                Ver certificado en tamaño completo
              </a>
            </div>
          ) : (
            <p className="certificado-vacio">
              Este usuario no ha cargado ningún certificado.
            </p>
          )}
        </article>
      </section>

      {!usuario.es_admin && (
        <section className="acciones-admin">
          <div className="acciones-info">
            <h2>Decisión administrativa</h2>
            <p>
              Selecciona una acción para cambiar el estado de esta solicitud.
            </p>

            {mensajeAccion && (
              <p className="mensaje-accion-exito">{mensajeAccion}</p>
            )}

            {error && <p className="mensaje-accion-error">{error}</p>}
          </div>

          <div className="acciones-botones">
            <button
              className={
                usuario.estado === "ACTIVO"
                  ? "btn-aprobar boton-seleccionado"
                  : "btn-aprobar"
              }
              disabled={guardando || usuario.estado === "ACTIVO"}
              onClick={() => actualizarEstadoUsuario("ACTIVO")}
            >
              Aprobar
            </button>

            <button
              className={
                usuario.estado === "REVISION_PENDIENTE"
                  ? "btn-secundario boton-seleccionado"
                  : "btn-secundario"
              }
              disabled={guardando || usuario.estado === "REVISION_PENDIENTE"}
              onClick={() => actualizarEstadoUsuario("REVISION_PENDIENTE")}
            >
              Solicitar corrección
            </button>

            <button
              className={
                usuario.estado === "RECHAZADO"
                  ? "btn-rechazar boton-seleccionado"
                  : "btn-rechazar"
              }
              disabled={guardando || usuario.estado === "RECHAZADO"}
              onClick={() => actualizarEstadoUsuario("RECHAZADO")}
            >
              Rechazar
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default DetalleSolicitudPage;