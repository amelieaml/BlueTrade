import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavbarDashboard from '../components/NavbarDashboard';
import { guardarCertificado } from '../api/item.api'; // Asegúrate de tener esta función en tu archivo API

function PerfilUsuario() {
  const { usuario, obtenerPerfilActualizado } = useContext(AuthContext);
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Helper para obtener iniciales
  const getIniciales = (nombre) => {
    if (!nombre) return "??";
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const subirArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!archivo) return;
    setCargando(true);
    try {
      // Ajusta '1' al ID del tipo de servicio correspondiente o cámbialo por un select si es necesario
      const formData = new FormData();
      formData.append('certificado', archivo);
      formData.append('tipoServicio', 1); 

      await guardarCertificado(usuario.id, formData);
      await obtenerPerfilActualizado(usuario.id); // Refresca el contexto
      alert("Certificado subido con éxito");
      setArchivo(null);
    } catch (error) {
      console.error("Error al subir certificado:", error);
      alert("Error al subir el archivo");
    } finally {
      setCargando(false);
    }
  };

  if (!usuario) return <div>Cargando perfil...</div>;

  return (
    <div className="dashboard-page-fintech">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />
      
      <NavbarDashboard paginaActiva="perfil" />

      <main className="dashboard-main-content">
        {/* CABECERA DE PERFIL */}
        <section className="flex flex-col items-center mb-12">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#0066ff] to-[#00c2ff] flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-6">
            {getIniciales(usuario.nombre)}
          </div>
          <h1 className="text-4xl font-extrabold text-[#102033] mb-2">{usuario.nombre}</h1>
          <p className="text-[#637489] font-medium">Casa: {usuario.codigo_casa}</p>
          
          <div className="mt-6 flex gap-4">
            <span className={`px-6 py-2 rounded-full font-bold text-sm ${usuario.estado === 'APROBADO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              Estado: {usuario.estado || 'Pendiente'}
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DATOS BÁSICOS */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-[#102033] mb-8">Mis datos</h2>
            <div className="grid grid-cols-2 gap-y-6">
              {[
                { label: 'DNI / CI', value: usuario.ci },
                { label: 'Móvil', value: usuario.telefono },
                { label: 'Email', value: usuario.email },
                { label: 'Litros Disponibles', value: usuario.litros_agua }
              ].map((item, idx) => (
                <div key={idx}>
                  <p className="text-xs uppercase text-[#94a3b8] font-bold mb-1">{item.label}</p>
                  <p className="text-lg text-[#102033] font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* GESTIÓN DE SERVICIOS */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#102033] mb-6">Gestión de Servicios</h2>
              <p className="text-[#637489] mb-8">Actualiza tus certificaciones vigentes para validar tu capacidad técnica en la comunidad.</p>
            </div>

            <div className="space-y-4">
              <div className="certificate-section">
                <label className="block text-sm font-bold text-[#102033] mb-2">Subir nuevo certificado</label>
                <input 
                  type="file" 
                  onChange={subirArchivo}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0066ff] file:text-white hover:file:bg-[#0052cc] cursor-pointer" 
                />
                {archivo && (
                  <button 
                    onClick={handleUpload}
                    disabled={cargando}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all"
                  >
                    {cargando ? "Subiendo..." : "Confirmar subida"}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PerfilUsuario;