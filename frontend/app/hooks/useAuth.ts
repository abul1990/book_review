import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { userStore } from '../stores/userStore';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      userStore.logout();
      router.push('/login');
    }
  }, [router]);
};
