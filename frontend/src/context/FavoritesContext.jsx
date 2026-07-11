import { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext(null);

const STORAGE_KEY = 'marquee-favorites';

// Wraps the app and holds the list of favorited movie IDs in state.
// Using Context (rather than separate useState calls per component) means
// the Navbar badge, movie cards, and the Favorites page all stay in sync
// the instant a favorite is toggled anywhere.
export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever the favorites list changes, so they
  // survive a page refresh or closing the browser.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function toggleFavorite(id) {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }

  function isFavorite(id) {
    return favoriteIds.includes(id);
  }

  const value = { favoriteIds, toggleFavorite, isFavorite };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
