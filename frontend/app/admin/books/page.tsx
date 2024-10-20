'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
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
  CardMedia,
} from '@mui/material';
import { bookStore } from '@/app/stores/bookStore';
import { Book } from '@/app/models/types';
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
    publicationDate: dayjs(new Date()).format('YYYY-MM-DD'),
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    bookStore.fetchBooks();
  }, []);

  const handleAddUpdateBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.publicationDate) {
      alert(
        'Please fill out all required fields: Title, Author, and Publication Date.'
      );
      return;
    }
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('publicationDate', newBook.publicationDate);

    if (coverFile) {
      formData.append('cover', coverFile);
    }

    if (newBook.id) {
      formData.append('id', newBook.id);
      await bookStore.updateBook(newBook.id, formData);
    } else {
      await bookStore.addBook(formData);
    }
    clearForm();
    setModalOpen(false);
    await bookStore.fetchBooks();
  };

  const clearForm = () => {
    setNewBook({
      id: '',
      title: '',
      author: '',
      coverUrl: '',
      publicationDate: dayjs(new Date()).format('YYYY-MM-DD'),
    });
    setCoverFile(null);
  };

  const handleEditBook = (book: Book) => {
    setNewBook(book);
    setModalOpen(true);
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
            <Card
              sx={{
                height: 160,
                display: 'flex',
                flexDirection: 'row',
                padding: 1,
              }}
            >
              <CardMedia
                component="img"
                src={
                  book.coverUrl
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${book.coverUrl}`
                    : '/images/default-book-cover.png'
                }
                alt={book.title}
                sx={{
                  width: '120px',
                  height: 'auto',
                  borderRadius: '4px',
                  marginRight: '16px',
                  objectFit: 'cover',
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1">{book.author}</Typography>
                <Typography variant="body2">{`Published on: ${formatDate(
                  book.publicationDate
                )}`}</Typography>
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
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="body1">Book Cover:</Typography>
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
