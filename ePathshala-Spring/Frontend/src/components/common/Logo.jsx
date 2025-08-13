import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Logo = ({ variant = 'default', size = 'medium', sx = {} }) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: '1.5rem', fontWeight: 600 };
      case 'large':
        return { fontSize: '2.5rem', fontWeight: 700 };
      default:
        return { fontSize: '2rem', fontWeight: 600 };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          color: theme.palette.primary.main,
          textDecoration: 'none',
        };
      case 'full':
        return {
          color: theme.palette.primary.main,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        };
      default:
        return {
          color: theme.palette.primary.main,
          textDecoration: 'none',
        };
    }
  };

  return (
    <Box
      component="div"
      sx={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...sx,
      }}
    >
      {variant === 'full' ? (
        <>
          <Typography
            component="span"
            sx={{
              fontWeight: 'bold',
              color: 'inherit',
            }}
          >
            ePathshala
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: '0.6em',
              color: 'text.secondary',
              fontWeight: 'normal',
            }}
          >
            Learning Platform
          </Typography>
        </>
      ) : (
        <Typography
          component="span"
          sx={{
            fontWeight: 'bold',
            color: 'inherit',
          }}
        >
          ePathshala
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
