'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { reviewStore } from '../stores/reviewStore';
import { CircularProgress, Box, Typography } from '@mui/material';
import { userStore } from '../stores/userStore';

const ReviewsPage = observer(() => {
  useEffect(() => {
    const fetchReviews = async () => {
      if (userStore.loggedInUser?.id) {
        await reviewStore.fetchReviewsByUser(userStore.loggedInUser.id);
      }
    };

    fetchReviews();
  }, [userStore.loggedInUser?.id]);

  if (reviewStore.loading) {
    return <CircularProgress />;
  }


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Book Reviews
      </Typography>
      {reviewStore.reviews.length === 0 ? (
        <Typography>No reviews available.</Typography>
      ) : (
        reviewStore.reviews.map((review) => (
          <Box key={review.id} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
            <Typography variant="h6">{review.bookId}</Typography>
            <Typography variant="body1">{review.comment}</Typography>
            <Typography variant="body2" color="textSecondary">
              - {review.userId}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
});

export default ReviewsPage;
