import React from 'react';
import useTotalGainByUser from '../hooks/useTotalGainByUser';
import { IUser } from '../types';
import { renderTokenAmount } from '../utils/conversion';

interface IProps {
  user: IUser;
}

function UserGains({ user }: IProps) {
  const userGains = useTotalGainByUser(user.id);
  if (userGains.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Your gain history
      </h2>
      <div className='grid grid-cols'>
        <table className='text-left w-full'>
          <thead className='flex w-full'>
            <tr className='flex w-full mb-4'>
              <th className='p-4 w-1/4'>Gain</th>
              <th className='p-4 w-1/4'>Token</th>
            </tr>
          </thead>
          <tbody className='flex flex-col items-center justify-between overflow-y-scroll w-full'>
            {userGains.map((gain, i) => {
              return (
                <tr key={i} className='flex w-full mb-4'>
                  <td className='p-4 w-1/4'>
                    {renderTokenAmount(gain.token.address, gain.totalGain)}
                  </td>
                  <td className='p-4 w-1/4'>{gain.token.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserGains;
