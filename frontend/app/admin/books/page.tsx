'use client';

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { bookStore } from '@/app/stores/bookStore';
import { Book, defaultBookCoverUrl } from '@/app/models/types';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '@/app/utils/date-formatter';

const BookManagementPage = observer(() => {
  const [newBook, setNewBook] = useState<Book>({
    id: '',
    title: '',
    author: '',
    coverUrl: '',
    publicationDate: dayjs(new Date()).format('YYYY-MM-DD'),
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    bookStore.fetchBooks();
  }, []);

  const handleAddUpdateBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.publicationDate) {
      alert('Please fill out all required fields: Title, Author, and Publication Date.');
      return;
    }

    if (newBook.id) {
      await bookStore.updateBook(newBook);
    } else {
      await bookStore.addBook(newBook);
    }
    clearForm();
    setModalOpen(false);
  };

  const clearForm = () => {
    setNewBook({
      id: '',
      title: '',
      author: '',
      coverUrl: '',
      publicationDate: dayjs(new Date()).format('YYYY-MM-DD'),
    });
  };

  const handleEditBook = (book: Book) => {
    setNewBook(book);
    setModalOpen(true);
  };

  if (bookStore.loading)
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Books
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          clearForm();
          setModalOpen(true);
        }}
        sx={{ marginBottom: 2 }}
      >
        Add New Book
      </Button>

      <Grid container spacing={2}>
        {bookStore.books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ height: 160, display: 'flex', flexDirection: 'row', padding: 1 }}>
              <Box
                component="img"
                src={book.coverUrl || defaultBookCoverUrl}
                alt={book.title}
                sx={{
                  width: '120px',
                  height: 'auto',
                  borderRadius: '4px',
                  marginRight: '16px',
                  objectFit: 'cover'
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1">{book.author}</Typography>
                <Typography variant="body2">{`Published on: ${formatDate(book.publicationDate)}`}</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 2,
                  }}
                >
                  <IconButton onClick={() => handleEditBook(book)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => bookStore.deleteBook(book.id ?? '')}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{newBook.id ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Author"
                variant="outlined"
                fullWidth
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Cover Url"
                variant="outlined"
                fullWidth
                value={newBook.coverUrl}
                onChange={(e) =>
                  setNewBook({ ...newBook, coverUrl: e.target.value })
                }
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body1">Publication Date:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <DatePicker
                    value={dayjs(newBook.publicationDate)}
                    maxDate={dayjs(new Date())}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = dayjs(date).format('YYYY-MM-DD');
                        setNewBook({
                          ...newBook,
                          publicationDate: formattedDate,
                        });
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUpdateBook}>
            {newBook.id ? 'Update Book' : 'Add Book'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default BookManagementPage;
