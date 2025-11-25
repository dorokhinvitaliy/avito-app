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
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
} from '@mui/material';
import type { FilterState } from '../types';
import { FilterAlt } from '@mui/icons-material';

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
    <Card>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <FilterAlt sx={{ color: '#000000ff' }} />
          <Typography variant="h5" gutterBottom>
            <b> Фильтры</b>
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid size={{ md: 12, xs: 4 }}>
            <TextField
              label="Поиск по названию или описанию"
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              sx={{ minWidth: 200, width: '100%' }}
            />
          </Grid>

          {/* Статус */}
          <Grid size={{ md: 12, xs: 4 }}>
            <FormControl sx={{ minWidth: 200, width: '100%' }}>
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
          </Grid>

          {/* Категория */}
          <Grid size={{ md: 12, xs: 4 }}>
            <FormControl sx={{ minWidth: 200, width: '100%' }}>
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
          </Grid>

          {/* Цена от */}
          <Grid size={{ md: 12, xs: 4 }}>
            <TextField
              label="Цена от"
              type="number"
              value={filters.minPrice}
              onChange={e =>
                handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : '')
              }
              sx={{ minWidth: 120, width: '100%' }}
            />
          </Grid>

          {/* Цена до */}
          <Grid size={{ md: 12, xs: 4 }}>
            <TextField
              label="Цена до"
              type="number"
              value={filters.maxPrice}
              onChange={e =>
                handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')
              }
              sx={{ minWidth: 120, width: '100%' }}
            />
          </Grid>
          <Grid size={{ md: 12, xs: 4 }}>
            <Button onClick={clearFilters} variant="outlined" size="large" sx={{ width: '100%' }}>
              Сбросить
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
