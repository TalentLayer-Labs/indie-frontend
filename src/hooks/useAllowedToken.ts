import { useEffect, useState } from 'react';
import { IToken } from '../types';
import { getAllowedToken } from '../queries/global';

const useAllowedToken = (address: string): IToken | undefined => {
  const [allowedToken, setAllowedToken] = useState<IToken>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (address) {
          const response = await getAllowedToken(address);
          if (response?.data?.data?.tokens) {
            setAllowedToken(response.data.data.tokens[0]);
          }
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return allowedToken;
};

export default useAllowedToken;
