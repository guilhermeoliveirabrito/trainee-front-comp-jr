import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies } from '../services/movieService';
import { useFavorites } from '../hooks/useFavorites';
import { GENRES } from '../utils/genres';
import MovieCard from '../components/MovieCard/MovieCard';
import Loading from '../components/Loading/Loading';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import Pagination from '../components/Pagination/Pagination';
import './Movies.css';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: '', label: 'Ordem padrão' },
  { value: 'rating:desc', label: 'Melhor avaliados' },
  { value: 'releaseYear:desc', label: 'Mais recentes' },
  { value: 'releaseYear:asc', label: 'Mais antigos' },
  { value: 'title:asc', label: 'Título (A-Z)' },
];

export default function Movies() {
  const { favoriteIds, toggleFavorite, error: favoritesError } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState({ key: '' });

  const requestKey = [page, search, genre, sort, attempt].join('|');
  const loading = response.key !== requestKey;
  const movies = response.movies ?? [];
  const pagination = response.pagination;

  useEffect(() => {
    let active = true;
    const [sortBy, order] = sort ? sort.split(':') : [];

    getMovies({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      genre: genre || undefined,
      sortBy,
      order,
    })
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
  }, [page, search, genre, sort, requestKey]);

  function updateParams(changes) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    setSearchParams(next);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateParams({ search: searchInput.trim(), page: '' });
  }

  function handleClear() {
    setSearchInput('');
    setSearchParams({});
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage > 1 ? String(newPage) : '' });
    window.scrollTo({ top: 0 });
  }

  const hasFilters = Boolean(search || genre || sort);

  return (
    <main className="movies">
      <h1 className="movies__title">Filmes</h1>

      <div className="movies__filters">
        <form className="movies__search" onSubmit={handleSearchSubmit} role="search">
          <input
            type="search"
            className="movies__input"
            placeholder="Buscar por título, descrição ou diretor"
            aria-label="Buscar filmes"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button type="submit" className="movies__button">
            Buscar
          </button>
        </form>

        <select
          className="movies__input movies__select"
          aria-label="Filtrar por gênero"
          value={genre}
          onChange={(event) => updateParams({ genre: event.target.value, page: '' })}
        >
          <option value="">Todos os gêneros</option>
          {GENRES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          className="movies__input movies__select"
          aria-label="Ordenar filmes"
          value={sort}
          onChange={(event) => updateParams({ sort: event.target.value, page: '' })}
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button type="button" className="movies__clear" onClick={handleClear}>
            Limpar filtros
          </button>
        )}
      </div>

      {loading && <Loading message="Carregando filmes..." />}

      {!loading && response.error && (
        <ErrorMessage message={response.error} onRetry={() => setAttempt((current) => current + 1)} />
      )}

      {!loading && !response.error && favoritesError && <ErrorMessage message={favoritesError} />}

      {!loading && !response.error && movies.length === 0 && (
        <p className="movies__empty">Nenhum filme encontrado.</p>
      )}

      {!loading && !response.error && movies.length > 0 && (
        <>
          <p className="movies__count">
            {pagination.total} {pagination.total === 1 ? 'filme encontrado' : 'filmes encontrados'}
          </p>

          <div className="movies__grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favoriteIds.includes(movie.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}