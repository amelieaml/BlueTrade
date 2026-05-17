function Navbar({
  nombreApp = "BlueTrade",
  enlaces = [],
  textoBoton = "Cerrar sesión",
  onBotonClick,
}) {
  return (
    <nav className="navbar">
      <h1>{nombreApp}</h1>

      <div>
        {enlaces.map((enlace, index) => (
          <a key={index} href={enlace.ruta}>
            {enlace.texto}
          </a>
        ))}
      </div>

      <button onClick={onBotonClick}>{textoBoton}</button>
    </nav>
  );
}

export default Navbar;