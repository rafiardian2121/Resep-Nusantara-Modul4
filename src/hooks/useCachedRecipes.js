import { useEffect, useState } from 'react';
import { ResepMakanan } from '../data/makanan';
import { ResepMinuman } from '../data/minuman';

const recipeSources = {
  makanan: () => Object.values(ResepMakanan.resep),
  minuman: () => Object.values(ResepMinuman.resep),
};

export function useCachedRecipes(type) {
  const [recipes, setRecipes] = useState(() => (recipeSources[type]?.() || []));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cacheKey = `rn-cache-${type}`;
    const cached = localStorage.getItem(cacheKey);
    const fallbackData = recipeSources[type] ? recipeSources[type]() : [];

    if (cached) {
      try {
        setRecipes(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (error) {
        console.warn('Failed to parse cache, resetting data', error);
      }
    }

    setRecipes(fallbackData);
    localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
    setLoading(false);
  }, [type]);

  const getRecipe = (id) => {
    return recipes.find((item) => Number(item.id) === Number(id));
  };

  return { recipes, loading, getRecipe };
}
