import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

// Small wrapper so components can just call useFavorites() instead of
// importing useContext + FavoritesContext everywhere.
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside a <FavoritesProvider>');
  }
  return context;
}
