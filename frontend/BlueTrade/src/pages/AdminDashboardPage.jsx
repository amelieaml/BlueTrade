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
      detalle: "Solicitudes, certificados y perfiles",
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
      detalle: "Ofertas activas y servicios conectados",
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
      titulo: "Cobros comunales",
      descripcion:
        "Emitir cobros de condominio y realizar el descuento masivo de litros de agua a los residentes activos.",
      ruta: "/cobroscomunales",
      etiqueta: "Finanzas",
      accion: "Cobros comunales",
      detalle: "Cobros, descuentos y control comunal",
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
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const manejarClick = (ruta) => {
    navigate(ruta);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

      <NavbarDashboard paginaActiva="admin" />

      <main className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-12 relative z-10">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white/86 border border-white/90 p-8 rounded-[32px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(20,70,140,0.18)]">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-2px] text-[#0f1f33] leading-none m-0">
              Panel{" "}
              <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">
                Administrativo
              </span>
            </h1>

            <p className="text-[#5d6f82] mt-4 text-lg leading-relaxed max-w-2xl m-0">
              Controla usuarios, ofertas y operaciones internas de BlueTrade
              desde un solo espacio.
            </p>
          </div>

          <div className="rounded-2xl bg-[#f0f6ff] border border-[#0066ff]/10 p-4 w-full md:w-[220px]">
            <p className="text-[11px] font-black text-[#6a7b8f] uppercase tracking-wider m-0">
              Rol
            </p>

            <h3 className="text-2xl font-extrabold text-[#102033] m-0 mt-1">
              Admin
            </h3>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-[320px] xl:w-[380px] shrink-0">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-extrabold text-[#102033] mb-6">
                Accesos rápidos
              </h3>

              <div className="flex flex-col gap-4">
                {opcionesAdmin.map((opcion, index) => (
                  <button
                    key={opcion.titulo}
                    type="button"
                    onClick={() => manejarClick(opcion.ruta)}
                    className="w-full border border-[#0066ff]/10 bg-white hover:border-[#0066ff] hover:shadow-[0_8px_30px_rgba(0,102,255,0.12)] cursor-pointer rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 text-left"
                  >
                    <span
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        index === 0
                          ? "bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)]"
                          : "bg-[#f0f6ff] text-[#0066ff]"
                      }`}
                    >
                      {opcion.icono}
                    </span>

                    <span>
                      <span className="block text-sm font-extrabold text-[#102033]">
                        {opcion.accion}
                      </span>
                      <span className="block text-xs font-semibold text-[#637489] mt-1">
                        {opcion.detalle}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <hr className="border-[#0066ff]/10 my-6" />

              <div className="rounded-[28px] border border-[#0066ff]/10 bg-[#f3f8ff] p-5">
                <p className="text-[11px] font-black text-[#0066ff] uppercase tracking-wider m-0">
                  Estado del panel
                </p>

                <h4 className="text-lg font-extrabold text-[#102033] mt-2 mb-2">
                  Operativo
                </h4>

                <p className="text-sm text-[#637489] leading-relaxed m-0">
                  Usa este panel para entrar a las áreas principales de gestión
                  administrativa.
                </p>
              </div>
            </div>
          </aside>

          <section className="flex-grow w-full">
            <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
              <div className="mb-8 border-b border-[#0066ff]/10 pb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#102033] m-0">
                    Módulos administrativos
                  </h3>

                  <p className="text-sm text-[#637489] mt-2 m-0">
                    Selecciona el área que deseas gestionar dentro del sistema.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {opcionesAdmin.map((opcion, index) => (
                  <article
                    key={opcion.titulo}
                    className="border border-[#0066ff]/10 bg-white hover:border-[#0066ff] hover:shadow-[0_8px_30px_rgba(0,102,255,0.12)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <span
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            index === 0
                              ? "bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)]"
                              : "bg-[#f0f6ff] text-[#0066ff]"
                          }`}
                        >
                          {opcion.icono}
                        </span>

                        <span className="text-[11px] font-black tracking-wider px-3 py-1.5 rounded-md border uppercase bg-[#0066ff]/10 text-[#0066ff] border-[#0066ff]/10">
                          {opcion.etiqueta}
                        </span>
                      </div>

                      <h4 className="text-xl font-extrabold text-[#102033] m-0">
                        {opcion.titulo}
                      </h4>

                      <p className="text-sm text-[#637489] leading-relaxed mt-3 mb-0">
                        {opcion.descripcion}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => manejarClick(opcion.ruta)}
                      className="mt-8 w-fit bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white font-bold py-3 px-6 rounded-full shadow-[0_12px_28px_rgba(0,102,255,0.22)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-none"
                    >
                      Entrar
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardPage;