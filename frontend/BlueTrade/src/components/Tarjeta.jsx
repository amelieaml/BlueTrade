function Tarjeta({ titulo, descripcion, botonTexto }) {
  return (
    <div className="tarjeta">
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
      <button>{botonTexto}</button>
    </div>
  );
}

export default Tarjeta;