import { useEffect, useState } from 'react';
import {ISismoBadge, ISismoGroup, IUser} from '../types';
import {getSismoBadgesPerAddress, getSismoGroupSnapshot} from '../queries/sismo';
import { callUrl } from '../utils/rest';

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
