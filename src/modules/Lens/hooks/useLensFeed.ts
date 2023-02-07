import { useState, useEffect } from 'react';
import { getLensFeedData } from '../queries/lensFeedData';
import { IlensFeed } from '../../../types';

const useLensFeed = (userProfileId: string): { lensFeed: IlensFeed | undefined } => {
  const [lensFeed, setLensFeed] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLensFeedData(userProfileId);

        if (response?.data?.data?.publications.items[0]) {
          setLensFeed(response?.data?.data?.publications.items[0]);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [userProfileId]);

  return { lensFeed };
};

export default useLensFeed;
