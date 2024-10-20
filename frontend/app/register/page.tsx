'use client';

import React, { ChangeEvent, useState } from 'react';
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

  const [newUser, setNewUser] = useState<User>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 256 * 1024;

      if (!validTypes.includes(file.type)) {
        alert('Only JPG and PNG files are allowed.');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must not exceed 256 KB.');
        return;
      }
      setCoverFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      role: '',
    };

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(newUser.name)) {
      newErrors.name = 'Name can only contain alphabets.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!newUser.password) {
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
      const formData = new FormData();
      formData.append('name', newUser.name);
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('role', 'user');
      if (coverFile) {
        formData.append('userPic', coverFile);
      }
      const success = await userStore.registerUser(formData);
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
              value={newUser.name}
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
              value={newUser.email}
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
              value={newUser.password}
              size="small"
              error={!!errors.password}
              helperText={errors.password}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="body1">Profile Pic:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Button variant="contained" component="label">
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography
              variant="caption"
              color="secondary"
              sx={{ fontSize: 10 }}
            >
              Allowed types: JPG, PNG. Max size: 256 KB.
            </Typography>
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
