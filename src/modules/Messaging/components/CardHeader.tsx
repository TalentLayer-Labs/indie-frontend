interface ICardHeaderProps {
  peerAddress: string;
}
const CardHeader = ({ peerAddress }: ICardHeaderProps) => {
  return (
    <div className='flex flex-row'>
      <div className='basis-1/4 flex py-4 px-2 justify-center items-center border-b border-r cursor-pointer'>
        <p className='text-xl font-medium tracking-wider max-w-lg text-center'>Conversations</p>
      </div>
      <div className='basis-3/4 flex justify-start py-4 px-2 items-start border-b'>
        {peerAddress && (
          <p>
            To:
            <span className='border-2 ml-2 pl-2 pr-2 border-gray-200 rounded-3xl text-xs'>
              {peerAddress}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
