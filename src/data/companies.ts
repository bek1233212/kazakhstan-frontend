export interface Company {
  id: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  priceFrom: number;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  tags: string[];
  description: string;
  longDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  website?: string;
  specialties: string[];
  languages: string[];
  yearEstablished: number;
  groupSize: string;
}

// Очищаем массив: теперь здесь пусто. 
// Все данные будут приходить только из твоего бэкенда на Railway.
export const companies: Company[] = [];

// Эти переменные теперь будут пустыми массивами по умолчанию, 
// пока ты не добавишь реальные данные через админку.
export const allTags = Array.from(new Set(companies.flatMap(c => c.tags)));

// ВАЖНО: Если фильтр по локациям на сайте станет пустым, 
// ты можешь временно прописать их вручную ниже, чтобы фильтры работали:
export const allLocations = [
  'Almaty', 'Astana', 'Shymkent', 'Aktau', 'Turkistan', 'Oskemen'
];

export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};
