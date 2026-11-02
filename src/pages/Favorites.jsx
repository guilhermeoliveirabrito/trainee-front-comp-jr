import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import MovieCard from '../components/MovieCard/MovieCard';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import './Movies.css';

export default function Favorites() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    getFavorites()
      .then((result) => {
        if (active) setMovies(result);
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar seus favoritos. Tente novamente em instantes.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  function handleRetry() {
    setError('');
    setLoading(true);
    setAttempt((current) => current + 1);
  }

  async function handleRemove(movie) {
    setActionError('');

    try {
      await removeFavorite(movie.id);
      setMovies((current) => current.filter((item) => item.id !== movie.id));
    } catch {
      setActionError('Não foi possível remover o filme dos favoritos. Tente novamente.');
    }
  }

  return (
    <main className="movies">
      <h1 className="movies__title">Meus favoritos</h1>

      {loading && <Loading message="Carregando favoritos..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {!loading && !error && actionError && <ErrorMessage message={actionError} />}

      {!loading && !error && movies.length === 0 && (
        <p className="movies__empty">Você ainda não favoritou nenhum filme.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="movies__grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite
              onToggleFavorite={handleRemove}
            />
          ))}
        </div>
      )}
    </main>
  );
}