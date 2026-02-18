import { useState, useEffect, useCallback } from 'react';

export type Route = '/' | '/tours' | '/destinations' | '/about' | '/dashboard' | '/login' | `/company/${string}`;

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<Route>(
    (window.location.hash.replace('#', '') as Route) || '/'
  );

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash.replace('#', '') as Route;
      setCurrentPath(newPath || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path: Route) => {
    window.location.hash = path;
  }, []);

  const matchRoute = useCallback((pattern: string): { isMatch: boolean; params?: Record<string, string> } => {
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const pathParts = currentPath.split('/');
      
      if (patternParts.length !== pathParts.length) {
        return { isMatch: false };
      }

      const params: Record<string, string> = {};
      
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          params[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
          return { isMatch: false };
        }
      }
      
      return { isMatch: true, params };
    }
    
    return { isMatch: currentPath === pattern };
  }, [currentPath]);

  return {
    currentPath,
    navigate,
    matchRoute,
  };
}
