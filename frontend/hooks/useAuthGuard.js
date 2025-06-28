import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

// optional: pass role like 'admin', 'commander', 'logistics'
export const useAuthGuard = (requiredRole = null) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If role is required and doesn't match, redirect to home
    if (requiredRole && user.role !== requiredRole) {
      router.push('/');
    }
  }, [user, requiredRole]);
};
