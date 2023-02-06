import { Dispatch, SetStateAction } from 'react';
import Loading from '../../../components/Loading';

interface IMessageComposerProps {
  messageContent: string;
  setMessageContent: Dispatch<SetStateAction<string>>;
  sendNewMessage: () => void;
  sendingPending: boolean;
  messageSendingErrorMsg: string;
  peerUserExists: boolean;
}

const MessageComposer = ({
  setMessageContent,
  messageContent,
  sendNewMessage,
  sendingPending,
  messageSendingErrorMsg,
  peerUserExists,
}: IMessageComposerProps) => {
  console.log('peerUserExists', peerUserExists);

  //TODO Disabling button not working yet
  const renderSendButton = (peerUserExists: boolean, sendingPending: boolean) => {
    return (
      !sendingPending && (
        <button
          className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full'
          onClick={sendNewMessage}
          disabled={!peerUserExists}>
          Send
        </button>
      )
    );
  };

  return (
    <>
      <div className='flex flex-row space-x-5 py-5'>
        <input
          className='w-full bg-gray-300 py-2 px-3 rounded-xl'
          type='text'
          onChange={e => setMessageContent(e.target.value)}
          placeholder='Write a message'
          value={messageContent}
        />
        {sendingPending && <Loading />}
        {renderSendButton(peerUserExists, sendingPending)}
      </div>
      {messageSendingErrorMsg && (
        <div>
          <p className={'text-red-400 ml-1'}>{messageSendingErrorMsg}</p>
        </div>
      )}
    </>
  );
};

export default MessageComposer;
