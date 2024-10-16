// app/page.tsx
'use client';
import { Container, Typography, Button } from '@mui/material';

export default function HomePage() {

  return (
    <Container sx={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Book Reviews
      </Typography>
      <Typography variant="body1">
        {/* The current theme is <strong>{darkMode ? 'Dark' : 'Light'}</strong>. */}
      </Typography>
      <Button variant="contained" sx={{ marginTop: 2 }}>
        Explore Books
      </Button>
    </Container>
  );
}
