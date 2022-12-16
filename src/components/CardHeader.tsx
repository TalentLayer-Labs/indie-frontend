interface ICardHeaderProps {
  setIsNewMsg: React.Dispatch<React.SetStateAction<boolean>>;
  peerAddress: string;
}
const CardHeader = ({ setIsNewMsg, peerAddress }: ICardHeaderProps) => {
  return (
    <div className='flex flex-row'>
      <div className='basis-1/4 flex justify-start py-4 px-2 justify-center items-center border-b-2 border-t-2 border-r-2 cursor-pointer'>
        <p className='text-xl font-medium tracking-wider max-w-lg text-center'>Conversations</p>
      </div>
      {/*<div className='basis-3/4 flex justify-start py-4 px-2 justify-end items-start border-b-2 border-t-2 cursor-pointer'>*/}
      {/*  <button*/}
      {/*    onClick={() => setIsNewMsg(true)}*/}
      {/*    className='bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded-full mr-10'>*/}
      {/*    + New conversation*/}
      {/*  </button>*/}
      {/*</div>*/}
      <div className='basis-3/4 flex justify-start py-4 px-2 items-start border-b-2 border-t-2'>
        {peerAddress && (
          <p>
            To:
            <span className='border-2 ml-2 pl-2 pr-2 border-gray-200 rounded-3xl'>
              {peerAddress}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
