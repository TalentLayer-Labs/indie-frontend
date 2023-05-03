import Image from 'next/image';

export function HandlePrice({ handle }: { handle: string }) {
  const length = handle.length;
  const price = length > 4 ? 1 : 200 / Math.pow(2, handle.length - 1);
  return (
    <div className='flex items-center border-gray-300 pl-2 text-sm text-gray-500 '>
      <div>{price} MATIC</div>
      <Image src={'/images/matic.png'} width={20} height={20} alt='MATIC' className='mx-2' />
    </div>
  );
}
