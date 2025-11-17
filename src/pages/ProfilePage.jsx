// src/pages/ProfilePage.jsx
import { useMemo, useRef, useState } from 'react';
import { Camera, Edit2, Heart, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const FavoriteCard = ({ data, onOpen, onRemove }) => {
  return (
    <div
      onClick={() => onOpen(data.type, { id: data.id, name: data.name, image_url: data.image_url })}
      className="group bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 transition cursor-pointer"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={data.image_url}
          alt={data.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition"
        />
        <span className="absolute top-3 left-3 text-xs font-semibold text-white bg-black/40 px-3 py-1 rounded-full capitalize">
          {data.type}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-red-50"
          aria-label="Hapus favorit"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-800 line-clamp-2">{data.name}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Heart className="w-4 h-4 text-red-500" />
          <span>Disimpan {new Date(data.savedAt).toLocaleDateString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage({ favorites, onSelectRecipe, toggleFavorite }) {
  const { profile, updateProfile } = useAppContext();
  const [username, setUsername] = useState(profile.username);
  const [tab, setTab] = useState('all');
  const fileInputRef = useRef(null);

  const filteredFavorites = useMemo(() => {
    if (tab === 'all') return favorites;
    return favorites.filter((item) => item.type === tab);
  }, [favorites, tab]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateProfile({ avatar: e.target?.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateUsername = () => {
    if (username.trim()) {
      updateProfile({ username: username.trim() });
    }
  };

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-50 shadow">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-3xl font-bold text-blue-700">
                {profile.username.slice(0, 1).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700"
              aria-label="Ubah foto profil"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-2xl md:text-3xl font-bold text-slate-800 focus:outline-none border-b border-transparent focus:border-blue-500"
              />
              <button
                onClick={handleUpdateUsername}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Edit2 size={14} /> Simpan
              </button>
            </div>
            <p className="text-slate-500">{profile.role}</p>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{favorites.length} resep favorit</span>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-500">Favorite kamu</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Akses cepat resep favorit</h2>
            </div>
            <div className="inline-flex bg-slate-100 rounded-full p-1 text-sm font-semibold">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'makanan', label: 'Makanan' },
                { id: 'minuman', label: 'Minuman' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`px-4 py-2 rounded-full transition ${
                    tab === item.id ? 'bg-white shadow text-blue-600' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Belum ada favorit di tab ini. Tandai resep untuk muncul di sini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFavorites.map((fav) => (
                <FavoriteCard
                  key={fav.key}
                  data={fav}
                  onOpen={onSelectRecipe}
                  onRemove={() => toggleFavorite(fav.key, fav)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
