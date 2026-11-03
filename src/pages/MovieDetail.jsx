import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { useFavorites } from '../hooks/useFavorites';
import { getGenreLabel } from '../utils/genres';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const { favoriteIds, toggleFavorite, error: favoritesError } = useFavorites();
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState({ key: '' });
  const [posterFailed, setPosterFailed] = useState(false);

  const requestKey = `${id}|${attempt}`;
  const loading = response.key !== requestKey;
  const movie = response.movie;

  useEffect(() => {
    let active = true;

    getMovieById(id)
      .then((loadedMovie) => {
        if (active) setResponse({ key: requestKey, movie: loadedMovie });
      })
      .catch((err) => {
        if (!active) return;
        const notFound = err.response?.status === 404;
        setResponse({
          key: requestKey,
          notFound,
          error: notFound
            ? 'Filme não encontrado.'
            : err.response?.data?.message ||
              'Não foi possível carregar o filme. Tente novamente em instantes.',
        });
      });

    return () => {
      active = false;
    };
  }, [id, requestKey]);

  const isFavorite = movie ? favoriteIds.includes(movie.id) : false;
  const showPoster = movie?.posterUrl && !posterFailed;

  return (
    <main className="movie-detail">
      <Link to="/movies" className="movie-detail__back">
        ← Voltar para os filmes
      </Link>

      {loading && <Loading message="Carregando filme..." />}

      {!loading && response.error && (
        <ErrorMessage
          message={response.error}
          onRetry={response.notFound ? undefined : () => setAttempt((current) => current + 1)}
        />
      )}

      {!loading && movie && (
        <article className="movie-detail__content">
          <div className="movie-detail__poster">
            {showPoster ? (
              <img
                src={movie.posterUrl}
                alt={`Pôster de ${movie.title}`}
                onError={() => setPosterFailed(true)}
              />
            ) : (
              <span className="movie-detail__no-poster">Sem pôster</span>
            )}
          </div>

          <div className="movie-detail__info">
            <h1 className="movie-detail__title">{movie.title}</h1>
            <p className="movie-detail__meta">
              {movie.releaseYear} · {getGenreLabel(movie.genre)}
            </p>
            <p className="movie-detail__rating">★ {Number(movie.rating).toFixed(1)}</p>

            {movie.director && (
              <p className="movie-detail__director">
                <span className="movie-detail__label">Direção</span> {movie.director}
              </p>
            )}

            {movie.description && <p className="movie-detail__description">{movie.description}</p>}

            <button
              type="button"
              className={`movie-detail__favorite${isFavorite ? ' movie-detail__favorite--active' : ''}`}
              onClick={() => toggleFavorite(movie)}
              aria-pressed={isFavorite}
            >
              {isFavorite ? '♥ Remover dos favoritos' : '♡ Adicionar aos favoritos'}
            </button>

            {favoritesError && <ErrorMessage message={favoritesError} />}
          </div>
        </article>
      )}
    </main>
  );
}