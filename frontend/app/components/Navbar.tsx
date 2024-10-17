'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Switch,
  Box,
  Link,
  useTheme,
} from '@mui/material';
import {
  DarkMode,
  Home,
  LightMode,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useThemeContext } from './CustomThemeProvider';
import { userStore } from '../stores/userStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

const Navbar = observer(() => {
  const isAdmin = userStore.loggedInUser?.role === 'admin';
  const isUserLoggedIn = !!userStore.loggedInUser;
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode, toggleTheme } = useThemeContext();

  const [selectedTab, setSelectedTab] = useState('');
  const menuColor = darkMode ? 'primary' : 'secondary';

  useEffect(() => {
    if (pathname.startsWith('/books')) {
      setSelectedTab('books');
    } else if (pathname === '/reviews') {
      setSelectedTab('reviews');
    } else if (isAdmin && pathname === '/admin/books') {
      setSelectedTab('manage');
    } else {
      setSelectedTab('');
    }
  }, [pathname, isAdmin]);

  const handleLogout = () => {
    userStore.logout();
    router.push('/login');
  };

  const handleNavigation = (path: string, tab: string) => {
    router.push(path);
    setSelectedTab(tab);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <Home onClick={() => handleNavigation('/', '')} />
        </IconButton>

        <Typography variant="h6" sx={{ mr: 4 }}>
          Book Review App
        </Typography>

        {isUserLoggedIn && (
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Button
              color={selectedTab === 'books' ? menuColor : 'inherit'}
              onClick={() => handleNavigation('/books', 'books')}
            >
              Books
            </Button>

            <Button
              color={selectedTab === 'reviews' ? menuColor : 'inherit'}
              onClick={() => handleNavigation('/reviews', 'reviews')}
            >
              Reviews
            </Button>

            {isAdmin && (
              <Button
                color={selectedTab === 'manage' ? menuColor : 'inherit'}
                onClick={() => handleNavigation('/admin/books', 'manage')}
              >
                Manage
              </Button>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {isUserLoggedIn && (
            <Link
              color="inherit"
              onClick={handleLogout}
              underline="hover"
              sx={{ cursor: 'pointer' }}
            >
              Logout
            </Link>
          )}
          <IconButton onClick={toggleTheme} color="inherit">
            {darkMode ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Navbar;
