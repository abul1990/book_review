import { useState, useEffect } from 'react';
import apiClient from '../utils/axios-instance';
import { RatingDistribution } from '../models/types';

export function useRatingDistribution(bookId: string) {
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRatingDistribution = async () => {
      try {
        const response = await apiClient.get<RatingDistribution[]>(`/books/${bookId}/reviews/rating-distribution`);
        setRatingDistribution(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingDistribution();
  }, [bookId]);

  return { ratingDistribution, loading, error };
}
