import { useCallback } from 'react';

type NavigateFunction = (to: string | number) => void;

/**
 * A simple hook to handle navigation in the app
 * In a real app, this would use react-router or similar
 */
export const useNavigate = (): NavigateFunction => {
  const navigate = useCallback((to: string | number) => {
    if (typeof to === 'number') {
      // Go back or forward in history
      window.history.go(to);
    } else {
      // Navigate to a specific route
      window.location.href = to;
    }
  }, []);

  return navigate;
};
