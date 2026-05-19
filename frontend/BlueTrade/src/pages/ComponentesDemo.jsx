import Navbar from "../components/Navbar";
import BotonPrincipal from "../components/BotonPrincipal";
import CampoFormulario from "../components/CampoFormulario";
import TituloSeccion from "../components/TituloSeccion";
import LogoNombre from "../components/LogoNombre";
import Tarjeta from "../components/Tarjeta";

function ComponentesDemo() {
  return (
    <>
      <Navbar
        nombreApp="BlueTrade"
        enlaces={[
          { texto: "Panel", ruta: "/panel" },
          { texto: "Ofertas", ruta: "/ofertas" },
          { texto: "Solicitudes", ruta: "/solicitudes" },
          { texto: "Perfil", ruta: "/perfil" },
        ]}
        textoBoton="Cerrar sesión"
        onBotonClick={() => {
          console.log("Cerrar sesión");
        }}
      />

      <main style={{ padding: "40px" }}>
        <LogoNombre />

        <TituloSeccion
          titulo="Componentes reutilizables"
          subtitulo="Vista de prueba para revisar las plantillas base de BlueTrade"
        />

        <section style={{ marginTop: "30px" }}>
          <h3>Botones</h3>

          <BotonPrincipal texto="Guardar cambios" />
          <BotonPrincipal texto="Aceptar oferta" />
          <BotonPrincipal texto="Enviar solicitud" />
        </section>

        <section style={{ marginTop: "30px" }}>
          <h3>Campos de formulario</h3>

          <CampoFormulario
            label="Nombre completo"
            placeholder="Ingrese su nombre"
          />

          <CampoFormulario
            label="Correo electrónico"
            type="email"
            placeholder="Ingrese su correo"
          />

          <CampoFormulario
            label="Contraseña"
            type="password"
            placeholder="Ingrese su contraseña"
          />
        </section>

        <section style={{ marginTop: "30px" }}>
          <h3>Tarjetas</h3>

          <Tarjeta
            titulo="Oferta de agua"
            descripcion="Usuario disponible para intercambiar litros de agua."
            botonTexto="Ver oferta"
          />

          <Tarjeta
            titulo="Servicio técnico"
            descripcion="Proveedor certificado para mantenimiento de infraestructura."
            botonTexto="Ver servicio"
          />
        </section>
      </main>
    </>
  );
}

export default ComponentesDemo;