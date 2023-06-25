import { signIn } from 'next-auth/react';

const UserOuth = () => {
  return (<button onClick={() => signIn('github')}>Sign in with GitHub</button>)
};

export default UserOuth;
