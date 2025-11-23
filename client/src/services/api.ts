import axios from 'axios';
import type {
  Advertisement,
  AdsResponse,
  StatsSummary,
  ActivityData,
  DecisionsData,
  Moderator,
  RejectRequest,
} from '../types';

const API_BASE = 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE,
});

export const adsApi = {
  // Получить список объявлений с фильтрацией и пагинацией
  getAds: (params?: {
    page?: number;
    limit?: number;
    status?: string[];
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'createdAt' | 'price' | 'priority';
    sortOrder?: 'asc' | 'desc';
  }) => api.get<AdsResponse>('/ads', { params }),

  // Получить объявление по ID
  getAd: (id: number) => api.get<Advertisement>(`/ads/${id}`),

  // Одобрить объявление
  approveAd: (id: number) => api.post<{ message: string; ad: Advertisement }>(`/ads/${id}/approve`),

  // Отклонить объявление
  rejectAd: (id: number, data: RejectRequest) =>
    api.post<{ message: string; ad: Advertisement }>(`/ads/${id}/reject`, data),

  // Запросить изменения в объявлении
  requestChanges: (id: number, data: RejectRequest) =>
    api.post<{ message: string; ad: Advertisement }>(`/ads/${id}/request-changes`, data),
};

export const statsApi = {
  // Получить общую статистику
  getSummary: (params?: {
    period?: 'today' | 'week' | 'month' | 'custom';
    startDate?: string;
    endDate?: string;
  }) => api.get<StatsSummary>('/stats/summary', { params }),

  // Получить данные графика активности
  getActivity: (params?: {
    period?: 'today' | 'week' | 'month' | 'custom';
    startDate?: string;
    endDate?: string;
  }) => api.get<ActivityData[]>('/stats/chart/activity', { params }),

  // Получить данные графика решений
  getDecisions: (params?: {
    period?: 'today' | 'week' | 'month' | 'custom';
    startDate?: string;
    endDate?: string;
  }) => api.get<DecisionsData>('/stats/chart/decisions', { params }),

  // Получить данные графика категорий
  getCategories: (params?: {
    period?: 'today' | 'week' | 'month' | 'custom';
    startDate?: string;
    endDate?: string;
  }) => api.get<Record<string, number>>('/stats/chart/categories', { params }),
};

export const moderatorsApi = {
  // Получить информацию о текущем модераторе
  getMe: () => api.get<Moderator>('/moderators/me'),
};
