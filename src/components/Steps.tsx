import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import ConnectBlock from './ConnectBlock';
import TalentLayerIdForm from './Form/TalentLayerIdForm';
import Step from './Step';

function Steps({ targetTitle }: { targetTitle: string }) {
  const { account, user } = useContext(TalentLayerContext);

  const isLastStep = !!user;
  if (isLastStep) {
    return null;
  }

  return (
    <>
      <nav className='mb-8'>
        <ol className='divide-y divide-gray-200 rounded-md border border-gray-200 md:flex md:divide-y-0'>
          <Step
            title='Connect your account'
            status={!account?.isConnected ? 'inprogress' : 'done'}
            order={1}
          />
          <Step
            title='Create your talent passport'
            status={!account?.isConnected ? 'todo' : user === undefined ? 'inprogress' : 'done'}
            order={2}
          />
          <Step
            title={targetTitle}
            status={!account?.isConnected ? 'todo' : user === undefined ? 'todo' : 'inprogress'}
            order={3}
            isLast={true}
          />
        </ol>
      </nav>

      {!account?.isConnected && <ConnectBlock />}
      {account?.isConnected && !user && <TalentLayerIdForm />}
    </>
  );
}

export default Steps;
