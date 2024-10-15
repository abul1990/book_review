// frontend/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import apiClient from '../utils/axios-instance';
import { User } from '../models/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    apiClient.get<User[]>('/users')
      .then((response) => setUsers(response.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
