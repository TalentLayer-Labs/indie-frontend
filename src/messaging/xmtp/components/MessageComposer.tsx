import { Dispatch, SetStateAction } from 'react';

interface IMessageComposerProps {
  messageContent: string;
  setMessageContent: Dispatch<SetStateAction<string>>;
  sendNewMessage: () => void;
}

const MessageComposer = ({
  setMessageContent,
  messageContent,
  sendNewMessage,
}: IMessageComposerProps) => {
  return (
    <div className='flex flex-row space-x-5 py-5'>
      <input
        className='w-full bg-gray-300 py-2 px-3 rounded-xl'
        type='text'
        onChange={e => setMessageContent(e.target.value)}
        placeholder='Write a message'
        value={messageContent}
      />
      <button
        className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={sendNewMessage}>
        Send
      </button>
    </div>
  );
};

export default MessageComposer;
