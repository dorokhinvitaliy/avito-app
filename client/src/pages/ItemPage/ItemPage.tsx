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
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  Divider,
} from '@mui/material';

import {
  ArrowBack,
  Check,
  Close,
  Edit,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CurrencyRuble,
} from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import type { Advertisement, RejectRequest } from '../../types';
import { adsApi } from '../../services/api';
import { ImageGallery } from '../../components/ImageGallery';

export const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(false);
  const [neighborAds, setNeighborAds] = useState<{ prev: number | null; next: number | null }>({
    prev: null,
    next: null,
  });
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [changesDialogOpen, setChangesDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [changesReason, setChangesReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    if (id) {
      const adId = parseInt(id);
      loadAd(adId);
      loadNeighbors(adId);
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

  const loadNeighbors = async (currentAdId: number) => {
    try {
      const response = await adsApi.getAds({
        limit: 1000,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const allAds = response.data.ads || [];
      const currentIndex = allAds.findIndex(ad => ad.id === currentAdId);

      if (currentIndex !== -1) {
        setNeighborAds({
          prev: currentIndex > 0 ? allAds[currentIndex - 1].id : null,
          next: currentIndex < allAds.length - 1 ? allAds[currentIndex + 1].id : null,
        });
      } else {
        setNeighborAds({ prev: null, next: null });
      }
    } catch (error) {
      console.error('Error loading neighbors:', error);
    }
  };

  const handleApprove = async () => {
    if (!ad) return;

    try {
      await adsApi.approveAd(ad.id);
      loadAd(ad.id);
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleReject = async () => {
    if (!ad) return;

    try {
      await adsApi.rejectAd(ad.id, {
        reason: rejectReason as RejectRequest['reason'],
        comment: rejectReason === 'Другое' ? customReason : undefined,
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

    try {
      await adsApi.requestChanges(ad.id, {
        reason: changesReason as RejectRequest['reason'],
        comment: changesReason === 'Другое' ? customReason : undefined,
      });
      setChangesDialogOpen(false);
      setChangesReason('');
      setCustomReason('');
      loadAd(ad.id);
    } catch (error) {
      console.error('Error requesting changes:', error);
    }
  };

  const handleNavigateToNeighbor = (neighborId: number | null) => {
    if (neighborId) {
      navigate(`/item/${neighborId}`);
    }
  };

  // Горячие клавиши
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!ad) return;

      if (event.altKey) {
        if (event.key === 'ArrowLeft' && neighborAds.prev) {
          handleNavigateToNeighbor(neighborAds.prev);
        } else if (event.key === 'ArrowRight' && neighborAds.next) {
          handleNavigateToNeighbor(neighborAds.next);
        }
      }

      if (!rejectDialogOpen && !changesDialogOpen) {
        switch (event.key.toLowerCase()) {
          case 'a':
            if (ad.status !== 'approved') {
              handleApprove();
            }
            break;
          case 'd':
            if (ad.status !== 'rejected') {
              setRejectDialogOpen(true);
            }
            break;
          case 'r':
            setChangesDialogOpen(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [ad, neighborAds, rejectDialogOpen, changesDialogOpen]);

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
        <Button onClick={() => navigate('/list')} sx={{ mt: 2 }}>
          Вернуться к списку
        </Button>
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
          <Tooltip title="Предыдущее объявление (Alt + ←)">
            <span>
              <IconButton
                onClick={() => handleNavigateToNeighbor(neighborAds.prev)}
                disabled={!neighborAds.prev}
                color="primary"
                size="large"
              >
                <KeyboardArrowLeft />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Следующее объявление (Alt + →)">
            <span>
              <IconButton
                onClick={() => handleNavigateToNeighbor(neighborAds.next)}
                disabled={!neighborAds.next}
                color="primary"
                size="large"
              >
                <KeyboardArrowRight />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Подсказка горячих клавиш */}
      <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'info.light', borderRadius: 4 }}>
        <Typography variant="caption" color="info.light">
          Горячие клавиши: A - одобрить, D - отклонить, R - вернуть на доработку, Alt+←/→ -
          навигация
        </Typography>
      </Box>

      {/* ИСПРАВЛЕННЫЙ Grid - новый синтаксис v5 */}
      <Grid container spacing={2}>
        {/* Левая колонка - основная информация */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Галерея изображений */}

          <ImageGallery images={ad.images} title={ad.title}></ImageGallery>
          {/* Заголовок и статус */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <Stack
                  direction="row"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{ height: 'fit-content' }}
                >
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {ad.category}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Создано {formatDate(ad.createdAt)}
                  </Typography>
                </Stack>
                <Chip label={getStatusLabel(ad.status)} color={getStatusColor(ad.status)} />
              </Stack>
            </CardContent>
          </Card>

          {/* Полное описание */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Полное описание
              </Typography>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {ad.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Характеристики */}
          {Object.keys(ad.characteristics).length > 0 && (
            <Card sx={{ mb: 2 }}>
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
        {/*   <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {ad.price.toLocaleString('ru-RU')} ₽
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 2, background: 'none', boxShadow: 'none' }}>
            <CardContent sx={{ p: 0, pb: '0px!important' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <CurrencyRuble sx={{ fontSize: '2rem', color: '#1976d2' }} />
                <Typography variant="h4" color="primary">
                  {ad.price.toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          {/* Информация о продавце */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Информация о продавце
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography color="textSecondary">Имя:</Typography>
                <Typography variant="body1" gutterBottom>
                  {ad.seller.name}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography color="textSecondary">Рейтинг:</Typography>
                <Stack direction="row" spacing={0.5}>
                  <Typography sx={{ color: '#ffb121', fontWeight: 500 }}>
                    {ad.seller.rating}{' '}
                  </Typography>
                  <StarIcon sx={{ color: '#ffb121' }} />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography color="textSecondary">Объявлений:</Typography>
                <Typography variant="body1" gutterBottom>
                  {ad.seller.totalAds}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography color="textSecondary">На сайте:</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(ad.seller.registeredAt).toLocaleDateString('ru-RU')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* История модерации */}
          <Card sx={{ mb: 2 }}>
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
                      <Typography variant="subtitle2" color="primary">
                        {action.moderatorName}
                      </Typography>
                      <Chip
                        variant="outlined"
                        label={getActionLabel(action.action)}
                        color={getStatusColor(
                          action.action === 'approved'
                            ? 'approved'
                            : action.action === 'rejected'
                            ? 'rejected'
                            : 'pending',
                        )}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(action.timestamp)}
                    </Typography>
                    {action.reason && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
                <Tooltip title="Горячая клавиша: A">
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Check />}
                    onClick={handleApprove}
                    fullWidth
                    disabled={ad.status === 'approved'}
                  >
                    Одобрить
                  </Button>
                </Tooltip>

                <Tooltip title="Горячая клавиша: D">
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Close />}
                    onClick={() => setRejectDialogOpen(true)}
                    fullWidth
                    disabled={ad.status === 'rejected'}
                  >
                    Отклонить
                  </Button>
                </Tooltip>

                <Tooltip title="Горячая клавиша: R">
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() => setChangesDialogOpen(true)}
                    fullWidth
                  >
                    Вернуть на доработку
                  </Button>
                </Tooltip>
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
