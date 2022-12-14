interface ICardHeaderProps {
  setIsNewMsg: React.Dispatch<React.SetStateAction<boolean>>;
}
const CardHeader = ({ setIsNewMsg }: ICardHeaderProps) => {
  return (
    <div className='flex flex-row'>
      <div className='basis-1/4 flex justify-start py-4 px-2 justify-center items-center border-b-2 border-t-2 border-r-2 cursor-pointer'>
        <h3>Conversations</h3>
      </div>
      <div className='basis-3/4 flex justify-start py-4 px-2 justify-end items-start border-b-2 border-t-2 cursor-pointer'>
        <button
          onClick={() => setIsNewMsg(true)}
          className='bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded-full mr-10'>
          + New message
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
