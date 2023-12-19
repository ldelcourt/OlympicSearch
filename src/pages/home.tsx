import Search from '../Component/Search';
import { useEffect} from 'react';
import './home.css';

function Home() {
  useEffect(() => {
    document.title = "Olymp'IF - Accueil";
  }, []);


  return (
    <div className='home-container'>
      <div>
        <Search />
      </div>
    </div> 
  );
}

export default Home;
