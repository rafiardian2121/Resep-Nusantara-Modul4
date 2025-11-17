// src/pages/MakananPage.jsx
import { useState, useEffect } from 'react';
import RecipeGrid from '../components/makanan/RecipeGrid';
import { useCachedRecipes } from '../hooks/useCachedRecipes';

export default function MakananPage({ onSelectRecipe, toggleFavorite, isFavorite }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const { recipes: allMakanan, loading } = useCachedRecipes('makanan');

  useEffect(() => {
    const filter = () => {
      if (searchQuery.trim() === '') {
        setFilteredRecipes(allMakanan);
      } else {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = allMakanan.filter(recipe => 
          recipe.name.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredRecipes(filtered);
      }
    };

    filter();
  }, [searchQuery, allMakanan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-800">Resep Makanan</h1>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari makanan favorit..."
            className="w-full md:w-80 px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-slate-500">Memuat data resep...</p>
        ) : (
          <RecipeGrid
            recipes={filteredRecipes}
            onSelectRecipe={onSelectRecipe}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}
      </main>
    </div>
  );
}
