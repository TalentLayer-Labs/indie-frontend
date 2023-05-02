import { Transition } from '@headlessui/react';
import Image from 'next/image';
import { Container } from './container';

export const Navbar = () => {
  return (
    <header className='sticky top-0 z-50 bg-black/90 py-7 backdrop-blur-sm lg:py-5'>
      <Container>
        <div className='relative -mx-4 flex items-center justify-between px-4'>
          <div className='w-60 max-w-full px-4'>
            <a href='https://claim.talentlayer.org' className='block w-full'>
              <Image src='/images/logo/icon.svg' alt='logo' width={40} height={40} />
            </a>
          </div>
          <Transition
            enter='transition-opacity duration-250'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='flex items-center gap-4 pr-4'></div>
          </Transition>
        </div>
      </Container>
    </header>
  );
};
