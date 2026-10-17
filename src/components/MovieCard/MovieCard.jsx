import { useState } from 'react';
import './MovieCard.css';

export default function MovieCard({ movie }) {
  const [posterFailed, setPosterFailed] = useState(false);
  const { title, genre, releaseYear, rating, posterUrl } = movie;
  const showPoster = posterUrl && !posterFailed;

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        {showPoster ? (
          <img
            src={posterUrl}
            alt={`Pôster de ${title}`}
            loading="lazy"
            onError={() => setPosterFailed(true)}
          />
        ) : (
          <span className="movie-card__no-poster">Sem pôster</span>
        )}
        <span className="movie-card__rating">{Number(rating).toFixed(1)}</span>
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__meta">
          {releaseYear} · {genre}
        </p>
      </div>
    </article>
  );
}