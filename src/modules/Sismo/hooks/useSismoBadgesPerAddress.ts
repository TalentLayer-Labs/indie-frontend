import { useEffect, useState } from 'react';
import { getSismoBadgesPerAddress } from '../queries/sismo';
import { ISismoBadge } from '../utils/types';

const useSismoBadgesPerAddress = (userAddress: string): ISismoBadge[] | null => {
  const [badgesData, setBadgesData] = useState<ISismoBadge[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSismoBadgesPerAddress(userAddress);
        const allBadges: ISismoBadge[] = [];
        if (response?.data?.data?.accounts[0]?.mintedBadges.length > 0) {
          const badges = response.data.data.accounts[0]?.mintedBadges;
          badges.forEach((badge: any) => {
            allBadges.push({
              name: badge.badge.name,
              image: badge.badge.image,
              description: badge.badge.description,
            });
          });
          setBadgesData(allBadges);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return badgesData;
};

export default useSismoBadgesPerAddress;
