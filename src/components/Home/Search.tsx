import Image from 'next/image';
import SearchButton from '../Form/SearchButton';

function Search() {
  return (
    <div>
      <div className='max-w-7xl mx-auto text-gray-900 px-4'>
        <div className='flex justify-center items-center gap-10 flex-col py-20'>
          <div className='flex items-center'>
            <div className='w-1/2'>
              <Image
                src='/images/3.png'
                alt='Image'
                width={1000}
                height={1}
                style={{ width: '80%' }}
              />
            </div>
            <div className='w-1/2'>
              <div className='space-y-4'>
                <p
                  className='text-5xl sm:text-7xl font-medium tracking-wider max-w-lg text-center'
                  style={{ fontFamily: 'LondrinaSolidShadow' }}>
                  Find{' '}
                  <span className='text-blue-600' style={{ fontFamily: 'customFont' }}>
                    Your{' '}
                  </span>{' '}
                  Dream{' '}
                  <span className='text-yellow-300	' style={{ fontFamily: 'customFont' }}>
                    Talent{' '}
                  </span>
                </p>
                <br></br>
                <p className='text-gray-500' style={{ fontFamily: 'customFont', textAlign: 'center' }}>
                  Forget the old rules. You can have the best people. Right now. Right here.
                </p>
                <br></br>
                <br></br>
                <SearchButton value={''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
