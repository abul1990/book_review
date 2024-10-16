'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Switch,
  Box,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useThemeContext } from './CustomThemeProvider';
import { userStore } from '../stores/userStore';
import Cookies from 'js-cookie';

const Navbar = () => {
  const isAdmin = userStore.loggedInUser?.role === 'admin';
  const isUserLoggedIn = !!userStore.loggedInUser;
  const router = useRouter();
  const { darkMode, toggleTheme } = useThemeContext();

  const handleLogout = () => {
    userStore.loggedInUser = null;
    Cookies.remove('loggedInUser');
    localStorage.clear();
    router.push('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mr: 4 }}>
          Book Review App
        </Typography>

        {isUserLoggedIn && (
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Button color="inherit" onClick={() => router.push('/books')}>
              Books
            </Button>

            <Button color="inherit" onClick={() => router.push('/reviews')}>
              Reviews
            </Button>

            {isAdmin && (
              <Button color="inherit" onClick={() => router.push('/admin/books')}>
                Manage
              </Button>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {isUserLoggedIn && (
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          )}
          <Switch checked={darkMode} onChange={toggleTheme} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
