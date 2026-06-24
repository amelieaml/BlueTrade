import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import ItemsPage from "../pages/ItemsPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import OfertasPage from "../pages/Ofertaspage.jsx";
import DashboardPage from "../pages/Dashboardpage.jsx";
import SolicitudesPage from "../pages/Solicitudes.jsx";
import PerfilUsuario from "../pages/PerfilUsuario.jsx";
import MisOfertasPage from "../pages/MisOfertasPage.jsx";
import TransaccionesPage from "../pages/TransaccionesPage.jsx";
import PaginaResena from "../pages/PaginaResena.jsx";

import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import SolicitudesRegistroPage from "../pages/SolicitudesRegistroPage.jsx";
import DetalleSolicitudPage from "../pages/DetalleSolicitudPage.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/ofertas" element={<OfertasPage />} />
        <Route path="/solicitudes" element={<SolicitudesPage />} />

        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/perfil/:id" element={<PerfilUsuario />} />
        
        <Route path="/historial" element={<MisOfertasPage />} />
        <Route path="/transacciones" element={<TransaccionesPage />} />

        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route
          path="/admin/usuarios"
          element={<SolicitudesRegistroPage />}
        />

        <Route
          path="/admin/solicitudes/:id"
          element={<DetalleSolicitudPage />}
        />

        <Route path="/resena/:idTransaccion" element={<PaginaResena />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;