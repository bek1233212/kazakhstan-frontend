import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Импортируем провайдеры из файлов, которые дал Kimi
import { CurrencyProvider } from './hooks/useCurrency';
import { AuthProvider } from './hooks/useAuth';

// Находим корневой элемент в index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Make sure index.html has <div id="root"></div>');
}

createRoot(rootElement).render(
  <StrictMode>
    {/* AuthProvider должен быть сверху, чтобы все приложение знало, залогинен юзер или нет */}
    <AuthProvider>
      {/* CurrencyProvider внутри, чтобы можно было использовать данные юзера для настроек валюты в будущем */}
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </AuthProvider>
  </StrictMode>
);