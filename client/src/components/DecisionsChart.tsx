import { Box } from '@mui/material';
import type { DecisionsData } from '../types';
import { PieChart } from '@mui/x-charts/PieChart';

export const DecisionsChart: React.FC<{ data: DecisionsData }> = ({ data }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <PieChart
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: { vertical: 'bottom', horizontal: 'center' },
          },
        }}
        width={200}
        height={300}
        series={[
          {
            data: [
              { id: 0, value: data.approved, label: 'Одобрено', color: '#4caf50' },
              { id: 1, value: data.rejected, label: 'Отклонено', color: '#f44336' },
              { id: 2, value: data.requestChanges, label: 'На доработку', color: '#ff9800' },
            ],
          },
        ]}
      />
    </Box>
  );
};
