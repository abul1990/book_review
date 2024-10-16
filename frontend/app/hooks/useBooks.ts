// frontend/hooks/useBooks.ts
import { useState, useEffect } from 'react';
import apiClient from '../utils/axios-instance';
import { Book } from '../models/types';

export function useBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      apiClient.get<Book[]>('/books')
        .then((response) => setBooks(response.data))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);
  
    return { books, loading, error };
}
