import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

const defaultProfile = {
  username: 'Rafi Ardian',
  role: 'Pecinta kuliner Nusantara',
  avatar: '',
};

const getInitialState = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn('Failed to read localStorage', error);
    return fallback;
  }
};

const usePersistentState = (key, fallback) => {
  const [value, setValue] = useState(() => getInitialState(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save localStorage', error);
    }
  }, [key, value]);

  return [value, setValue];
};

export function AppProvider({ children }) {
  const [profile, setProfile] = usePersistentState('rn-profile', defaultProfile);
  const [favorites, setFavorites] = usePersistentState('rn-favorites', []);
  const [reviews, setReviews] = usePersistentState('rn-reviews', {});

  const updateProfile = (partialProfile) => {
    setProfile((prev) => ({ ...prev, ...partialProfile }));
  };

  const toggleFavorite = (recipeKey, recipeMeta) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.key === recipeKey);
      if (exists) {
        return prev.filter((item) => item.key !== recipeKey);
      }
      return [...prev, { ...recipeMeta, key: recipeKey, savedAt: Date.now() }];
    });
  };

  const isFavorite = (recipeKey) => favorites.some((item) => item.key === recipeKey);

  const addReview = (recipeKey, newReview) => {
    const reviewWithMeta = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      ...newReview,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => {
      const existing = prev[recipeKey] || [];
      return {
        ...prev,
        [recipeKey]: [reviewWithMeta, ...existing],
      };
    });
  };

  const value = {
    profile,
    updateProfile,
    favorites,
    toggleFavorite,
    isFavorite,
    reviews,
    addReview,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
