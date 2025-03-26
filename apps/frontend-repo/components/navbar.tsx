'use client';

import {
  AppBar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '../context/authProvider';

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await logout();
      router.push('/auth/signin');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EBuddy
          </Typography>
          <Button color="inherit" onClick={handleClick}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
