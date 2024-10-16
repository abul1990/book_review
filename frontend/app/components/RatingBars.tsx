import { Box, Typography, LinearProgress } from '@mui/material';

interface RatingBarsProps {
  distribution: { rating: number; count: number }[];
}

export default function RatingBars({ distribution }: RatingBarsProps) {
  const totalReviews = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box>
      {/* Loop through ratings from 5 to 1 */}
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution.find(item => item.rating === rating)?.count || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <Box key={rating} display="flex" alignItems="center" mb={1}>
            <Typography sx={{ width: 60, color: 'linkblue' }}>{rating} Star</Typography>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ width: '100%', marginX: 2, backgroundColor: '#f0f0f0', '& .MuiLinearProgress-bar': { backgroundColor: 'gold' }}}
            />
            <Typography sx={{color: 'linkblue'}}>{percentage.toFixed(0)}%</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
