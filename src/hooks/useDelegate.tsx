import { useState, useEffect } from 'react';
import { getDelegate } from '../components/request';
import { Transaction } from 'ethers';

export const useDelegate = () => {
  const [transaction, setTransaction] = useState<Transaction>();

  const delegate = async (
    id: string | undefined,
    platform: string | undefined,
    cid: string,
    signature: string,
  ) => {
    try {
      if (!id) return;

      const response = await getDelegate(id, platform, cid, signature);
      console.log('response', response);

      if (response?.data) {
        setTransaction(response?.data?.transaction);
        return;
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return { transaction, delegate };
};
