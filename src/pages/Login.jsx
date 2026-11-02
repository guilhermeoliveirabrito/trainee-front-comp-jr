import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/movies');
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('E-mail ou senha inválidos.');
      } else if (status === 400) {
        setError('Informe e-mail e senha.');
      } else {
        setError('Não foi possível entrar. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Entrar no MeuCine</h1>

        {error && (
          <p className="login__error" role="alert">
            {error}
          </p>
        )}

        <label className="login__label" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          className="login__input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label className="login__label" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          className="login__input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <button className="login__button" type="submit" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}