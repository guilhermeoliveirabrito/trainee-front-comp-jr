import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createMovie, deleteMovie, getMovies, updateMovie } from '../services/movieService';
import { getGenreLabel } from '../utils/genres';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Pagination from '../components/Pagination/Pagination';
import Notification from '../components/Notification/Notification';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import MovieForm from '../components/MovieForm/MovieForm';
import './AdminMovies.css';

const PAGE_SIZE = 10;

function getApiErrors(err, fallback) {
  const data = err.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors;
  return [data?.message || fallback];
}

export default function AdminMovies() {
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [response, setResponse] = useState({ key: '' });
  const [formState, setFormState] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const requestKey = `${page}|${reload}`;
  const loading = response.key !== requestKey;
  const movies = response.movies ?? [];
  const pagination = response.pagination;

  useEffect(() => {
    let active = true;

    getMovies({ page, limit: PAGE_SIZE, sortBy: 'createdAt', order: 'desc' })
      .then(({ movies: loadedMovies, pagination: loadedPagination }) => {
        if (active) {
          setResponse({ key: requestKey, movies: loadedMovies, pagination: loadedPagination });
        }
      })
      .catch((err) => {
        if (active) {
          setResponse({
            key: requestKey,
            error:
              err.response?.data?.message ||
              'Não foi possível carregar os filmes. Tente novamente em instantes.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [page, requestKey]);

  const closeNotification = useCallback(() => setNotification(null), []);

  function notify(type, message) {
    setNotification({ id: Date.now(), type, message });
  }

  function openCreate() {
    setFormErrors([]);
    setFormState({ movie: null });
  }

  function openEdit(movie) {
    setFormErrors([]);
    setFormState({ movie });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setFormState(null);
    setFormErrors([]);
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setFormErrors([]);

    try {
      if (formState.movie) {
        await updateMovie(formState.movie.id, payload);
        notify('success', 'Filme atualizado com sucesso.');
      } else {
        await createMovie(payload);
        notify('success', 'Filme cadastrado com sucesso.');
        setPage(1);
      }
      setFormState(null);
      setReload((current) => current + 1);
    } catch (err) {
      setFormErrors(getApiErrors(err, 'Não foi possível salvar o filme. Tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);

    try {
      await deleteMovie(movieToDelete.id);
      notify('success', `"${movieToDelete.title}" foi excluído.`);
      if (formState?.movie?.id === movieToDelete.id) closeForm();
      // apagou o último da página, volta uma página
      if (movies.length === 1 && page > 1) setPage(page - 1);
      setReload((current) => current + 1);
    } catch (err) {
      notify('error', getApiErrors(err, 'Não foi possível excluir o filme. Tente novamente.')[0]);
    } finally {
      setMovieToDelete(null);
      setDeleting(false);
    }
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="admin">
      <div className="admin__header">
        <h1 className="admin__title">Gerenciar filmes</h1>
        {!formState && (
          <button type="button" className="admin__button" onClick={openCreate}>
            Novo filme
          </button>
        )}
      </div>

      {formState && (
        <section className="admin__panel">
          <h2 className="admin__panel-title">{formState.movie ? 'Editar filme' : 'Novo filme'}</h2>

          {formErrors.length > 0 && (
            <div className="admin__form-errors" role="alert">
              <ul>
                {formErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <MovieForm
            key={formState.movie?.id ?? 'new'}
            movie={formState.movie}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </section>
      )}

      {loading && <Loading message="Carregando filmes..." />}

      {!loading && response.error && (
        <ErrorMessage message={response.error} onRetry={() => setReload((current) => current + 1)} />
      )}

      {!loading && !response.error && movies.length === 0 && (
        <p className="admin__empty">Nenhum filme cadastrado.</p>
      )}

      {!loading && !response.error && movies.length > 0 && (
        <>
          <ul className="admin__list">
            {movies.map((movie) => (
              <li key={movie.id} className="admin__item">
                <div className="admin__item-info">
                  <Link to={`/movies/${movie.id}`} className="admin__item-title">
                    {movie.title}
                  </Link>
                  <span className="admin__item-meta">
                    {movie.releaseYear} · {getGenreLabel(movie.genre)} · ★{' '}
                    {Number(movie.rating).toFixed(1)}
                  </span>
                </div>
                <div className="admin__item-actions">
                  <button type="button" className="admin__action" onClick={() => openEdit(movie)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin__action admin__action--danger"
                    onClick={() => setMovieToDelete(movie)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onChange={handlePageChange}
          />
        </>
      )}

      {notification && (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}

      {movieToDelete && (
        <ConfirmModal
          title="Excluir filme"
          message={`Tem certeza que deseja excluir "${movieToDelete.title}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setMovieToDelete(null)}
        />
      )}
    </main>
  );
}