import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import type { Advertisement, FilterState, PaginationResponse } from '../../types';
import { adsApi } from '../../services/api';
import { AdCard } from '../../components/AdCard';
import { FilterBar } from '../../components/FilterBar';
import { Pagination } from '../../components/Pagination';

export const ListPage: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    status: [],
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  const [pagination, setPagination] = useState<PaginationResponse>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'priority'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Загружаем объявления при изменении фильтров, сортировки или страницы
  useEffect(() => {
    loadAds();
  }, [filters, pagination.currentPage, sortBy, sortOrder]);

  // Загружаем категории один раз при монтировании
  useEffect(() => {
    loadCategories();
  }, []);

  const loadAds = async () => {
    setLoading(true);
    try {
      // Подготавливаем параметры для API
      const params: any = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy,
        sortOrder,
      };

      // Добавляем фильтры только если они указаны
      if (filters.status.length > 0) {
        params.status = filters.status;
      }
      if (filters.categoryId) {
        params.categoryId = filters.categoryId;
      }
      if (filters.minPrice) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice;
      }
      if (filters.search) {
        params.search = filters.search;
      }

      console.log('Loading ads with params:', params); // Для отладки

      const response = await adsApi.getAds(params);
      console.log('API response:', response.data); // Для отладки

      setAds(response.data.ads || []);

      // Обновляем пагинацию из ответа API
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        // Fallback если пагинация не пришла
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil((response.data.ads?.length || 0) / prev.itemsPerPage),
          totalItems: response.data.ads?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Error loading ads:', error);
      setAds([]);
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // Загружаем все объявления чтобы извлечь категории
      const response = await adsApi.getAds({ limit: 100 });
      const allAds = response.data.ads || [];
      const uniqueCategories = Array.from(
        new Map(
          allAds.map(ad => [ad.categoryId, { id: ad.categoryId, name: ad.category }]),
        ).values(),
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSortChange = (event: any) => {
    const [field, order] = event.target.value.split('-');
    setSortBy(field as 'createdAt' | 'price' | 'priority');
    setSortOrder(order as 'asc' | 'desc');
  };

  // Сбрасываем на первую страницу при изменении фильтров
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <Container maxWidth="lg" sx={{ p: 4, m: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Список объявлений
      </Typography>

      {/* Фильтры */}
      <FilterBar filters={filters} onFiltersChange={handleFiltersChange} categories={categories} />

      {/* Сортировка */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Сортировка</InputLabel>
          <Select value={`${sortBy}-${sortOrder}`} onChange={handleSortChange} label="Сортировка">
            <MenuItem value="createdAt-desc">Новые сначала</MenuItem>
            <MenuItem value="createdAt-asc">Старые сначала</MenuItem>
            <MenuItem value="price-desc">Цена по убыванию</MenuItem>
            <MenuItem value="price-asc">Цена по возрастанию</MenuItem>
            <MenuItem value="priority-desc">По приоритету</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Список объявлений */}
      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : ads.length === 0 ? (
          <Typography textAlign="center" py={4} color="text.secondary">
            Объявления не найдены
          </Typography>
        ) : (
          ads.map(ad => <AdCard key={ad.id} ad={ad} />)
        )}
      </Box>

      {/* Пагинация */}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </Container>
  );
};
