import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Rating, 
  IconButton 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Review } from '../models/types';

interface ReviewCardProps {
  review: Review;
  isUserReview: boolean; // Determines if edit/delete options should be shown
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReviewCard({ 
  review, 
  isUserReview, 
  onEdit, 
  onDelete 
}: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt!).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card sx={{ 
      height: '100%', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      boxShadow: 1 
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <img
            src={review.user?.coverPicUrl}
            alt="review"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '10px',
            }}
          />
          <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
            {review.user?.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Rating value={review.rating} readOnly precision={0.5} />

          {isUserReview && (
            <Box ml={1} display="flex">
              <IconButton 
                aria-label="edit" 
                onClick={() => onEdit(review.id!)}
                size="small"
                sx={{ marginRight: 1 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                aria-label="delete" 
                onClick={() => onDelete(review.id!)}
                size="small"
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Reviewed On {formattedDate}
        </Typography>
        <Typography sx={{ marginTop: 1 }}>{review.comment}</Typography>
      </CardContent>
    </Card>
  );
}
