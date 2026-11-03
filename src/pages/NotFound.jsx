import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Página não encontrada</h1>
      <p className="not-found__text">O endereço que você acessou não existe ou foi movido.</p>
      <Link to="/" className="not-found__link">
        Voltar para o início
      </Link>
    </main>
  );
}