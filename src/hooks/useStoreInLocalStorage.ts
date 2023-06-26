import { useEffect } from 'react';

const useStoreInLocalStorage = (key: string, data: string): void => {
  useEffect(() => {
    if (!data) return;
    localStorage.setItem(key, data);
  }, [data]);
};

export default useStoreInLocalStorage;
