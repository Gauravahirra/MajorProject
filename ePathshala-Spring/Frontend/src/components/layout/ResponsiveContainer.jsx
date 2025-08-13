import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { layoutOptimization, layoutHelpers } from '../../utils/responsive';

const ResponsiveContainer = ({
  children,
  variant = 'content', // 'content', 'card', 'form', 'table', 'sidebar', 'navbar'
  maxWidth = 'auto',
  padding = 'auto',
  margin = 'auto',
  overflow = 'auto',
  height = 'auto',
  minHeight = 'auto',
  position = 'relative',
  zIndex = 'auto',
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'content':
        return {
          ...layoutOptimization.contentContainer,
          ...layoutHelpers.responsiveContainer,
          minHeight: 'calc(100vh - 200px)', // Account for navbar and footer
        };
      
      case 'card':
        return {
          ...layoutOptimization.cardSpacing,
          ...layoutHelpers.preventOverlap,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: 'background.paper',
          boxShadow: theme.shadows[1],
        };
      
      case 'form':
        return {
          ...layoutOptimization.formSpacing,
          ...layoutHelpers.responsiveContainer,
          maxWidth: '600px',
          mx: 'auto',
        };
      
      case 'table':
        return {
          ...layoutOptimization.tableSpacing,
          ...layoutHelpers.scrollableContent,
          overflowX: 'auto',
        };
      
      case 'sidebar':
        return {
          ...layoutOptimization.sidebarSpacing,
          ...layoutHelpers.fixedPosition,
          zIndex: layoutOptimization.zIndexStack.drawer,
        };
      
      case 'navbar':
        return {
          ...layoutOptimization.navbarSpacing,
          ...layoutHelpers.fixedPosition,
          zIndex: layoutOptimization.zIndexStack.appBar,
        };
      
      default:
        return layoutHelpers.responsiveContainer;
    }
  };

  // Get responsive values
  const getResponsiveValue = (value) => {
    if (value === 'auto') {
      return getVariantStyles();
    }
    
    if (typeof value === 'object') {
      return {
        xs: value.xs || value,
        sm: value.sm || value.xs || value,
        md: value.md || value.sm || value.xs || value,
        lg: value.lg || value.md || value.sm || value.xs || value,
        xl: value.xl || value.lg || value.md || value.sm || value.xs || value,
      };
    }
    
    return value;
  };

  // Calculate responsive maxWidth
  const getMaxWidth = () => {
    if (maxWidth === 'auto') {
      return layoutOptimization.contentContainer.maxWidth;
    }
    return getResponsiveValue(maxWidth);
  };

  // Calculate responsive padding
  const getPadding = () => {
    if (padding === 'auto') {
      return layoutOptimization.contentContainer.padding;
    }
    return getResponsiveValue(padding);
  };

  // Calculate responsive margin
  const getMargin = () => {
    if (margin === 'auto') {
      return layoutOptimization.contentContainer.margin;
    }
    return getResponsiveValue(margin);
  };

  // Calculate responsive height
  const getHeight = () => {
    if (height === 'auto') {
      return 'auto';
    }
    return getResponsiveValue(height);
  };

  // Calculate responsive minHeight
  const getMinHeight = () => {
    if (minHeight === 'auto') {
      return variant === 'content' ? 'calc(100vh - 200px)' : 'auto';
    }
    return getResponsiveValue(minHeight);
  };

  // Calculate responsive zIndex
  const getZIndex = () => {
    if (zIndex === 'auto') {
      return variant === 'navbar' ? layoutOptimization.zIndexStack.appBar :
             variant === 'sidebar' ? layoutOptimization.zIndexStack.drawer :
             variant === 'modal' ? layoutOptimization.zIndexStack.modal :
             'auto';
    }
    return zIndex;
  };

  // Calculate responsive position
  const getPosition = () => {
    if (position === 'auto') {
      return variant === 'navbar' || variant === 'sidebar' ? 'fixed' : 'relative';
    }
    return position;
  };

  // Calculate responsive overflow
  const getOverflow = () => {
    if (overflow === 'auto') {
      return variant === 'table' ? 'auto' : 'hidden';
    }
    return overflow;
  };

  const containerStyles = {
    // Base styles
    ...getVariantStyles(),
    
    // Responsive properties
    maxWidth: getMaxWidth(),
    p: getPadding(),
    m: getMargin(),
    height: getHeight(),
    minHeight: getMinHeight(),
    position: getPosition(),
    zIndex: getZIndex(),
    overflow: getOverflow(),
    
    // Prevent overlapping
    ...layoutHelpers.preventOverlap,
    
    // Responsive adjustments
    ...(isMobile && {
      px: 2,
      py: 2,
      mx: 0,
      my: 1,
    }),
    
    ...(isTablet && {
      px: 3,
      py: 3,
      mx: 1,
      my: 2,
    }),
    
    // Custom styles
    ...sx,
  };

  return (
    <Box
      sx={containerStyles}
      {...props}
    >
      {children}
    </Box>
  );
};

export default React.memo(ResponsiveContainer); 