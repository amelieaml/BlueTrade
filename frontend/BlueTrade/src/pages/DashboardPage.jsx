import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NavbarDashboard from "../components/NavbarDashboard";
import PanelMisOfertas from "../components/PanelMisOfertas";
import {
  crearOferta,
  getServicios,
  getOfertas,
  getUsuarioPorId
} from '../api/item.api';
import "../styles/RegisterPage.css";

const inputClass =
  "w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none box-border font-inherit transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10";

const labelClass = "text-[#102033] font-bold text-13px";

const formInicial = {
  tipoOfrecido: "agua",
  cantidadOfrecida: "",
  categoriaOfrecidaServicio: "",
  cantidadSolicitada: "",
  categoriaSolicitadaServicio: "",
  descripcion: "",
};

function DashboardPage() {
  const navigate = useNavigate();
  const { usuario, obtenerPerfilActualizado } = useContext(AuthContext);

const [datosUsuario, setDatosUsuario] = useState(null);

const saldoLitros = Number(
  datosUsuario?.saldo_litros ||
  datosUsuario?.saldoLitros ||
  datosUsuario?.litros_disponibles ||
  usuario?.saldo_litros ||
  usuario?.saldoLitros ||
  usuario?.litros_disponibles ||
  0
);

const isModerator =
  datosUsuario?.es_admin === true ||
  datosUsuario?.is_staff === true ||
  datosUsuario?.rol === "MODERADOR" ||
  datosUsuario?.rol === "moderador" ||
  usuario?.es_admin === true ||
  usuario?.is_staff === true ||
  usuario?.rol === "MODERADOR" ||
  usuario?.rol === "moderador";

const nombreUsuario =
  datosUsuario?.nombre ||
  datosUsuario?.name ||
  datosUsuario?.username ||
  usuario?.nombre ||
  usuario?.name ||
  usuario?.username ||
  "Usuario";


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviciosDB, setServiciosDB] = useState([]);
  const [ofertasActivas, setOfertasActivas] = useState([]);
  const [formData, setFormData] = useState(formInicial);
  const [errores, setErrores] = useState({});

  const tipoSolicitadoCalculado =
    formData.tipoOfrecido === "agua" ? "servicio" : "agua";

  const saldoWaterCoins = `W ${saldoLitros.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  useEffect(() => {
  if (!usuario?.id) {
    navigate("/login");
    return;
  }

  const cargarDatosDashboard = async () => {
    try {
      const respuestaUsuario = await getUsuarioPorId(usuario.id);
      setDatosUsuario(respuestaUsuario.data);
    } catch (error) {
      console.error("Error al cargar el usuario actualizado:", error);
      setDatosUsuario(usuario);
    }

    try {
      const respuestaServicios = await getServicios();
      const servicios = respuestaServicios.data;

      setServiciosDB(servicios);

      if (servicios.length > 0) {
        setFormData((prev) => ({
          ...prev,
          categoriaOfrecidaServicio:
            prev.categoriaOfrecidaServicio || servicios[0].nombre,
          categoriaSolicitadaServicio:
            prev.categoriaSolicitadaServicio || servicios[0].nombre,
        }));
      }

      const respuestaOfertas = await getOfertas();

      const ofertasUsuario = respuestaOfertas.data.filter((oferta) => {
        const idUsuarioOferta =
          oferta.usuario?.id || oferta.usuario || oferta.usuario_id;

        return (
          Number(idUsuarioOferta) === Number(usuario.id) &&
          oferta.estado === "ACTIVO"
        );
      });

      setOfertasActivas(ofertasUsuario);
    } catch (error) {
      console.error("Error al cargar los datos del dashboard:", error);
    }
  };

  cargarDatosDashboard();
}, [usuario, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "tipoOfrecido" && {
        cantidadOfrecida: "",
        cantidadSolicitada: "",
      }),
    }));
  };

  const handleAccionDashboard = (tipoAccion) => {
    if (tipoAccion === "crear") setIsModalOpen(true);
    if (tipoAccion === "solicitudes") navigate("/solicitudes");
  };

  const handleGestionarOferta = (oferta) => {
    console.log("Gestionando oferta:", oferta.id);
  };

  const validarCertificado = () => {
    if (formData.tipoOfrecido !== "servicio") return true;

    const servicio = serviciosDB.find(
      (s) => s.nombre === formData.categoriaOfrecidaServicio
    );

    if (servicio?.necesita_certificado && !(datosUsuario?.certificado || usuario?.certificado)) {
      setErrores({
        certificado: "Este servicio requiere una certificación técnica.",
      });
      return false;
    }

    return true;
  };

  const resetFormulario = () => {
    setFormData({
      ...formInicial,
      categoriaOfrecidaServicio: serviciosDB[0]?.nombre || "",
      categoriaSolicitadaServicio: serviciosDB[0]?.nombre || "",
    });
  };

  const handleSubmitOferta = async (e) => {
    e.preventDefault();
    setErrores({});

    if (!validarCertificado()) return;

    const payload = {
      usuario: usuario?.id,
      tipo_ofrecido: formData.tipoOfrecido.toUpperCase(),
      descripcion: formData.descripcion,
      cantidad_ofrecida: parseFloat(formData.cantidadOfrecida),
      categoria_ofrecida:
        formData.tipoOfrecido === "servicio"
          ? formData.categoriaOfrecidaServicio
          : null,
      tipo_solicitado: tipoSolicitadoCalculado.toUpperCase(),
      cantidad_solicitada: parseFloat(formData.cantidadSolicitada),
      categoria_solicitada:
        tipoSolicitadoCalculado === "servicio"
          ? formData.categoriaSolicitadaServicio
          : null,
    };

    try {
      const respuesta = await crearOferta(payload);

      if (respuesta.status === 201) {
        alert("¡Oferta publicada exitosamente!");
        setIsModalOpen(false);
        setOfertasActivas((prev) => [respuesta.data, ...prev]);
        resetFormulario();
      }
    } catch (error) {
      const mensajeError =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        "Hubo un error al intentar registrar tu intercambio.";

      alert(mensajeError);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fbff] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%),linear-gradient(135deg,#f7fbff_0%,#eef6ff_45%,#ffffff_100%)] text-[#102033] font-sans pb-16 relative">
      <NavbarDashboard paginaActiva="dashboard" />

      <main className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-10 flex flex-col items-center">
        <section className="w-full max-w-[660px] bg-white border border-[#e2e8f0] p-8 rounded-[32px] shadow-[0_20px_50px_rgba(15,31,51,0.06)] mb-12 relative z-10 flex flex-col items-center">
          <div className="w-full flex flex-col items-center text-center mb-6">
            <h2 className="text-xs font-bold text-[#6a7b8f] uppercase tracking-wider m-0 mb-3">
              {nombreUsuario} - Saldo Disponible
            </h2>

            <h1 className="text-5xl md:text-6xl font-black tracking-[-2.5px] text-[#102033] m-0 leading-none select-none">
              {saldoWaterCoins}
            </h1>

            <p className="text-xs font-semibold text-[#5d6f82] mt-4 mb-0 tracking-wide">
              Equivalente en litros y horas técnicas de la comunidad
            </p>
          </div>

          <hr className="w-full border-[#e2e8f0] m-0 mb-8" />

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-11 w-full pb-2">
            <BotonDashboard
              texto="Crear oferta"
              icono="+"
              destacado
              onClick={() => handleAccionDashboard("crear")}
            />

            <BotonDashboard
              texto="Recargar"
              icono="↓"
              onClick={() => handleAccionDashboard("recargar")}
            />

            <BotonDashboard
              texto="Catálogo"
              icono="▤"
              onClick={() => handleAccionDashboard("catalogo")}
            />

            {isModerator && (
              <BotonDashboard
                texto="Solicitudes"
                icono="!"
                onClick={() => handleAccionDashboard("solicitudes")}
              />
            )}
          </div>
        </section>

        <div className="w-full">
          <PanelMisOfertas
            ofertas={ofertasActivas}
            onGestionar={handleGestionarOferta}
            onCrearNueva={() => setIsModalOpen(true)}
          />
        </div>
      </main>

      {isModalOpen && (
        <ModalCrearOferta
          formData={formData}
          serviciosDB={serviciosDB}
          errores={errores}
          tipoSolicitadoCalculado={tipoSolicitadoCalculado}
          onChange={handleInputChange}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitOferta}
        />
      )}
    </div>
  );
}

function BotonDashboard({ texto, icono, destacado = false, onClick }) {
  const botonClass = destacado
    ? "bg-gradient-to-r from-[#3662AD] to-[#0F5FED] text-white shadow-[0_8px_20px_rgba(15,95,237,0.24)] hover:shadow-[0_12px_24px_rgba(15,95,237,0.35)]"
    : "bg-white border border-[#e2e8f0] text-[#3D4F6E] shadow-sm hover:border-[#0066ff]/30 hover:text-[#0066ff] hover:bg-[#f3f8ff]";

  return (
    <div className="flex flex-col items-center gap-2.5">
      <button
        onClick={onClick}
        className={`w-14 h-14 flex items-center justify-center rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer font-bold text-xl ${botonClass}`}
      >
        {icono}
      </button>

      <span className="text-[11px] font-bold text-[#5d6f82] tracking-wide">
        {texto}
      </span>
    </div>
  );
}

function ModalCrearOferta({
  formData,
  serviciosDB,
  errores,
  tipoSolicitadoCalculado,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f33]/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-[18px] border border-gray-100 rounded-[28px] shadow-[0_30px_70px_rgba(20,70,140,0.22)] w-full max-w-[560px] relative max-h-[92vh] flex flex-col overflow-hidden">
        <header className="p-6 md:p-7 border-b border-gray-50 relative text-left shrink-0">
          <h2 className="text-xl font-bold text-[#102033] tracking-tight m-0">
            Crear nueva oferta
          </h2>

          <p className="text-xs text-[#637489] m-0 mt-1 leading-relaxed">
            Define los recursos para publicarlos en la cartelera comunitaria de
            intercambio.
          </p>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#91a0b2] hover:bg-[#f7fbff] hover:text-[#102033] transition-colors cursor-pointer border-none bg-transparent font-medium text-base"
          >
            ✕
          </button>
        </header>

        <form
          className="p-6 md:p-7 overflow-y-auto flex flex-col gap-5"
          onSubmit={onSubmit}
        >
          <BloqueOferta
            titulo="Ofrece"
            color="#5b8cff"
            fondo="#f8fafc"
            icono={formData.tipoOfrecido === "agua" ? "💧" : "🔧"}
          >
            <CampoSelect
              label="Tipo de recurso"
              name="tipoOfrecido"
              value={formData.tipoOfrecido}
              onChange={onChange}
              opciones={[
                { value: "agua", label: "Agua (Litros)" },
                { value: "servicio", label: "Servicio Técnico" },
              ]}
            />

            {formData.tipoOfrecido === "agua" ? (
              <CampoInput
                label="Cantidad (Litros)"
                name="cantidadOfrecida"
                placeholder="Ej. 1000"
                value={formData.cantidadOfrecida}
                onChange={onChange}
              />
            ) : (
              <div className="flex flex-col gap-1.5 w-full">
                <CampoServicios
                  label="Categoría"
                  name="categoriaOfrecidaServicio"
                  value={formData.categoriaOfrecidaServicio}
                  serviciosDB={serviciosDB}
                  onChange={onChange}
                />

                {errores.certificado && (
                  <div className="mt-2 text-[#e11d48] text-[11px] font-bold">
                    {errores.certificado}
                  </div>
                )}

                <CampoInput
                  label="Horas Técnicas Estimadas"
                  name="cantidadOfrecida"
                  placeholder="Ej. 4"
                  value={formData.cantidadOfrecida}
                  onChange={onChange}
                />
              </div>
            )}
          </BloqueOferta>

          <div className="flex justify-center -my-2 shrink-0">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm text-xs font-bold">
              ↓
            </div>
          </div>

          <BloqueOferta
            titulo="A cambio de"
            color="#ffb443"
            fondo="#fdf8f4"
            icono={tipoSolicitadoCalculado === "agua" ? "💧" : "🔧"}
          >
            <div className="flex flex-col gap-1.5 w-full">
              <label className={labelClass}>Recurso solicitado</label>
              <input
                type="text"
                value={
                  tipoSolicitadoCalculado === "agua"
                    ? "Agua (Litros)"
                    : "Servicio Técnico"
                }
                disabled
                className="w-full border border-gray-100 bg-gray-100/70 rounded-[14px] py-2.5 px-3.5 text-sm text-[#5d6f82] font-semibold outline-none cursor-not-allowed"
              />
            </div>

            {tipoSolicitadoCalculado === "agua" ? (
              <CampoInput
                label="Cantidad (Litros)"
                name="cantidadSolicitada"
                placeholder="Ej. 800"
                value={formData.cantidadSolicitada}
                onChange={onChange}
              />
            ) : (
              <div className="flex flex-col gap-1.5 w-full">
                <CampoServicios
                  label="Categoría"
                  name="categoriaSolicitadaServicio"
                  value={formData.categoriaSolicitadaServicio}
                  serviciosDB={serviciosDB}
                  onChange={onChange}
                />

                <CampoInput
                  label="Horas Requeridas"
                  name="cantidadSolicitada"
                  placeholder="Ej. 3"
                  value={formData.cantidadSolicitada}
                  onChange={onChange}
                />
              </div>
            )}
          </BloqueOferta>

          <div className="flex flex-col gap-1.5 w-full text-left">
            <label className={labelClass}>
              Notas u observaciones adicionales
            </label>

            <textarea
              name="descripcion"
              rows="2"
              placeholder="Detalla horarios, urgencias o condiciones..."
              value={formData.descripcion}
              onChange={onChange}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="register-approval-notice !p-3.5 !rounded-xl text-xs text-left">
            <strong>Importante:</strong> al publicar la oferta, estará disponible
            inmediatamente para que otros miembros la visualicen.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="border border-[rgba(0,102,255,0.14)] cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-[#5d6f82] bg-[#f7fbff] transition-all hover:bg-[#eef6ff] hover:-translate-y-0.5"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="border-none cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-[#0066ff] to-[#00b8ff] shadow-[0_10px_22px_rgba(0,102,255,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,102,255,0.28)] sm:col-span-2"
            >
              Publicar oferta de intercambio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BloqueOferta({ titulo, icono, color, fondo, children }) {
  return (
    <section
      className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] relative w-full box-border text-left"
      style={{ backgroundColor: fondo }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80 rounded-l-[18px]"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center gap-2 mb-4">
        <span className="text-base leading-none">{icono}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {titulo}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function CampoInput({ label, name, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className={labelClass}>{label}</label>
      <input
        type="number"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={inputClass}
      />
    </div>
  );
}

function CampoSelect({ label, name, value, onChange, opciones }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className={labelClass}>{label}</label>
      <select name={name} value={value} onChange={onChange} className={inputClass}>
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CampoServicios({ label, name, value, serviciosDB, onChange }) {
  return (
    <CampoSelect
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      opciones={serviciosDB.map((servicio) => ({
        value: servicio.nombre,
        label: servicio.nombre,
      }))}
    />
  );
}

export default DashboardPage;