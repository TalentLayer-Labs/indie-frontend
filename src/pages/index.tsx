import CreateId from '../components/Home/CreateId';
import Search from '../components/Home/Search';
import SearchService from '../components/Home/SearchService';
import SearchTalent from '../components/Home/SearchTalent';

function Home() {
  return (
    <>
      {/* <CreateId /> */}
      <SearchService />
      <SearchTalent />
      <Search />
    </>
  );
}

export default Home;
