import React from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
  Box
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const items = [];

    // Add home
    items.push({
      label: 'Home',
      path: '/',
      icon: HomeIcon
    });

    // Build breadcrumb items
    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      // Convert path to readable label
      const label = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        label,
        path: currentPath,
        icon: null
      });
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          if (isLast) {
            return (
              <Typography 
                key={item.path} 
                color="text.primary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {item.icon && <item.icon sx={{ mr: 0.5, fontSize: 16 }} />}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.path}
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {item.icon && <item.icon sx={{ mr: 0.5, fontSize: 16 }} />}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

export default Breadcrumb;
