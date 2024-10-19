import { Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { reviewStore } from '../stores/reviewStore';

export default function SortReviews() {
  const [sortOption, setSortOption] = useState('newest');

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
    reviewStore.sortReviews(event.target.value as string);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1" sx={{ marginRight: 1 }}>
        Sort by:
      </Typography>
      <Select
        sx={{
          width: 200,
          height: 40,
          '.MuiSelect-select': { paddingTop: 1, paddingBottom: 1 },
          '.MuiInputBase-root': { height: 40 },
        }}
        value={sortOption}
        onChange={handleSortChange}
        displayEmpty
      >
        <MenuItem value="newest">Newest</MenuItem>
        <MenuItem value="oldest">Oldest</MenuItem>
        <MenuItem value="rating_asc">Rating: Low to High</MenuItem>
        <MenuItem value="rating_desc">Rating: High to Low</MenuItem>
      </Select>
    </Box>
  );
}
