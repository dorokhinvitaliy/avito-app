import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Cancel,
  Schedule,
  BarChart,
  PieChart,
  Category,
} from '@mui/icons-material';
import type { StatsSummary, ActivityData, DecisionsData } from '../../types';
import { statsApi } from '../../services/api';

// Простые компоненты графиков (заглушки)
const ActivityChart: React.FC<{ data: ActivityData[] }> = ({ data }) => (
  <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2 }}>
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

const DecisionsChart: React.FC<{ data: DecisionsData }> = ({ data }) => {
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

const CategoriesChart: React.FC<{ data: Record<string, number> }> = ({ data }) => (
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

export const StatsPage: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [activity, setActivity] = useState<ActivityData[]>([]);
  const [decisions, setDecisions] = useState<DecisionsData | null>(null);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const params = { period };

      const [summaryRes, activityRes, decisionsRes, categoriesRes] = await Promise.all([
        statsApi.getSummary(params),
        statsApi.getActivity(params),
        statsApi.getDecisions(params),
        statsApi.getCategories(params),
      ]);

      setSummary(summaryRes.data);
      setActivity(activityRes.data);
      setDecisions(decisionsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: 'today' | 'week' | 'month',
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 3600);
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}ч ${mins}мин` : `${hours}ч`;
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Статистика модерации
        </Typography>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          aria-label="период статистики"
        >
          <ToggleButton value="today" aria-label="сегодня">
            Сегодня
          </ToggleButton>
          <ToggleButton value="week" aria-label="неделя">
            7 дней
          </ToggleButton>
          <ToggleButton value="month" aria-label="месяц">
            30 дней
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Общая статистика */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    Проверено
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {summary.totalReviewed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  всего объявлений
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" component="h2">
                    Одобрено
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'success.main' }}
                >
                  {summary.approvedPercentage.toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  процент одобрения
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Cancel sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="h6" component="h2">
                    Отклонено
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'error.main' }}
                >
                  {summary.rejectedPercentage.toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  процент отклонения
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6" component="h2">
                    Время
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatTime(summary.averageReviewTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  среднее на проверку
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Графики */}
      <Grid container spacing={3}>
        {/* Активность */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2">
                  Активность модерации
                </Typography>
              </Box>
              {activity.length > 0 ? (
                <ActivityChart data={activity} />
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  Нет данных за выбранный период
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Решения */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PieChart sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2">
                  Распределение решений
                </Typography>
              </Box>
              {decisions ? (
                <DecisionsChart data={decisions} />
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  Нет данных
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Категории */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Category sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2">
                  Категории объявлений
                </Typography>
              </Box>
              {Object.keys(categories).length > 0 ? (
                <CategoriesChart data={categories} />
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  Нет данных по категориям
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
