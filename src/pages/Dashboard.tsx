import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Edit2, 
  Users, 
  MapPin, 
  Star, 
  Loader2,
  CheckCircle,
  X,
  Save,
  UserCog,
  Shield,
  Briefcase
} from 'lucide-react';
import { useAuth, type UserRole } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { useCurrency } from '../hooks/useCurrency';
import { toursAPI, usersAPI } from '../services/api';

// Приводим интерфейс Tour в Dashboard к соответствию с api.ts
interface Tour {
  id: string;
  title: string;
  description: string;
  longDescription?: string; // Сделали необязательным
  priceFrom: number;
  location: string;
  duration: string;
  difficulty: string;
  rating: number;
  tags: string[];
  verified?: boolean; // Добавили опциональность
  operator?: {
    id: string;
    name: string;
    email: string;
  };
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  _count?: {
    tours: number;
    bookings: number;
  };
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();
  const { formatPrice } = useCurrency();
  
  const [activeTab, setActiveTab] = useState<'tours' | 'users'>('tours');
  const [tours, setTours] = useState<Tour[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    priceFrom: '',
    location: '',
    duration: '',
    difficulty: 'Easy',
    rating: '',
    tags: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'tours') {
        if (user?.role === 'ADMIN') {
          // ИСПРАВЛЕНО: берем response.data напрямую (так как apiRequest возвращает ApiResponse)
          const response = await toursAPI.getAllTours();
          setTours(response.data); 
        } else if (user?.role === 'OPERATOR') {
          const response = await toursAPI.getMyTours();
          setTours(response.data);
        }
      } else if (activeTab === 'users' && user?.role === 'ADMIN') {
        const response = await usersAPI.getAllUsers();
        setUsers(response.data as UserData[]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tourData = {
        ...formData,
        priceFrom: parseFloat(formData.priceFrom),
        rating: parseFloat(formData.rating) || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      await toursAPI.createTour(tourData);
      setIsCreating(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create tour');
    }
  };

  const handleUpdateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;

    try {
      const tourData = {
        ...formData,
        priceFrom: parseFloat(formData.priceFrom),
        rating: parseFloat(formData.rating) || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      await toursAPI.updateTour(editingTour.id, tourData);
      setEditingTour(null);
      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update tour');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      priceFrom: '',
      location: '',
      duration: '',
      difficulty: 'Easy',
      rating: '',
      tags: '',
    });
  };

  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    try {
      await toursAPI.deleteTour(tourId);
      setTours(tours.filter(t => t.id !== tourId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete tour');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await usersAPI.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
    }
  };

  const startEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      description: tour.description,
      longDescription: tour.longDescription || '',
      priceFrom: tour.priceFrom.toString(),
      location: tour.location,
      duration: tour.duration,
      difficulty: tour.difficulty,
      rating: tour.rating.toString(),
      tags: tour.tags.join(', '),
    });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-rose-500" />;
      case 'OPERATOR': return <Briefcase className="w-4 h-4 text-sand-500" />;
      default: return <Users className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
      case 'OPERATOR': return 'bg-sand-100 text-sand-700 dark:bg-sand-500/20 dark:text-sand-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850 pt-20">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-sand-500/20 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-sand-400" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-medium text-white">Dashboard</h1>
              <p className="text-white/60 text-sm">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(user?.role as UserRole)}`}>
              {getRoleIcon(user?.role as UserRole)}
              {user?.role}
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveTab('tours')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'tours' ? 'bg-sand-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              <MapPin className="w-4 h-4" /> Tours
            </button>
            {user?.role === 'ADMIN' && (
              <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-sand-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                <UserCog className="w-4 h-4" /> Users
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
              <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          )}

          {activeTab === 'tours' && (
            <div>
              {(user?.role === 'OPERATOR' || user?.role === 'ADMIN') && !isCreating && !editingTour && (
                <button onClick={() => setIsCreating(true)} className="mb-6 flex items-center gap-2 px-6 py-3 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-xl transition-all shadow-lg">
                  <Plus className="w-5 h-5" /> Create New Tour
                </button>
              )}

              {(isCreating || editingTour) && (
                <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-100 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-750 dark:text-white">{editingTour ? 'Edit Tour' : 'Create New Tour'}</h2>
                    <button onClick={() => { setIsCreating(false); setEditingTour(null); resetForm(); }} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={editingTour ? handleUpdateTour : handleCreateTour} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location *</label>
                        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Short Description *</label>
                      <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Long Description</label>
                      <textarea value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500 resize-none" />
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price From *</label>
                        <input type="number" value={formData.priceFrom} onChange={(e) => setFormData({ ...formData, priceFrom: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration *</label>
                        <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty *</label>
                        <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" required>
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                        <input type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags (comma separated)</label>
                      <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white focus:outline-none focus:border-sand-500" />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => { setIsCreating(false); setEditingTour(null); resetForm(); }} className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                      <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-xl transition-colors"><Save className="w-4 h-4" /> {editingTour ? 'Update Tour' : 'Create Tour'}</button>
                    </div>
                  </form>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-sand-500 animate-spin" /></div>
              ) : tours.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-750 dark:text-white mb-2">No tours found</h3>
                  <p className="text-slate-500 dark:text-slate-400">{user?.role === 'OPERATOR' ? 'Create your first tour to get started.' : 'No tours available in the system.'}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tours.map((tour) => (
                    <div key={tour.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-750 dark:text-white">{tour.title}</h3>
                            {tour.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full"><CheckCircle className="w-3 h-3" /> Verified</span>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">{tour.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-sand-600 dark:text-sand-400 font-bold">{formatPrice(tour.priceFrom)}</span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><MapPin className="w-4 h-4" /> {tour.location}</span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">{tour.duration}</span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><Star className="w-4 h-4 text-sand-500" /> {tour.rating}</span>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-lg">{tour.difficulty}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(user?.role === 'ADMIN' || user?.id === tour.operator?.id) && (
                            <>
                              <button onClick={() => startEdit(tour)} className="p-2 text-slate-400 hover:text-sand-500 hover:bg-sand-50 dark:hover:bg-sand-500/10 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                              <button onClick={() => handleDeleteTour(tour.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && user?.role === 'ADMIN' && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-sand-500 animate-spin" /></div>
              ) : (
                <div className="grid gap-4">
                  {users.map((u) => (
                    <div key={u.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-750 dark:text-white">{u.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${getRoleColor(u.role)}`}>{getRoleIcon(u.role)} {u.role}</span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select value={u.role} onChange={(e) => handleUpdateUserRole(u.id, e.target.value as UserRole)} disabled={u.id === user?.id} className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-750 dark:text-white focus:outline-none focus:border-sand-500 disabled:opacity-50">
                            <option value="USER">USER</option>
                            <option value="OPERATOR">OPERATOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          {u.id !== user?.id && (
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
