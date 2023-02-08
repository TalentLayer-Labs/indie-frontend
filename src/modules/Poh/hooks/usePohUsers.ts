import { useState, useEffect } from 'react';
import { getPohProfileInfo } from '../queries/pohProfileData';
import { IPohUser } from '../utils/types';

const usePohUser = (address: string): { pohUser: IPohUser | undefined } => {
  const [pohUser, setPohUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPohProfileInfo('0x1db3439a222c519ab44bb1144fc28167b4fa6ee6');

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
