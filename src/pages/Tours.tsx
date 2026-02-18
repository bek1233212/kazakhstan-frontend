import { useState, useEffect, useMemo } from 'react';
import { Search, Star, MapPin, Filter, BarChart3, Banknote, Check, SortAsc, ChevronDown, Trash2, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { allLocations } from '../data/companies';
import { useCurrency } from '../hooks/useCurrency';
import { useAuth } from '../hooks/useAuth';
import { toursAPI } from '../services/api';
import BookingDrawer from '../components/BookingDrawer';

interface Tour {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  location: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  rating: number;
  tags: string[];
  operator?: {
    id: string;
    name: string;
  };
  isFromApi?: boolean;
}

export default function Tours() {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState({ name: '', price: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTourId, setDeletingTourId] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const [filters, setFilters] = useState({
    difficulty: [] as string[],
    minPrice: '',
    maxPrice: '',
    location: [] as string[],
    duration: [] as string[],
    tags: [] as string[],
  });

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Top Rated' }
  ];

  const trendings = ['Charyn Canyon', 'Lake Kaindy', 'Almaty', 'Turkistan'];

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setIsLoading(true);
      const response = await toursAPI.getAllTours();
      const apiTours = response.data.map((tour: any) => ({
        ...tour,
        isFromApi: true 
      }));
      setTours(apiTours);
    } catch (error) {
      console.error('Failed to load tours from API:', error);
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return tours
      .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, tours]);

  const toggleFilter = (key: 'difficulty' | 'location' | 'duration', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(v => v !== value) 
        : [...prev[key], value]
    }));
  };

  const handleDeleteTour = async (e: React.MouseEvent, tourId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this tour?')) return;
    setDeletingTourId(tourId);
    try {
      await toursAPI.deleteTour(tourId);
      setTours(prev => prev.filter(t => t.id !== tourId));
    } catch (error: any) {
      alert(error.message || 'Error deleting tour');
    } finally {
      setDeletingTourId(null);
    }
  };

  const isAdmin = user && (
    user.role === 'ADMIN' || 
    user.role === 'OPERATOR' || 
    (user.role as string) === 'admin' || 
    (user.role as string) === 'operator'
  );

  const filteredAndSortedTours = useMemo(() => {
    let result = tours.filter((tour) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!(tour.title.toLowerCase().includes(query) || tour.location.toLowerCase().includes(query))) return false;
      }
      if (filters.minPrice && tour.priceFrom < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && tour.priceFrom > parseInt(filters.maxPrice)) return false;
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(tour.difficulty)) return false;
      if (filters.location.length > 0 && !filters.location.some(loc => tour.location.includes(loc))) return false;
      return true;
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sortBy === 'price-high') result.sort((a, b) => b.priceFrom - a.priceFrom);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [filters, searchQuery, sortBy, tours]);

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850 pt-20 text-left">
      <BookingDrawer 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        tourName={selectedTour.name}
        pricePerPerson={selectedTour.price}
      />
      
      <section className="section-padding">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-sand-500" />
            <h1 className="text-4xl font-serif font-bold dark:text-white">Explore Tours</h1>
          </div>
          <p className="text-slate-500 text-lg">Discover unique experiences across Kazakhstan with our verified local operators.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 relative">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tours, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sand-500 dark:text-white"
              />
            </div>
          </div>

          {/* Search Suggestions */}
          {searchQuery && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
              {suggestions.map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => setSearchQuery(tour.title)}
                  className="w-full px-5 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0 flex items-center gap-3"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-medium">{tour.title}</p>
                    <p className="text-xs text-slate-400">{tour.location}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Trending Tags */}
        <div className="mb-10 flex flex-wrap gap-3">
          {trendings.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-sand-100 dark:hover:bg-sand-500/20 hover:text-sand-600 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sorting & Results */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <p className="text-slate-500 font-medium">
            {isLoading ? 'Loading...' : `${filteredAndSortedTours.length} tours found`}
          </p>
          
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-sand-500 transition-all min-w-[180px] justify-between"
            >
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-sand-500" />
                <span className="text-sm font-bold dark:text-white">
                  {sortOptions.find(opt => opt.id === sortBy)?.label}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsSortOpen(false)} />
                <div className="absolute right-0 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-30 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                        sortBy === option.id 
                        ? 'bg-sand-50 text-sand-600 font-bold dark:bg-sand-500/10' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-sand-500" /> Filters
                </h2>
                <button onClick={() => setFilters({difficulty:[], minPrice:'', maxPrice:'', location:[], duration:[], tags:[]})} className="text-xs text-sand-600 font-bold hover:underline">Reset</button>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-sand-500" /> Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="filter-input-style" />
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="filter-input-style" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sand-500" /> Difficulty
                </label>
                <div className="space-y-2">
                  {['Easy', 'Moderate', 'Hard'].map(lvl => (
                    <button key={lvl} onClick={() => toggleFilter('difficulty', lvl)} className={`flex items-center justify-between w-full p-2.5 rounded-xl text-xs transition-all ${filters.difficulty.includes(lvl) ? 'bg-sand-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'}`}>
                      {lvl} {filters.difficulty.includes(lvl) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sand-500" /> Regions
                </label>
                <div className="space-y-2">
                  {allLocations.map(loc => (
                    <button key={loc} onClick={() => toggleFilter('location', loc)} className={`flex items-center justify-between w-full p-2.5 rounded-lg text-[11px] transition-all ${filters.location.includes(loc) ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                      {loc} {filters.location.includes(loc) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            {isLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 text-sand-500 animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredAndSortedTours.map((tour) => (
                  <div key={tour.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all h-full relative">
                    
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteTour(e, tour.id)}
                        disabled={deletingTourId === tour.id}
                        className="absolute top-4 right-4 z-30 p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                      >
                        {deletingTourId === tour.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    )}

                    <div className="p-8 pb-4 flex-grow">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-sand-100 dark:bg-sand-500/20 flex items-center justify-center font-bold text-sand-700 text-xl">{tour.title.charAt(0)}</div>
                          <div>
                            <h3 className="text-xl font-serif font-medium dark:text-white leading-tight">{tour.title}</h3>
                            <div className="flex items-center gap-1 text-slate-400 text-sm mt-0.5"><MapPin className="w-3.5 h-3.5" />{tour.location}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1 bg-sand-100 dark:bg-sand-500/20 px-3 py-1 rounded-full text-sand-600 font-bold text-sm">
                            <Star className="w-4 h-4 fill-sand-500" />{tour.rating}
                          </div>
                          <div className="flex items-center gap-1 text-emerald-500">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed line-clamp-2 min-h-[3rem] mb-6">{tour.description}</p>
                    </div>
                    <div className="mt-auto px-8 pb-8">
                      <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 dark:border-slate-700 mb-8 text-center">
                        <div><span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold tracking-wider">From</span><span className="text-slate-900 dark:text-white font-bold text-xl">{formatPrice(tour.priceFrom)}</span></div>
                        <div><span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold tracking-wider">Duration</span><span className="text-slate-900 dark:text-white font-bold text-lg">{tour.duration}</span></div>
                        <div><span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold tracking-wider">Level</span><span className="text-sand-600 dark:text-sand-400 font-bold text-lg">{tour.difficulty}</span></div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTour({ name: tour.title, price: tour.priceFrom });
                          setIsBookingOpen(true);
                        }} 
                        className="w-full bg-sand-500 hover:bg-sand-600 text-white py-4.5 rounded-2xl font-bold transition-all shadow-lg text-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <style>{`.filter-input-style { width: 100%; padding: 0.75rem; background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 0.75rem; font-size: 0.75rem; outline: none; transition: all 0.2s; } .dark .filter-input-style { background-color: #334155; border-color: #475569; color: white; }`}</style>
    </div>
  );
}
