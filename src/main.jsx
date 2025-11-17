// src/main.jsx
import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import DetailPage from './pages/DetailPage';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css'
import PWABadge from './PWABadge';
import { AppProvider, useAppContext } from './context/AppContext';
import { useCachedRecipes } from './hooks/useCachedRecipes';

function AppShell() {
  const [showSplash, setShowSplash] = useState(true);
  const [route, setRoute] = useState({ page: 'home', type: null, recipeId: null });
  const { favorites, isFavorite, toggleFavorite, addReview, reviews } = useAppContext();
  const { recipes: makananList } = useCachedRecipes('makanan');
  const { recipes: minumanList } = useCachedRecipes('minuman');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipeType = params.get('recipeType');
    const recipeId = params.get('recipeId');

    if (recipeType && recipeId) {
      setRoute({ page: 'detail', type: recipeType, recipeId: Number(recipeId) });
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNavigation = (page) => {
    setRoute({ page, type: null, recipeId: null });
    const params = new URLSearchParams(window.location.search);
    params.delete('recipeType');
    params.delete('recipeId');
    const query = params.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, '', url);
  };

  const getRecipeByType = (type, id) => {
    const source = type === 'makanan' ? makananList : minumanList;
    return source.find((item) => Number(item.id) === Number(id));
  };

  const openRecipeDetail = (type, recipe) => {
    setRoute({ page: 'detail', type, recipeId: recipe.id });
    const params = new URLSearchParams(window.location.search);
    params.set('recipeType', type);
    params.set('recipeId', recipe.id);
    const query = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}?${query}`);
  };

  const activeRecipe = useMemo(() => {
    if (route.page !== 'detail' || !route.type || !route.recipeId) return null;
    return getRecipeByType(route.type, route.recipeId);
  }, [route, makananList, minumanList]);

  const recipeKey = route.type && route.recipeId ? `${route.type}-${route.recipeId}` : '';
  const recipeReviews = recipeKey ? reviews[recipeKey] || [] : [];

  const renderCurrentPage = () => {
    switch (route.page) {
      case 'home':
        return (
          <HomePage
            onSelectRecipe={openRecipeDetail}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'makanan':
        return (
          <MakananPage
            onSelectRecipe={openRecipeDetail}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'minuman':
        return (
          <MinumanPage
            onSelectRecipe={openRecipeDetail}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            favorites={favorites}
            onSelectRecipe={openRecipeDetail}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        );
      case 'detail':
        return (
          <DetailPage
            recipe={activeRecipe}
            type={route.type}
            isFavorite={!!recipeKey && isFavorite(recipeKey)}
            toggleFavorite={() => activeRecipe && toggleFavorite(recipeKey, {
              id: activeRecipe.id,
              name: activeRecipe.name,
              image_url: activeRecipe.image_url,
              type: route.type,
            })}
            onBack={() => handleNavigation('home')}
            shareUrl={`${window.location.origin}${window.location.pathname}?recipeType=${route.type}&recipeId=${route.recipeId}`}
            reviews={recipeReviews}
            onAddReview={(review) => addReview(recipeKey, review)}
          />
        );
      default:
        return <HomePage />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navbar */}
      <DesktopNavbar currentPage={route.page} onNavigate={handleNavigation} />
      
      {/* Main Content */}
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>
      
      {/* Mobile Navbar */}
      <MobileNavbar currentPage={route.page} onNavigate={handleNavigation} />

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <AppShell />
    </AppProvider>
  </StrictMode>,
)
