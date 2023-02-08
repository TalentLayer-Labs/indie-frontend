import UserItem from '../components/UserItem';
import useUsers from '../hooks/useUsers';
import SearchTalentButton from '../components/Form/SearchTalentButton';

function Talents() {
  const queryString = window.location.search;
  const searchQuery = new URLSearchParams(queryString).get('s') || undefined;
  const users = useUsers(searchQuery?.toLocaleLowerCase());

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        All <span className='text-indigo-600'>Talents </span>
      </p>

      {searchQuery && users.length > 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          Search results for <span className='text-indigo-600'>{searchQuery}</span>
        </p>
      )}
      {searchQuery && users.length === 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          No search results for <span className='text-indigo-600'>{searchQuery}</span>
        </p>
      )}

      <div className='flex justify-center items-center gap-10 flex-col pb-5'>
        <SearchTalentButton value={searchQuery} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {users.map((user, i) => {
          return <UserItem user={user} key={i} />;
        })}
      </div>

      {users.length === 20 && (
        <a
          href='#'
          className='px-5 py-2  border border-indigo-600 rounded-full text-indigo-600 hover:text-white hover:bg-indigo-700'>
          Load More
        </a>
      )}
    </div>
  );
}

export default Talents;
