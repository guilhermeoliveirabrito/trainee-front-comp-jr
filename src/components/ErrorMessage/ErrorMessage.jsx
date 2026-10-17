import './ErrorMessage.css';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button type="button" className="error-message__button" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}