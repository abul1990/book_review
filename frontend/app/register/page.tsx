'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useTheme,
  SelectChangeEvent,
  Link,
} from '@mui/material';
import { userStore } from '@/app/stores/userStore';
import { Role, User } from '../models/types';
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

  const handleRoleChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, role: event.target.value as string });
  };

  const handleRegister = async () => {
    const isFormValid = Object.values(formData).every(field => field.trim() !== '');
  
    if (!isFormValid) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
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
              label="Name"
              name="name"
              fullWidth
              onChange={handleChange}
              value={formData.name}
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              onChange={handleChange}
              value={formData.email}
              size='small'
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
              size='small'
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                label="Role"
                size='small'
              >
                {Object.values(Role).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleRegister}>
              Register
            </Button>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="body2" color="textPrimary">
              {"Have an account? "}
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
