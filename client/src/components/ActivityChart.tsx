import { Box, Typography } from '@mui/material';
import type { ActivityData } from '../types';

export const ActivityChart: React.FC<{ data: ActivityData[] }> = ({ data }) => (
  <Box
    sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2, overflowX: 'auto' }}
  >
    {data.map((item, index) => (
      <Box
        key={index}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 200 }}>
          <Box
            sx={{
              width: 20,
              height: (item.approved / Math.max(...data.map(d => d.approved))) * 180,
              bgcolor: '#4caf50',
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: (item.rejected / Math.max(...data.map(d => d.rejected))) * 180,
              bgcolor: '#f44336',
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: (item.requestChanges / Math.max(...data.map(d => d.requestChanges))) * 180,
              bgcolor: '#ff9800',
              borderRadius: 1,
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ mt: 1 }}>
          {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
        </Typography>
      </Box>
    ))}
  </Box>
);
