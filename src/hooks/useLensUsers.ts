import { useState, useEffect } from 'react';
import { getLensProfileInfo } from '../queries/lensCheck';
import { IlensUser } from '../types';

const useLensUser = (lensId: string): { lensUser: IlensUser | undefined } => {
  const [lensUser, setLensUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLensProfileInfo(lensId);

        if (response?.data?.data?.profile) {
          setLensUser(response.data.data.profile);
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
