import { useState } from 'react';
import { GENRES } from '../../utils/genres';
import './MovieForm.css';

const EMPTY_VALUES = {
  title: '',
  description: '',
  genre: '',
  director: '',
  releaseYear: '',
  rating: '',
  posterUrl: '',
};

function toFormValues(movie) {
  if (!movie) return EMPTY_VALUES;

  return {
    title: movie.title ?? '',
    description: movie.description ?? '',
    genre: movie.genre ?? '',
    director: movie.director ?? '',
    releaseYear: String(movie.releaseYear ?? ''),
    rating: String(movie.rating ?? ''),
    posterUrl: movie.posterUrl ?? '',
  };
}

// mesmas regras do back-end: campos obrigatórios, ano inteiro e nota de 0 a 10
function validate(values) {
  const errors = {};

  if (!values.title.trim()) errors.title = 'Informe o título.';
  if (!values.description.trim()) errors.description = 'Informe a descrição.';
  if (!values.genre) errors.genre = 'Selecione um gênero.';
  if (!values.director.trim()) errors.director = 'Informe o diretor.';

  const year = Number(values.releaseYear);
  if (!values.releaseYear.trim() || !Number.isInteger(year)) {
    errors.releaseYear = 'Informe um ano válido (número inteiro).';
  }

  const rating = Number(values.rating);
  if (!values.rating.trim() || Number.isNaN(rating) || rating < 0 || rating > 10) {
    errors.rating = 'A nota deve estar entre 0 e 10.';
  }

  return errors;
}

function Field({ id, label, error, full = false, children }) {
  return (
    <div className={`movie-form__field${full ? ' movie-form__field--full' : ''}`}>
      <label className="movie-form__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <span className="movie-form__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default function MovieForm({ movie = null, submitting = false, onSubmit, onCancel }) {
  const isEditing = Boolean(movie);
  const [values, setValues] = useState(() => toFormValues(movie));
  const [errors, setErrors] = useState({});

  const genreOptions =
    movie?.genre && !GENRES.some((genre) => genre.value === movie.genre)
      ? [...GENRES, { value: movie.genre, label: movie.genre }]
      : GENRES;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      genre: values.genre,
      director: values.director.trim(),
      releaseYear: Number(values.releaseYear),
      rating: Number(values.rating),
    };

    // editando, campo vazio vira null pra limpar o pôster; criando, nem manda o campo
    const posterUrl = values.posterUrl.trim();
    if (posterUrl || isEditing) payload.posterUrl = posterUrl || null;

    onSubmit(payload);
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit} noValidate>
      <Field id="movie-title" label="Título" error={errors.title} full>
        <input
          id="movie-title"
          name="title"
          className="movie-form__input"
          value={values.title}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={Boolean(errors.title)}
        />
      </Field>

      <fieldset
        className="movie-form__field movie-form__field--full movie-form__group"
        disabled={submitting}
      >
        <legend className="movie-form__label">Gênero</legend>
        <div className="movie-form__chips">
          {genreOptions.map((genre) => (
            <label key={genre.value} className="movie-form__chip">
              <input
                type="radio"
                name="genre"
                value={genre.value}
                checked={values.genre === genre.value}
                onChange={handleChange}
              />
              <span>{genre.label}</span>
            </label>
          ))}
        </div>
        {errors.genre && (
          <span className="movie-form__error" role="alert">
            {errors.genre}
          </span>
        )}
      </fieldset>

      <Field id="movie-director" label="Diretor" error={errors.director}>
        <input
          id="movie-director"
          name="director"
          className="movie-form__input"
          value={values.director}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={Boolean(errors.director)}
        />
      </Field>

      <Field id="movie-releaseYear" label="Ano de lançamento" error={errors.releaseYear}>
        <input
          id="movie-releaseYear"
          name="releaseYear"
          type="number"
          step="1"
          className="movie-form__input"
          value={values.releaseYear}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={Boolean(errors.releaseYear)}
        />
      </Field>

      <Field id="movie-rating" label="Nota (0 a 10)" error={errors.rating}>
        <input
          id="movie-rating"
          name="rating"
          type="number"
          step="0.1"
          min="0"
          max="10"
          className="movie-form__input"
          value={values.rating}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={Boolean(errors.rating)}
        />
      </Field>

      <Field id="movie-posterUrl" label="URL do pôster (opcional)">
        <input
          id="movie-posterUrl"
          name="posterUrl"
          type="url"
          className="movie-form__input"
          value={values.posterUrl}
          onChange={handleChange}
          disabled={submitting}
        />
      </Field>

      <Field id="movie-description" label="Descrição" error={errors.description} full>
        <textarea
          id="movie-description"
          name="description"
          className="movie-form__input movie-form__textarea"
          value={values.description}
          onChange={handleChange}
          disabled={submitting}
          aria-invalid={Boolean(errors.description)}
        />
      </Field>

      <div className="movie-form__actions">
        <button type="submit" className="movie-form__submit" disabled={submitting}>
          {submitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar filme'}
        </button>
        <button
          type="button"
          className="movie-form__cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}