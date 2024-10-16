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
  Input,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { bookStore } from '../stores/bookStore';
import { Book } from '../models/types';

const BooksPage = observer(() => {
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
  }

  if (bookStore.loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (bookStore.books.length === 0) return <Typography>No books found.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
    <Input
      placeholder="Search by Title or Author"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        height: '36px', 
        fontSize: '14px',
        padding: '4px 8px', 
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        marginBottom: 3,
        width: '100%'
      }}
    />

      <Grid container spacing={3}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
              }}
              onClick={() => handleBookClick(book)}
              style={{ cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                sx={{ width: 80, height: 120, objectFit: 'cover' }}
                image={book.coverUrl}
                alt={`${book.title} cover`}
              />

              <CardContent sx={{ flex: 1, marginLeft: 2 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Published: 
                </Typography>
              </CardContent>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginRight: 2,
                }}
              >
                <Rating
                  value={book.averageRating}
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
