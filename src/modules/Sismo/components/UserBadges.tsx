import { useContext } from 'react';
import TalentLayerContext from '../../../context/talentLayer';
import { IUser } from '../../../types';
import useSismoBadgesPerAddress from '../hooks/useSismoBadgesPerAddress';
import { TALENTLAYER_GROUPS } from '../utils/sismoGroupsData';
import { ISismoBadge, ISismoGroup } from '../utils/types';
import SismoBadgeCard from './SismoBadgeCard';
import SismoGroupCard from './SismoGroupCard';

interface IProps {
  user: IUser;
}

function UserBadges({ user }: IProps) {
  const { user: currentUser } = useContext(TalentLayerContext);
  const sismoBadges = useSismoBadgesPerAddress(user.address);

  const groupsData: ISismoGroup[] = [...TALENTLAYER_GROUPS];

  // TODO: clean that - NOT clean to have conditional use
  // if (user.address === currentUser?.address) {
  //   groupsData.map(group => {
  //     group.userInGroup = useIsUserInSismoGroup(group.id, user.address);
  //   });
  // }

  return (
    <>
      {sismoBadges && sismoBadges.length > 0 && (
        <>
          <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium break-all'>
            {user.address === currentUser?.address ? 'Your badges' : 'Badges'}:
          </h2>
          <div className='flex mb-8'>
            {sismoBadges.map((badge: ISismoBadge, i: number) => {
              return <SismoBadgeCard key={i} sismoBadgeData={badge} />;
            })}
          </div>
        </>
      )}

      {user.address === currentUser?.address && groupsData.length > 0 && (
        <>
          <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium break-all mt-4'>
            All zkPOW badges:
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
            {groupsData.map((groupData: ISismoGroup, i: number) => {
              return (
                <SismoGroupCard key={i} sismoGroupData={groupData} userAddrss={user.address} />
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default UserBadges;
