import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Star, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useCurrency } from '../hooks/useCurrency';
import { toursAPI } from '../services/api';

const heroImages = [
  { src: '/bg-hero.jpg', alt: 'Kazakhstan Landscape' },
  { src: '/bg-mountain.jpg', alt: 'Tien Shan Mountains' },
  { src: '/bg-lake.jpg', alt: 'Lake Kaindy' },
  { src: '/bg-desert.jpg', alt: 'Altyn-Emel Desert' },
];

const destinations = [
  { name: 'Tien Shan', location: 'Southeastern Kazakhstan', image: '/bg-mountain.jpg' },
  { name: 'Charyn Canyon', location: 'Almaty Region', image: '/bg-canyon.jpg' },
  { name: 'Lake Kaindy', location: 'Kungey Alatau', image: '/bg-lake.jpg' },
  { name: 'Altyn Emel', location: 'Almaty Region', image: '/bg-desert.jpg' },
];

export default function Home() {
  const { navigate } = useRouter();
  const { formatPrice } = useCurrency();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dbTours, setDbTours] = useState<any[]>([]);
  const [isToursLoading, setIsToursLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsToursLoading(true);
        const response = await toursAPI.getAllTours();
        setDbTours(response.data);
      } catch (error) {
        console.error('Error fetching tours for Home:', error);
      } finally {
        setIsToursLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % heroImages.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + heroImages.length) % heroImages.length);

  // ФУНКЦИЯ КРУГОВОЙ ПРОКРУТКИ
  const scrollTours = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 340;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (direction === 'left') {
        // Если мы в самом начале и жмем "налево" — прыгаем в конец
        if (container.scrollLeft <= 0) {
          container.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      } else {
        // Если мы в самом конце и жмем "направо" — прыгаем в начало
        if (container.scrollLeft >= maxScroll - 5) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-500';
      case 'Moderate': return 'text-amber-500';
      case 'Hard': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-start text-center px-4 pt-48">
          <p className="text-sand-400 text-sm font-medium uppercase tracking-widest mb-4">Private & Small-Group Tours</p>
          <h1 className="heading-xl text-white text-shadow-lg mb-4 tracking-wider">Discover Kazakhstan</h1>
          <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide mb-8 text-shadow">Nature. Culture. Real Experience.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/tours')} className="btn-primary">Explore Tours</button>
            <button onClick={() => navigate('/destinations')} className="btn-outline">View Destinations</button>
          </div>
        </div>

        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex gap-2">
            {heroImages.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`} />
            ))}
          </div>
          <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-sand-100 dark:bg-slate-800/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[{ value: '4.8', label: 'Average Rating' }, { value: '5000+', label: 'Happy Travelers' }, { value: '15+', label: 'Verified Partners' }, { value: '50+', label: 'Unique Routes' }].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl lg:text-5xl font-serif font-medium text-sand-600 dark:text-sand-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Adventures Section (Круговая прокрутка) */}
      <section className="pt-16 pb-16 bg-cream dark:bg-slate-850">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-sand-100 dark:bg-sand-500/20 text-sand-700 dark:text-sand-300 text-sm font-medium rounded-full mb-4">Explore</span>
              <h2 className="heading-lg text-slate-750 dark:text-white">Featured Adventures</h2>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => scrollTours('left')} className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-sand-500 transition-all active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => scrollTours('right')} className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-sand-500 transition-all active:scale-95"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          {isToursLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-sand-500 animate-spin" />
            </div>
          ) : (
            <div 
              ref={scrollContainerRef} 
              className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 scroll-smooth"
            >
              {dbTours.map((tour) => (
                <div 
                  key={tour.id} 
                  onClick={() => navigate('/tours')} 
                  className="flex-shrink-0 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-sand-100 dark:bg-sand-500/20 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-sand-500 fill-sand-500" />
                          <span className="text-xs font-semibold text-sand-600 dark:text-sand-400">{tour.rating || '5.0'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sand-200 to-sand-300 dark:from-sand-500/30 dark:to-sand-600/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-sand-700 dark:text-sand-400">{tour.title.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-serif font-medium text-slate-750 dark:text-white group-hover:text-sand-500 transition-colors line-clamp-1">{tour.title}</h3>
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm"><MapPin className="w-3 h-3" />{tour.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div><span className="text-xs text-slate-400">From</span><p className="text-slate-750 dark:text-white font-semibold">{formatPrice(tour.priceFrom)}</p></div>
                      <div className="text-right"><span className="text-xs text-slate-400">Duration</span><p className="text-slate-750 dark:text-white font-semibold">{tour.duration}</p></div>
                      <div className="text-right"><span className="text-xs text-slate-400">Level</span><p className={`text-xs font-semibold ${getDifficultyColor(tour.difficulty)}`}>{tour.difficulty}</p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <button onClick={() => navigate('/tours')} className="px-8 py-4 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-full transition-all">View All Adventures</button>
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="py-16 bg-sand-100/50 dark:bg-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-sand-100 dark:bg-sand-500/20 text-sand-700 dark:text-sand-300 text-sm font-medium rounded-full mb-4">Must-Visit Places</span>
            <h2 className="heading-lg text-slate-750 dark:text-white mb-4">Top Destinations</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">From natural wonders to ancient cities, discover the places that make Kazakhstan truly special.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div key={dest.name} onClick={() => navigate('/destinations')} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md">
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-1 text-white/60 text-sm mb-2"><MapPin className="w-4 h-4" />{dest.location}</div>
                  <h3 className="text-xl font-serif font-medium text-white group-hover:text-sand-300 transition-colors">{dest.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate('/destinations')} className="px-8 py-4 border-2 border-sand-500 text-sand-500 font-medium rounded-full hover:bg-sand-500 hover:text-white transition-all">Explore All Destinations</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-cream dark:bg-slate-850">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 text-center">
          <div className="relative rounded-3xl p-12 lg:p-16 overflow-hidden shadow-xl">
            <img src="/bg-cta.jpg" alt="CTA Background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10">
              <h2 className="heading-md text-white mb-4">Ready to Start Your Adventure?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">Connect with verified local tour operators and plan your perfect Kazakh adventure today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate('/tours')} className="px-8 py-4 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-full transition-all hover:shadow-lg">Browse All Tours</button>
                <button onClick={() => navigate('/about')} className="px-8 py-4 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all">Contact Us</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
