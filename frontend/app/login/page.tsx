'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { userStore } from '@/app/stores/userStore';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };

    if (!credentials.email) {
      newErrors.email = 'Email required';
    }

    if (!credentials.password) {
      newErrors.password = 'Password required';
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.email;
  };

  const handleLogin = async () => {
    const isValid = validateForm();
    if(!isValid) {
      return;
    }
    const success = await userStore.login(credentials);
    if (success) {
      router.push('/books');
    } else {
      alert('Invalid credentials!');
    }
  };
  

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? '#1E1E1E'
              : theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 3,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <Grid container spacing={2}>
          {['email', 'password'].map((field) => (
            <Grid item xs={12} key={field}>
              <TextField
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                fullWidth
                onChange={handleChange}
                value={credentials[field as keyof typeof credentials]}
                size="small"
                error={field === 'email' ? !!errors.email : !!errors.password}
                helperText={field === 'email' ? errors.email : errors.password}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleLogin}>
              Login
            </Button>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="body2" color="textPrimary">
              {"Don't have an account? "}
              <Link href="/register" underline="hover" color="primary">
                Sign Up
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginPage;
