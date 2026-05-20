import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import ItemsPage from '../pages/ItemsPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import OfertasPage from '../pages/Ofertaspage.jsx';
import DashboardPage from '../pages/Dashboardpage.jsx';
import SolicitudesPage from '../pages/Solicitudes.jsx';
import PerfilUsuario from '../pages/PerfilUsuario.jsx';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/ofertas" element={<OfertasPage />} />
        <Route path="/solicitudes" element={<SolicitudesPage />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;