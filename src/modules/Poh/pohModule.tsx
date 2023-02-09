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
        <div className='ml-4'>
          <UserPohProfile pohUser={pohUser} />
        </div>
      </>
    </div>
  );
}

export default PohModule;
