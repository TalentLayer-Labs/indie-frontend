import { useState, useEffect } from 'react';
import { getDelegate } from '../components/request';
import { Contract, ethers } from 'ethers';

export const useDelegate = (id: string | undefined) => {
  const [delegateSigner, setdelegateSigner] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const response = await getDelegate(id);

        if (response?.data) {
          setdelegateSigner(response?.data?.delegateSigner);
          return;
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  return { delegateSigner };
};
