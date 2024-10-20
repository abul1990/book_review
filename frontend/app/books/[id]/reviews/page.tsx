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
  Rating,
  CardMedia,
} from '@mui/material';
import { reviewStore } from '@/app/stores/reviewStore';
import { bookStore } from '@/app/stores/bookStore';
import RatingBars from '@/app/components/RatingBars';
import ReviewCard from '@/app/components/ReviewCard';
import { Review } from '@/app/models/types';
import { userStore } from '@/app/stores/userStore';
import { useAuth } from '@/app/hooks/useAuth';
import { formatDate } from '@/app/utils/date-formatter';
import SortReviews from '@/app/components/SortReviews';
import { useRouter } from 'next/navigation';

const getInitialReviewState = (bookId: string): Review => ({
  comment: '',
  rating: 0,
  bookId,
  userId: userStore.loggedInUser?.id ?? '',
});

const ReviewsPage = observer(() => {
  useAuth();
  const router = useRouter();
  const { selectedBook, ratingDistribution } = bookStore;
  const { loggedInUser } = userStore;
  const reviews = reviewStore.reviews;

  const [newReview, setNewReview] = useState<Review>(
    getInitialReviewState(selectedBook?.id || '')
  );

  const userHasReviewed = reviews.some(
    (review) => review.userId === loggedInUser?.id
  );

  useEffect(() => {
    if (selectedBook?.id) {
      reviewStore.fetchReviewsByBook(selectedBook.id);
      bookStore.getDistribution(selectedBook.id);
    }
  }, [selectedBook]);

  const handleAddReview = async () => {
    if (newReview.comment.length > 500) {
      alert('Please share your thoughts in 500 chars');
      return;
    }
    await reviewStore.addReview(newReview);
    if (selectedBook?.id) {
      bookStore.refreshSelectedBook(selectedBook.id);
      setNewReview(getInitialReviewState(selectedBook.id));
    }
  };

  if (!selectedBook) {
    router.push('/books');
    return;
  }

  if (reviewStore.loading) {
    return <CircularProgress sx={{ margin: 'auto', display: 'block' }} />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} alignItems="stretch" sx={{ marginBottom: 4 }}>
        <Grid item xs={12} md={6}>
          <Grid
            container
            spacing={2}
            alignItems="start"
            sx={{ height: '100%' }}
          >
            <Grid item xs={12} sm={4}>
              <CardMedia
                component="img"
                src={
                  selectedBook.coverUrl
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedBook.coverUrl}`
                    : '/images/default-book-cover.png'
                }
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
                size="large"
                sx={{ color: '#FFD700' }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Ratings Distribution
          </Typography>
          <RatingBars distribution={ratingDistribution} />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        <SortReviews />
      </Box>

      {!userHasReviewed && (
        <>
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
              setNewReview({ ...newReview, comment: e.target.value?.trim() })
            }
            sx={{ marginBottom: 2 }}
            inputProps={{ maxLength: 500 }}
          />
          <Button
            variant="contained"
            disabled={!newReview.rating}
            onClick={handleAddReview}
          >
            Post Review
          </Button>
        </>
      )}

      <Grid container spacing={2} mt={2}>
        {reviews.map((review) => (
          <Grid item xs={12} key={review.id}>
            <ReviewCard
              review={review}
              isUserReview={review.userId === loggedInUser?.id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default ReviewsPage;
