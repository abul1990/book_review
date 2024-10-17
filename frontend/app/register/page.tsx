'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  Link,
} from '@mui/material';
import { userStore } from '@/app/stores/userStore';
import { User } from '../models/types';
import { useRouter } from 'next/navigation';

const RegistrationPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      role: '',
    };

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      newErrors.name = 'Name can only contain alphabets.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.password) {
      newErrors.password = 'Password required';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const handleRegister = async () => {
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }

    try {
      const withRole = {...formData, role: 'user'}
      const success = await userStore.registerUser(withRole);
      if (success) {
        alert('User registered successfully!');
        router.push('/login');
      } else {
        alert(userStore.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
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
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              label="Name"
              name="name"
              fullWidth
              onChange={handleChange}
              value={formData.name}
              size="small"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Email"
              name="email"
              fullWidth
              onChange={handleChange}
              value={formData.email}
              size="small"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Password"
              name="password"
              type="password"
              fullWidth
              onChange={handleChange}
              value={formData.password}
              size="small"
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleRegister}>
              Register
            </Button>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="body2" color="textPrimary">
              {'Have an account? '}
              <Link href="/login" underline="hover" color="primary">
                Login
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegistrationPage;
