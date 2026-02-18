import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, X, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '../hooks/useRouter';
import { destinations, type Destination } from '../data/destinations-database';

export default function Destinations() {
  const { navigate } = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentDestination = destinations[currentSlide];

  // Auto-play for Hero Section
  useEffect(() => {
    if (!selectedDest) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % destinations.length);
      }, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedDest]);

  // Preload all gallery images when modal opens
  useEffect(() => {
    if (selectedDest) {
      setIsImageLoading(true);
      selectedDest.gallery.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [selectedDest]);

  const openModal = (dest: Destination) => {
    setSelectedDest(dest);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedDest(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850 pt-20">
      
      {/* 1. Hero Carousel */}
      <section className="relative h-[80vh] mt-5 mx-4 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="heading-xl text-white mb-4">{currentDestination.name}</h1>
          <p className="text-lg text-white/80 max-w-2xl mb-8">{currentDestination.shortDescription}</p>
          <button onClick={() => openModal(currentDestination)} className="btn-primary">
            Explore Details
          </button>
        </div>
      </section>

      {/* 2. Grid Section */}
      <section className="py-24 lg:py-32">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={dest.image} alt={dest.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-serif font-medium mb-3 text-slate-850 dark:text-white">{dest.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">{dest.shortDescription}</p>
                  
                  <button 
                    onClick={() => openModal(dest)}
                    className="inline-flex items-center gap-2 px-6 py-2 border-2 border-sand-500 text-sand-600 dark:text-sand-400 font-bold rounded-full hover:bg-sand-500 hover:text-white transition-all"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Smooth Modal */}
      <AnimatePresence>
        {selectedDest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={closeModal} />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-800 w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Slideshow Side */}
              <div className="lg:w-3/5 h-[400px] lg:h-auto relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
                
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-10 h-10 text-sand-500 animate-spin" />
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={selectedDest.gallery[activeImageIndex]}
                    onLoad={() => setIsImageLoading(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isImageLoading ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                    alt="Gallery"
                  />
                </AnimatePresence>
                
                <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
                  <button 
                    onClick={() => {
                      setIsImageLoading(true);
                      setActiveImageIndex((prev) => (prev - 1 + selectedDest.gallery.length) % selectedDest.gallery.length);
                    }}
                    className="p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => {
                      setIsImageLoading(true);
                      setActiveImageIndex((prev) => (prev + 1) % selectedDest.gallery.length);
                    }}
                    className="p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-2/5 p-8 lg:p-12 overflow-y-auto relative">
                <button onClick={closeModal} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-8 h-8" />
                </button>

                <div className="flex items-center gap-2 text-sand-600 font-bold text-xs uppercase mb-4">
                  <MapPin className="w-4 h-4" /> {selectedDest.location}
                </div>
                
                <h2 className="text-4xl font-serif text-slate-850 dark:text-white mb-6">{selectedDest.name}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{selectedDest.fullDescription}</p>

                <div className="space-y-4 mb-10">
                  <h4 className="font-bold text-slate-850 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-sand-500" /> Highlights
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedDest.features.map(f => (
                      <div key={f} className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-sand-500 rounded-full" /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => { closeModal(); navigate('/tours'); }}
                  className="w-full py-4 bg-sand-500 hover:bg-sand-600 text-white font-bold rounded-2xl transition-all shadow-lg"
                >
                  Find Tours
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
