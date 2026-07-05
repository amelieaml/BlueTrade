import React, { useState } from 'react';
import { crearCobroComunal } from '../api/item.api';

function ModalCobroComunal({ onClose, onCobroCreado }) {
  const [descripcion, setDescripcion] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas del frontend
    if (!descripcion.trim() || !montoTotal) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (Number(montoTotal) <= 0) {
      setError('El monto total debe ser mayor a 0 litros.');
      return;
    }

    setCargando(true);
    setCargando(true);
    try {
      // 1. Buscamos tu sesión en el almacenamiento local del navegador
      const sesionGuardada = localStorage.getItem('usuario_comunidad');
      const usuarioLogueado = sesionGuardada ? JSON.parse(sesionGuardada) : null;

      // Validación por si la sesión se cerró
      if (!usuarioLogueado || !usuarioLogueado.id) {
        setError('No se pudo identificar tu usuario. Por favor, inicia sesión de nuevo.');
        setCargando(false);
        return;
      }

      // 2. Armamos los datos inyectando TU ID REAL
      const datosCobro = {
        descripcion: descripcion,
        monto_total: parseFloat(montoTotal),
        administrador: usuarioLogueado.id // <--- AQUÍ ENVIAMOS TU ID EXACTO
      };

      await crearCobroComunal(datosCobro);
      
      onCobroCreado(); 
      
    } catch (err) {
      console.error("Error al crear el cobro:", err);
      // Atrapamos el error específico que mandamos desde Django si no hay usuarios activos
      setError(
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'Ocurrió un error al procesar el cobro en el servidor.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f33]/40 backdrop-blur-sm p-4">
      {/* Contenedor del Modal */}
      <div 
        className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-[0_30px_80px_rgba(20,70,140,0.3)] relative transform transition-all"
      >
        {/* Botón de Cerrar (X) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#91a0b2] hover:text-[#0f1f33] transition-colors"
          disabled={cargando}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-[#0f1f33] tracking-tight">
            Crear <span className="text-[#0066ff]">Cobro</span>
          </h2>
          <p className="text-[#5d6f82] mt-2 text-sm font-medium">
            Define el motivo y el monto. El sistema calculará la alícuota automáticamente.
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
            <p className="text-sm font-bold text-red-700 m-0">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Campo: Descripción */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold text-[#91a0b2] uppercase tracking-wider ml-1">
              Descripción del Cobro
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Reparación de tubería principal"
              className="w-full bg-[#f3f8ff] border border-[#dbe4ea] rounded-xl px-4 py-3.5 text-[#102033] font-medium placeholder-[#91a0b2] focus:outline-none focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 transition-all"
              disabled={cargando}
            />
          </div>

          {/* Campo: Monto Total */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold text-[#91a0b2] uppercase tracking-wider ml-1">
              Monto Total a dividir (Litros)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.1"
                value={montoTotal}
                onChange={(e) => setMontoTotal(e.target.value)}
                placeholder="Ej. 1500"
                className="w-full bg-[#f3f8ff] border border-[#dbe4ea] rounded-xl pl-4 pr-12 py-3.5 text-[#102033] font-black text-lg focus:outline-none focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 transition-all"
                disabled={cargando}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[#91a0b2]">
                L
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-[#eef6ff]">
            <button
              type="button"
              onClick={onClose}
              disabled={cargando}
              className="flex-1 bg-white border-2 border-[#dbe4ea] text-[#5d6f82] hover:bg-[#f3f8ff] hover:text-[#102033] font-extrabold py-3.5 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] text-white font-extrabold py-3.5 rounded-xl shadow-[0_10px_20px_rgba(0,102,255,0.2)] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {cargando ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                'Procesar Cobro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCobroComunal;