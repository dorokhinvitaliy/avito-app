import type { ActivityData } from '../types';
import { BarChart } from '@mui/x-charts';

export interface ChartDataset {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
  [key: string]: string | number;
}

export const ActivityChart: React.FC<{ data: ActivityData[] }> = ({ data }) => (
  <>
    <BarChart
      dataset={data as ChartDataset[]}
      height={300}
      xAxis={[{ dataKey: 'date' }]}
      slotProps={{
        legend: {
          direction: 'horizontal',
          position: { vertical: 'bottom', horizontal: 'center' },
        },
      }}
      series={[
        { dataKey: 'approved', label: 'Одобрено', color: '#4caf50' },
        { dataKey: 'rejected', label: 'Отклонено', color: '#f44336' },
        { dataKey: 'requestChanges', label: 'На доработку', color: '#ff9800' },
      ]}
    />
  </>
);
