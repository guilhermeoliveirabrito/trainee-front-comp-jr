import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Movies from './pages/Movies';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route element={<PrivateRoute />}>
              <Route path="/favorites" element={<Favorites />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}