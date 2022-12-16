import { shortAddress, truncate } from '../utils/messaging';
import { useEnsAvatar } from 'wagmi';
import { useContext, Dispatch, SetStateAction } from 'react';
import TalentLayerContext from '../context/talentLayer';

interface IConversationCardProps {
  address: string;
  setSelectedConversation: Dispatch<SetStateAction<string>>;
}

const ConversationCard = ({ setSelectedConversation, address }: IConversationCardProps) => {
  const { user } = useContext(TalentLayerContext);
  //TODO: useUser by address ===> Get Avatar and Handle to display

  // const isActiveConversation = () => return key === address;

  return (
    <div
      onClick={() => setSelectedConversation(address)}
      className={`flex justify-start py-4 px-2 justify-center items-center border-b-2 cursor-pointer `}>
      <div className='w-1/4'>
        <img
          src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
          className='object-cover h-12 w-12 rounded-full'
          alt=''
        />
      </div>
      <div className='w-full'>
        <b>{shortAddress(address)}</b>
      </div>
    </div>
  );
};

export default ConversationCard;
