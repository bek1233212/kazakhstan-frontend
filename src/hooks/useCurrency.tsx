import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdPrice: number) => string;
  symbol: string;
}

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency') as Currency;
      return saved || 'USD';
    }
    return 'USD';
  });

  const [rates, setRates] = useState<Record<Currency, number>>({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
  });

  const fetchRates = async () => {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data && data.rates) {
        setRates({
          USD: 1,
          EUR: data.rates.EUR || 0.92,
          GBP: data.rates.GBP || 0.79,
        });
      }
    } catch (error) {
      console.error('Exchange rate fetch failed', error);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  };

  const formatPrice = (usdPrice: number): string => {
    const rate = rates[currency] || 1;
    const converted = Math.round(usdPrice * rate);
    return `${currencySymbols[currency]}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol: currencySymbols[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
