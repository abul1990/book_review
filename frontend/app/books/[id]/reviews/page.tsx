'use client';

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Rating,
} from '@mui/material';
import { reviewStore } from '@/app/stores/reviewStore';
import { bookStore } from '@/app/stores/bookStore';
import RatingBars from '@/app/components/RatingBars';
import ReviewCard from '@/app/components/ReviewCard';
import { defaultBookCoverUrl, Review } from '@/app/models/types';
import { useRatingDistribution } from '@/app/hooks/useRatingDistribution';
import { userStore } from '@/app/stores/userStore';
import { useAuth } from '@/app/hooks/useAuth';
import { formatDate } from '@/app/utils/date-formatter';

const getInitialReviewState = (bookId: string): Review => ({
  comment: '',
  rating: 0,
  bookId,
  userId: userStore.loggedInUser?.id ?? '',
});

const ReviewsPage = observer(() => {
  useAuth();
  const { selectedBook } = bookStore;
  const reviews = reviewStore.reviews;

  useEffect(() => {
    if (selectedBook?.id) reviewStore.fetchReviewsByBook(selectedBook.id);
  }, [selectedBook]);

  const [newReview, setNewReview] = useState<Review>(
    getInitialReviewState(selectedBook?.id || '')
  );

  const { ratingDistribution, loading: distributionLoading } =
    useRatingDistribution(selectedBook?.id ?? '');

  const handleAddReview = async () => {
    await reviewStore.addReview(newReview);
    setNewReview(getInitialReviewState(selectedBook?.id || ''));
  };

  if (!selectedBook) {
    return (
      <Typography variant="h6">
        Please select a book to view its reviews.
      </Typography>
    );
  }

  if (reviewStore.loading) {
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={4}>
          <Box
            component="img"
            src={selectedBook.coverUrl || defaultBookCoverUrl}
            alt={selectedBook.title}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: '4px',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h4" gutterBottom>
            {selectedBook.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            by {selectedBook.author}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Published On: {formatDate(selectedBook.publicationDate)}
          </Typography>
          <Rating
            value={selectedBook.rating}
            precision={0.5}
            readOnly
            size='large'
            sx={{ color: '#FFD700' }}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Customer Reviews
      </Typography>

      {distributionLoading ? (
        <CircularProgress />
      ) : (
        <RatingBars distribution={ratingDistribution} />
      )}

      <Divider sx={{ margin: '12px 4px' }} />

      <Typography variant="h6" gutterBottom>
        Rate & Review
      </Typography>

      <Rating
        name="rating"
        value={newReview.rating || 0}
        precision={0.5}
        onChange={(_, newValue) => {
          if (newValue !== null) {
            setNewReview({ ...newReview, rating: newValue });
          }
        }}
        size="large"
      />

      <TextField
        label="Share your thoughts with others"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={newReview.comment}
        onChange={(e) =>
          setNewReview({ ...newReview, comment: e.target.value })
        }
        sx={{ marginBottom: 2 }}
      />

      <Button variant="contained" onClick={handleAddReview}>
        Post Review
      </Button>

      <Grid container spacing={2} mt={2}>
        {reviews.map((review) => (
          <Grid item xs={12} key={review.id}>
            <ReviewCard
              review={review}
              isUserReview={review.userId === userStore.loggedInUser?.id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default ReviewsPage;
