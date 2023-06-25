import SearchServiceButton from '../Form/SearchServiceButton';
import Image from 'next/image';

function SearchService() {
  return (
    <div>
      <div className='max-w-7xl mx-auto text-gray-900 px-4'>
        <div className='flex justify-center items-center gap-10 flex-col py-20'>
          <div className='flex items-center'>
            <div className='w-1/2'>
              <Image
                src='/images/1.png'
                alt='Image'
                width={1000}
                height={1}
                style={{ width: '100%' }}
              />
            </div>
            <div className='w-1/2'>
              <div className='space-y-4'>
                <p
                  className='text-5xl sm:text-7xl font-medium tracking-wider max-w-lg text-center'
                  style={{ fontFamily: 'LondrinaSolidShadow' }}>
                  The{' '}
                  <span className='text-blue-600' style={{ fontFamily: 'customFont' }}>
                    Gateway{' '}
                  </span>{' '}
                  To The Best{' '}
                  <span className='text-red-600' style={{ fontFamily: 'customFont' }}>
                    Jobs{' '}
                  </span>
                </p>
                <br></br>
                <p className='text-gray-500' style={{ fontFamily: 'customFont' }}>
                  Your work, Your network, Your future. Own Your Story Prove Your Worth
                </p>
                <br></br>
                <br></br>
                <br></br>
                <SearchServiceButton value={''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchService;
