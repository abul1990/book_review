import { useEffect, useState } from 'react';
import apiClient from '../utils/axios-instance';
import { Review } from '../models/types';

export const useReviews = (bookId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchReviews = async () => {
      try {
        const response = await apiClient.get<Review[]>(`/books/${bookId}/reviews`);
        setReviews(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId]);

  return { reviews, loading, error };
};
