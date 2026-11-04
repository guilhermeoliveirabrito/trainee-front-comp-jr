import { useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../services/userService';
import Notification from '../components/Notification/Notification';
import './Profile.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'O nome deve ter pelo menos 2 caracteres.';
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }

  return errors;
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [values, setValues] = useState({ name: user.name ?? '', email: user.email ?? '' });
  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const closeNotification = useCallback(() => setNotification(null), []);

  const hasChanges =
    values.name.trim() !== (user.name ?? '') || values.email.trim() !== (user.email ?? '');

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = { name: values.name.trim(), email: values.email.trim() };

    setSubmitting(true);
    setApiErrors([]);

    try {
      await updateProfile(payload);
      updateUser(payload);
      setValues(payload);
      setNotification({ id: Date.now(), type: 'success', message: 'Perfil atualizado com sucesso.' });
    } catch (err) {
      const data = err.response?.data;
      setApiErrors(
        Array.isArray(data?.errors) && data.errors.length > 0
          ? data.errors
          : [data?.message || 'Não foi possível atualizar o perfil. Tente novamente.'],
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="profile">
      <h1 className="profile__title">Meu perfil</h1>

      <div className="profile__card">
        {apiErrors.length > 0 && (
          <div className="profile__api-errors" role="alert">
            <ul>
              {apiErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="profile__form" onSubmit={handleSubmit} noValidate>
          <div className="profile__field">
            <label className="profile__label" htmlFor="profile-name">
              Nome
            </label>
            <input
              id="profile-name"
              name="name"
              className="profile__input"
              value={values.name}
              onChange={handleChange}
              disabled={submitting}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="profile__error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="profile__field">
            <label className="profile__label" htmlFor="profile-email">
              E-mail
            </label>
            <input
              id="profile-email"
              name="email"
              type="email"
              className="profile__input"
              value={values.email}
              onChange={handleChange}
              disabled={submitting}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <span className="profile__error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <p className="profile__hint">A senha não pode ser alterada por aqui.</p>

          <button type="submit" className="profile__submit" disabled={submitting || !hasChanges}>
            {submitting ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>

      {notification && (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </main>
  );
}