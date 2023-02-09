import UserPohProfile from '../../modules/Poh/components/UserPohProfile';
import usePohUser from './hooks/usePohUsers';

interface IProps {
  address: string;
}

function PohModule({ address }: IProps) {
  const { pohUser } = usePohUser(address);
  console.log('pohUser', pohUser);

  if (!pohUser?.registered) {
    return null;
  }

  return (
    <div className='flex'>
      <>
        <div className='md:w-1/2 xl:w-1/3 mb-6'>
          <UserPohProfile pohUser={pohUser} />
        </div>
      </>
    </div>
  );
}

export default PohModule;
