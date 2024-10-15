'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
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
    role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const success = await userStore.registerUser(formData);
      if (success) {
        alert('User registered successfully!');
        router.push('/login');
      } else {
        alert(userStore.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error("Registration error:", error);
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
              label="Name"
              name="name"
              fullWidth
              onChange={handleChange}
              value={formData.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              onChange={handleChange}
              value={formData.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              onChange={handleChange}
              value={formData.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Role"
              name="role"
              fullWidth
              onChange={handleChange}
              value={formData.role}
            />
          </Grid>
          <Grid item alignItems={'center'}>
            <Button variant="contained" onClick={handleRegister}>
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegistrationPage;
