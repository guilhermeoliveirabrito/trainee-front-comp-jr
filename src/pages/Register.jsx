import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register } from '../services/authService';
import './Login.css';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmation) {
      setError('As senhas não conferem.');
      return;
    }

    setSubmitting(true);

    try {
      await register(name, email, password);
      await login(email, password);
      navigate('/movies');
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setError('Este e-mail já está em uso.');
      } else if (status === 400) {
        setError('Verifique os dados informados e tente novamente.');
      } else {
        setError('Não foi possível criar a conta. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 className="login__title">Criar conta</h1>

        {error && (
          <p className="login__error" role="alert">
            {error}
          </p>
        )}

        <label className="login__label" htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          className="login__input"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          minLength={2}
          required
        />

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
          autoComplete="new-password"
          required
        />

        <label className="login__label" htmlFor="confirmation">
          Confirmar senha
        </label>
        <input
          id="confirmation"
          className="login__input"
          type="password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="new-password"
          required
        />

        <button className="login__button" type="submit" disabled={submitting}>
          {submitting ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="login__footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}