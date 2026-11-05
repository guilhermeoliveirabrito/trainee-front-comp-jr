import { usePoster } from '../../hooks/usePoster';
import './Poster.css';

function hueFromTitle(title) {
  let hash = 0;
  for (const char of title) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return hash;
}

export default function Poster({ movie }) {
  const { src, onError } = usePoster(movie);

  if (src) {
    return (
      <img
        className="poster__image"
        src={src}
        alt={`Pôster de ${movie.title}`}
        loading="lazy"
        onError={onError}
      />
    );
  }

  const hue = hueFromTitle(movie.title);

  return (
    <div
      className="poster__fallback"
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 45% 28%), hsl(${(hue + 40) % 360} 50% 12%))`,
      }}
      role="img"
      aria-label={`Capa de ${movie.title}`}
    >
      <span className="poster__initial">{movie.title.charAt(0).toUpperCase()}</span>
      <span className="poster__title">{movie.title}</span>
    </div>
  );
}