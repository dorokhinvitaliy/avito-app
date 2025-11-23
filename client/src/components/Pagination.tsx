import React from 'react';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';
import type { PaginationResponse } from '../types';

interface PaginationProps {
  pagination: PaginationResponse;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  // Защита от деления на ноль и некорректных данных
  const totalPages = Math.max(pagination.totalPages || 1, 1);
  const currentPage = Math.min(Math.max(pagination.currentPage || 1, 1), totalPages);
  const totalItems = pagination.totalItems || 0;

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, p: 2 }}
    >
      <Typography variant="body2" color="text.secondary">
        Всего: {totalItems} объявлений
      </Typography>

      {totalPages > 1 && (
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          showFirstButton
          showLastButton
        />
      )}
    </Box>
  );
};
