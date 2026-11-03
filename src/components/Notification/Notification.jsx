import { useEffect } from 'react';
import './Notification.css';

export default function Notification({ type = 'success', message, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`notification notification--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className="notification__text">{message}</span>
      <button
        type="button"
        className="notification__close"
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}