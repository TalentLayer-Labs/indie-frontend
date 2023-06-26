import { useEffect } from 'react';

const useStoreInLocalStorage = (data: string, key: string): void => {
  useEffect(() => {
    localStorage.setItem(key, data);
  }, [data]);
};

export default useStoreInLocalStorage;
