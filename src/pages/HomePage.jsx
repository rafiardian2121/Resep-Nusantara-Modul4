// src/pages/HomePage.jsx
import HeroSection from '../components/home/HeroSection';
import FeaturedMakananSection from '../components/home/FeaturedMakananSection';
import FeaturedMinumanSection from '../components/home/FeaturedMinumanSection';

import { useCachedRecipes } from '../hooks/useCachedRecipes';

export default function HomePage({ onSelectRecipe, isFavorite, toggleFavorite }) {
  const { recipes: makananList } = useCachedRecipes('makanan');
  const { recipes: minumanList } = useCachedRecipes('minuman');

  const featuredMakanan = makananList.slice(0, 3);
  const featuredMinuman = minumanList.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <HeroSection />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
        <FeaturedMakananSection
          featuredMakanan={featuredMakanan}
          onSelectRecipe={onSelectRecipe}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        <FeaturedMinumanSection
          featuredMinuman={featuredMinuman}
          onSelectRecipe={onSelectRecipe}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  );
}
