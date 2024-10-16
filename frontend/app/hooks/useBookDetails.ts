import { useEffect, useState } from 'react';
import apiClient from '../utils/axios-instance';
import { Book } from '../models/types';

export function useBookDetails(bookId: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        const response = await apiClient.get(`/books/${bookId}`);
        setBook(response.data);
      } catch (err) {
        console.error(err);
        // setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  return { book, loading };
}
