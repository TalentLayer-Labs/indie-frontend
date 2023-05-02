import { ReactNode } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '../components/newlayout/navbar';
import { Container } from '../components/newlayout/container';
import { Footer } from '../components/newlayout/footer';

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Container>{children}</Container>
      </main>
      <Footer />
      <ToastContainer position='bottom-right' />
    </div>
  );
};
