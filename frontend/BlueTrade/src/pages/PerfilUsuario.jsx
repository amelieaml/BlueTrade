import { useState } from 'react';
import NavbarDashboard from '../components/NavbarDashboard';
import '../styles/DashboardPage.css'; // Asegúrate de que este archivo contenga los estilos globales que hemos usado

function PerfilUsuario() {
  // Simulamos datos del usuario (esto vendrá de tu AuthContext)
  const usuario = {
    nombre: "Juan Aguirre",
    iniciales: "JA",
    ciudad: "Buenos Aires",
    dni: "33443897",
    direccion: "Av. Directorio 1880",
    movil: "11 6546655",
    email: "juan.aguirre@gmail.com",
    estado: "Aprobado"
  };

  return (
    <div className="dashboard-page-fintech">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />
      
      <NavbarDashboard paginaActiva="perfil" />

      <main className="dashboard-main-content">
        {/* CABECERA DE PERFIL */}
        <section className="flex flex-col items-center mb-12">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-6">
            {usuario.iniciales}
          </div>
          <h1 className="text-4xl font-extrabold text-[#102033] mb-2">{usuario.nombre}</h1>
          <p className="text-[#637489] font-medium">{usuario.ciudad}, Argentina</p>
          
          <div className="mt-6 flex gap-4">
            <span className={`px-6 py-2 rounded-full font-bold text-sm ${usuario.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              Estado: {usuario.estado}
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* COLUMNA 1: DATOS BÁSICOS */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-[#102033] mb-8">Mis datos</h2>
            <div className="grid grid-cols-2 gap-y-6">
              {[
                { label: 'DNI', value: usuario.dni },
                { label: 'Dirección', value: usuario.direccion },
                { label: 'Ciudad', value: usuario.ciudad },
                { label: 'Móvil', value: usuario.movil }
              ].map((item, idx) => (
                <div key={idx}>
                  <p className="text-xs uppercase text-[#94a3b8] font-bold mb-1">{item.label}</p>
                  <p className="text-lg text-[#102033] font-semibold">{item.value}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs uppercase text-[#94a3b8] font-bold mb-1">Email</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg text-[#102033] font-semibold">{usuario.email}</p>
                  <button className="text-[#0066ff] font-bold text-sm">Editar</button>
                </div>
              </div>
            </div>
          </section>

          {/* COLUMNA 2: GESTIÓN DE SERVICIOS */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#102033] mb-6">Gestión de Servicios</h2>
              <p className="text-[#637489] mb-8">Agrega nuevos servicios hídricos o técnicos, o actualiza tus certificaciones vigentes para mantener tu perfil activo.</p>
            </div>

            <div className="space-y-4">
              <button className="w-full py-4 rounded-2xl bg-[#f7fbff] border-2 border-dashed border-[#0066ff] text-[#0066ff] font-bold hover:bg-[#eff6ff] transition-all">
                + Agregar nuevo servicio
              </button>
              <div className="certificate-section">
                <label className="block text-sm font-bold text-[#102033] mb-2">Subir/Actualizar Certificado</label>
                <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0066ff] file:text-white hover:file:bg-[#0052cc]" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PerfilUsuario;