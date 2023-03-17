import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import TalentLayerContext from '../context/talentLayer';
import { ISismoBadge, ISismoGroup, IUser } from '../types';
import Loading from './Loading';
import Stars from './Stars';
import PohModule from '../modules/Poh/PohModule';
import useUserById from '../hooks/useUserById';
import useSismoGroupData from '../hooks/useSismoGroupData';
import SismoGroupCard from './SismoGroupCard';
import useSismoBadgesPerAddress from '../hooks/useSismoBadgesPerAddress';
import SismoBadgeCard from './SismoBadgeCard';

const TALENTLAYER_GROUP_IDS = [
  '0x251d25c1e9192286e0e329bc4a46b84e',
  '0xf2e9a70ce2d0afe45d96c6c642042e8d',
  '0xb2f9ffd39037252f2be891b943bfcca4',
  '0x8837536887a7f6458977b10cc464df4b',
];

function UserDetail({ user }: { user: IUser }) {
  const { user: currentUser } = useContext(TalentLayerContext);
  const userDescription = user?.id ? useUserById(user?.id)?.description : null;
  const sismoBadges = useSismoBadgesPerAddress(user.address);
  console.log('sismoBadges', sismoBadges);

  const groupsData: ISismoGroup[] = [];

  TALENTLAYER_GROUP_IDS.forEach(groupId => {
    const groupData = useSismoGroupData(groupId, user.address);
    if (groupData) {
      groupsData.push(groupData);
    }
  });
  console.log('groupsData', groupsData);

  if (!user?.id) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col rounded-xl p-4 border border-gray-200'>
      <div className='flex items-top justify-between w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start mb-4'>
            <img
              src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{user?.handle}</p>
              <p className='text-gray-900 text-xs'>{userDescription?.title}</p>
            </div>
            <div className=''>
              <PohModule address={user.address} />
            </div>
          </div>
        </div>
        <Stars rating={Number(user.rating)} numReviews={user.numReviews} />
      </div>
      <div className=' border-t border-gray-100 pt-4 w-full'>
        <p className='text-sm text-gray-500 mt-4'>
          <strong>Name:</strong> {userDescription?.name}
        </p>
        <p className='text-sm text-gray-500 mt-4'>
          <strong>Skills:</strong> {userDescription?.skills_raw}
        </p>
        <p className='text-sm text-gray-500 mt-4'>
          <strong>About:</strong> {userDescription?.about}
        </p>
        <p className='text-sm text-gray-500 mt-4'>
          <strong>Role:</strong> {userDescription?.role}
        </p>
      </div>
      {groupsData.length > 0 && (
        <>
          <div className=' border-t border-gray-100 pt-4 w-full mt-4' />
          <p className='text-sm text-gray-500 mt-4 mb-4'>
            <strong>TalentLayer groups:</strong>
          </p>
        </>
      )}
      <div className='flex'>
        {groupsData.length > 0 &&
          groupsData.map((groupData: ISismoGroup) => {
            return <SismoGroupCard sismoGroupData={groupData} userAddrss={user.address} />;
          })}
      </div>
      {sismoBadges && sismoBadges.length > 0 && (
        <>
          <div className=' border-t border-gray-100 pt-4 w-full mt-4' />
          <p className='text-sm text-gray-500 mt-4 mb-4'>
            <strong>Badges:</strong>
          </p>
        </>
      )}
      <div className='flex'>
        {sismoBadges &&
          sismoBadges.length > 0 &&
          sismoBadges.map((badge: ISismoBadge) => {
            return <SismoBadgeCard sismoBadgeData={badge} />;
          })}
      </div>
      {currentUser?.id === user.id && (
        <div className=' border-t border-gray-100 pt-4 w-full mt-4'>
          <div className='flex flex-row gap-4 justify-end items-center'>
            <NavLink
              className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
              to={`/profile/${user.id}`}>
              View profile
            </NavLink>
            <NavLink
              className='text-green-600 bg-green-50 hover:bg-green-500 hover:text-white px-5 py-2 rounded-lg'
              to={`/profile/edit`}>
              Edit profile
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetail;
