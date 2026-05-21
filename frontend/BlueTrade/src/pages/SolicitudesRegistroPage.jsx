import "../styles/SolicitudesRegistroPage.css";

function SolicitudesRegistroPage() {
  const solicitudes = [
    {
      id: 1,
      nombre: "Carlos González",
      correo: "carlos@email.com",
      propiedad: "Casa A-12",
      intencion: "Proveedor de agua",
      estado: "Pendiente",
    },
    {
      id: 2,
      nombre: "María Rodríguez",
      correo: "maria@email.com",
      propiedad: "Casa B-04",
      intencion: "Servicio técnico",
      estado: "Corrección requerida",
    },
    {
      id: 3,
      nombre: "José Pérez",
      correo: "jose@email.com",
      propiedad: "Casa C-09",
      intencion: "Proveedor de agua y servicio técnico",
      estado: "Aprobado",
    },
  ];

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "estado pendiente";
      case "Aprobado":
        return "estado aprobado";
      case "Corrección requerida":
        return "estado correccion";
      case "Rechazado":
        return "estado rechazado";
      default:
        return "estado";
    }
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
      </section>

      <section className="solicitudes-card">
        <div className="solicitudes-card-header">
          <div>
            <h2>Usuarios registrados</h2>
            <p>Lista de perfiles pendientes o ya revisados por administración.</p>
          </div>

          <span className="contador-solicitudes">
            {solicitudes.length} solicitudes
          </span>
        </div>

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
                <tr key={solicitud.id}>
                  <td>
                    <div className="usuario-info">
                      <strong>{solicitud.nombre}</strong>
                      <span>{solicitud.correo}</span>
                    </div>
                  </td>

                  <td>{solicitud.propiedad}</td>

                  <td>{solicitud.intencion}</td>

                  <td>
                    <span className={obtenerClaseEstado(solicitud.estado)}>
                      {solicitud.estado}
                    </span>
                  </td>

                  <td>
                    <button className="btn-ver-solicitud">
                      Ver solicitud
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default SolicitudesRegistroPage;