import UserItem from '../components/UserItem';
import useUsers from '../hooks/useUsers';

function Talents() {
  const { users } = useUsers();

  console.log(users);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 px-4 lg:px-0'>
      <div className='flex flex-col gap-10'>
        <p className='text-5xl font-medium tracking-wider'>
          All <span className='text-indigo-600'>Talents </span>
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {users.map((user, i) => {
            return <UserItem user={user} key={i} />;
          })}
        </div>

        {users.length === 20 && (
          <a
            href='#'
            className='px-5 py-2  border border-indigo-600 rounded-full text-indigo-600 hover:text-white hover:bg-indigo-600'>
            Load More
          </a>
        )}
      </div>
    </div>
  );
}

export default Talents;
