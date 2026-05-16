function BotonPrincipal({ texto, onClick, type = "button" }) {
  return (
    <button className="boton-principal" type={type} onClick={onClick}>
      {texto}
    </button>
  );
}

export default BotonPrincipal;