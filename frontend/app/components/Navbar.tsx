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
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mr: 4 }}>
          Book Review App
        </Typography>

        {isUserLoggedIn && (
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Button
              color={selectedTab === 'books' ? 'primary' : 'inherit'}
              onClick={() => handleNavigation('/books', 'books')}
            >
              Books
            </Button>

            <Button
              color={selectedTab === 'reviews' ? 'primary' : 'inherit'}
              onClick={() => handleNavigation('/reviews', 'reviews')}
            >
              Reviews
            </Button>

            {isAdmin && (
              <Button
                color={selectedTab === 'manage' ? 'primary' : 'inherit'}
                onClick={() => handleNavigation('/admin/books', 'manage')}
              >
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
});

export default Navbar;
