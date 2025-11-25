import React, { useState } from 'react';
import { Box, IconButton, Card, CardContent, Typography, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight, ZoomIn } from '@mui/icons-material';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(true);

  if (!images || images.length === 0) {
    return (
      <Card>
        <CardContent sx={{ padding: 0 }}>
          {/*  <Typography variant="h6" gutterBottom>
            Изображения
          </Typography> */}
          <Box
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">Изображения отсутствуют</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleZoom = () => {
    setZoom(!zoom);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ padding: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 4 }} gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          {/* <Typography variant="h6" gutterBottom>
            Изображения
          </Typography> */}
          <Chip
            label={`${currentIndex + 1} / ${images.length}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Основное изображение с навигацией */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.50',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: zoom ? 'zoom-out' : 'zoom-in',
              position: 'relative',
            }}
            onClick={toggleZoom}
          >
            <img
              src={images[currentIndex] || '/placeholder-image.jpg'}
              alt={`${title} ${currentIndex + 1}`}
              style={{
                width: zoom ? '100%' : 'auto',
                height: zoom ? '100%' : 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: zoom ? 'contain' : 'cover',
                transition: 'all 0.3s ease',
              }}
            />

            {/* Кнопка увеличения */}
            {!zoom && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
                onClick={e => {
                  e.stopPropagation();
                  toggleZoom();
                }}
              >
                <ZoomIn />
              </IconButton>
            )}
          </Box>

          {/* Стрелки навигации */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Box>

        {/* Миниатюры */}
        {images.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: 80,
                  height: 60,
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentIndex === index ? 2 : 1,
                  borderColor: currentIndex === index ? 'primary.main' : 'grey.300',
                  opacity: currentIndex === index ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    borderColor: 'primary.light',
                  },
                }}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image || '/placeholder-image.jpg'}
                  alt={`${title} ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
