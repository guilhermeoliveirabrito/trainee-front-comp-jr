import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/movieService';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import MovieCard from '../components/MovieCard/MovieCard';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import './Home.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { favoriteIds, toggleFavorite, error: favoritesError } = useFavorites();
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState({ attempt: -1 });

  const loading = response.attempt !== attempt;
  const movies = response.movies ?? [];

  useEffect(() => {
    let active = true;

    getMovies({ sortBy: 'rating', order: 'desc', limit: 6 })
      .then(({ movies: loadedMovies }) => {
        if (active) setResponse({ attempt, movies: loadedMovies });
      })
      .catch((err) => {
        if (active) {
          setResponse({
            attempt,
            error:
              err.response?.data?.message ||
              'Não foi possível carregar os filmes. Tente novamente em instantes.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <main>
      <section className="home__hero">
        <h1 className="home__title">
          Descubra filmes e monte a sua <span className="home__highlight">lista de favoritos</span>
        </h1>
        <p className="home__subtitle">
          Busque por título ou gênero, ordene pelas melhores notas e guarde o que você quer assistir.
        </p>
        <div className="home__actions">
          <Link className="home__button" to="/movies">
            Ver filmes
          </Link>
          {isAuthenticated ? (
            <Link className="home__button home__button--ghost" to="/favorites">
              Meus favoritos
            </Link>
          ) : (
            <Link className="home__button home__button--ghost" to="/register">
              Criar conta
            </Link>
          )}
        </div>
      </section>

      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">Mais bem avaliados</h2>
          <Link className="home__more" to="/movies?sort=rating:desc">
            Ver todos
          </Link>
        </div>

        {loading && <Loading message="Carregando filmes..." />}

        {!loading && response.error && (
          <ErrorMessage message={response.error} onRetry={() => setAttempt((current) => current + 1)} />
        )}

        {!loading && !response.error && favoritesError && <ErrorMessage message={favoritesError} />}

        {!loading && !response.error && movies.length > 0 && (
          <div className="home__grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favoriteIds.includes(movie.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}