import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ImageList,
  ImageListItem,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, ArrowForward, Check, Close, Edit } from '@mui/icons-material';
import type { Advertisement } from '../../types';
import { adsApi } from '../../services/api';

export const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [changesDialogOpen, setChangesDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [changesReason, setChangesReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    if (id) {
      loadAd(parseInt(id));
    }
  }, [id]);

  const loadAd = async (adId: number) => {
    setLoading(true);
    try {
      const response = await adsApi.getAd(adId);
      setAd(response.data);
    } catch (error) {
      console.error('Error loading ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!ad) return;

    try {
      await adsApi.approveAd(ad.id);
      loadAd(ad.id); // Перезагружаем для обновления данных
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleReject = async () => {
    if (!ad) return;

    const reason = rejectReason === 'Другое' ? customReason : rejectReason;

    try {
      await adsApi.rejectAd(ad.id, {
        reason: rejectReason as any,
        comment: reason === 'Другое' ? customReason : undefined,
      });
      setRejectDialogOpen(false);
      setRejectReason('');
      setCustomReason('');
      loadAd(ad.id);
    } catch (error) {
      console.error('Error rejecting ad:', error);
    }
  };

  const handleRequestChanges = async () => {
    if (!ad) return;

    const reason = changesReason === 'Другое' ? customReason : changesReason;

    try {
      await adsApi.requestChanges(ad.id, {
        reason: changesReason as any,
        comment: reason === 'Другое' ? customReason : undefined,
      });
      setChangesDialogOpen(false);
      setChangesReason('');
      setCustomReason('');
      loadAd(ad.id);
    } catch (error) {
      console.error('Error requesting changes:', error);
    }
  };

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

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      case 'requestChanges':
        return 'На доработку';
      default:
        return action;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const renderModerationDialog = (
    open: boolean,
    onClose: () => void,
    title: string,
    reason: string,
    onReasonChange: (value: string) => void,
    onConfirm: () => void,
    confirmText: string,
    confirmColor: 'error' | 'warning',
  ) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Причина</InputLabel>
          <Select value={reason} onChange={e => onReasonChange(e.target.value)} label="Причина">
            <MenuItem value="Запрещенный товар">Запрещенный товар</MenuItem>
            <MenuItem value="Неверная категория">Неверная категория</MenuItem>
            <MenuItem value="Некорректное описание">Некорректное описание</MenuItem>
            <MenuItem value="Проблемы с фото">Проблемы с фото</MenuItem>
            <MenuItem value="Подозрение на мошенничество">Подозрение на мошенничество</MenuItem>
            <MenuItem value="Другое">Другое</MenuItem>
          </Select>
        </FormControl>

        {reason === 'Другое' && (
          <TextField
            fullWidth
            label="Укажите причину"
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
            sx={{ mt: 2 }}
            multiline
            rows={3}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={!reason || (reason === 'Другое' && !customReason)}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!ad) {
    return (
      <Container>
        <Typography>Объявление не найдено</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Навигация */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/list')}>
          Назад к списку
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Предыдущее
          </Button>
          <Button variant="outlined" endIcon={<ArrowForward />}>
            Следующее
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Левая колонка - основная информация */}
        <Grid item xs={12} md={8}>
          {/* Заголовок и статус */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom>
                  {ad.title}
                </Typography>
                <Chip
                  label={getStatusLabel(ad.status)}
                  color={getStatusColor(ad.status) as any}
                  size="large"
                />
              </Box>

              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                {ad.price.toLocaleString('ru-RU')} ₽
              </Typography>

              <Typography variant="body1" color="text.secondary" gutterBottom>
                Категория: {ad.category} • Дата: {formatDate(ad.createdAt)}
              </Typography>
            </CardContent>
          </Card>

          {/* Галерея изображений */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Изображения
              </Typography>
              <ImageList cols={3} gap={8}>
                {ad.images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image || '/placeholder-image.jpg'}
                      alt={`${ad.title} ${index + 1}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </CardContent>
          </Card>

          {/* Полное описание */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Полное описание
              </Typography>
              <Typography variant="body1">{ad.description}</Typography>
            </CardContent>
          </Card>

          {/* Характеристики */}
          {Object.keys(ad.characteristics).length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Характеристики
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableBody>
                      {Object.entries(ad.characteristics).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: 'bold', width: '40%' }}
                          >
                            {key}
                          </TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Правая колонка - информация о продавце и модерация */}
        <Grid item xs={12} md={4}>
          {/* Информация о продавце */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Информация о продавце
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Имя:</strong> {ad.seller.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Рейтинг:</strong> {ad.seller.rating} ⭐
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Объявлений:</strong> {ad.seller.totalAds}
              </Typography>
              <Typography variant="body1">
                <strong>На сайте:</strong>{' '}
                {new Date(ad.seller.registeredAt).toLocaleDateString('ru-RU')}
              </Typography>
            </CardContent>
          </Card>

          {/* История модерации */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                История модерации
              </Typography>
              {ad.moderationHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  История модерации отсутствует
                </Typography>
              ) : (
                ad.moderationHistory.map(action => (
                  <Box key={action.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {action.moderatorName}
                      </Typography>
                      <Chip
                        label={getActionLabel(action.action)}
                        color={
                          getStatusColor(
                            action.action === 'approved'
                              ? 'approved'
                              : action.action === 'rejected'
                              ? 'rejected'
                              : 'pending',
                          ) as any
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(action.timestamp)}
                    </Typography>
                    {action.reason && (
                      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                        Причина: {action.reason}
                      </Typography>
                    )}
                    {action.comment && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {action.comment}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          {/* Панель действий модератора */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Действия модератора
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Check />}
                  onClick={handleApprove}
                  fullWidth
                  disabled={ad.status === 'approved'}
                >
                  Одобрить
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Close />}
                  onClick={() => setRejectDialogOpen(true)}
                  fullWidth
                  disabled={ad.status === 'rejected'}
                >
                  Отклонить
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Edit />}
                  onClick={() => setChangesDialogOpen(true)}
                  fullWidth
                >
                  Вернуть на доработку
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Диалог отклонения */}
      {renderModerationDialog(
        rejectDialogOpen,
        () => setRejectDialogOpen(false),
        'Отклонить объявление',
        rejectReason,
        setRejectReason,
        handleReject,
        'Отклонить',
        'error',
      )}

      {/* Диалог запроса изменений */}
      {renderModerationDialog(
        changesDialogOpen,
        () => setChangesDialogOpen(false),
        'Вернуть на доработку',
        changesReason,
        setChangesReason,
        handleRequestChanges,
        'Отправить на доработку',
        'warning',
      )}
    </Container>
  );
};
