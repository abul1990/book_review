// app/page.tsx
'use client';
import { Container, Typography, Button, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function HomePage() {
  const router = useRouter();
  const isLoggedIn = !!Cookies.get('access_token'); // Check if user is logged in

  return (
    <Container sx={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Book Reviews
      </Typography>

      {isLoggedIn ? (
        <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => router.push('/books')}>
          Explore Books
        </Button>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          <MuiLink href="/login" color="primary" underline="hover">
            Login
          </MuiLink>
          {' to explore books'}
        </Typography>
      )}
    </Container>
  );
}
