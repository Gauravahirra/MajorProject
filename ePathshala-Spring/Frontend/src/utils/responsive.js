import { useMediaQuery, useTheme } from '@mui/material';

// Responsive breakpoints
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Layout optimization constants
export const layoutOptimization = {
  // Navbar spacing
  navbarSpacing: {
    height: {
      xs: '56px',
      sm: '64px',
      md: '72px',
      lg: '80px',
      xl: '88px'
    },
    padding: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5
    }
  },

  // Sidebar spacing
  sidebarSpacing: {
    collapsedWidth: 60,
    expandedWidth: 280,
    transition: 'width 0.3s ease-in-out'
  },

  // Content container
  contentContainer: {
    padding: {
      xs: 2,
      sm: 3,
      md: 4
    },
    margin: {
      xs: 0,
      sm: 0,
      md: 'auto'
    },
    maxWidth: {
      xs: '100%',
      sm: '100%',
      md: '1200px',
      lg: '1400px',
      xl: '1600px'
    }
  },

  // Z-index stack
  zIndexStack: {
    backdrop: 1200,
    drawer: 1300,
    appBar: 1400,
    modal: 1500,
    tooltip: 1600
  },

  // Overflow handling
  overflowHandling: {
    hidden: 'hidden',
    auto: 'auto',
    scroll: 'scroll'
  },

  // Text overflow
  textOverflow: {
    ellipsis: {
    overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  },

  // Responsive padding
  responsivePadding: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  },

  // Responsive margins
  responsiveMargins: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  },

  // Grid spacing
  gridSpacing: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  },

  // Card spacing
  cardSpacing: {
    padding: {
      xs: 2,
      sm: 3,
      md: 4
    },
    margin: {
      xs: 1,
      sm: 2,
      md: 3
    }
  },

  // Form spacing
  formSpacing: {
    padding: {
      xs: 2,
      sm: 3,
      md: 4
    },
    gap: {
      xs: 2,
      sm: 3,
      md: 4
    }
  },

  // Table spacing
  tableSpacing: {
    padding: {
      xs: 1,
      sm: 2,
      md: 3
    },
    cellPadding: {
      xs: 1,
      sm: 1.5,
      md: 2
    }
  }
};

// Responsive utilities
export const responsiveUtils = {
  // Get responsive value based on breakpoint
  getResponsiveValue: (values, theme) => {
    const breakpoints = theme.breakpoints.values;
    const currentBreakpoint = Object.keys(breakpoints).find(
      key => window.innerWidth >= breakpoints[key]
    ) || 'xs';
    
    return values[currentBreakpoint] || values.xs || values;
  },

  // Check if device is mobile
  isMobile: (theme) => useMediaQuery(theme.breakpoints.down('md')),

  // Check if device is tablet
  isTablet: (theme) => useMediaQuery(theme.breakpoints.between('md', 'lg')),

  // Check if device is desktop
  isDesktop: (theme) => useMediaQuery(theme.breakpoints.up('lg')),

  // Get optimal spacing for current breakpoint
  getSpacing: (theme, type = 'padding') => {
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    
    if (isMobile) return layoutOptimization[`${type}Spacing`].padding.xs;
    if (isTablet) return layoutOptimization[`${type}Spacing`].padding.sm;
    return layoutOptimization[`${type}Spacing`].padding.md;
  }
};

// Spacing utilities
export const spacing = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 5
};

// Typography utilities
export const typography = {
  h1: {
    xs: '1.5rem',
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
    xl: '3.5rem'
  },
  h2: {
    xs: '1.25rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '2.5rem',
    xl: '3rem'
  },
  h3: {
    xs: '1.125rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem'
  },
  body1: {
    xs: '0.875rem',
    sm: '1rem',
    md: '1.125rem',
    lg: '1.25rem',
    xl: '1.375rem'
  },
  body2: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem'
  }
};

// Text alignment utilities
export const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify'
};

// Button styles
export const buttonStyles = {
  primary: {
    backgroundColor: 'primary.main',
    color: 'white',
    '&:hover': {
      backgroundColor: 'primary.dark'
    }
  },
  secondary: {
    backgroundColor: 'secondary.main',
    color: 'white',
    '&:hover': {
      backgroundColor: 'secondary.dark'
    }
  }
};

// Container styles
export const containerStyles = {
  maxWidth: 'lg',
  mx: 'auto',
  px: { xs: 2, sm: 3, md: 4 }
};

// Grid configuration
export const gridConfig = {
  spacing: { xs: 2, sm: 3, md: 4 },
  columns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5
  }
};

// Card styles
export const cardStyles = {
  default: {
    padding: { xs: 2, sm: 3, md: 4 },
    borderRadius: 2,
    boxShadow: 1,
    '&:hover': {
      boxShadow: 3,
      transform: 'translateY(-2px)',
      transition: 'all 0.3s ease-in-out'
    }
  },
  elevated: {
    padding: { xs: 2, sm: 3, md: 4 },
    borderRadius: 2,
    boxShadow: 3,
    backgroundColor: 'background.paper',
    '&:hover': {
      boxShadow: 6,
      transform: 'translateY(-4px)',
      transition: 'all 0.3s ease-in-out'
    }
  },
  outlined: {
    padding: { xs: 2, sm: 3, md: 4 },
    borderRadius: 2,
    border: 1,
    borderColor: 'divider',
    backgroundColor: 'background.paper'
  },
  glass: {
    padding: { xs: 2, sm: 3, md: 4 },
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  }
};

// Custom hook for responsive design
export const useResponsive = () => {
  const theme = useTheme();
  
  return {
    isMobile: useMediaQuery(theme.breakpoints.down('md')),
    isTablet: useMediaQuery(theme.breakpoints.between('md', 'lg')),
    isDesktop: useMediaQuery(theme.breakpoints.up('lg')),
    isLargeScreen: useMediaQuery(theme.breakpoints.up('xl')),
    
    // Get responsive spacing
    getSpacing: (type = 'padding') => responsiveUtils.getSpacing(theme, type),
    
    // Get responsive typography
    getTypography: (variant) => typography[variant] || typography.body1,
    
    // Get responsive layout values
    getLayoutValue: (section, property) => {
      return layoutOptimization[section]?.[property] || {};
    }
  };
};

// Layout optimization helpers
export const layoutHelpers = {
  // Prevent overlapping
  preventOverlap: {
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    isolation: 'isolate'
  },

  // Ensure proper stacking
  properStacking: {
    position: 'relative',
    zIndex: 'auto'
  },

  // Responsive container
  responsiveContainer: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative'
  },

  // Fixed positioning
  fixedPosition: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1400
  },

  // Sticky positioning
  stickyPosition: {
    position: 'sticky',
    top: 0,
    zIndex: 1300
  },

  // Scrollable content
  scrollableContent: {
    overflow: 'auto',
    height: '100%',
    width: '100%'
  },

  // Prevent text overflow
  preventTextOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  // Responsive grid
  responsiveGrid: {
    display: 'grid',
    gap: { xs: 2, sm: 3, md: 4 },
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
      xl: 'repeat(5, 1fr)'
    }
  },

  // Responsive flexbox
  responsiveFlex: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 2, sm: 3, md: 4 },
    alignItems: { xs: 'stretch', md: 'center' },
    justifyContent: { xs: 'flex-start', md: 'space-between' }
  }
};

export default {
  breakpoints,
  layoutOptimization,
  responsiveUtils,
  spacing,
  typography,
  textAlign,
  buttonStyles,
  containerStyles,
  gridConfig,
  cardStyles,
  useResponsive,
  layoutHelpers
};
