import { useEffect, useState } from 'react';
import { getMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard/MovieCard';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import './Movies.css';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    getMovies()
      .then((result) => {
        if (active) setMovies(result.movies);
      })
      .catch((err) => {
        if (!active) return;
        const apiMessage = err.response?.data?.message;
        setError(apiMessage || 'Não foi possível carregar os filmes. Tente novamente em instantes.');
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

  return (
    <main className="movies">
      <h1 className="movies__title">Filmes</h1>

      {loading && <Loading message="Carregando filmes..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {!loading && !error && movies.length === 0 && (
        <p className="movies__empty">Nenhum filme encontrado.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="movies__grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </main>
  );
}