import { useCallback } from 'react';

type NavigateFunction = (to: string | number) => void;

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
