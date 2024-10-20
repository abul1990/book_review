'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Rating,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { bookStore } from '../stores/bookStore';
import { Book } from '../models/types';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/date-formatter';
import { Search } from '@mui/icons-material';

const BooksPage = observer(() => {
  useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    bookStore.fetchBooks();
  }, []);

  const filteredBooks = searchQuery
    ? bookStore.searchBooks(searchQuery)
    : bookStore.books;

  const handleBookClick = (book: Book) => {
    bookStore.setSelectedBook(book);
    router.push(`/books/${book.id}/reviews`);
  };

  if (bookStore.loading)
    return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (bookStore.books.length === 0)
    return <Typography>No books found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <TextField
        label="Search by Title or Author"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3} marginTop={2}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
                position: 'relative',
              }}
              onClick={() => handleBookClick(book)}
              style={{ cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                sx={{ width: 100, height: 120, objectFit: 'cover' }}
                image={
                  book.coverUrl
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${book.coverUrl}`
                    : '/images/default-book-cover.png'
                }
                alt={`${book.title} cover`}
                onError={(e) => e.currentTarget.src = '/images/default-book-cover.png'}
              />

              <CardContent sx={{ flex: 1, marginLeft: 2 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Published On: {formatDate(book.publicationDate)}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Rating
                  value={book.rating}
                  precision={0.5}
                  readOnly
                  sx={{ color: '#FFD700' }}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default BooksPage;
