import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { useFavorites } from '../hooks/useFavorites';
import { useMovieTitle } from '../hooks/useMovieTitle';
import { useUserRating } from '../hooks/useUserRating';
import { getGenreLabel } from '../utils/genres';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Poster from '../components/Poster/Poster';
import './MovieDetail.css';

const NO_MOVIE = {};

export default function MovieDetail() {
  const { id } = useParams();
  const { favoriteIds, toggleFavorite, error: favoritesError } = useFavorites();
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState({ key: '' });
  const [hoverRating, setHoverRating] = useState(0);

  const requestKey = `${id}|${attempt}`;
  const loading = response.key !== requestKey;
  const movie = response.movie;

  const title = useMovieTitle(movie ?? NO_MOVIE);
  const { rating: userRating, rate, isAuthenticated } = useUserRating(movie?.id);
  const shownRating = hoverRating || userRating;

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

  function handleRate(value) {
    rate(value);
    setHoverRating(0);
  }

  function getRatingHint() {
    if (userRating) {
      return `Você avaliou com ${userRating} de 5. Clique na mesma estrela para remover.`;
    }
    if (isAuthenticated) return 'Clique em uma estrela para avaliar.';
    return 'Entre na sua conta para avaliar.';
  }

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
            <Poster movie={movie} />
          </div>

          <div className="movie-detail__info">
            <h1 className="movie-detail__title">{title}</h1>
            {title !== movie.title && (
              <p className="movie-detail__original">Título original: {movie.title}</p>
            )}
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

            <div className="movie-detail__user-rating">
              <span className="movie-detail__label">Sua avaliação</span>
              <div
                className="movie-detail__stars"
                role="group"
                aria-label="Sua avaliação"
                onPointerLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`movie-detail__star${value <= shownRating ? ' movie-detail__star--active' : ''}`}
                    onClick={() => handleRate(value)}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') setHoverRating(value);
                    }}
                    aria-label={`${value} ${value === 1 ? 'estrela' : 'estrelas'}`}
                    aria-pressed={value === userRating}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="movie-detail__rating-hint">{getRatingHint()}</p>
            </div>

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