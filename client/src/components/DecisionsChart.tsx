import { Box, Typography } from '@mui/material';
import type { DecisionsData } from '../types';

export const DecisionsChart: React.FC<{ data: DecisionsData }> = ({ data }) => {
  const total = data.approved + data.rejected + data.requestChanges;
  const approvedPercent = (data.approved / total) * 100;
  const rejectedPercent = (data.rejected / total) * 100;
  const requestChangesPercent = (data.requestChanges / total) * 100;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: '50%' }} />
        <Typography variant="body2">Одобрено: {approvedPercent.toFixed(1)}%</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: '50%' }} />
        <Typography variant="body2">Отклонено: {rejectedPercent.toFixed(1)}%</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: '50%' }} />
        <Typography variant="body2">На доработку: {requestChangesPercent.toFixed(1)}%</Typography>
      </Box>
    </Box>
  );
};
