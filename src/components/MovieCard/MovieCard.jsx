import { Link } from 'react-router-dom';
import { getGenreLabel } from '../../utils/genres';
import Poster from '../Poster/Poster';
import './MovieCard.css';

export default function MovieCard({ movie, isFavorite = false, onToggleFavorite }) {
  const { id, title, genre, releaseYear, rating } = movie;
  const detailsPath = `/movies/${id}`;

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <Link
          to={detailsPath}
          className="movie-card__poster-link"
          aria-label={`Ver detalhes de ${title}`}
        >
          <Poster movie={movie} />
        </Link>
        <span className="movie-card__rating">{Number(rating).toFixed(1)}</span>
        {onToggleFavorite && (
          <button
            type="button"
            className={`movie-card__favorite${isFavorite ? ' movie-card__favorite--active' : ''}`}
            onClick={() => onToggleFavorite(movie)}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Remover ${title} dos favoritos`
                : `Adicionar ${title} aos favoritos`
            }
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        )}
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">
          <Link to={detailsPath}>{title}</Link>
        </h3>
        <p className="movie-card__meta">
          {releaseYear} · {getGenreLabel(genre)}
        </p>
      </div>
    </article>
  );
}