const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Описание типов данных
 */
export interface Tour {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  priceFrom: number;
  location: string;
  duration: string;
  difficulty: string;
  rating: number;
  tags: string[];
  operator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'USER';
  createdAt: string;
}

// Тип для обертки данных (чтобы Dashboard.tsx не ругался на отсутствие .data)
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Базовая функция для выполнения запросов
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json();

    // Если бэкенд возвращает данные сразу массивом без поля data, 
    // мы искусственно оборачиваем их, чтобы фронтенд (от Kimi) работал корректно
    if (response.ok) {
      return result.data ? result : { success: true, data: result };
    }

    throw new Error(result.message || 'Ошибка при запросе к API');
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * API для работы с турами
 */
export const toursAPI = {
  getAllTours: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return apiRequest<Tour[]>(`/tours${query}`);
  },
  
  getMyTours: () => apiRequest<Tour[]>('/tours/my'), 

  createTour: (tourData: Partial<Tour>) =>
    apiRequest<Tour>('/tours', {
      method: 'POST',
      body: tourData as any,
    }),

  updateTour: (id: string, tourData: Partial<Tour>) =>
    apiRequest<Tour>(`/tours/${id}`, {
      method: 'PUT',
      body: tourData as any,
    }),

  deleteTour: (id: string) =>
    apiRequest<{ success: boolean }>(`/tours/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * API для работы с пользователями
 */
export const usersAPI = {
  getAllUsers: () => apiRequest<User[]>('/users'),

  updateUserRole: (id: string, role: string) =>
    apiRequest<User>(`/users/${id}/role`, {
      method: 'PATCH',
      body: { role } as any,
    }),

  deleteUser: (id: string) =>
    apiRequest<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * API для авторизации
 */
export const authAPI = {
  login: (credentials: any) => 
    apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: credentials,
    }),
    
  register: (userData: any) =>
    apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: userData,
    }),

  getMe: () => apiRequest<User>('/auth/me'),
};
