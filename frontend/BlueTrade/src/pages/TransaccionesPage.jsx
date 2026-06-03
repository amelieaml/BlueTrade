import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMisTransacciones } from '../api/item.api';
import NavbarDashboard from '../components/NavbarDashboard';

function TransaccionesPage() {
  const { usuario } = useContext(AuthContext);
  const [transacciones, setTransacciones] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('compras'); // 'compras' o 'ventas'

  const cargarTransacciones = async () => {
    try {
      const response = await getMisTransacciones();
      setTransacciones(response.data);
    } catch (error) {
      console.error("Error al cargar las transacciones:", error);
    }
  };
  

  // Filtrado en el cliente basado en el rol del usuario logueado
  const misCompras = useMemo(() => {
    return transacciones.filter((t) => t.comprador === usuario?.id);
  }, [transacciones, usuario]);

  const misVentas = useMemo(() => {
    return transacciones.filter((t) => t.vendedor === usuario?.id);
  }, [transacciones, usuario]);

  const transaccionesFiltradas = vistaActiva === 'compras' ? misCompras : misVentas;

  // Función auxiliar para renderizar insignias de estado con estilos condicionales
  const renderBadgeEstado = (estado) => {
    const estilos = {
      PENDIENTE: 'bg-amber-100 text-amber-700 border-amber-200',
      EN_PROCESO: 'bg-blue-100 text-blue-700 border-blue-200',
      COMPLETADA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      CANCELADA: 'bg-rose-100 text-rose-700 border-rose-200',
    };

    return (
      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${estilos[estado] || 'bg-gray-100 text-gray-700'}`}>
        {estado}
      </span>
    );
  };
  useEffect(() => {
    if (usuario?.id) {
      cargarTransacciones();
    }
  }, [usuario]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fbff] via-[#eef6ff] to-[#ffffff] text-[#3D4F6E] font-sans pb-16 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%)] pointer-events-none" />

      <NavbarDashboard paginaActiva="transacciones" />

      <div className="max-w-[1200px] mx-auto px-6 pt-12 relative z-10">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white/86 border border-white/90 p-8 rounded-[32px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(20,70,140,0.18)]">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-2px] text-[#0f1f33] leading-none m-0">
              Mis <span className="bg-gradient-to-r from-[#0066ff] to-[#00b8ff] bg-clip-text text-transparent">intercambios</span>
            </h1>
            <p className="text-[#5d6f82] mt-4 text-lg leading-relaxed max-w-2xl m-0">
              Monitorea y gestiona el flujo de tus transacciones activas e históricas.
            </p>
          </div>

          {/* Selector de pestañas / Tabs */}
          <div className="flex bg-[#f0f6ff] p-1.5 rounded-2xl border border-[#0066ff]/10 w-full md:w-auto">
            <button
              onClick={() => setVistaActiva('compras')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                vistaActiva === 'compras'
                  ? 'bg-white text-[#0066ff] shadow-[0_4px_12px_rgba(0,102,255,0.15)]'
                  : 'text-[#6a7b8f] hover:text-[#0f1f33]'
              }`}
            >
              Como Comprador ({misCompras.length})
            </button>
            <button
              onClick={() => setVistaActiva('ventas')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                vistaActiva === 'ventas'
                  ? 'bg-white text-[#0066ff] shadow-[0_4px_12px_rgba(0,102,255,0.15)]'
                  : 'text-[#6a7b8f] hover:text-[#0f1f33]'
              }`}
            >
              Como Vendedor ({misVentas.length})
            </button>
          </div>
        </div>

        {/* Panel de Resultados */}
        <div className="bg-white/86 backdrop-blur-[18px] border border-white/90 shadow-[0_30px_80px_rgba(20,70,140,0.18)] rounded-[32px] p-8">
          {transaccionesFiltradas.length === 0 ? (
            <div className="text-center py-20 text-[#637489] font-medium">
              No tienes transacciones registradas bajo este rol en este momento.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {transaccionesFiltradas.map((tx) => (
                <div 
                  key={tx.id} 
                  className="border border-[#0066ff]/10 bg-white hover:border-[#0066ff]/30 rounded-2xl p-6 transition-all duration-200 shadow-[0_4px_20px_rgba(20,70,140,0.02)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#6a7b8f] tracking-wider uppercase">
                      Transacción #{tx.id}
                    </span>
                    <h4 className="text-lg font-bold text-[#102033] m-0">
                      Oferta Vinculada ID: {tx.oferta}
                    </h4>
                    <p className="text-sm text-[#5d6f82] m-0 mt-1">
                      Iniciada el: {new Date(tx.fecha_inicio).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-bold text-[#6a7b8f] uppercase m-0">Confirmaciones</p>
                      <p className="text-xs font-medium text-[#5d6f82] mt-0.5">
                        Tú: {vistaActiva === 'compras' ? (tx.confirmacion_comprador ? '✅' : '❌') : (tx.confirmacion_vendedor ? '✅' : '❌')} | 
                        Contraparte: {vistaActiva === 'compras' ? (tx.confirmacion_vendedor ? '✅' : '❌') : (tx.confirmacion_comprador ? '✅' : '❌')}
                      </p>
                    </div>
                    {renderBadgeEstado(tx.estado)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransaccionesPage;