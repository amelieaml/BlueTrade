import { useState } from 'react';

import NavbarDashboard from '../components/NavbarDashboard';
import BalanceSeccion from '../components/BalanceSeccion';
import BotoneraAcciones from '../components/BotoneraAcciones';
import PanelMisOfertas from '../components/PanelMisOfertas';

const MIS_OFERTAS_MOCK = [
  {
    id: 'OFE-001',
    estado: 'ACTIVO',
    itemOfrecido: { tipo: 'agua', litros: 1000 },
    itemSolicitado: { tipo: 'servicio', categoria: 'electricidad', horasEstimadas: 4 }
  },
  {
    id: 'OFE-042',
    estado: 'PROCESANDO',
    itemOfrecido: { tipo: 'servicio', categoria: 'plomeria', horasEstimadas: 3 },
    itemSolicitado: { tipo: 'agua', litros: 800 }
  }
];

function DashboardPage() {
  const [isModerator] = useState(true);
  const [saldoLitros] = useState(3250);

  function handleAccionDashboard(tipoAccion) {
    console.log(`Disparando acción desde la botonera: ${tipoAccion}`);
  }

  function handleGestionarOferta(oferta) {
    console.log('Gestionando oferta específica:', oferta.id);
  }

  return (
    <div className="min-h-screen bg-[#f7fbff] bg-[radial-gradient(circle_at_top_left,rgba(0,120,255,0.18),transparent_35%),linear-gradient(135deg,#f7fbff_0%,#eef6ff_45%,#ffffff_100%)] text-[#102033] font-sans pb-16">
      
      <NavbarDashboard paginaActiva="dashboard" />

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 pt-10">
        
        {/* 1. Componente del Balance de Litros */}
        <BalanceSeccion litros={saldoLitros} usuario="Manuel" />

        {/* 2. Componente de la Botonera de Navegación */}
        <BotoneraAcciones isModerator={isModerator} onAccion={handleAccionDashboard} />

        {/* 3. Panel de Ofertas (AHORA EN UNA GRAN TARJETA) */}
        <PanelMisOfertas 
          ofertas={MIS_OFERTAS_MOCK}
          onGestionar={handleGestionarOferta}
          onCrearNueva={() => handleAccionDashboard('crear')}
        />

      </div>
    </div>
  );
}

export default DashboardPage;