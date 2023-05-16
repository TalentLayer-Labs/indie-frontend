import { useContext, useState } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import Back from '../../components/Back';
import Steps from '../../components/Steps';
import CreateOrganizationForm from '../../components/Form/CreateOrganizationForm';
import Congrats from '../../components/Congrats';

function CreateOrganization() {
  const { account, user } = useContext(TalentLayerContext);
  const [congrats, setCongrats] = useState(false);

  return (
    <>
      {!congrats ? (
        <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
          <Back />
          <p className='text-5xl font-medium tracking-wider mb-8'>
            Create{' '}
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-il-green-700 to-il-green-600'>
              an organization
            </span>
          </p>

          <Steps targetTitle={'Create an organization'} />

          {account?.isConnected && user && (
            <CreateOrganizationForm setCongrats={setCongrats} congrats={congrats} />
          )}
        </div>
      ) : (
        <Congrats />
      )}
    </>
  );
}

export default CreateOrganization;
