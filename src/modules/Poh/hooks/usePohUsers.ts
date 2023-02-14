import { useState, useEffect } from 'react';
import { getPohProfileInfo } from '../queries/pohProfileData';
import { IPohUser } from '../utils/types';

const usePohUser = (address: string): { pohUser: IPohUser | undefined } => {
  const [pohUser, setPohUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPohProfileInfo(address);

        if (response?.data?.data?.submission) {
          setPohUser(response.data.data.submission);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [address]);

  return { pohUser };
};

export default usePohUser;
