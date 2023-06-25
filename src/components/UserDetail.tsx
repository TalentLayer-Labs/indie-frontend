import Link from 'next/link';
import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import useUserById from '../hooks/useUserById';
import PohModule from '../modules/Poh/PohModule';
import { IUser } from '../types';
import Loading from './Loading';
import Stars from './Stars';
import Image from 'next/image';
import DelegateModal from './Modal/DelegateModal';
import {
  SismoConnectButton,
  AuthType,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-react';
import { sismo } from '../config';
import { contractAddress, abi } from '../constants/smartcontractinfo';
import { useSigner } from 'wagmi';
import { ethers } from 'ethers';


function UserDetail({ user }: { user: IUser }) {
  const { user: currentUser } = useContext(TalentLayerContext);
  const userDescription = user?.id ? useUserById(user?.id)?.description : null;

  if (!user?.id) {
    return <Loading />;
  }
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const checkSismo = async (sismoResponse: string) => {
    if (signer) {

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );

      const tx = await contract.checkSismoGithub(sismoResponse)
      console.log("transaction", tx)

    }
  }

  return (
    <div>
      <div className='flex flex-col rounded-xl p-4 border border-gray-200'>
        <div className='flex items-top justify-between w-full'>
          <div className='flex flex-col justify-start items-start gap-4'>
            <div className='flex items-center justify-start mb-4'>
              <Image
                src={`/images/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
                className='w-10 mr-4 rounded-full'
                width={50}
                height={50}
                alt='default avatar'
              />
              <div className='flex flex-col'>
                <p className='text-gray-900 font-medium break-all'>{user?.handle}</p>
                <p className='text-gray-900 text-xs'>{userDescription?.title}</p>
              </div>
              <div className=''>
                <PohModule address={user.address} />
              </div>
            </div>
          </div>
          <Stars rating={Number(user.rating)} numReviews={user.userStats.numReceivedReviews} />
        </div>
        <div className=' border-t border-gray-100 pt-4 w-full'>
          {userDescription?.name && (
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Name:</strong> {userDescription?.name}
            </p>
          )}
          <p className='text-sm text-gray-500 mt-4'>
            <strong>Skills:</strong> {userDescription?.skills_raw}
          </p>
          <p className='text-sm text-gray-500 mt-4'>
            <strong>About:</strong> {userDescription?.about}
          </p>
          <p className='text-sm text-gray-500 mt-4'>
            <strong>Work Experience:</strong> { /* PLACEHOLDER */}
          </p>
          {userDescription?.role && (
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Role:</strong> {userDescription?.role}
            </p>
          )}
        </div>

        {currentUser?.id === user.id && (
          <div className=' border-t border-gray-100 pt-4 w-full mt-4'>
            <SismoConnectButton
              config={sismo}
              // request proof of Github ownership
              auths={[{ authType: AuthType.VAULT }, { authType: AuthType.GITHUB }]}
              claims={[{ groupId: '0xfb20933ed4261d329255c10c64c53ff0' }]}
              onResponse={async (response: SismoConnectResponse) => {
                console.log(response);
              }}
              onResponseBytes={(response: string) => {
                // TODO: Store this response in the smart contract


                console.log("Response:")
                console.log(response); // call your contract with the response as bytes


                checkSismo(response);
              }}
            />
            <br></br>
            <div className='flex flex-row gap-4 justify-end items-center'>
              <Link
                className='text-blue-600 bg-blue-50 hover:bg-blue-500 hover:text-white px-5 py-2 rounded-lg'
                href={`/profile/WorkExperience`}>
                Add Work Experience
              </Link>
              <Link
                className='text-red-600 bg-red-50 hover:bg-red-500 hover:text-white px-5 py-2 rounded-lg'
                href={`/profile/${user.id}`}>
                View profile
              </Link>
              <Link
                className='text-green-600 bg-green-50 hover:bg-green-500 hover:text-white px-5 py-2 rounded-lg'
                href={`/profile/edit`}>
                Edit profile
              </Link>
              <Link
                className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
                href={`/dashboard/incomes`}>
                Your incomes
              </Link>
              {user && <DelegateModal user={user} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
