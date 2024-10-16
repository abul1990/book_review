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
} from '@mui/material';
import { bookStore } from '@/app/stores/bookStore';
import { Book } from '@/app/models/types';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BookManagementPage = observer(() => {
  const [newBook, setNewBook] = useState<Book>({
    id: '',
    title: '',
    author: '',
    coverUrl: '',
    publicationDate: dayjs(new Date()).format('YYYY-MM-DD'),
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    bookStore.fetchBooks();
  }, []);

  const handleAddUpdateBook = async () => {
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = async () => {
    //     if(newBook.id) {
    //         await bookStore.updateBook({ ...newBook, coverUrl: reader.result as string });
    //     } else {
    //         await bookStore.addBook({ ...newBook, coverUrl: reader.result as string });
    //     }
    //     clearForm();
    //   };
    //   reader.readAsDataURL(file);
    // } else {
    //   await bookStore.addBook(newBook);
    //   clearForm();
    // }

    if(newBook.id) {
        await bookStore.updateBook(newBook);
    } else {
        await bookStore.addBook(newBook);
    }
    clearForm();
  };

  const clearForm = () => {
    setNewBook({
      id: '',
      title: '',
      author: '',
      coverUrl: '',
      publicationDate: dayjs(new Date()).format('YYYY-MM-DD'),
    });
    setFile(null);
  };

  const handleEditBook = (book: Book) => {
    setNewBook(book);
  };

  if (bookStore.loading) return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Books
      </Typography>

      <Grid container spacing={6} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Author"
            variant="outlined"
            fullWidth
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            value={dayjs(newBook.publicationDate)}
            onChange={(date) => {
              if (date) {
                const formattedDate = dayjs(date).format('YYYY-MM-DD');
                setNewBook({ ...newBook, publicationDate: formattedDate });
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Cover Url"
            variant="outlined"
            fullWidth
            value={newBook.coverUrl}
            onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })}         
        />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleAddUpdateBook}>
            {newBook.id ? 'Update Book' : 'Add Book'}
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Current Books
      </Typography>

      <Grid container spacing={2}>
        {bookStore.books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ display: 'flex', flexDirection: 'row', padding: 1 }}>
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{ width: '150px', height: 'auto', borderRadius: '4px', marginRight: '16px' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1">{book.author}</Typography>
                <Typography variant="body2">{`Published on: ${book.publicationDate}`}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                  <IconButton onClick={() => handleEditBook(book)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => bookStore.deleteBook(book.id ?? '')} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default BookManagementPage;
