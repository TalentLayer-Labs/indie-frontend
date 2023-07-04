import { useEffect, useState } from 'react';
import { ITransaction } from '../types';
import { getTransactionById } from '../queries/transactions';

const useTransactionsById = (id?: string | undefined): ITransaction | undefined => {
  const [transaction, setTransaction] = useState<ITransaction>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getTransactionById(id);
          if (response?.data?.data?.transactions[0]) {
            setTransaction(response.data.data.transactions[0]);
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      } else {
        setTransaction(undefined);
      }
    };
    fetchData();
  }, [id]);

  return transaction;
};

export default useTransactionsById;
