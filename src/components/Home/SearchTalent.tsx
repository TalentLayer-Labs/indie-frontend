import SearchTalentButton from '../Form/SearchTalentButton';
import Image from 'next/image';

function SearchTalent() {
  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto text-gray-900 px-4'>
        <div className='flex justify-center items-center gap-10 flex-col py-20'>
        <div className='flex items-center'>
            <div className='w-1/2'>
              <div className='space-y-4'>
                <p
                  className='text-5xl sm:text-7xl font-medium tracking-wider max-w-lg text-center'
                  style={{ fontFamily: 'LondrinaSolidShadow' }}>
                  Working Will {' '}
                  <span className='text-yellow-300' style={{ fontFamily: 'customFont' }}>
                    Never {' '}
                  </span>{' '}
                  <span className='text-blue-600' style={{ fontFamily: 'customFont' }}>
                    Be {' '}
                  </span>{' '}
                  The {' '}
                  <span className='text-red-600' style={{ fontFamily: 'customFont' }}>
                    Same{' '}
                  </span>
                </p>
                <br></br>
                <p className='text-gray-500' style={{ fontFamily: 'customFont', textAlign: 'center' }}>
                  Earn money doing what you love. Find a job that fits your skills & flexible schedule without doxing yourself.
                </p>
                <br></br>
                <br></br>
                <br></br>
                <SearchTalentButton value={''} />
              </div>
            </div>
            <div className='w-1/2'>
              <Image
                src='/images/2.png'
                alt='Image'
                width={1000}
                height={1}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchTalent;
