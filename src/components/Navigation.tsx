import { useState, useEffect } from 'react';
import { Mountain, Menu, X, Sun, Moon, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useTheme } from '../hooks/useTheme';
import { useCurrency, type Currency } from '../hooks/useCurrency';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/tours', label: 'Tours' },
  { path: '/destinations', label: 'Destinations' },
  { path: '/about', label: 'About Us' },
];

const currencies: { code: Currency; label: string }[] = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const { navigate, currentPath } = useRouter();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { currency, setCurrency, symbol } = useCurrency();
  const { isAuthenticated, logout } = useAuth();

  const isHomePage = currentPath === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path as any);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const getTopTextColor = () => {
    if (isDark) return 'text-white'; 
    if (isHomePage) return 'text-white';
    return 'text-[#2F3E46]';
  };

  const getTopTextOpacityColor = () => {
    if (isDark) return 'text-white/80 hover:text-white';
    if (isHomePage) return 'text-white/80 hover:text-white';
    return 'text-[#2F3E46]/80 hover:text-[#2F3E46]';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-cream/95 dark:bg-slate-850/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="flex items-center h-20">
          
          {/* 1. ЛЕВАЯ ЧАСТЬ (Logo) - flex-1 занимает левую треть */}
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center gap-3 group"
            >
              <Mountain
                className={`w-8 h-8 transition-colors ${
                  isScrolled 
                    ? 'text-sand-500' 
                    : (isDark || isHomePage) ? 'text-white' : 'text-[#2F3E46]'
                } group-hover:text-sand-400`}
                strokeWidth={1.5}
              />
              <span
                className={`font-serif text-xl tracking-wider transition-colors hidden sm:block ${
                  isScrolled ? 'text-slate-750 dark:text-white' : getTopTextColor()
                }`}
              >
                KAZAKHSTAN
              </span>
            </button>
          </div>

          {/* 2. ЦЕНТРАЛЬНАЯ ЧАСТЬ (Desktop Navigation) - фиксированный блок по центру */}
          <div className="hidden lg:flex items-center gap-8 px-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className={`relative text-sm font-medium tracking-wide transition-colors whitespace-nowrap ${
                  isScrolled
                    ? 'text-slate-600 dark:text-white/70 hover:text-sand-500 dark:hover:text-sand-400'
                    : getTopTextOpacityColor()
                } ${isActive(link.path) ? 'text-sand-500!' : ''}`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sand-500" />
                )}
              </button>
            ))}
          </div>

          {/* 3. ПРАВАЯ ЧАСТЬ (Actions) - flex-1 занимает правую треть */}
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
                    : (isDark || isHomePage) 
                      ? 'text-white/80 hover:bg-white/10' 
                      : 'text-[#2F3E46]/80 hover:bg-[#2F3E46]/10'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isScrolled
                      ? 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
                      : (isDark || isHomePage) 
                        ? 'text-white/80 hover:bg-white/10' 
                        : 'text-[#2F3E46]/80 hover:bg-[#2F3E46]/10'
                  }`}
                >
                  <span className="text-base font-bold leading-none">{symbol}</span>
                  {currency}
                  <ChevronDown className={`w-3 h-3 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCurrencyOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setCurrency(curr.code);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                            currency === curr.code
                              ? 'bg-sand-50 dark:bg-sand-500/20 text-sand-600 dark:text-sand-400 font-bold'
                              : 'text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="font-medium">{curr.code}</span>
                          <span className="ml-2 text-xs opacity-60">{curr.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleNavigate('/dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isScrolled
                        ? 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
                        : (isDark || isHomePage) 
                          ? 'text-white/80 hover:bg-white/10' 
                          : 'text-[#2F3E46]/80 hover:bg-[#2F3E46]/10'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-sand-500 hover:bg-sand-600 text-white text-sm font-medium rounded-full transition-all hover:shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigate('/login')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sand-500 hover:bg-sand-600 text-white text-sm font-medium rounded-full transition-all hover:shadow-lg hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-slate-750 dark:text-white'
                  : (isDark || isHomePage) ? 'text-white' : 'text-[#2F3E46]'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-cream dark:bg-slate-850 shadow-xl border-t border-slate-100 dark:border-slate-800 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={`block w-full text-left py-3 text-lg font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-sand-500'
                  : 'text-slate-600 dark:text-white/70 hover:text-sand-500'
              }`}
            >
              {link.label}
            </button>
          ))}
          {/* ... остальная часть мобильного меню без изменений ... */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full py-3 text-slate-600 dark:text-white/70"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className="flex items-center gap-3 py-3">
              <span className="w-5 text-center font-bold text-slate-700 dark:text-white">{symbol}</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-slate-600 dark:text-white/70 focus:outline-none font-medium"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.label}
                  </option>
                ))}
              </select>
            </div>

            {isAuthenticated ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-full transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-white/70 font-medium rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('/login')}
                className="w-full py-4 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-full transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
