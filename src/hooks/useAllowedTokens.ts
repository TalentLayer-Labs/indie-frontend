import { useEffect, useState } from 'react';
import { IToken } from '../types';
import { getAllowedTokenList } from '../queries/global';

const useAllowedTokens = (): IToken[] => {
  const [allowedTokens, setAllowedTokens] = useState<IToken[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllowedTokenList();
        if (response?.data?.data?.tokens) {
          setAllowedTokens(response.data.data.tokens);
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return allowedTokens;
};

export default useAllowedTokens;
