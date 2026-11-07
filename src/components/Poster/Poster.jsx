import { usePoster } from '../../hooks/usePoster';
import './Poster.css';

function hueFromTitle(title) {
  // converte o título num número de 0 a 359, assim o mesmo filme sempre tem a mesma cor
  let hash = 0;
  for (const char of title) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return hash;
}

export default function Poster({ movie }) {
  const { src, onError } = usePoster(movie);
  const { title } = movie;

  if (src) {
    return (
      <img
        className="poster__image"
        src={src}
        alt={`Pôster de ${title}`}
        loading="lazy"
        onError={onError}
      />
    );
  }

  const hue = hueFromTitle(title);

  return (
    <div
      className="poster__fallback"
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 45% 28%), hsl(${(hue + 40) % 360} 50% 12%))`,
      }}
      role="img"
      aria-label={`Capa de ${title}`}
    >
      <span className="poster__initial">{title.charAt(0).toUpperCase()}</span>
      <span className="poster__title">{title}</span>
    </div>
  );
}