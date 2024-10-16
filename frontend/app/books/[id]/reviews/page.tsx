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
} from '@mui/material';
import { reviewStore } from '@/app/stores/reviewStore';
import { bookStore } from '@/app/stores/bookStore';
import RatingBars from '@/app/components/RatingBars';
import ReviewCard from '@/app/components/ReviewCard';
import { Review } from '@/app/models/types';
import { useRatingDistribution } from '@/app/hooks/useRatingDistribution';
import { userStore } from '@/app/stores/userStore';

const getInitialReviewState = (bookId: string): Review => ({
  comment: '',
  rating: 0,
  bookId,
  userId: userStore.loggedInUser?.id ?? '',
});

//@ts-ignore
const StarRating = ({ rating, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          onClick={() => onChange(star)}
          sx={{
            color: star <= rating ? 'gold' : 'gray',
            fontSize: 24,
          }}
        >
          ★
        </Button>
      ))}
    </Box>
  );
};

const ReviewsPage = observer(() => {
  const { selectedBook } = bookStore;
  const reviews = reviewStore.reviews;

  useEffect(() => {
    if (selectedBook?.id) 
      reviewStore.fetchReviewsByBook(selectedBook.id);
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
    return <Typography variant="h6">Please select a book to view its reviews.</Typography>;
  }

  if (reviewStore.loading) {
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={4}>
          <img
            src={selectedBook.coverUrl}
            alt={selectedBook.title}
            style={{ width: '100%', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h4" gutterBottom>{selectedBook.title}</Typography>
          <Typography variant="h6" gutterBottom>by {selectedBook.author}</Typography>
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

      <StarRating
        rating={newReview.rating}
        onChange={(rating: number) => setNewReview({ ...newReview, rating })}
      />

      <TextField
        label="Share your thoughts with others"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={newReview.comment}
        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
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
            isUserReview={review.userId === newReview.userId}
            onEdit={(id) => console.log('Edit review:', id)}
            onDelete={(id) => console.log('Delete review:', id)}
          />
        </Grid>
      ))}
    </Grid>
    </Box>
  );
});

export default ReviewsPage;
