import { useRouter } from 'next/router';
import SearchTalentButton from '../components/Form/SearchTalentButton';
import Loading from '../components/Loading';
import UserItem from '../components/UserItem';
import useUsers from '../hooks/useUsers';

function Talents() {
  const PAGE_SIZE = 36;
  const router = useRouter();
  const query = router.query;
  const searchQuery = query.search as string;
  const { users, hasMoreData, loading, loadMore } = useUsers(
    searchQuery?.toLocaleLowerCase(),
    PAGE_SIZE,
  );

  return (
    <div
      className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'
      style={{ fontFamily: 'CustomFont' }}>
      <p className='text-5xl font-medium tracking-wider mb-8' style={{ fontFamily: 'CustomFont' }}>
        FIND <span className='text-red-600'>TALENT </span>
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

      {users.length > 0 && hasMoreData && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5'>
          <button
            type='submit'
            className={`px-5 py-2 mt-5 content-center border border-indigo-600 rounded-full text-indigo-600 
              hover:text-white hover:bg-indigo-700
            `}
            disabled={!hasMoreData}
            onClick={() => loadMore()}>
            Load More
          </button>
        </div>
      )}
      {loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <Loading />
        </div>
      )}
      {!hasMoreData && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <p>No more Users...</p>
        </div>
      )}
    </div>
  );
}

export default Talents;
