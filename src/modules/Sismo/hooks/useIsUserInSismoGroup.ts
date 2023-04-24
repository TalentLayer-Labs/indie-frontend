import { useEffect, useState } from 'react';
import { getSismoGroupSnapshotUrl } from '../queries/sismo';
import { callUrl } from '../utils/rest';

const useIsUserInSismoGroup = (sismoGroupId: string, userAddress: string): boolean => {
  const [userInGroup, setUserInGroup] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSismoGroupSnapshotUrl(sismoGroupId);
        if (response?.data?.data?.groups?.length > 0) {
          const groupUsers = await callUrl(response.data.data.groups[0].latestSnapshot.dataUrl);
          const userInGroup = groupUsers.data[userAddress] == 1;
          setUserInGroup(userInGroup);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return userInGroup;
};

export default useIsUserInSismoGroup;
