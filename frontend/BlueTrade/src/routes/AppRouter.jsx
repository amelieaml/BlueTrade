import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import ItemsPage from '../pages/ItemsPage.jsx';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;