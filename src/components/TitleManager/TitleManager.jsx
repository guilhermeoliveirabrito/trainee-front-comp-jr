import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

const TITLES = [
  { path: '/', title: 'Início' },
  { path: '/movies', title: 'Filmes' },
  { path: '/movies/:id', title: 'Detalhes do filme' },
  { path: '/favorites', title: 'Favoritos' },
  { path: '/admin/movies', title: 'Gerenciar filmes' },
  { path: '/profile', title: 'Meu perfil' },
  { path: '/login', title: 'Entrar' },
  { path: '/register', title: 'Criar conta' },
];

export default function TitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const match = TITLES.find(({ path }) => matchPath({ path, end: true }, pathname));
    document.title = `${match ? match.title : 'Página não encontrada'} · MeuCine`;
  }, [pathname]);

  return null;
}