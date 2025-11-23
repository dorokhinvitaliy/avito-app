import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Chip, Box } from '@mui/material';
import type { Advertisement } from '../types';
import { useNavigate } from 'react-router-dom';

interface AdCardProps {
  ad: Advertisement;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      case 'draft':
        return 'Черновик';
      default:
        return 'На модерации';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'error' : 'default';
  };

  const getPriorityLabel = (priority: string) => {
    return priority === 'urgent' ? 'Срочное' : 'Обычное';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Card sx={{ display: 'flex', mb: 2, height: 140 }}>
      <CardMedia
        component="img"
        sx={{ width: 140 }}
        image={ad.images[0] || '/placeholder-image.jpg'}
        alt={ad.title}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Typography variant="h6" component="h2" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {ad.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={getStatusLabel(ad.status)}
              color={getStatusColor(ad.status) as any}
              size="small"
            />
            <Chip
              label={getPriorityLabel(ad.priority)}
              color={getPriorityColor(ad.priority) as any}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          {ad.price.toLocaleString('ru-RU')} ₽
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {ad.category} • {formatDate(ad.createdAt)}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => navigate(`/item/${ad.id}`)}>
            Открыть →
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
