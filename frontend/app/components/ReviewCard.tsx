import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  IconButton,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Review } from '../models/types';
import { useState } from 'react';
import { Cancel } from '@mui/icons-material';
import { reviewStore } from '../stores/reviewStore';

interface ReviewCardProps {
  review: Review;
  isUserReview: boolean;
}

export default function ReviewCard({ review, isUserReview }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt!).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editableReview, setEditableReview] = useState<Partial<Review>>({});

  const handleSave = async (reviewId: string) => {
    if(editableReview?.comment && editableReview?.comment?.length > 500) {
      alert('Please share your thoughts in 500 chars')
      return;
    }
    await reviewStore.updateReview(reviewId, editableReview as Review);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async (reviewId: string) => {
    await reviewStore.deleteReview(reviewId);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditableReview({ rating: review.rating, comment: review.comment });
  };

  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: 1,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            component="img"
            src={
              review.user?.coverPicUrl
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${review.user?.coverPicUrl}`
                : '/images/default-user.jpg'
            }
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '10px',
            }}
            onError={(e) => e.currentTarget.src = '/images/default-user.png'}
          />
          <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
            {review.user?.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isEditing ? (
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
          ) : (
            <Rating value={review.rating} readOnly precision={0.5} />
          )}

          {isUserReview && (
            <Box ml={1} display="flex">
              {isEditing ? (
                <>
                  <IconButton
                    aria-label="save"
                    onClick={() => handleSave(review.id!)}
                    size="small"
                    sx={{ marginRight: 1 }}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleCancel()}
                    aria-label="cancel"
                  >
                    <Cancel />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEdit()}
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
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Reviewed On {formattedDate}
        </Typography>

        {isEditing ? (
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={editableReview.comment || ''}
            onChange={(e) =>
              setEditableReview((prev) => ({
                ...prev,
                comment: e.target.value?.trim(),
              }))
            }
            sx={{ marginTop: 2 }}
            inputProps={{ maxLength: 500 }}
          />
        ) : (
          <Typography sx={{ marginTop: 1 }}>{review.comment}</Typography>
        )}
      </CardContent>
    </Card>
  );
}
