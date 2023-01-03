import { useState, useEffect } from 'react';
import { getLensProfileInfo } from '../queries/lensCheck';

const useLensUser = (lensId: string) => {
  const [lensUser, setLensUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLensProfileInfo(lensId);
        console.log('TOTO', response.data.data.profile);

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
