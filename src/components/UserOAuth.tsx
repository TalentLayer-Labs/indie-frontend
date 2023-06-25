import { useSession, signIn, signOut } from 'next-auth/react';

export default function UserOAuth() {
  const { data: session } = useSession();
  const buttonStyles = {
    backgroundColor: "#FFC700",
    color: "#1F2D3D",
    fontWeight: "bold",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', sans-serif",
  };

  if (session && session.user) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button style={buttonStyles} onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button style={buttonStyles} onClick={() => signIn()}>Sign in</button>
    </>
  );
}

