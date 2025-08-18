import { useEffect, useState } from 'react';

/**
 * Hook to safely handle hydration mismatches
 * Returns true only after the component has mounted on the client
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
