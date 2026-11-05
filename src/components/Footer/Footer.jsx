import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <span className="footer__brand">MeuCine</span>
        <p className="footer__text">Projeto do Desafio Frontend 2026.2 · Comp Júnior</p>
        <a
          className="footer__link"
          href="https://github.com/guilhermeoliveirabrito/trainee-front-comp-jr"
          target="_blank"
          rel="noreferrer"
        >
          Código no GitHub
        </a>
      </div>
      <p className="footer__credit">
        Capas fornecidas pelo{' '}
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          TMDB
        </a>
        . Este produto usa a API do TMDB, mas não é endossado nem certificado por ele.
      </p>
    </footer>
  );
}