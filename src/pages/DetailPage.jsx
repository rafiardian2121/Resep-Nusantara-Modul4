import { useMemo, useState } from 'react';
import { ArrowLeft, Clock, Heart, Share2, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const formatDate = (iso) => new Date(iso).toLocaleDateString('id-ID', {
  day: '2-digit', month: 'long', year: 'numeric',
});

export default function DetailPage({ recipe, type, isFavorite, toggleFavorite, onBack, shareUrl, reviews, onAddReview }) {
  const { profile } = useAppContext();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [shareState, setShareState] = useState('idle');

  const recipeTag = useMemo(() => type === 'makanan' ? 'Makanan' : 'Minuman', [type]);

  if (!recipe) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-slate-600">Resep tidak ditemukan.</p>
        <button onClick={onBack} className="text-blue-600 mt-4 underline">Kembali</button>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      setShareState('sharing');
      if (navigator.share) {
        await navigator.share({
          title: `${recipe.name} - Resep Nusantara`,
          text: `Cobain ${recipe.name} di Resep Nusantara`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareState('done');
      setTimeout(() => setShareState('idle'), 1500);
    } catch (error) {
      console.error('Share failed', error);
      setShareState('idle');
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddReview({
      user: profile.username,
      avatar: profile.avatar,
      rating,
      comment,
    });
    setComment('');
    setRating(5);
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 min-h-screen pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-64 md:h-96">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-3">
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/90 text-slate-800 shadow-md">
                {recipeTag}
              </span>
              <div className="flex items-center gap-1 text-white/90">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.8</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-105 transition"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-700'}`} />
              </button>
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-105 transition"
              >
                <Share2 className={`w-5 h-5 ${shareState === 'done' ? 'text-green-600' : 'text-slate-700'}`} />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-slate-500 text-sm md:text-base">Resep {recipeTag}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{recipe.name}</h1>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-slate-700 text-sm font-semibold">
                <Clock className="w-4 h-4" />
                {recipe.ingredients.length} bahan, {recipe.steps.length} langkah
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">Bahan</h2>
                <ul className="space-y-2 list-disc list-inside text-slate-700">
                  {recipe.ingredients.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-800">Langkah</h2>
                <ol className="space-y-3 text-slate-700 list-decimal list-inside">
                  {recipe.steps.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ol>
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Ulasan ({reviews.length})</h3>
                <span className="text-sm text-slate-500">Bagikan pengalamanmu</span>
              </div>

              <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span>Rating:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="p-1"
                        aria-label={`Rating ${value}`}
                      >
                        <Star className={`w-5 h-5 ${rating >= value ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tulis ulasan singkat..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-60"
                  disabled={!comment.trim()}
                >
                  Kirim Ulasan
                </button>
              </form>

              <div className="space-y-3">
                {reviews.length === 0 && (
                  <p className="text-slate-500">Belum ada ulasan, jadilah yang pertama.</p>
                )}
                {reviews.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-semibold overflow-hidden">
                          {item.avatar ? (
                            <img src={item.avatar} alt={item.user} className="w-full h-full object-cover" />
                          ) : (
                            item.user.slice(0, 1).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{item.user}</p>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(item.rating)].map((_, idx) => (
                              <Star key={idx} className="w-4 h-4 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-slate-700 leading-relaxed">{item.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
