import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Button,
} from '@mui/material';
import type { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: { id: number; name: string }[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, categories }) => {
  const statusOptions = [
    { value: 'pending', label: 'На модерации' },
    { value: 'approved', label: 'Одобрено' },
    { value: 'rejected', label: 'Отклонено' },
    { value: 'draft', label: 'Черновик' },
  ];

  const handleStatusChange = (event: any) => {
    onFiltersChange({
      ...filters,
      status: event.target.value,
    });
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', mb: 2, borderRadius: 1 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Поиск */}
        <TextField
          label="Поиск по названию или описанию"
          value={filters.search}
          onChange={e => handleFilterChange('search', e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />

        {/* Статус */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            multiple
            value={filters.status}
            onChange={handleStatusChange}
            input={<OutlinedInput label="Статус" />}
            renderValue={selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(value => (
                  <Chip
                    key={value}
                    label={statusOptions.find(opt => opt.value === value)?.label}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Категория */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Категория</InputLabel>
          <Select
            value={filters.categoryId}
            onChange={e => handleFilterChange('categoryId', e.target.value)}
            label="Категория"
          >
            <MenuItem value="">Все категории</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Цена от */}
        <TextField
          label="Цена от"
          type="number"
          value={filters.minPrice}
          onChange={e =>
            handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : '')
          }
          size="small"
          sx={{ minWidth: 120 }}
        />

        {/* Цена до */}
        <TextField
          label="Цена до"
          type="number"
          value={filters.maxPrice}
          onChange={e =>
            handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')
          }
          size="small"
          sx={{ minWidth: 120 }}
        />

        {/* Сброс фильтров */}
        <Button onClick={clearFilters} variant="outlined">
          Сбросить
        </Button>
      </Box>
    </Box>
  );
};
