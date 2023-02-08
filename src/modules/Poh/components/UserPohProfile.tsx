import { IPohUser } from '../utils/types';

interface IProps {
  pohUser: IPohUser;
}

function UserPohProfile({ pohUser }: IProps) {
  return (
    <>
      {pohUser?.id && (
        <div>
          <p>
            <strong>POH Id</strong> : {pohUser.id}
          </p>
          <p>
            <strong> Is Registered</strong> : {pohUser.registered.toString()}
          </p>
        </div>
      )}
    </>
  );
}
export default UserPohProfile;
