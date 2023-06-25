import { signIn } from 'next-auth/react'
import GithubButton from 'react-github-login-button';

const UserOuth = () => {
  return (
    <GithubButton onClick={() => signIn('github')}>
      Sign in with GitHub
    </GithubButton>
  )
}

export default UserOuth