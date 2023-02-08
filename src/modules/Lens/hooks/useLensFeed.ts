import { useState, useEffect } from 'react';
import { getLensFeedData } from '../queries/lensFeedData';
import { IlensFeed } from '../utils/types';

const useLensFeed = (userProfileId: string | undefined): { lensFeed: IlensFeed | undefined } => {
  const [lensFeed, setLensFeed] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userProfileId) {
          return;
        }
        const response = await getLensFeedData(userProfileId);

        if (response?.data?.data?.publications.items.length > 0) {
          setLensFeed(response?.data?.data?.publications.items);
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
