import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import ItemsPage from '../pages/ItemsPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import Dashboard from '../pages/DashboardPage.jsx';


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;