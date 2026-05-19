function TituloSeccion({ titulo, subtitulo }) {
  return (
    <div className="titulo-seccion">
      <h2>{titulo}</h2>
      {subtitulo && <p>{subtitulo}</p>}
    </div>
  );
}

export default TituloSeccion;