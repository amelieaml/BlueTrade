import React, { useState, useEffect, useContext } from 'react';
import { crearOferta, obtenerCertificadosUsuario } from '../api/item.api'; 
import { AuthContext } from '../context/AuthContext'; 

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

function ModalCrearOferta({ isOpen, onClose, onSuccess, serviciosDB, usuario }) {
  const [errores, setErrores] = useState({});
  const [certificadosUsuario, setCertificadosUsuario] = useState([]); // Nuevo estado para los certificados
  
  const [formData, setFormData] = useState({
    tipoOfrecido: 'agua',
    cantidadOfrecida: '',
    categoriaOfrecidaServicio: serviciosDB[0]?.nombre || '',
    cantidadSolicitada: '',
    categoriaSolicitadaServicio: serviciosDB[0]?.nombre || '',
    descripcion: ''
  });

  // Efecto para buscar los certificados del usuario al abrir el modal
  useEffect(() => {
    if (isOpen && usuario?.id) {
      const fetchCertificados = async () => {
        try {
          const respuesta = await obtenerCertificadosUsuario(usuario.id);
          // Asumimos que respuesta.data contiene el arreglo de certificados
          console.log("Certificados obtenidos de Supabase:", respuesta.data);
          setCertificadosUsuario(respuesta.data || []); 
        } catch (error) {
          console.error("Error al obtener los certificados del usuario:", error);
          setCertificadosUsuario([]);
        }
      };

      fetchCertificados();
    } else {
      setCertificadosUsuario([]); // Limpiamos al cerrar
      setErrores({}); // Limpiamos errores al cerrar
    }
  }, [isOpen, usuario]);

  useEffect(() => {
    if (serviciosDB && serviciosDB.length > 0) {
      const primerServicioOfrecidoValido = serviciosDB.find(s => {
        const tieneCert = certificadosUsuario.some(cert => cert.tipo_servicio === s.id);
        return !s.necesita_certificado || tieneCert;
      }) || serviciosDB[0];

      setFormData(prev => ({
        ...prev,
        categoriaOfrecidaServicio: prev.categoriaOfrecidaServicio || primerServicioOfrecidoValido.nombre,
        categoriaSolicitadaServicio: prev.categoriaSolicitadaServicio || serviciosDB[0].nombre
      }));
    }
  }, [serviciosDB, certificadosUsuario]);

  if (!isOpen) return null;

  const tipoSolicitadoCalculado = formData.tipoOfrecido === 'agua' ? 'servicio' : 'agua';

  const esOfreceAgua = formData.tipoOfrecido === 'agua';
  const colorOfrece = esOfreceAgua ? 'bg-[#5b8cff]' : 'bg-[#ffb443]';
  const iconoOfrece = esOfreceAgua ? <IconoAgua /> : <IconoServicio />;

  const esSolicitaAgua = tipoSolicitadoCalculado === 'agua';
  const colorSolicita = esSolicitaAgua ? 'bg-[#5b8cff]' : 'bg-[#ffb443]';
  const iconoSolicita = esSolicitaAgua ? <IconoAgua /> : <IconoServicio />;

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
    // Limpiamos el error del campo que el usuario está modificando
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    setErrores({});

    if (formData.tipoOfrecido === 'agua' && parseFloat(formData.cantidadOfrecida) > usuario.litros_disponibles) {
        // En lugar de alert, guardamos el error en el estado
        setErrores({ 
            cantidadOfrecida: "No tienes suficientes litros disponibles. Tu saldo actual es " + usuario.litros_disponibles 
        });
        return; // Detenemos la ejecución
    }

    if (formData.tipoOfrecido === 'servicio') {
      const servicioSeleccionado = serviciosDB.find(s => s.nombre === formData.categoriaOfrecidaServicio);
      if (servicioSeleccionado?.necesita_certificado && !usuario?.certificado) {
        setErrores({ certificado: "Este servicio requiere una certificación técnica." });
        return;
      }
    }

    const payload = {
      usuario_id: usuario?.id, 
      tipo_ofrecido: formData.tipoOfrecido.toUpperCase(),
      descripcion: formData.descripcion,
      cantidad_ofrecida: parseFloat(formData.cantidadOfrecida),
      categoria_ofrecida: formData.tipoOfrecido === 'servicio' ? formData.categoriaOfrecidaServicio : null,
      tipo_solicitado: tipoSolicitadoCalculado.toUpperCase(),
      cantidad_solicitada: parseFloat(formData.cantidadSolicitada),
      categoria_solicitada: tipoSolicitadoCalculado === 'servicio' ? formData.categoriaSolicitadaServicio : null
    };

    try {
      const respuesta = await crearOferta(payload);
      if (respuesta.status === 201) {
        alert("¡Oferta publicada exitosamente!");
        onSuccess(respuesta.data); 
        
        setFormData({
          tipoOfrecido: 'agua',
          cantidadOfrecida: '',
          categoriaOfrecidaServicio: serviciosDB[0]?.nombre || '',
          cantidadSolicitada: '',
          categoriaSolicitadaServicio: serviciosDB[0]?.nombre || '',
          descripcion: ''
        });
        onClose();
      }
    } catch (error) {
      console.error("Error al publicar la oferta:", error);
      const mensaje = error.response?.data?.detail || "Hubo un error al registrar tu intercambio.";
      alert(mensaje);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1f33]/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-[18px] border border-gray-100 rounded-[28px] shadow-[0_30px_70px_rgba(20,70,140,0.22)] w-full max-w-[560px] relative max-h-[92vh] flex flex-col overflow-hidden">
        
        <div className="p-6 md:p-7 border-b border-gray-50 relative text-left shrink-0">
          <h2 className="text-xl font-bold text-[#102033] tracking-tight m-0">Crear nueva oferta</h2>
          <p className="text-xs text-[#637489] m-0 mt-1 leading-relaxed">
            Especifica que deseas ofrecer y obtener a cambio
          </p>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-[#91a0b2] hover:bg-[#f7fbff] hover:text-[#102033] transition-colors cursor-pointer border-none bg-transparent font-medium text-base"
          >
            ✕
          </button>
        </div>

        <form className="p-6 md:p-7 overflow-y-auto flex flex-col gap-5" onSubmit={handleSubmit}>
          
          {/* OFRECE */}
          <div className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] bg-[#f8fafc] relative w-full box-border text-left">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorOfrece} opacity-80 rounded-l-[18px] transition-colors duration-300`} />
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-base leading-none ${esOfreceAgua ? 'text-[#5b8cff]' : 'text-[#ffb443]'}`}>{iconoOfrece}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ofrece</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[#102033] font-bold text-[13px]">Tipo de recurso</label>
                <select name="tipoOfrecido" value={formData.tipoOfrecido} onChange={handleInputChange} className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm text-[#102033] outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10">
                  <option value="agua">Agua (Litros)</option>
                  <option value="servicio">Servicio Técnico</option>
                </select>
              </div>

              {formData.tipoOfrecido === 'agua' ? (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Cantidad (Litros)</label>
                  <input 
                    type="number" 
                    name="cantidadOfrecida" 
                    placeholder="Ej. 1000" 
                    value={formData.cantidadOfrecida} 
                    onChange={handleInputChange} 
                    required 
                    // Si hay error, cambiamos el borde a rojo
                    className={`w-full border rounded-[14px] py-2.5 px-3.5 text-sm outline-none transition-all 
                      ${errores.cantidadOfrecida ? 'border-red-500 ring-1 ring-red-500' : 'border-[rgba(0,102,255,0.14)] focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10'}`}
                  />
                  {errores.cantidadOfrecida && (
                    <span className="text-[#e11d48] text-[11px] font-bold mt-1">
                      {errores.cantidadOfrecida}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Categoría (Desde BD)</label>
                  <select 
                    name="categoriaOfrecidaServicio" 
                    value={formData.categoriaOfrecidaServicio} 
                    onChange={handleInputChange} 
                    className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"
                  >
                    {serviciosDB.map(s => {
                      // AHORA: Comparamos por ID para saber si habilitar o deshabilitar la opción
                      const tieneCertificado = certificadosUsuario.some(cert => cert.tipo_servicio === s.id);
                      const opcionBloqueada = s.necesita_certificado && !tieneCertificado;

                      return (
                        <option 
                          key={s.id} 
                          value={s.nombre}
                          disabled={opcionBloqueada}
                        >
                          {s.nombre} {opcionBloqueada ? '(Requiere certificado)' : ''}
                        </option>
                      )
                    })}
                  </select>
                  {errores.certificado && (
                    <div className="mt-2 text-[#e11d48] text-[11px] font-bold flex items-center gap-1">{errores.certificado}</div>
                  )}
                  <label className="text-[#102033] font-bold text-[13px] mt-2">Horas Técnicas Estimadas</label>
                  <input type="number" name="cantidadOfrecida" placeholder="Ej. 4" value={formData.cantidadOfrecida} onChange={handleInputChange} required className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"/>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center -my-2 shrink-0 z-10">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm text-xs font-bold">
              <IconoFlechaAbajo />
            </div>
          </div>

          {/* SOLICITA */}
          <div className="p-5 pr-[18px] pl-6 rounded-[18px] border border-black/[0.04] bg-[#fdf8f4] relative w-full box-border text-left">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorSolicita} opacity-80 rounded-l-[18px] transition-colors duration-300`} />
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-base leading-none ${esSolicitaAgua ? 'text-[#5b8cff]' : 'text-[#ffb443]'}`}>{iconoSolicita}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">A cambio de</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[#102033] font-bold text-[13px]">Recurso solicitado</label>
                <input type="text" value={tipoSolicitadoCalculado === 'agua' ? "Agua (Litros)" : "Servicio Técnico"} disabled className="w-full border border-gray-100 bg-gray-100/70 rounded-[14px] py-2.5 px-3.5 text-sm text-[#5d6f82] font-semibold outline-none cursor-not-allowed"/>
              </div>

              {tipoSolicitadoCalculado === 'agua' ? (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Cantidad (Litros)</label>
                  <input type="number" name="cantidadSolicitada" placeholder="Ej. 800" value={formData.cantidadSolicitada} onChange={handleInputChange} required className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"/>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[#102033] font-bold text-[13px]">Categoría (Desde BD)</label>
                  <select name="categoriaSolicitadaServicio" value={formData.categoriaSolicitadaServicio} onChange={handleInputChange} className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10">
                    {serviciosDB.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}
                  </select>
                  <label className="text-[#102033] font-bold text-[13px] mt-2">Horas Requeridas</label>
                  <input type="number" name="cantidadSolicitada" placeholder="Ej. 3" value={formData.cantidadSolicitada} onChange={handleInputChange} required className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10"/>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full text-left">
            <label className="text-[#102033] font-bold text-[13px]">Notas u observaciones (Opcional)</label>
            <textarea name="descripcion" rows="2" value={formData.descripcion} onChange={handleInputChange} className="w-full border border-[rgba(0,102,255,0.14)] bg-white rounded-[14px] py-2.5 px-3.5 text-sm outline-none transition-all focus:border-[rgba(0,102,255,0.65)] focus:ring-4 focus:ring-blue-500/10 resize-none"/>
          </div>

          <div className="bg-[#f0f6ff] text-[#0066ff] p-3.5 rounded-xl text-xs text-left border border-blue-100">
            <strong>Importante:</strong> al publicar la oferta, estará disponible inmediatamente.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 shrink-0">
            <button type="button" onClick={onClose} className="border border-[rgba(0,102,255,0.14)] cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-[#5d6f82] bg-[#f7fbff] transition-all hover:bg-[#eef6ff]">Cancelar</button>
            <button type="submit" className="border-none cursor-pointer rounded-full py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-[#0066ff] to-[#00b8ff] shadow-[0_10px_22px_rgba(0,102,255,0.2)] hover:-translate-y-0.5 sm:col-span-2">Publicar oferta</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCrearOferta;