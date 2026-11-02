import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Movies from './pages/Movies';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movies" element={<Movies />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}