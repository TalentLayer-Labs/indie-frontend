import Image from 'next/image';

export function HandlePrice({ handle }: { handle: string }) {
  const length = handle.length;
  const price = 0.001;
  return (
    <div className='flex items-center border-gray-300 pl-2 text-sm text-gray-500 '>
      <div>{price} MATIC</div>
      <Image src={'/images/matic.png'} width={20} height={20} alt='MATIC' className='mx-2' />
    </div>
  );
}
