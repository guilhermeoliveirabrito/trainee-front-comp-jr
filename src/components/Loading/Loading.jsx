import './Loading.css';

export default function Loading({ message = 'Carregando...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true"></span>
      <p className="loading__text">{message}</p>
    </div>
  );
}