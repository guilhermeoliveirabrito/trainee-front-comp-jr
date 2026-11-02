import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="header__content">
        <Link to="/" className="header__logo">
          MeuCine
        </Link>

        <nav className="header__nav">
          <NavLink to="/movies" className="header__link">
            Filmes
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className="header__link">
              Favoritos
            </NavLink>
          )}
        </nav>

        <div className="header__session">
          {isAuthenticated ? (
            <>
              <span className="header__user">Olá, {user.name}</span>
              <button type="button" className="header__button" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="header__button">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}