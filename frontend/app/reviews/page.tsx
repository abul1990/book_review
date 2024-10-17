'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { reviewStore } from '../stores/reviewStore';
import { userStore } from '../stores/userStore';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Save, Cancel, Search } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { defaultBookCoverUrl, Review } from '../models/types';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/date-formatter';

const ReviewsPage = observer(() => {
  useAuth();
  const loggedInUser = userStore.loggedInUser;
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editableReview, setEditableReview] = useState<Partial<Review>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchReviews = async () => {
      if (loggedInUser?.id) {
        await reviewStore.fetchReviewsByUser(loggedInUser.id);
      }
    };
    fetchReviews();
  }, [loggedInUser]);

  const handleEdit = (review: Review) => {
    setEditMode({ [review.id!]: true });
    setEditableReview({ rating: review.rating, comment: review.comment });
  };

  const handleDelete = async (reviewId: string) => {
    await reviewStore.deleteReview(reviewId);
  };

  const handleSave = async (reviewId: string) => {
    await reviewStore.updateReview(reviewId, editableReview as Review);
    setEditMode({ [reviewId]: false });
  };

  const handleCancel = (reviewId: string) => {
    setEditMode({ [reviewId]: false });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredReviews = reviewStore.reviews.filter((review: Review) => {
    const { book, rating } = review;
    return (
      book!.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book!.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${rating}` === searchQuery
    );
  });

  if (reviewStore.loading) {
    return <CircularProgress />;
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {loggedInUser?.name}, Your Book Reviews
      </Typography>

      <TextField
        fullWidth
        label="Search by book Title, Author, or Rating"
        variant="outlined"
        value={searchQuery}
        size='small'
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: 4 }}
      />

      {filteredReviews.length === 0 ? (
        <Typography variant="body1">
          No reviews found matching your search criteria.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredReviews.map((review: Review) => (
            <Grid item xs={12} key={review.id!}>
              <Card
                variant="outlined"
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: 2,
                  height: 'auto',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 160, marginRight: 2 }}
                  image={review.book?.coverUrl || defaultBookCoverUrl}
                  alt="Book cover"
                />
                <Box sx={{ flex: 1 }}>
                  <CardContent sx={{ paddingBottom: 1 }}>
                    <Typography variant="h6">{review.book?.title}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      gutterBottom
                    >
                      by {review.book?.author}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Reviewed On {formatDate(review.createdAt!)}
                    </Typography>


                    {editMode[review.id!] ? (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ marginTop: 1 }}
                      >
                        <Rating
                          name={`edit-rating-${review.id!}`}
                          value={editableReview.rating || 0}
                          precision={0.5}
                          onChange={(_, newValue) =>
                            setEditableReview((prev) => ({
                              ...prev,
                              rating: newValue!,
                            }))
                          }
                        />
                        <Typography variant="body2" color="textSecondary">
                          {editableReview.rating}/5
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ marginTop: 1 }}
                      >
                        <Rating
                          name={`rating-${review.id!}`}
                          value={review.rating || 0}
                          precision={0.5}
                          readOnly
                        />
                        <Typography variant="body2" color="textSecondary">
                          {review.rating ? `${review.rating}/5` : 'No rating'}
                        </Typography>
                      </Stack>
                    )}
                  </CardContent>

                  {editMode[review.id!] ? (
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      value={editableReview.comment || ''}
                      onChange={(e) =>
                        setEditableReview((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      sx={{ marginTop: 2 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      {review.comment}
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  {editMode[review.id!] ? (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleSave(review.id!)}
                        aria-label="save"
                      >
                        <Save />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleCancel(review.id!)}
                        aria-label="cancel"
                      >
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(review)}
                        size="small"
                        sx={{ marginRight: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(review.id!)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </>
                  )}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
});

export default ReviewsPage;
