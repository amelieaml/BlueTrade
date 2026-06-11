import React, { useState, useEffect } from 'react';
import { actualizarOferta } from '../api/item.api'; 

const IconoAgua = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16a5 5 0 005-5c0-2.76-2.5-5.5-5-8.5-2.5 3-5 5.74-5 8.5a5 5 0 005 5z" />
  </svg>
);

const IconoServicio = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconoFlechaAbajo = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

function ModalGestionarOferta({ isOpen, onClose, onSuccess, serviciosDB, usuario, oferta }) {
  const [errores, setErrores] = useState({});
  
  const [formData, setFormData] = useState({
    tipoOfrecido: 'agua',
    cantidadOfrecida: '',
    categoriaOfrecidaServicio: '',
    cantidadSolicitada: '',
    categoriaSolicitadaServicio: '',
    descripcion: ''
  });

  useEffect(() => {
    if (oferta && isOpen) {
      const tipoOfrecidoLower = oferta.tipo_ofrecido?.toLowerCase() || 'agua';
      const tipoSolicitadoLower = oferta.tipo_solicitado?.toLowerCase() || 'servicio';

      setFormData({
        tipoOfrecido: tipoOfrecidoLower,
        cantidadOfrecida: oferta.cantidad_ofrecida || '',
        categoriaOfrecidaServicio: tipoOfrecidoLower === 'servicio' ? oferta.categoria_ofrecida : (serviciosDB[0]?.nombre || ''),
        cantidadSolicitada: oferta.cantidad_solicitada || '',
        categoriaSolicitadaServicio: tipoSolicitadoLower === 'servicio' ? oferta.categoria_solicitada : (serviciosDB[0]?.nombre || ''),
        descripcion: oferta.descripcion || ''
      });
    }
  }, [oferta, isOpen, serviciosDB]);

  if (!isOpen || !oferta) return null;

  const tipoSolicitadoCalculado = formData.tipoOfrecido === 'agua' ? 'servicio' : 'agua';

  const esOfreceAgua = formData.tipoOfrecido === 'agua';
  const colorOfrece = esOfreceAgua ? 'bg-[#5b8cff]' : 'bg-[#ffb443]';
  const iconoOfrece = esOfreceAgua ? <IconoAgua /> : <IconoServicio />;

  const esSolicitaAgua = tipoSolicitadoCalculado === 'agua';
  const colorSolicita = esSolicitaAgua ? 'bg-[#5b8cff]' : 'bg-[#ffb443]';
  const iconoSolicita = esSolicitaAgua ? <IconoAgua /> : <IconoServicio />;

  const esEstadoPausado = oferta.estado === 'PAUSADO';
  const esEditable = oferta.estado === 'ACTIVO' || oferta.estado === 'PAUSADO';
  
  const getEstadoEstilos = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'EN_PROCESO': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'PAUSADO': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'COMPLETADO': return 'bg-[#f7fbff] text-[#0066ff] border-blue-100';
      case 'CANCELADO': return 'bg-red-50 text-red-500 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const inputClassBase = "w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-100/70 disabled:text-[#5d6f82] disabled:cursor-not-allowed";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipoOfrecido') {
      setFormData(prev => ({
        ...prev,
        tipoOfrecido: value,
        cantidadOfrecida: '',
        cantidadSolicitada: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const ejecutarAccion = async (estadoDestino) => {
    setErrores({});
    const payload = {
      id: oferta.id,
      usuario: usuario?.id,
      estado: estadoDestino, 
      tipo_ofrecido: formData.tipoOfrecido.toUpperCase(),
      descripcion: formData.descripcion,
      cantidad_ofrecida: parseFloat(formData.cantidadOfrecida),
      categoria_ofrecida: formData.tipoOfrecido === 'servicio' ? formData.categoriaOfrecidaServicio : null,
      tipo_solicitado: tipoSolicitadoCalculado.toUpperCase(),
      cantidad_solicitada: parseFloat(formData.cantidadSolicitada),
      categoria_solicitada: tipoSolicitadoCalculado === 'servicio' ? formData.categoriaSolicitadaServicio : null
    };

    try {
      const respuesta = await actualizarOferta(oferta.id, payload);
      if (respuesta.status === 200) {
        alert(`¡Oferta actualizada a ${estadoDestino.toLowerCase()} exitosamente!`);
        onSuccess(respuesta.data); 
        onClose();
      }
    } catch (error) {
      console.error(`Error al actualizar la oferta a ${estadoDestino}:`, error);
      const mensajeError = error.response?.data?.detail || "Hubo un error al intentar ejecutar la acción.";
      alert(mensajeError);
    }
  };

  const handleSubmitGuardar = (e) => {
    e.preventDefault();
    if (esEditable) {
      ejecutarAccion(oferta.estado); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f33]/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-[18px] border border-gray-100 rounded-[28px] shadow-[0_30px_70px_rgba(20,70,140,0.22)] w-full max-w-[600px] relative max-h-[92vh] flex flex-col overflow-hidden">
        
        <div className="p-6 md:p-7 border-b border-gray-50 relative text-left shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#102033] tracking-tight m-0">Gestionar oferta #{oferta.id}</h2>
            {/* Aplicación dinámica de colores al estado */}
            <span className={`text-[10px] font-black tracking-wider px-2 py-1 rounded-md border uppercase ${getEstadoEstilos(oferta.estado)}`}>
              {oferta.estado}
            </span>
          </div>
          <p className="text-xs text-[#637489] m-0 mt-1 leading-relaxed">
            {esEditable 
              ? "Modifica las cantidades, altera el estado o cancela tu publicación."
              : "Esta oferta es de solo lectura debido a su estado actual."}
          </p>
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#91a0b2] hover:bg-[#f7fbff] hover:text-[#102033] transition-colors cursor-pointer border-none bg-transparent font-medium text-base">
            ✕
          </button>
        </div>

        <form className="p-6 md:p-7 overflow-y-auto flex flex-col gap-5" onSubmit={handleSubmitGuardar}>
          
          {!esEditable && (
            <div className="bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Esta oferta está en estado {oferta.estado.toLowerCase()} y ya no puede ser modificada.
            </div>
          )}

          <div className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] bg-[#f8fafc] relative w-full box-border text-left">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorOfrece} opacity-80 rounded-l-[18px] transition-colors duration-300`} />
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-base leading-none ${esOfreceAgua ? 'text-[#5b8cff]' : 'text-[#ffb443]'}`}>{iconoOfrece}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ofrece</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[#102033] font-bold text-[13px]">Tipo de recurso</label>
                <select disabled={!esEditable} name="tipoOfrecido" value={formData.tipoOfrecido} onChange={handleInputChange} className={inputClassBase}>
                  <option value="agua">Agua (Litros)</option>
                  <option value="servicio">Servicio Técnico</option>
                </select>
              </div>

              {formData.tipoOfrecido === 'agua' ? (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Cantidad (Litros)</label>
                  <input disabled={!esEditable} type="number" name="cantidadOfrecida" value={formData.cantidadOfrecida} onChange={handleInputChange} required className={inputClassBase}/>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Categoría (Desde BD)</label>
                  <select disabled={!esEditable} name="categoriaOfrecidaServicio" value={formData.categoriaOfrecidaServicio} onChange={handleInputChange} className={inputClassBase}>
                    {serviciosDB.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                  </select>
                  <label className="text-[#102033] font-bold text-[13px] mt-2">Horas Técnicas</label>
                  <input disabled={!esEditable} type="number" name="cantidadOfrecida" value={formData.cantidadOfrecida} onChange={handleInputChange} required className={inputClassBase}/>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center -my-2 shrink-0 z-10">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
              <IconoFlechaAbajo />
            </div>
          </div>

          <div className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] bg-[#fdf8f4] relative w-full box-border text-left">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorSolicita} opacity-80 rounded-l-[18px] transition-colors duration-300`} />
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-base leading-none ${esSolicitaAgua ? 'text-[#5b8cff]' : 'text-[#ffb443]'}`}>{iconoSolicita}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">A cambio de</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[#102033] font-bold text-[13px]">Recurso solicitado</label>
                <input type="text" value={tipoSolicitadoCalculado === 'agua' ? "Agua (Litros)" : "Servicio Técnico"} disabled className={inputClassBase}/>
              </div>

              {tipoSolicitadoCalculado === 'agua' ? (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Cantidad (Litros)</label>
                  <input disabled={!esEditable} type="number" name="cantidadSolicitada" value={formData.cantidadSolicitada} onChange={handleInputChange} required className={inputClassBase}/>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Categoría (Desde BD)</label>
                  <select disabled={!esEditable} name="categoriaSolicitadaServicio" value={formData.categoriaSolicitadaServicio} onChange={handleInputChange} className={inputClassBase}>
                    {serviciosDB.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                  </select>
                  <label className="text-[#102033] font-bold text-[13px] mt-2">Horas Requeridas</label>
                  <input disabled={!esEditable} type="number" name="cantidadSolicitada" value={formData.cantidadSolicitada} onChange={handleInputChange} required className={inputClassBase}/>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full text-left">
            <label className="text-[#102033] font-bold text-[13px]">Notas u observaciones</label>
            <textarea disabled={!esEditable} name="descripcion" rows="2" value={formData.descripcion} onChange={handleInputChange} className={`${inputClassBase} resize-none`}/>
          </div>

          <div className={`grid ${esEditable ? 'grid-cols-2' : 'grid-cols-1'} gap-3 pt-4 shrink-0 mt-2 border-t border-gray-100`}>
            <button 
              type="button" 
              onClick={onClose} 
              className={`border border-gray-200 cursor-pointer rounded-xl py-3 px-4 text-sm font-bold text-[#5d6f82] bg-gray-50 transition-all hover:bg-gray-100 ${!esEditable ? 'col-span-1' : ''}`}
            >
              Cerrar
            </button>
            
            {esEditable && (
              <>
                <button 
                  type="button" 
                  onClick={() => ejecutarAccion(esEstadoPausado ? 'ACTIVO' : 'PAUSADO')} 
                  className={esEstadoPausado 
                    ? "border border-emerald-200 cursor-pointer rounded-xl py-3 px-4 text-sm font-bold text-emerald-600 bg-emerald-50 transition-all hover:bg-emerald-100"
                    : "border border-amber-200 cursor-pointer rounded-xl py-3 px-4 text-sm font-bold text-amber-600 bg-amber-50 transition-all hover:bg-amber-100"
                  }
                >
                  {esEstadoPausado ? 'Activar Oferta' : 'Pausar Oferta'}
                </button>

                <button 
                  type="button" 
                  onClick={() => ejecutarAccion('CANCELADO')} 
                  className="border border-red-200 cursor-pointer rounded-xl py-3 px-4 text-sm font-bold text-red-600 bg-red-50 transition-all hover:bg-red-100"
                >
                  Cancelar Oferta
                </button>

                <button 
                  type="submit" 
                  className="border-none cursor-pointer rounded-xl py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-[#0066ff] to-[#00b8ff] shadow-[0_4px_12px_rgba(0,102,255,0.2)] hover:shadow-[0_6px_16px_rgba(0,102,255,0.3)] transition-all"
                >
                  Guardar Cambios
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalGestionarOferta;