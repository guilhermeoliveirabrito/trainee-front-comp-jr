import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFavorites } from '../services/favoriteService';
import { updateProfile } from '../services/userService';
import MovieCard from '../components/MovieCard/MovieCard';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
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
  const [attempt, setAttempt] = useState(0);
  const [favorites, setFavorites] = useState({ attempt: -1 });

  const closeNotification = useCallback(() => setNotification(null), []);

  const loadingFavorites = favorites.attempt !== attempt;
  const movies = favorites.movies ?? [];
  const total = movies.length;
  const initial = (user.name ?? '?').charAt(0).toUpperCase();

  const hasChanges =
    values.name.trim() !== (user.name ?? '') || values.email.trim() !== (user.email ?? '');

  useEffect(() => {
    let active = true;

    getFavorites()
      .then((result) => {
        if (active) setFavorites({ attempt, movies: result });
      })
      .catch(() => {
        if (active) {
          setFavorites({
            attempt,
            error: 'Não foi possível carregar seus favoritos. Tente novamente em instantes.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [attempt]);

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
      <header className="profile__header">
        <div className="profile__avatar" aria-hidden="true">
          {initial}
        </div>
        <div className="profile__summary">
          <h1 className="profile__name">{user.name}</h1>
          <p className="profile__email">{user.email}</p>
          {!loadingFavorites && !favorites.error && (
            <p className="profile__stat">
              <strong>{total}</strong> {total === 1 ? 'filme favoritado' : 'filmes favoritados'}
            </p>
          )}
        </div>
      </header>

      <section className="profile__section">
        <h2 className="profile__section-title">Filmes favoritos</h2>

        {loadingFavorites && <Loading message="Carregando favoritos..." />}

        {!loadingFavorites && favorites.error && (
          <ErrorMessage
            message={favorites.error}
            onRetry={() => setAttempt((current) => current + 1)}
          />
        )}

        {!loadingFavorites && !favorites.error && total === 0 && (
          <p className="profile__empty">
            Você ainda não favoritou nenhum filme. <Link to="/movies">Explorar filmes</Link>
          </p>
        )}

        {!loadingFavorites && !favorites.error && total > 0 && (
          <div className="profile__grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section className="profile__section">
        <h2 className="profile__section-title">Editar perfil</h2>

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
      </section>

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