function BalanceSeccion({ litros = 0, usuario = "Manuel" }) {
  return (
    <div className="mb-10 font-['Poppins',_sans-serif]">
      <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
        Hola, {usuario} 👋 Tu saldo actual
      </p>
      <div className="flex items-baseline gap-3">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#102033] m-0">
          {litros.toLocaleString()}
        </h1>
        <span className="text-2xl md:text-3xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#0066ff] to-[#00b8ff]">
          LITROS
        </span>
      </div>
    </div>
  );
}

export default BalanceSeccion;