import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { addFavorite, getFavorites, removeFavorite } from '../services/favoriteService';

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadedIds, setLoadedIds] = useState([]);
  const [error, setError] = useState('');

  // deslogado a lista é sempre vazia, mesmo se sobrar estado da sessão anterior
  const favoriteIds = isAuthenticated ? loadedIds : [];

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let active = true;

    getFavorites()
      .then((movies) => {
        if (active) setLoadedIds(movies.map((movie) => movie.id));
      })
      .catch(() => {});

    return () => {
      active = false;
      setLoadedIds([]);
    };
  }, [isAuthenticated]);

  async function toggleFavorite(movie) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return false;
    }

    setError('');

    try {
      if (favoriteIds.includes(movie.id)) {
        await removeFavorite(movie.id);
        setLoadedIds((current) => current.filter((id) => id !== movie.id));
      } else {
        await addFavorite(movie.id);
        setLoadedIds((current) => [...current, movie.id]);
      }
      return true;
    } catch {
      setError('Não foi possível atualizar seus favoritos. Tente novamente.');
      return false;
    }
  }

  return { favoriteIds, toggleFavorite, error };
}