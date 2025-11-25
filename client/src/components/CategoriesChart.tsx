import { Box, Typography } from '@mui/material';

export const CategoriesChart: React.FC<{ data: Record<string, number> }> = ({ data }) => (
  <Box sx={{ mt: 2 }}>
    {Object.entries(data).map(([category, count]) => (
      <Box
        key={category}
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}
      >
        <Typography variant="body2">{category}</Typography>
        <Typography variant="body2" fontWeight="bold">
          {count}
        </Typography>
      </Box>
    ))}
  </Box>
);
