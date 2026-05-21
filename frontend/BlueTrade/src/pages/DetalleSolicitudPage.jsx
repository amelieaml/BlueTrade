import "../styles/DetalleSolicitudPage.css";

function DetalleSolicitudPage() {
  const solicitud = {
    id: 1,
    nombre: "Carlos González",
    correo: "carlos@email.com",
    telefono: "+58 412-0000000",
    cedula: "V-12345678",
    propiedad: "Casa A-12",
    direccion: "Urbanización BlueTrade, Calle Principal, Casa A-12",
    intencionAgua: true,
    intencionServicio: true,
    estado: "Pendiente",
    fechaSolicitud: "21/05/2026",
    descripcion:
      "Deseo registrarme como proveedor de agua y también ofrecer servicios técnicos de mantenimiento general dentro de la comunidad.",
    certificados: [
      {
        id: 1,
        nombre: "Certificado técnico de mantenimiento.pdf",
        tipo: "PDF",
        estado: "Adjunto",
      },
      {
        id: 2,
        nombre: "Documento de propiedad.pdf",
        tipo: "PDF",
        estado: "Adjunto",
      },
      {
        id: 3,
        nombre: "Cédula de identidad.jpg",
        tipo: "Imagen",
        estado: "Adjunto",
      },
    ],
  };

  const aprobarSolicitud = () => {
    console.log("Solicitud aprobada:", solicitud.id);
  };

  const solicitarCorreccion = () => {
    console.log("Corrección solicitada:", solicitud.id);
  };

  const rechazarSolicitud = () => {
    console.log("Solicitud rechazada:", solicitud.id);
  };

  return (
    <main className="detalle-solicitud-page">
      <section className="detalle-header">
        <div>
          <p className="detalle-etiqueta">Revisión administrativa</p>
          <h1>Detalle de solicitud</h1>
          <p>
            Verifica la información suministrada por el usuario antes de aprobar
            su ingreso a la comunidad.
          </p>
        </div>

        <span className="badge-estado">{solicitud.estado}</span>
      </section>

      <section className="detalle-layout">
        <article className="detalle-card">
          <div className="card-header">
            <h2>Datos personales</h2>
            <p>Información básica suministrada durante el registro.</p>
          </div>

          <div className="datos-grid">
            <div className="dato-item">
              <span>Nombre completo</span>
              <strong>{solicitud.nombre}</strong>
            </div>

            <div className="dato-item">
              <span>Correo electrónico</span>
              <strong>{solicitud.correo}</strong>
            </div>

            <div className="dato-item">
              <span>Teléfono</span>
              <strong>{solicitud.telefono}</strong>
            </div>

            <div className="dato-item">
              <span>Cédula</span>
              <strong>{solicitud.cedula}</strong>
            </div>

            <div className="dato-item">
              <span>Fecha de solicitud</span>
              <strong>{solicitud.fechaSolicitud}</strong>
            </div>
          </div>
        </article>

        <article className="detalle-card">
          <div className="card-header">
            <h2>Datos de propiedad</h2>
            <p>Validación de residencia dentro de la urbanización.</p>
          </div>

          <div className="datos-grid">
            <div className="dato-item">
              <span>Propiedad</span>
              <strong>{solicitud.propiedad}</strong>
            </div>

            <div className="dato-item dato-item-full">
              <span>Dirección</span>
              <strong>{solicitud.direccion}</strong>
            </div>
          </div>
        </article>

        <article className="detalle-card">
          <div className="card-header">
            <h2>Intención del usuario</h2>
            <p>Actividades que el usuario desea realizar dentro del sistema.</p>
          </div>

          <div className="intenciones-grid">
            <div
              className={
                solicitud.intencionAgua ? "intencion activa" : "intencion"
              }
            >
              <span>Proveedor de agua</span>
              <strong>{solicitud.intencionAgua ? "Sí" : "No"}</strong>
            </div>

            <div
              className={
                solicitud.intencionServicio ? "intencion activa" : "intencion"
              }
            >
              <span>Prestador de servicios</span>
              <strong>{solicitud.intencionServicio ? "Sí" : "No"}</strong>
            </div>
          </div>

          <div className="descripcion-box">
            <span>Descripción suministrada</span>
            <p>{solicitud.descripcion}</p>
          </div>
        </article>

        <article className="detalle-card">
          <div className="card-header">
            <h2>Certificados y documentos</h2>
            <p>Archivos adjuntos enviados por el usuario para validación.</p>
          </div>

          <div className="certificados-lista">
            {solicitud.certificados.map((certificado) => (
              <div className="certificado-item" key={certificado.id}>
                <div className="certificado-icono">
                  {certificado.tipo === "PDF" ? "PDF" : "IMG"}
                </div>

                <div className="certificado-info">
                  <strong>{certificado.nombre}</strong>
                  <span>
                    {certificado.tipo} · {certificado.estado}
                  </span>
                </div>

                <button className="btn-ver-documento">Ver documento</button>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="acciones-admin">
  <div className="acciones-info">
    <h2>Decisión administrativa</h2>
    <p>
      Selecciona una acción para continuar con la revisión de esta solicitud.
    </p>
  </div>

  <div className="acciones-botones">
    <button className="btn-secundario" onClick={solicitarCorreccion}>
      Solicitar corrección
    </button>

    <button className="btn-rechazar" onClick={rechazarSolicitud}>
      Rechazar
    </button>

    <button className="btn-aprobar" onClick={aprobarSolicitud}>
      Aprobar solicitud
    </button>
  </div>
</section>
    </main>
  );
}

export default DetalleSolicitudPage;