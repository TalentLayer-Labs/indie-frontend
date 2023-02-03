import { useState, useEffect } from 'react';
import { getLensProfileInfo } from '../queries/LensCheck';
import { IlensUser } from '../types';

const useLensUser = (userAddress: string): { lensUser: IlensUser | undefined } => {
  const [lensUser, setLensUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLensProfileInfo(userAddress);

        if (response?.data?.data?.defaultProfile) {
          setLensUser(response.data.data.defaultProfile);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return { lensUser };
};

export default useLensUser;
